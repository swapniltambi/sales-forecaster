from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random

app = FastAPI(title="Sales Forecaster API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictionRequest(BaseModel):
    ad_spend: float


class PredictionResponse(BaseModel):
    predicted_revenue: float
    confidence_score: float


@app.get("/")
async def health_check():
    """Root health check endpoint"""
    return {"status": "healthy", "message": "Sales Forecaster API is running"}


@app.post("/predict", response_model=PredictionResponse)
async def predict_revenue(request: PredictionRequest):
    """
    Predict revenue based on ad spend.
    
    Args:
        request: JSON body containing 'ad_spend' (float)
    
    Returns:
        PredictionResponse with predicted_revenue and confidence_score
    """
    # Calculate base revenue (spend * 2.5)
    base_revenue = request.ad_spend * 2.5
    
    # Add random noise (between -10% and +10% of base revenue)
    noise_percentage = random.uniform(-0.1, 0.1)
    noise = base_revenue * noise_percentage
    predicted_revenue = base_revenue + noise
    
    # Generate a confidence score (between 0.75 and 0.95)
    confidence_score = random.uniform(0.75, 0.95)
    
    return PredictionResponse(
        predicted_revenue=round(predicted_revenue, 2),
        confidence_score=round(confidence_score, 2)
    )

