from config import *
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from meal_planner import MealPlanner, MealPreferences

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "https://davis-menus.vercel.app"
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

@app.get("/helloworld")
async def helloworld():
    return {"message": "Hello World", "success": True}
