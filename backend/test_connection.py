# test_connection.py
import asyncio
import os
import sys
from motor.motor_asyncio import AsyncIOMotorClient

async def test_mongodb_connection():
    """Test MongoDB connection with different configurations"""
    
    print("🔍 Testing MongoDB Connection")
    print("=" * 40)
    
    # Test configurations - prioritize Atlas if available
    configs = [
        {
            "name": "MongoDB Atlas (if configured)",
            "uri": os.getenv("MONGO_URI"),
            "db": os.getenv("DATABASE_NAME", "eco")
        },
        {
            "name": "Local MongoDB (default)",
            "uri": "mongodb://localhost:27017",
            "db": "energy_db"
        }
    ]
    
    for config in configs:
        if not config["uri"]:
            continue
            
        print(f"\n📡 Testing: {config['name']}")
        print(f"   URI: {config['uri'][:50]}...")
        print(f"   Database: {config['db']}")
        
        try:
            client = AsyncIOMotorClient(config["uri"], serverSelectionTimeoutMS=5000)
            
            # Test connection
            await client.admin.command('ping')
            print("   ✅ Connection successful!")
            
            # Test database access
            db = client[config["db"]]
            collections = await db.list_collection_names()
            print(f"   📊 Collections: {collections}")
            
            client.close()
            
            # Create .env file if this connection works
            if config["name"] == "Local MongoDB (default)":
                env_content = f"""MONGO_URI={config['uri']}
DATABASE_NAME={config['db']}
"""
                with open('.env', 'w') as f:
                    f.write(env_content)
                print("   📝 Created .env file")
            
            return True
            
        except Exception as e:
            print(f"   ❌ Connection failed: {str(e)[:100]}...")
    
    print("\n❌ No working MongoDB connection found!")
    print("\n🔧 Setup options:")
    print("1. Run: python setup_atlas_connection.py (for MongoDB Atlas - RECOMMENDED)")
    print("2. Run: python docker_setup.py (if you have Docker)")
    print("3. Install MongoDB locally (see setup_local_mongodb.md)")
    
    return False

if __name__ == "__main__":
    asyncio.run(test_mongodb_connection())
