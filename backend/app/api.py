# app/api.py
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List
import logging, os
from .services import RecommendationService
from .database import DatabaseManager
from .models import EnergyRecommendationModel

logger = logging.getLogger(__name__)

router = APIRouter()

# ------------------------------
# Dependencies
# ------------------------------
def get_db_manager():
    MONGO_URI = os.getenv("MONGO_URI")
    DATABASE_NAME = os.getenv("DATABASE_NAME", "energy_db")
    return DatabaseManager(connection_string=MONGO_URI, database_name=DATABASE_NAME)


def get_recommendation_model():
    return EnergyRecommendationModel()

def get_recommendation_service(
    db_manager: DatabaseManager = Depends(get_db_manager),
    model: EnergyRecommendationModel = Depends(get_recommendation_model)
):
    # RecommendationService constructor updated to accept model
    return RecommendationService(db_manager, model)

# ------------------------------
# Pydantic models
# ------------------------------
class RecommendationResponse(BaseModel):
    recommendation_id: int
    title: str
    description: str
    category: str
    potential_savings: str
    cost: str
    difficulty: str
    confidence_score: float

class FeedbackRequest(BaseModel):
    recommendation_id: int
    effectiveness: float
    satisfaction: float

# ------------------------------
# API endpoints
# ------------------------------
@router.get("/health")
async def health_check(service: RecommendationService = Depends(get_recommendation_service)):
    return {"status": "healthy", "model_ready": service.is_trained}

@router.get("/households/{household_id}/recommendations", response_model=List[RecommendationResponse])
async def get_recommendations(
    household_id: str,
    service: RecommendationService = Depends(get_recommendation_service)
):
    try:
        recommendations = await service.get_recommendations(household_id)
        return recommendations
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error getting recommendations: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/households/{household_id}/feedback")
async def submit_feedback(
    household_id: str,
    feedback: FeedbackRequest,
    service: RecommendationService = Depends(get_recommendation_service)
):
    try:
        await service.save_feedback(
            household_id, feedback.recommendation_id, 
            feedback.effectiveness, feedback.satisfaction
        )
        return {"status": "feedback_saved"}
    except Exception as e:
        logger.error(f"Error saving feedback: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/admin/train-models")
async def train_models(service: RecommendationService = Depends(get_recommendation_service)):
    try:
        await service.train_models()
        return {"status": "models_trained"}
    except Exception as e:
        logger.error(f"Error training models: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
