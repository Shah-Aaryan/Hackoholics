# Setup MongoDB Locally on Windows

## Option A: Using MongoDB Community Server

1. **Download MongoDB Community Server:**
   - Go to https://www.mongodb.com/try/download/community
   - Select Windows x64
   - Download the MSI installer

2. **Install MongoDB:**
   - Run the MSI installer
   - Choose "Complete" installation
   - Install as a Windows Service
   - Install MongoDB Compass (GUI tool)

3. **Start MongoDB Service:**
   - Open Services (services.msc)
   - Find "MongoDB" service
   - Right-click and select "Start"

## Option B: Using Docker (Recommended)

1. **Install Docker Desktop:**
   - Download from https://www.docker.com/products/docker-desktop
   - Install and start Docker Desktop

2. **Run MongoDB with Docker:**
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

3. **Verify MongoDB is running:**
   ```bash
   docker ps
   ```

## Option C: Using MongoDB Shell (mongosh)

1. **Download MongoDB Shell:**
   - Go to https://www.mongodb.com/try/download/shell
   - Download for Windows

2. **Install and run:**
   ```bash
   mongosh
   ```

## Test Connection

After installation, test the connection:
```bash
python test_api.py
```

## Default Connection String

For local MongoDB, use:
```
MONGO_URI=mongodb://localhost:27017
DATABASE_NAME=energy_db
```
