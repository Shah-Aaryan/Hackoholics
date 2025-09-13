# init_db.py
import asyncio
from .database import DatabaseManager
from .config import Config
import logging

logger = logging.getLogger(__name__)

async def initialize_database():
    """Initialize MongoDB database with sample data"""
    db_manager = DatabaseManager(Config.DATABASE_URL)
    
    try:
        # Test connection
        if not await db_manager.test_connection():
            logger.error("Failed to connect to MongoDB")
            return False
        
        # Create indexes
        await db_manager.create_indexes()
        
        logger.info("Database initialized successfully")
        return True
        
    except Exception as e:
        logger.error(f"Error initializing database: {e}")
        return False
    finally:
        await db_manager.close_connection()

if __name__ == "__main__":
    asyncio.run(initialize_database()) 