# run_server.py
import asyncio
import os
import sys
import uvicorn

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

async def main():
    """Main function to start the server"""
    
    # Set environment variables if not set
    if not os.getenv("MONGO_URI"):
        os.environ["MONGO_URI"] = "mongodb://localhost:27017"
    if not os.getenv("DATABASE_NAME"):
        os.environ["DATABASE_NAME"] = "energy_db"
    
    print("🚀 Starting Energy Recommendation API Server...")
    print(f"📊 MongoDB URI: {os.getenv('MONGO_URI')}")
    print(f"🗄️  Database: {os.getenv('DATABASE_NAME')}")
    
    # Start the server
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

if __name__ == "__main__":
    asyncio.run(main())
