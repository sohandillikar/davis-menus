import asyncio
import aiohttp
from config import *
from fastapi import FastAPI
from pydantic import BaseModel
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from meal_planner import MealPlanner, MealPreferences

@asynccontextmanager
async def lifespan(app: FastAPI):
    asyncio.create_task(ping_to_keep_server_alive())
    yield

app = FastAPI(lifespan=lifespan)
frontend_url = "https://davis-menus.vercel.app"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MealPlanRequest(BaseModel):
    meal_preferences: MealPreferences
    date: str

@app.post("/get_meal_plan")
async def get_meal_plan(request: MealPlanRequest):
    meal_planner = MealPlanner(request.date, request.meal_preferences.to_dict())
    meal_plan = meal_planner.plan_meals()
    return {"meal_plan": meal_plan, "success": True}

@app.get("/ping")
async def ping():
    return {"message": "pong", "success": True}

async def ping_to_keep_server_alive():
    """Send ping requests to the server every 5 seconds"""
    async with aiohttp.ClientSession() as session:
        while True:
            await session.get(f"{frontend_url}/ping")
            await asyncio.sleep(5)
