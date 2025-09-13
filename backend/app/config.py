import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # MongoDB
    MONGO_URI: str = os.getenv("MONGO_URI", "mongodb://localhost:27017/energy_db")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "energy_db")
    
    # API
    API_HOST: str = os.getenv("API_HOST", "0.0.0.0")
    API_PORT: int = int(os.getenv("API_PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    # Model paths
    MODEL_PATH: str = os.getenv("MODEL_PATH", "models/trained_models.joblib")
    CATALOG_PATH: str = os.getenv("CATALOG_PATH", "data/recommendation_catalog.json")

settings = Settings()