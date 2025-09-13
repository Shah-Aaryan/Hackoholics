# setup_atlas_connection.py
import os

def setup_atlas():
    """Setup MongoDB Atlas connection for the 'eco' database"""
    
    print("🌐 MongoDB Atlas Setup for 'eco' Database")
    print("=" * 50)
    print()
    print("You mentioned you have MongoDB Atlas connected.")
    print("Let's set up the connection string for your 'eco' database.")
    print()
    
    # Get connection string from user
    print("📋 Please provide your MongoDB Atlas connection details:")
    print()
    
    # Get connection string
    connection_string = input("Enter your MongoDB Atlas connection string: ").strip()
    
    if not connection_string:
        print("❌ No connection string provided!")
        return
    
    # Verify it's an Atlas connection string
    if "mongodb+srv://" not in connection_string:
        print("⚠️  Warning: This doesn't look like a MongoDB Atlas connection string.")
        print("   Atlas connection strings usually start with 'mongodb+srv://'")
        proceed = input("Continue anyway? (y/n): ").strip().lower()
        if proceed != 'y':
            return
    
    # Create .env file
    env_content = f"""MONGO_URI={connection_string}
DATABASE_NAME=eco
"""
    
    with open('.env', 'w') as f:
        f.write(env_content)
    
    print()
    print("✅ Created .env file with your MongoDB Atlas connection!")
    print(f"   Database: eco")
    print(f"   URI: {connection_string[:50]}...")
    print()
    print("🧪 Now let's test the connection:")
    print("   python test_connection.py")
    print()
    print("📊 If successful, populate the database:")
    print("   python populate_db.py")
    print()
    print("🚀 Then start the API server:")
    print("   python run_server.py")

if __name__ == "__main__":
    setup_atlas()
