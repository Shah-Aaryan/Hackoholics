# models.py
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import NMF
from sklearn.ensemble import RandomForestRegressor
from sklearn.cluster import KMeans
import joblib
import json
from typing import Dict, List, Any
import logging

logger = logging.getLogger(__name__)

class EnergyRecommendationModel:
    def __init__(self):
        self.scaler = StandardScaler()
        self.label_encoders = {}
        self.nmf_model = None
        self.kmeans = None
        self.household_features = None
        self.household_features_scaled = None
        self.predicted_ratings = None
        self.household_clusters = None
        self.similarity_df = None
        self.recommendation_catalog = self._load_recommendation_catalog()
        
    def _load_recommendation_catalog(self) -> Dict:
        """Load recommendation catalog from JSON file"""
        try:
            with open('data/recommendation_catalog.json', 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            logger.warning("Recommendation catalog not found, using default")
            return self._create_default_catalog()
    
    def _create_default_catalog(self) -> Dict:
        """Create default recommendation catalog"""
        return {
            1: {
                'title': 'Upgrade to LED bulbs',
                'description': 'Replace incandescent bulbs with LED bulbs',
                'category': 'lighting',
                'potential_savings': 0.75,
                'cost': 'low',
                'difficulty': 'easy',
                'seasonal_relevance': ['all'],
                'household_type': ['all']
            },
            2: {
                'title': 'Install programmable thermostat',
                'description': 'Use smart thermostat to optimize heating/cooling',
                'category': 'hvac',
                'potential_savings': 0.10,
                'cost': 'medium',
                'difficulty': 'medium',
                'seasonal_relevance': ['winter', 'summer'],
                'household_type': ['house', 'apartment']
            },
            3: {
                'title': 'Improve insulation',
                'description': 'Add insulation to walls, attic, and basement',
                'category': 'insulation',
                'potential_savings': 0.15,
                'cost': 'high',
                'difficulty': 'hard',
                'seasonal_relevance': ['winter'],
                'household_type': ['house']
            },
            4: {
                'title': 'Seal air leaks',
                'description': 'Caulk and weatherstrip doors and windows',
                'category': 'insulation',
                'potential_savings': 0.05,
                'cost': 'low',
                'difficulty': 'easy',
                'seasonal_relevance': ['winter', 'summer'],
                'household_type': ['all']
            },
            5: {
                'title': 'Use cold water for washing',
                'description': 'Wash clothes in cold water when possible',
                'category': 'appliances',
                'potential_savings': 0.12,
                'cost': 'free',
                'difficulty': 'easy',
                'seasonal_relevance': ['all'],
                'household_type': ['all']
            },
            6: {
                'title': 'Install ceiling fans',
                'description': 'Use ceiling fans to circulate air and reduce AC usage',
                'category': 'cooling',
                'potential_savings': 0.08,
                'cost': 'medium',
                'difficulty': 'medium',
                'seasonal_relevance': ['summer'],
                'household_type': ['house', 'apartment']
            },
            7: {
                'title': 'Unplug phantom loads',
                'description': 'Unplug devices when not in use to eliminate standby power',
                'category': 'electronics',
                'potential_savings': 0.03,
                'cost': 'free',
                'difficulty': 'easy',
                'seasonal_relevance': ['all'],
                'household_type': ['all']
            },
            8: {
                'title': 'Upgrade to ENERGY STAR appliances',
                'description': 'Replace old appliances with energy-efficient models',
                'category': 'appliances',
                'potential_savings': 0.20,
                'cost': 'high',
                'difficulty': 'medium',
                'seasonal_relevance': ['all'],
                'household_type': ['all']
            },
            9: {
                'title': 'Install window treatments',
                'description': 'Use blinds or curtains to control heat gain/loss',
                'category': 'thermal',
                'potential_savings': 0.06,
                'cost': 'medium',
                'difficulty': 'easy',
                'seasonal_relevance': ['winter', 'summer'],
                'household_type': ['all']
            },
            10: {
                'title': 'Maintain HVAC system',
                'description': 'Regular maintenance and filter changes',
                'category': 'hvac',
                'potential_savings': 0.08,
                'cost': 'low',
                'difficulty': 'easy',
                'seasonal_relevance': ['all'],
                'household_type': ['house', 'apartment']
            }
        }
    
    def prepare_features(self, households_data: List[Dict], usage_data: List[Dict], 
                        weather_data: List[Dict]) -> pd.DataFrame:
        """Prepare features from database data"""
        # Convert to DataFrames
        households_df = pd.DataFrame(households_data)
        usage_df = pd.DataFrame(usage_data)
        weather_df = pd.DataFrame(weather_data)
        
        # Aggregate usage data per household
        usage_agg = usage_df.groupby('household_id').agg({
            'energy_usage_kwh': ['mean', 'std', 'max', 'min'],
            'cost': 'mean'
        }).round(2)
        usage_agg.columns = ['avg_usage', 'usage_std', 'max_usage', 'min_usage', 'avg_cost']
        
        # Aggregate weather sensitivity
        weather_usage = usage_df.merge(weather_df, on=['household_id', 'month'])
        weather_sensitivity = weather_usage.groupby('household_id').apply(
            lambda x: np.corrcoef(x['avg_temperature'], x['energy_usage_kwh'])[0, 1] 
            if len(x) > 1 else 0
        ).fillna(0)
        weather_sensitivity.name = 'weather_sensitivity'
        
        # Seasonal usage patterns
        seasonal_usage = weather_usage.groupby(['household_id', 'season'])['energy_usage_kwh'].mean().unstack(fill_value=0)
        seasonal_usage.columns = [f'usage_{col}' for col in seasonal_usage.columns]
        
        # Combine all features
        households_df_indexed = households_df.set_index('household_id')
        features = households_df_indexed.join([
            usage_agg,
            weather_sensitivity,
            seasonal_usage
        ], how='left').fillna(0)
        
        # Encode categorical variables
        categorical_cols = ['type', 'income_level']
        for col in categorical_cols:
            if col not in self.label_encoders:
                self.label_encoders[col] = LabelEncoder()
                # Fit on all possible categories to avoid unseen labels
                all_categories = households_df[col].unique().tolist()
                self.label_encoders[col].fit(all_categories)
            
            features[f'{col}_encoded'] = self.label_encoders[col].transform(features[col])
        
        # Select numerical features for modeling
        feature_cols = [
            'size', 'age', 'square_footage', 'avg_usage', 'usage_std', 
            'max_usage', 'min_usage', 'avg_cost', 'weather_sensitivity',
            'type_encoded', 'income_level_encoded'
        ] + [col for col in features.columns if col.startswith('usage_')]
        
        # Ensure all columns exist (some seasonal columns might be missing)
        available_cols = [col for col in feature_cols if col in features.columns]
        self.household_features = features[available_cols].fillna(0)
        
        # Scale features (fit only if not already fitted)
        if not hasattr(self.scaler, 'n_features_in_'):
            self.scaler.fit(self.household_features)
        
        self.household_features_scaled = pd.DataFrame(
            self.scaler.transform(self.household_features),
            index=self.household_features.index,
            columns=self.household_features.columns
        )
        
        return self.household_features
    
    def build_user_item_matrix(self, recommendation_history: List[Dict]) -> pd.DataFrame:
        """Build user-item interaction matrix from recommendation history data"""
        
        if not recommendation_history:
            # Return empty matrix with proper structure
            all_households = self.household_features.index if self.household_features is not None else []
            all_recommendations = list(self.recommendation_catalog.keys())
            
            return pd.DataFrame(0, index=all_households, columns=all_recommendations)
        
        recommendation_history_df = pd.DataFrame(recommendation_history)
        
        # Create matrix of households vs recommendations
        user_item_matrix = recommendation_history_df.pivot_table(
            index='household_id',
            columns='recommendation_id', 
            values='effectiveness',
            fill_value=0
        )
        
        # Ensure all households are represented
        if self.household_features is not None:
            all_households = self.household_features.index
            user_item_matrix = user_item_matrix.reindex(all_households, fill_value=0)
        
        # Ensure all recommendations are represented
        all_recommendations = list(self.recommendation_catalog.keys())
        for rec_id in all_recommendations:
            if rec_id not in user_item_matrix.columns:
                user_item_matrix[rec_id] = 0
        
        return user_item_matrix[sorted(user_item_matrix.columns)]
    
    def train_collaborative_filtering(self, user_item_matrix: pd.DataFrame):
        """Train collaborative filtering model using NMF"""
        if user_item_matrix.empty or len(user_item_matrix) < 2:
            # Create dummy model for small datasets
            self.nmf_model = None
            self.predicted_ratings = pd.DataFrame(0, 
                index=user_item_matrix.index, 
                columns=user_item_matrix.columns
            )
            return
        
        self.nmf_model = NMF(n_components=min(10, len(user_item_matrix)-1), 
                            random_state=42, max_iter=200)
        
        # Fit NMF model
        W = self.nmf_model.fit_transform(user_item_matrix)
        H = self.nmf_model.components_
        
        # Reconstruct the full matrix
        self.predicted_ratings = pd.DataFrame(
            W @ H,
            index=user_item_matrix.index,
            columns=user_item_matrix.columns
        )
    
    def calculate_content_similarity(self):
        """Calculate content-based similarity between households"""
        if self.household_features_scaled is None or len(self.household_features_scaled) < 2:
            # Create identity matrix for small datasets
            self.similarity_df = pd.DataFrame(
                np.eye(len(self.household_features_scaled)),
                index=self.household_features_scaled.index,
                columns=self.household_features_scaled.index
            )
            return
        
        # Calculate cosine similarity between households
        similarity_matrix = cosine_similarity(self.household_features_scaled)
        
        self.similarity_df = pd.DataFrame(
            similarity_matrix,
            index=self.household_features_scaled.index,
            columns=self.household_features_scaled.index
        )
    
    def cluster_households(self):
        """Cluster similar households"""
        if self.household_features_scaled is None or len(self.household_features_scaled) < 2:
            # Assign all to cluster 0 for small datasets
            self.household_clusters = pd.Series(0, index=self.household_features_scaled.index)
            return
        
        n_clusters = min(5, len(self.household_features_scaled))
        self.kmeans = KMeans(n_clusters=n_clusters, random_state=42)
        clusters = self.kmeans.fit_predict(self.household_features_scaled)
        self.household_clusters = pd.Series(clusters, index=self.household_features_scaled.index)
    
    def calculate_recommendation_suitability(self, household_id: int, household_df: pd.DataFrame, 
                                           weather_df: pd.DataFrame) -> Dict:
        """Calculate how suitable each recommendation is for a specific household"""
        
        if len(household_df) == 0:
            return {rec_id: 1.0 for rec_id in self.recommendation_catalog.keys()}
        
        household_info = household_df.iloc[0]
        
        # Get household's weather data to determine dominant season
        household_weather = weather_df[weather_df['household_id'] == household_id]
        if len(household_weather) > 0:
            dominant_season = household_weather['season'].mode().iloc[0] if not household_weather['season'].mode().empty else 'all'
        else:
            dominant_season = 'all'
        
        suitability_scores = {}
        
        for rec_id, rec_info in self.recommendation_catalog.items():
            score = 1.0  # Base score
            
            # Seasonal relevance
            if 'all' not in rec_info['seasonal_relevance'] and dominant_season not in rec_info['seasonal_relevance']:
                score *= 0.5
            
            # Household type compatibility
            if 'all' not in rec_info['household_type'] and household_info['type'] not in rec_info['household_type']:
                score *= 0.3
            
            # Cost vs income compatibility
            if household_info['income_level'] == 'low' and rec_info['cost'] == 'high':
                score *= 0.4
            elif household_info['income_level'] == 'high' and rec_info['cost'] == 'free':
                score *= 1.2
            
            # Potential savings weight
            score *= (1 + rec_info['potential_savings'])
            
            suitability_scores[rec_id] = score
        
        return suitability_scores
    
    def predict_recommendations(self, household_id: int, household_data: Dict, 
                              weather_data: List[Dict], recommendation_history: List[Dict], 
                              top_n: int = 5) -> List[Dict]:
        """Generate recommendations for a single household using database data"""
        
        # Convert data to DataFrames
        household_df = pd.DataFrame([household_data])
        weather_df = pd.DataFrame(weather_data)
        recommendation_history_df = pd.DataFrame(recommendation_history)
        
        # Get collaborative filtering scores
        if household_id in self.predicted_ratings.index:
            cf_scores = self.predicted_ratings.loc[household_id].to_dict()
        else:
            cf_scores = {rec_id: 0 for rec_id in self.recommendation_catalog.keys()}
        
        # Get content-based scores (similar households)
        if household_id in self.similarity_df.index:
            similar_households = self.similarity_df.loc[household_id].nlargest(10).index
        else:
            similar_households = []
        
        cb_scores = {}
        for rec_id in self.recommendation_catalog.keys():
            if len(similar_households) > 0:
                similar_effectiveness = recommendation_history_df[
                    (recommendation_history_df['household_id'].isin(similar_households)) &
                    (recommendation_history_df['recommendation_id'] == rec_id)
                ]['effectiveness'].mean()
                cb_scores[rec_id] = similar_effectiveness if not pd.isna(similar_effectiveness) else 0
            else:
                cb_scores[rec_id] = 0
        
        # Get content suitability scores
        suitability_scores = self.calculate_recommendation_suitability(household_id, household_df, weather_df)
        
        # Get cluster-based scores
        if household_id in self.household_clusters.index:
            household_cluster = self.household_clusters[household_id]
            cluster_households = self.household_clusters[self.household_clusters == household_cluster].index
        else:
            cluster_households = []
        
        cluster_scores = {}
        for rec_id in self.recommendation_catalog.keys():
            if len(cluster_households) > 0:
                cluster_effectiveness = recommendation_history_df[
                    (recommendation_history_df['household_id'].isin(cluster_households)) &
                    (recommendation_history_df['recommendation_id'] == rec_id)
                ]['effectiveness'].mean()
                cluster_scores[rec_id] = cluster_effectiveness if not pd.isna(cluster_effectiveness) else 0
            else:
                cluster_scores[rec_id] = 0
        
        # Check what recommendations this household has already tried
        tried_recommendations = set(
            recommendation_history_df[
                recommendation_history_df['household_id'] == household_id
            ]['recommendation_id'].values
        )
        
        # Combine all scores
        final_scores = {}
        for rec_id in self.recommendation_catalog.keys():
            if rec_id in tried_recommendations:
                continue  # Skip already tried recommendations
            
            # Weighted combination of different approaches
            combined_score = (
                0.3 * cf_scores.get(rec_id, 0) +
                0.25 * cb_scores.get(rec_id, 0) +
                0.25 * cluster_scores.get(rec_id, 0) +
                0.2 * suitability_scores.get(rec_id, 0)
            )
            
            final_scores[rec_id] = combined_score
        
        # Get top N recommendations
        top_recommendations = sorted(final_scores.items(), key=lambda x: x[1], reverse=True)[:top_n]
        
        # Format recommendations with details
        formatted_recommendations = []
        for rec_id, score in top_recommendations:
            if rec_id in self.recommendation_catalog:
                rec_info = self.recommendation_catalog[rec_id]
                formatted_recommendations.append({
                    'recommendation_id': rec_id,
                    'title': rec_info['title'],
                    'description': rec_info['description'],
                    'category': rec_info['category'],
                    'potential_savings': f"{rec_info['potential_savings']*100:.0f}%",
                    'cost': rec_info['cost'],
                    'difficulty': rec_info['difficulty'],
                    'confidence_score': round(score, 3)
                })
        
        return formatted_recommendations
    
    def train_models(self, households_data: List[Dict], usage_data: List[Dict], 
                    weather_data: List[Dict], recommendation_history: List[Dict]):
        """Train all recommendation models with database data"""
        
        logger.info("Preparing features...")
        self.prepare_features(households_data, usage_data, weather_data)
        
        logger.info("Building user-item matrix...")
        user_item_matrix = self.build_user_item_matrix(recommendation_history)
        
        logger.info("Training collaborative filtering model...")
        self.train_collaborative_filtering(user_item_matrix)
        
        logger.info("Calculating content-based similarities...")
        self.calculate_content_similarity()
        
        logger.info("Clustering households...")
        self.cluster_households()
        
        logger.info("Models trained successfully!")
    
    def save_models(self, model_path: str):
        """Save trained models to disk"""
        model_data = {
            'nmf_model': self.nmf_model,
            'kmeans': self.kmeans,
            'household_clusters': self.household_clusters,
            'similarity_df': self.similarity_df,
            'predicted_ratings': self.predicted_ratings,
            'scaler': self.scaler,
            'label_encoders': self.label_encoders,
            'household_features': self.household_features,
            'household_features_scaled': self.household_features_scaled
        }
        joblib.dump(model_data, model_path)
        logger.info(f"Models saved to {model_path}")
    
    def load_models(self, model_path: str):
        """Load trained models from disk"""
        try:
            model_data = joblib.load(model_path)
            
            # Load models with default fallbacks
            self.nmf_model = model_data.get('nmf_model', None)
            self.kmeans = model_data.get('kmeans', None)
            self.household_clusters = model_data.get('household_clusters', None)
            self.similarity_df = model_data.get('similarity_df', None)
            self.predicted_ratings = model_data.get('predicted_ratings', None)
            self.scaler = model_data.get('scaler', StandardScaler())
            self.label_encoders = model_data.get('label_encoders', {})
            self.household_features = model_data.get('household_features', None)
            self.household_features_scaled = model_data.get('household_features_scaled', None)
            
            logger.info(f"Models loaded from {model_path}")
            
        except FileNotFoundError:
            logger.warning("No pre-trained models found, will need to train")
            raise
        except Exception as e:
            logger.error(f"Error loading models: {e}")
            logger.warning("Models file may be corrupted, will train new models")
            raise