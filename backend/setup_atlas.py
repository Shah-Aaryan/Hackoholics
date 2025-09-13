# setup_atlas.py
import os
import sys

def setup_mongodb_atlas():
    """Setup MongoDB Atlas connection"""
    
    print("🔗 MongoDB Atlas Setup")
    print("=" * 50)
    print()
    print("1. Go to https://www.mongodb.com/atlas")
    print("2. Create a free account")
    print("3. Create a new cluster (free tier)")
    print("4. Get your connection string")
    print()
    
    # Get connection string from user
    connection_string = input("Enter your MongoDB Atlas connection string: ").strip()
    
    if not connection_string:
        print("❌ No connection string provided!")
        return
    
    # Get database name
    db_name = input("Enter database name (default: energy_db): ").strip() or "energy_db"
    
    # Create .env file
    env_content = f"""MONGO_URI={connection_string}
DATABASE_NAME={db_name}
"""
    
    with open('.env', 'w') as f:
        f.write(env_content)
    
    print(f"✅ Created .env file with:")
    print(f"   MONGO_URI: {connection_string[:50]}...")
    print(f"   DATABASE_NAME: {db_name}")
    print()
    print("Now you can run:")
    print("  python populate_db.py")
    print("  python run_server.py")

if __name__ == "__main__":
    setup_mongodb_atlas()
