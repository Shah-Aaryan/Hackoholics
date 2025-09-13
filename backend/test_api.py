# test_api.py
import asyncio
import sys
import os

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.database import DatabaseManager
from app.services import RecommendationService
from app.models import EnergyRecommendationModel

async def test_recommendations():
    """Test the recommendation system"""
    
    # Initialize components
    db_manager = DatabaseManager(
        connection_string=os.getenv("MONGO_URI", "mongodb://localhost:27017"),
        database_name=os.getenv("DATABASE_NAME", "energy_db")
    )
    
    model = EnergyRecommendationModel()
    service = RecommendationService(db_manager, model)
    
    try:
        print("Testing MongoDB connection...")
        is_connected = await db_manager.test_connection()
        
        if not is_connected:
            print("❌ MongoDB connection failed!")
            return
        
        print("✅ MongoDB connection successful!")
        
        # Test getting household data
        print("\nTesting household data retrieval...")
        households = await db_manager.get_household_data()
        print(f"Found {len(households)} households")
        
        if households:
            # Test getting recommendations for first household
            household_id = str(households[0]['household_id'])
            print(f"\nTesting recommendations for household {household_id}...")
            
            try:
                recommendations = await service.get_recommendations(household_id)
                print(f"✅ Got {len(recommendations)} recommendations:")
                for rec in recommendations:
                    print(f"   - {rec['title']} (confidence: {rec['confidence_score']})")
                    
            except Exception as e:
                print(f"❌ Error getting recommendations: {e}")
        else:
            print("❌ No households found in database!")
            
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        await db_manager.close_pool()

if __name__ == "__main__":
    asyncio.run(test_recommendations())
