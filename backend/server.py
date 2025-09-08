import asyncio
import aiohttp
import database as db
from random import randint
from fastapi import FastAPI
from pydantic import BaseModel
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from meal_planner import MealPlanner, MealPreferences

# uvicorn server:app --reload --host 0.0.0.0 --port 8000

@asynccontextmanager
async def lifespan(app: FastAPI):
    asyncio.create_task(ping_to_keep_server_alive())
    yield

app = FastAPI(lifespan=lifespan)
server_url = "https://davis-menus-server.onrender.com" # TODO: change to production url

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://10.0.0.158:8080",
        "https://davis-menus.vercel.app",
        "https://preview--aggie-menu-explorer.lovable.app/",
        server_url
    ], # TODO: add production url
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/menu_items/all")
async def get_all_menu_items():
    menu_items = db.get_menu_items()
    dates = [item['date'] for item in menu_items]
    from_date = min(dates)
    to_date = max(dates)
    return {
        "menu_items": menu_items,
        "from_date": from_date,
        "to_date": to_date
    }


class OfferedThisWeekRequest(BaseModel):
    item_names: list[str]

@app.post("/offered_this_week")
async def offered_this_week(request: OfferedThisWeekRequest):
    if len(request.item_names) > 0:
        query = f"WHERE name IN ({str(request.item_names)[1:-1]}) AND date >= CURRENT_DATE"
        menu_items = db.get_menu_items(options=query)
    else:
        menu_items = []
    return {"menu_items": menu_items}


class AvailableDiningHallsRequest(BaseModel):
    date: str

@app.post("/get_available_dining_halls")
async def get_available_dining_halls(request: AvailableDiningHallsRequest):
    available_dining_halls = {}
    for meal in ["breakfast", "lunch", "dinner"]:
        response = db.execute(f"SELECT DISTINCT dining_hall FROM menu_items WHERE date = '{request.date}' AND meal = '{meal}'")
        available_dining_halls[meal] = [r[0] for r in response]
    return {"available_dining_halls": available_dining_halls}


class MealPlanRequest(BaseModel):
    meal_preferences: MealPreferences
    date: str

@app.post("/get_meal_plan")
async def get_meal_plan(request: MealPlanRequest):
    meal_planner = MealPlanner(request.date, request.meal_preferences.to_dict())
    meal_plan = meal_planner.plan_meals()
    return {"meal_plan": meal_plan}


@app.get("/ping")
async def ping():
    return {"message": "pong"}

async def ping_to_keep_server_alive():
    async with aiohttp.ClientSession() as session:
        while True:
            await session.get(f"{server_url}/ping")
            await asyncio.sleep(randint(int(8 * 60), int(14.9 * 60)))
