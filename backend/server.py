import asyncio
import aiohttp
from config import *
from random import randint
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
server_url = "https://davis-menus-server.onrender.com"

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "https://davis-menus.vercel.app",
        server_url
    ],
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
    async with aiohttp.ClientSession() as session:
        while True:
            await session.get(f"{server_url}/ping")
            await asyncio.sleep(randint(int(8 * 60), int(14.9 * 60)))
