# populate_db.py
import asyncio
import os
import sys
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

async def populate_database():
    """Populate MongoDB with sample data"""
    
    # MongoDB connection
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    DATABASE_NAME = os.getenv("DATABASE_NAME", "energy_db")
    
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DATABASE_NAME]
    
    try:
        print("Connecting to MongoDB...")
        await client.admin.command('ping')
        print("✅ Connected to MongoDB successfully!")
        
        # Sample households data
        households_data = [
            {
                "household_id": 1,
                "type": "house",
                "size": 4,
                "age": 15,
                "income_level": "medium",
                "square_footage": 2000,
                "created_at": datetime.now(),
                "updated_at": datetime.now()
            },
            {
                "household_id": 2,
                "type": "apartment",
                "size": 2,
                "age": 5,
                "income_level": "low",
                "square_footage": 800,
                "created_at": datetime.now(),
                "updated_at": datetime.now()
            },
            {
                "household_id": 3,
                "type": "house",
                "size": 6,
                "age": 25,
                "income_level": "high",
                "square_footage": 3500,
                "created_at": datetime.now(),
                "updated_at": datetime.now()
            },
            {
                "household_id": 4,
                "type": "apartment",
                "size": 3,
                "age": 10,
                "income_level": "medium",
                "square_footage": 1200,
                "created_at": datetime.now(),
                "updated_at": datetime.now()
            },
            {
                "household_id": 5,
                "type": "house",
                "size": 5,
                "age": 20,
                "income_level": "high",
                "square_footage": 2800,
                "created_at": datetime.now(),
                "updated_at": datetime.now()
            }
        ]
        
        # Sample energy usage data
        usage_data = []
        for household_id in range(1, 6):
            for month in range(1, 13):  # 12 months of data
                base_usage = 800 + (household_id * 100) + (month * 20)
                usage_data.append({
                    "household_id": household_id,
                    "month": month,
                    "energy_usage_kwh": base_usage + (month % 3) * 50,
                    "cost": round((base_usage + (month % 3) * 50) * 0.12, 2),
                    "reading_date": datetime(2024, month, 15)
                })
        
        # Sample weather data
        weather_data = []
        seasons = ["winter", "spring", "summer", "fall"]
        temperatures = [30, 55, 85, 60]  # Average temps for each season
        
        for household_id in range(1, 6):
            for month in range(1, 13):
                season_index = (month - 1) // 3
                weather_data.append({
                    "household_id": household_id,
                    "month": month,
                    "avg_temperature": temperatures[season_index] + (month % 3) * 5,
                    "humidity": 60 + (month % 5) * 10,
                    "season": seasons[season_index],
                    "recorded_date": datetime(2024, month, 15)
                })
        
        # Sample recommendation history
        recommendation_history = [
            {
                "household_id": 1,
                "recommendation_id": 1,
                "tried": True,
                "effectiveness": 0.8,
                "satisfaction": 0.9,
                "created_at": datetime.now() - timedelta(days=30),
                "updated_at": datetime.now() - timedelta(days=30)
            },
            {
                "household_id": 1,
                "recommendation_id": 2,
                "tried": True,
                "effectiveness": 0.6,
                "satisfaction": 0.7,
                "created_at": datetime.now() - timedelta(days=20),
                "updated_at": datetime.now() - timedelta(days=20)
            },
            {
                "household_id": 2,
                "recommendation_id": 1,
                "tried": True,
                "effectiveness": 0.9,
                "satisfaction": 0.8,
                "created_at": datetime.now() - timedelta(days=25),
                "updated_at": datetime.now() - timedelta(days=25)
            },
            {
                "household_id": 3,
                "recommendation_id": 3,
                "tried": True,
                "effectiveness": 0.7,
                "satisfaction": 0.8,
                "created_at": datetime.now() - timedelta(days=15),
                "updated_at": datetime.now() - timedelta(days=15)
            }
        ]
        
        # Clear existing data
        print("Clearing existing data...")
        await db.households.delete_many({})
        await db.energy_usage.delete_many({})
        await db.weather_data.delete_many({})
        await db.recommendation_history.delete_many({})
        
        # Insert sample data
        print("Inserting sample data...")
        await db.households.insert_many(households_data)
        await db.energy_usage.insert_many(usage_data)
        await db.weather_data.insert_many(weather_data)
        await db.recommendation_history.insert_many(recommendation_history)
        
        # Create indexes
        print("Creating indexes...")
        await db.households.create_index("household_id", unique=True)
        await db.energy_usage.create_index("household_id")
        await db.energy_usage.create_index("reading_date")
        await db.weather_data.create_index("household_id")
        await db.weather_data.create_index("recorded_date")
        await db.recommendation_history.create_index("household_id")
        await db.recommendation_history.create_index("recommendation_id")
        
        # Verify data insertion
        household_count = await db.households.count_documents({})
        usage_count = await db.energy_usage.count_documents({})
        weather_count = await db.weather_data.count_documents({})
        history_count = await db.recommendation_history.count_documents({})
        
        print(f"✅ Data populated successfully!")
        print(f"   - Households: {household_count}")
        print(f"   - Energy usage records: {usage_count}")
        print(f"   - Weather records: {weather_count}")
        print(f"   - Recommendation history: {history_count}")
        
    except Exception as e:
        print(f"❌ Error populating database: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(populate_database())
