# services.py
from typing import List, Dict, Any
import pandas as pd
from .database import DatabaseManager
from .models import EnergyRecommendationModel
import logging

logger = logging.getLogger(__name__)

class RecommendationService:
    def __init__(self, db_manager: DatabaseManager, model: EnergyRecommendationModel):
        self.db_manager = db_manager
        self.model = model
        self.is_trained = False
    
    async def initialize_models(self):
        """Initialize and train models if needed"""
        try:
            self.model.load_models('models/trained_models.joblib')
            self.is_trained = True
            logger.info("Models loaded successfully")
        except Exception as e:
            logger.info(f"Could not load models ({e}), training new models...")
            await self.train_models()
    
    async def train_models(self):
        """Train models with data from database"""
        try:
            # Get all data
            households = await self.db_manager.get_household_data()
            usage_data = await self.db_manager.get_usage_data()
            weather_data = await self.db_manager.get_weather_data()
            rec_history = await self.db_manager.get_recommendation_history()
            
            # Train models using the correct method signature
            self.model.train_models(households, usage_data, weather_data, rec_history)
            self.model.save_models('models/trained_models.joblib')
            self.is_trained = True
            
            logger.info("Models trained and saved successfully")
        except Exception as e:
            logger.error(f"Error training models: {e}")
            raise
    
    def _build_user_item_matrix(self, recommendation_history: List[Dict], household_ids: List[int]) -> pd.DataFrame:
        """Build user-item matrix from recommendation history"""
        if not recommendation_history:
            # Return empty matrix with proper structure
            all_recommendations = list(self.model.recommendation_catalog.keys())
            return pd.DataFrame(0, index=household_ids, columns=all_recommendations)
        
        recommendation_history_df = pd.DataFrame(recommendation_history)
        
        # Create matrix of households vs recommendations
        user_item_matrix = recommendation_history_df.pivot_table(
            index='household_id',
            columns='recommendation_id', 
            values='effectiveness',
            fill_value=0
        )
        
        # Ensure all households are represented
        user_item_matrix = user_item_matrix.reindex(household_ids, fill_value=0)
        
        # Ensure all recommendations are represented
        all_recommendations = list(self.model.recommendation_catalog.keys())
        for rec_id in all_recommendations:
            if rec_id not in user_item_matrix.columns:
                user_item_matrix[rec_id] = 0
        
        return user_item_matrix[sorted(user_item_matrix.columns)]
    
    async def get_recommendations(self, household_id: str, top_n: int = 5) -> List[Dict]:
        """Get recommendations for a specific household"""
        try:
            # Convert string household_id to int
            household_id_int = int(household_id)
            
            if not self.is_trained:
                await self.initialize_models()
            
            # Get household-specific data
            household_data = await self.db_manager.get_household_data(household_id_int)
            weather_data = await self.db_manager.get_weather_data(household_id_int)
            rec_history = await self.db_manager.get_recommendation_history(household_id_int)
            
            if not household_data:
                raise ValueError(f"Household {household_id} not found")
            
            # Generate recommendations
            recommendations = self.model.predict_recommendations(
                household_id_int, household_data[0], weather_data, rec_history, top_n
            )
            
            return recommendations
        except ValueError as e:
            if "not found" in str(e):
                raise e
            else:
                raise ValueError(f"Invalid household_id: {household_id}")
        except Exception as e:
            logger.error(f"Error getting recommendations: {e}")
            raise
    
    async def save_feedback(self, household_id: str, recommendation_id: int, 
                          effectiveness: float, satisfaction: float):
        """Save user feedback for recommendations"""
        try:
            # Convert string household_id to int
            household_id_int = int(household_id)
            
            await self.db_manager.save_recommendation_feedback(
                household_id_int, recommendation_id, effectiveness, satisfaction
            )
        except ValueError:
            raise ValueError(f"Invalid household_id: {household_id}")
        except Exception as e:
            logger.error(f"Error saving feedback: {e}")
            raise