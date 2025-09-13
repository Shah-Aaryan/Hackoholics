# test_full_flow.py
import asyncio
import os
import sys

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.database import DatabaseManager
from app.services import RecommendationService
from app.models import EnergyRecommendationModel

async def test_full_flow():
    """Test the complete recommendation flow"""
    
    print("🧪 Testing Full Recommendation Flow")
    print("=" * 50)
    
    # Initialize components
    db_manager = DatabaseManager(
        connection_string=os.getenv("MONGO_URI", "mongodb://localhost:27017"),
        database_name=os.getenv("DATABASE_NAME", "energy_db")
    )
    
    model = EnergyRecommendationModel()
    service = RecommendationService(db_manager, model)
    
    try:
        # Step 1: Test MongoDB connection
        print("1️⃣ Testing MongoDB connection...")
        is_connected = await db_manager.test_connection()
        
        if not is_connected:
            print("❌ MongoDB connection failed!")
            print("💡 Run: python test_connection.py to fix this")
            return
        
        print("✅ MongoDB connection successful!")
        
        # Step 2: Check if we have data
        print("\n2️⃣ Checking database data...")
        households = await db_manager.get_household_data()
        usage_data = await db_manager.get_usage_data()
        weather_data = await db_manager.get_weather_data()
        
        print(f"   📊 Households: {len(households)}")
        print(f"   📊 Usage records: {len(usage_data)}")
        print(f"   📊 Weather records: {len(weather_data)}")
        
        if len(households) == 0:
            print("❌ No households found in database!")
            print("💡 Run: python populate_db.py to add sample data")
            return
        
        # Step 3: Test model training
        print("\n3️⃣ Testing model training...")
        try:
            await service.train_models()
            print("✅ Models trained successfully!")
        except Exception as e:
            print(f"❌ Model training failed: {e}")
            return
        
        # Step 4: Test recommendations
        print("\n4️⃣ Testing recommendations...")
        test_household_id = str(households[0]['household_id'])
        
        try:
            recommendations = await service.get_recommendations(test_household_id)
            print(f"✅ Got {len(recommendations)} recommendations for household {test_household_id}:")
            
            for i, rec in enumerate(recommendations[:3], 1):
                print(f"   {i}. {rec['title']} (confidence: {rec['confidence_score']})")
                
        except Exception as e:
            print(f"❌ Error getting recommendations: {e}")
            return
        
        # Step 5: Test feedback submission
        print("\n5️⃣ Testing feedback submission...")
        try:
            await service.save_feedback(
                test_household_id, 
                recommendations[0]['recommendation_id'], 
                0.8, 
                0.9
            )
            print("✅ Feedback submitted successfully!")
        except Exception as e:
            print(f"❌ Error submitting feedback: {e}")
            return
        
        print("\n🎉 All tests passed! Your API is ready to use.")
        print("\n🚀 Next steps:")
        print("   python run_server.py")
        print("   Then visit: http://localhost:8000/docs")
        
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
    finally:
        await db_manager.close_pool()

if __name__ == "__main__":
    asyncio.run(test_full_flow())
