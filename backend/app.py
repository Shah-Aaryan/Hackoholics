from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="Green Marketplace Microservice")

# -----------------------------
# Schemas
# -----------------------------

class HouseholdProfile(BaseModel):
    household_id: str
    monthly_kwh: float
    appliances: dict

class Recommendation(BaseModel):
    name: str
    description: str
    estimated_savings: str
    vendor_url: str
    category: str
    rating: Optional[float] = None
    distance_km: Optional[float] = None
    discount: Optional[str] = None

class TrendingProduct(BaseModel):
    name: str
    popularity: int
    category: str

# -----------------------------
# Endpoints
# -----------------------------

@app.post("/recommend", response_model=List[Recommendation])
def recommend(profile: HouseholdProfile):
    """
    Return personalized vendor recommendations based on household profile
    """
    recommendations = []

    # Example logic: suggest high consumption products first
    if profile.monthly_kwh > 300:
        recommendations.append(Recommendation(
            name="Solar Panel Installation",
            description="Reduce electricity bills with a rooftop solar system.",
            estimated_savings="$50-$100 per month",
            vendor_url="https://example.com/solar",
            category="Solar",
            rating=4.5,
            distance_km=2.5,
            discount="10% off"
        ))

    recommendations.append(Recommendation(
        name="Energy-Efficient LED Bulbs",
        description="Replace old bulbs to save energy.",
        estimated_savings="$10-$15 per month",
        vendor_url="https://example.com/led-bulbs",
        category="Lighting",
        rating=4.2,
        distance_km=1.2
    ))

    recommendations.append(Recommendation(
        name="Smart Thermostat",
        description="Control home temperature and save energy.",
        estimated_savings="$15-$25 per month",
        vendor_url="https://example.com/thermostat",
        category="Smart Home",
        rating=4.8,
        distance_km=3.0,
        discount="5% off"
    ))

    recommendations.append(Recommendation(
        name="Water-Saving Shower Head",
        description="Reduce water heating costs.",
        estimated_savings="$5-$10 per month",
        vendor_url="https://example.com/showerhead",
        category="Plumbing",
        rating=4.0,
        distance_km=0.8
    ))

    return recommendations

# -----------------------------
# AI Insights Endpoint
# -----------------------------
@app.get("/insights")
def insights(household_id: str):
    """
    Return personalized AI insights for a given household
    """
    # Placeholder logic
    return {
        "insights": (
            "Based on your usage patterns, peak consumption occurs between 4-9 PM. "
            "Focus on AC efficiency in summer and lighting efficiency year-round."
        )
    }

# -----------------------------
# Community Stats Endpoint
# -----------------------------
@app.get("/community-stats")
def community_stats():
    """
    Return neighborhood energy savings and adoption stats
    """
    return {
        "households": 120,
        "energy_saved_kwh": 1250
    }

# -----------------------------
# Trending Products Endpoint
# -----------------------------
@app.get("/trending", response_model=List[TrendingProduct])
def trending():
    """
    Return top trending sustainable products in the neighborhood
    """
    trending_products = [
        TrendingProduct(name="Solar Panel Installation", popularity=120, category="Solar"),
        TrendingProduct(name="LED Bulbs Upgrade", popularity=95, category="Lighting"),
        TrendingProduct(name="Smart Thermostat", popularity=85, category="Smart Home"),
    ]
    return trending_products

# -----------------------------
# Root Endpoint
# -----------------------------
@app.get("/")
def root():
    return {"message": "Green Marketplace AI Microservice running!"}
