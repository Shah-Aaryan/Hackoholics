# docker_setup.py
import subprocess
import sys
import os

def check_docker():
    """Check if Docker is installed and running"""
    try:
        result = subprocess.run(['docker', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Docker found: {result.stdout.strip()}")
            return True
        else:
            print("❌ Docker not found")
            return False
    except FileNotFoundError:
        print("❌ Docker not installed")
        return False

def check_docker_running():
    """Check if Docker daemon is running"""
    try:
        result = subprocess.run(['docker', 'ps'], capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ Docker daemon is running")
            return True
        else:
            print("❌ Docker daemon is not running")
            return False
    except:
        return False

def start_mongodb():
    """Start MongoDB using Docker"""
    print("🐳 Starting MongoDB with Docker...")
    
    # Check if container already exists
    result = subprocess.run(['docker', 'ps', '-a', '--filter', 'name=mongodb'], capture_output=True, text=True)
    
    if 'mongodb' in result.stdout:
        print("📦 MongoDB container already exists, starting it...")
        subprocess.run(['docker', 'start', 'mongodb'])
    else:
        print("📦 Creating new MongoDB container...")
        subprocess.run([
            'docker', 'run', '-d', 
            '-p', '27017:27017', 
            '--name', 'mongodb',
            'mongo:latest'
        ])
    
    print("⏳ Waiting for MongoDB to start...")
    import time
    time.sleep(5)
    
    # Test connection
    print("🔍 Testing MongoDB connection...")
    result = subprocess.run(['docker', 'exec', 'mongodb', 'mongosh', '--eval', 'db.runCommand("ping")'], 
                          capture_output=True, text=True)
    
    if 'ok' in result.stdout.lower():
        print("✅ MongoDB is running successfully!")
        return True
    else:
        print("❌ MongoDB failed to start")
        return False

def create_env_file():
    """Create .env file for local MongoDB"""
    env_content = """MONGO_URI=mongodb://localhost:27017
DATABASE_NAME=energy_db
"""
    
    with open('.env', 'w') as f:
        f.write(env_content)
    
    print("✅ Created .env file for local MongoDB")

def main():
    print("🐳 MongoDB Docker Setup")
    print("=" * 40)
    
    # Check Docker
    if not check_docker():
        print("\n❌ Please install Docker Desktop first:")
        print("   https://www.docker.com/products/docker-desktop")
        return
    
    if not check_docker_running():
        print("\n❌ Please start Docker Desktop first")
        return
    
    # Start MongoDB
    if start_mongodb():
        create_env_file()
        print("\n🚀 Setup complete! You can now run:")
        print("   python populate_db.py")
        print("   python run_server.py")
    else:
        print("\n❌ Setup failed. Please check Docker logs")

if __name__ == "__main__":
    main()
