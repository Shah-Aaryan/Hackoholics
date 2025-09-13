# database.py
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List, Dict, Any, Optional
import os
import logging
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class DatabaseManager:
    def __init__(self, connection_string: str, database_name: str):
        self.connection_string = connection_string
        self.database_name = database_name
        self.client = None
        self.db = None
        self.connected = False
    
    async def initialize_pool(self):
        """Initialize the MongoDB connection"""
        if self.client is None:
            try:
                self.client = AsyncIOMotorClient(self.connection_string)
                self.db = self.client[self.database_name]
                # Test connection
                await self.client.admin.command('ping')
                self.connected = True
                logger.info(f"MongoDB connection initialized successfully: {self.database_name}")
            except Exception as e:
                logger.error(f"Failed to initialize MongoDB connection: {e}")
                raise
    
    async def close_pool(self):
        """Close the MongoDB connection"""
        if self.client:
            self.client.close()
            self.client = None
            self.db = None
            self.connected = False
            logger.info("MongoDB connection closed")
    
    async def get_connection(self):
        """Get database instance"""
        if not self.connected:
            await self.initialize_pool()
        return self.db
    
    async def get_household_data(self, household_id: Optional[str] = None) -> List[Dict]:
        """Get household data from MongoDB"""
        try:
            db = await self.get_connection()
            collection = db.households
            
            if household_id:
                # Convert string household_id to int if needed
                try:
                    household_id_int = int(household_id)
                    household = await collection.find_one({"household_id": household_id_int})
                except ValueError:
                    household = await collection.find_one({"household_id": household_id})
                return [household] if household else []
            else:
                cursor = collection.find({})
                return await cursor.to_list(length=1000)
                
        except Exception as e:
            logger.error(f"Error getting household data: {e}")
            return []
    
    async def get_usage_data(self, household_id: Optional[str] = None, 
                           limit: int = 12) -> List[Dict]:
        """Get energy usage data from MongoDB"""
        try:
            db = await self.get_connection()
            collection = db.energy_usage
            
            query = {}
            if household_id:
                try:
                    household_id_int = int(household_id)
                    query["household_id"] = household_id_int
                except ValueError:
                    query["household_id"] = household_id
            
            # Get latest records
            cursor = collection.find(query).sort("reading_date", -1).limit(limit)
            return await cursor.to_list(length=limit)
                
        except Exception as e:
            logger.error(f"Error getting usage data: {e}")
            return []
    
    async def get_weather_data(self, household_id: Optional[str] = None, 
                             limit: int = 12) -> List[Dict]:
        """Get weather data from MongoDB"""
        try:
            db = await self.get_connection()
            collection = db.weather_data
            
            query = {}
            if household_id:
                try:
                    household_id_int = int(household_id)
                    query["household_id"] = household_id_int
                except ValueError:
                    query["household_id"] = household_id
            
            cursor = collection.find(query).sort("recorded_date", -1).limit(limit)
            return await cursor.to_list(length=limit)
                
        except Exception as e:
            logger.error(f"Error getting weather data: {e}")
            return []
    
    async def get_recommendation_history(self, household_id: Optional[str] = None) -> List[Dict]:
        """Get recommendation history from MongoDB"""
        try:
            db = await self.get_connection()
            collection = db.recommendation_history
            
            query = {}
            if household_id:
                try:
                    household_id_int = int(household_id)
                    query["household_id"] = household_id_int
                except ValueError:
                    query["household_id"] = household_id
            
            cursor = collection.find(query).sort("created_at", -1)
            return await cursor.to_list(length=100)
                
        except Exception as e:
            logger.error(f"Error getting recommendation history: {e}")
            return []
    
    async def save_recommendation_feedback(self, household_id: str, recommendation_id: int, 
                                         effectiveness: float, satisfaction: float):
        """Save user feedback on recommendations to MongoDB"""
        try:
            db = await self.get_connection()
            collection = db.recommendation_feedback
            
            # Convert household_id to int if it's numeric
            try:
                household_id_int = int(household_id)
                household_id_val = household_id_int
            except ValueError:
                household_id_val = household_id
            
            await collection.update_one(
                {
                    "household_id": household_id_val,
                    "recommendation_id": recommendation_id
                },
                {
                    "$set": {
                        "effectiveness": effectiveness,
                        "satisfaction": satisfaction,
                        "updated_at": datetime.utcnow()
                    },
                    "$setOnInsert": {
                        "created_at": datetime.utcnow()
                    }
                },
                upsert=True
            )
            
            logger.info(f"Saved feedback for household {household_id}, recommendation {recommendation_id}")
                
        except Exception as e:
            logger.error(f"Error saving recommendation feedback: {e}")
            raise
    
    async def save_recommendation_history(self, household_id: str, recommendation_id: int,
                                        tried: bool = True, effectiveness: float = 0.0,
                                        satisfaction: float = 0.0):
        """Save recommendation history to MongoDB"""
        try:
            db = await self.get_connection()
            collection = db.recommendation_history
            
            # Convert household_id to int if it's numeric
            try:
                household_id_int = int(household_id)
                household_id_val = household_id_int
            except ValueError:
                household_id_val = household_id
            
            await collection.update_one(
                {
                    "household_id": household_id_val,
                    "recommendation_id": recommendation_id
                },
                {
                    "$set": {
                        "tried": tried,
                        "effectiveness": effectiveness,
                        "satisfaction": satisfaction,
                        "updated_at": datetime.utcnow()
                    },
                    "$setOnInsert": {
                        "created_at": datetime.utcnow()
                    }
                },
                upsert=True
            )
            
            logger.info(f"Saved history for household {household_id}, recommendation {recommendation_id}")
                
        except Exception as e:
            logger.error(f"Error saving recommendation history: {e}")
            raise
    
    async def get_household_stats(self, household_id: str) -> Dict[str, Any]:
        """Get comprehensive statistics for a household from MongoDB"""
        try:
            db = await self.get_connection()
            
            # Convert household_id to int if it's numeric
            try:
                household_id_int = int(household_id)
                household_id_val = household_id_int
            except ValueError:
                household_id_val = household_id
            
            # Get household info
            household = await db.households.find_one({"household_id": household_id_val})
            if not household:
                return {}
            
            # Get usage stats
            usage_stats = await db.energy_usage.aggregate([
                {"$match": {"household_id": household_id_val}},
                {"$group": {
                    "_id": None,
                    "avg_monthly_usage": {"$avg": "$energy_usage_kwh"},
                    "max_monthly_usage": {"$max": "$energy_usage_kwh"},
                    "min_monthly_usage": {"$min": "$energy_usage_kwh"},
                    "avg_monthly_cost": {"$avg": "$cost"}
                }}
            ]).to_list(length=1)
            
            # Get recommendation count
            rec_count = await db.recommendation_history.count_documents({
                "household_id": household_id_val
            })
            
            stats = {
                "household_id": household.get("household_id"),
                "type": household.get("type"),
                "size": household.get("size"),
                "income_level": household.get("income_level"),
                "recommendations_tried": rec_count
            }
            
            if usage_stats and usage_stats[0]:
                stats.update({
                    "avg_monthly_usage": usage_stats[0].get("avg_monthly_usage", 0),
                    "max_monthly_usage": usage_stats[0].get("max_monthly_usage", 0),
                    "min_monthly_usage": usage_stats[0].get("min_monthly_usage", 0),
                    "avg_monthly_cost": usage_stats[0].get("avg_monthly_cost", 0)
                })
            
            return stats
                
        except Exception as e:
            logger.error(f"Error getting household stats: {e}")
            return {}
    
    async def get_similar_households(self, household_id: str, limit: int = 10) -> List[Dict]:
        """Get households with similar characteristics from MongoDB"""
        try:
            db = await self.get_connection()
            
            # Get current household
            try:
                household_id_int = int(household_id)
                current_household = await db.households.find_one({"household_id": household_id_int})
            except ValueError:
                current_household = await db.households.find_one({"household_id": household_id})
            
            if not current_household:
                return []
            
            # Find similar households
            similar_households = await db.households.find({
                "type": current_household.get("type"),
                "income_level": current_household.get("income_level"),
                "household_id": {"$ne": current_household.get("household_id")},
                "size": {"$gte": current_household.get("size", 0) - 1, 
                        "$lte": current_household.get("size", 0) + 1}
            }).limit(limit).to_list(length=limit)
            
            return similar_households
                
        except Exception as e:
            logger.error(f"Error getting similar households: {e}")
            return []
    
    async def get_recommendation_effectiveness(self, recommendation_id: int) -> Dict[str, Any]:
        """Get effectiveness statistics for a specific recommendation from MongoDB"""
        try:
            db = await self.get_connection()
            
            stats = await db.recommendation_history.aggregate([
                {"$match": {"recommendation_id": recommendation_id}},
                {"$group": {
                    "_id": "$recommendation_id",
                    "total_trials": {"$sum": 1},
                    "avg_effectiveness": {"$avg": "$effectiveness"},
                    "avg_satisfaction": {"$avg": "$satisfaction"},
                    "high_effectiveness_count": {
                        "$sum": {"$cond": [{"$gt": ["$effectiveness", 0.7]}, 1, 0]}
                    }
                }}
            ]).to_list(length=1)
            
            return stats[0] if stats else {}
                
        except Exception as e:
            logger.error(f"Error getting recommendation effectiveness: {e}")
            return {}
    
    async def test_connection(self) -> bool:
        """Test MongoDB connection"""
        try:
            if not self.connected:
                await self.initialize_pool()
            await self.client.admin.command('ping')
            return True
        except Exception as e:
            logger.error(f"MongoDB connection test failed: {e}")
            return False
    
    async def get_database_stats(self) -> Dict[str, Any]:
        """Get database statistics from MongoDB"""
        try:
            db = await self.get_connection()
            
            stats = {
                'total_households': await db.households.count_documents({}),
                'total_usage_records': await db.energy_usage.count_documents({}),
                'total_recommendations': await db.recommendation_history.count_documents({}),
            }
            
            # Get active households (last 30 days)
            thirty_days_ago = datetime.utcnow() - timedelta(days=30)
            active_households = await db.energy_usage.distinct(
                "household_id", 
                {"reading_date": {"$gte": thirty_days_ago}}
            )
            stats['active_households'] = len(active_households)
            
            return stats
            
        except Exception as e:
            logger.error(f"Error getting database stats: {e}")
            return {}

# Use .env variables
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "energy_db")

# Global database instance
db_manager = DatabaseManager(connection_string=MONGO_URI, database_name=DATABASE_NAME)