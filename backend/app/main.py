from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .weather import WeatherClient
from pydantic import BaseModel
import os

app = FastAPI(title="RainCheck API")

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
client = WeatherClient(api_key=OPENWEATHER_API_KEY)

class ForecastRequest(BaseModel):
    city: str
    date: str  # YYYY-MM-DD

@app.get("/health")
def health():
    return {"status":"ok"}

@app.post("/api/forecast")
async def forecast(req: ForecastRequest):
    if not client.api_key:
        raise HTTPException(status_code=500, detail="Server misconfigured: OPENWEATHER_API_KEY not set")
    try:
        result = await client.get_precip_probability_for_date(req.city, req.date)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=502, detail="Upstream API error: " + str(e))
