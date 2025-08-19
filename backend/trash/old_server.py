import json
from config import *
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class MealPlanRequest(BaseModel):
    user_id: str
    date: str

async def get_user_preferences(user_id):
    user_preferences = supabase_client.table('meal_preferences') \
        .select('*') \
        .eq('user_id', user_id) \
        .execute().data[0]
    return user_preferences

async def filter_menu_items(date, user_preferences):
    filtered_menu_items = {}

    for meal in user_preferences['meals']:
        filtered_menu_items[meal] = []
        menu_items = supabase_client.table('menu_items') \
            .select('id', 'item_name', 'description', 'calories', 'fat_g', 'carbohydrates_g', 'protein_g', 'allergens', 'diets', 'ingredients') \
            .eq('date', date) \
            .eq('meal', meal) \
            .eq('dining_hall', user_preferences['meals'][meal]) \
            .contains('diets', json.dumps(user_preferences['diets'])) \
            .not_.in_('calories', ['N/A', '0']) \
            .not_.in_('protein_g', ['N/A', '0']) \
            .execute().data

        # Filter out items that contain user's allergens
        for item in menu_items:
            found_allergen = False
            for exclude_allergen in user_preferences['allergens']:
                for allergen in item['allergens']:
                    if allergen.find(exclude_allergen) != -1:
                        found_allergen = True
                        break
                if found_allergen == True:
                    break
            if found_allergen == False:
                filtered_menu_items[meal].append(item)

    return filtered_menu_items

def restructure_menu_items(menu_items):
    restructured_menu_items = {}

    for meal, items in menu_items.items():
        restructured_menu_items[meal] = {}
        for item in items:
            restructured_menu_items[meal][item['id']] = f"{item['name']} ({item['calories']} cal, {item['fat']}g fat, {item['carbs']}g carbs, {item['protein']}g protein)"

    return restructured_menu_items

async def generate_meal_plan(menu_items, user_preferences):
    selected_meals = list(user_preferences['meals'].keys())
    selected_meals_str = ', '.join(selected_meals)

    calorie_goal = user_preferences['calories']
    protein_goal = user_preferences['protein']

    prompt = f"""You are a professional nutritionist tasked with creating a healthy meal plan. 

    AVAILABLE MENU OPTIONS:
    {json.dumps(menu_items, indent=2)}

    TASK:
    Analyze the menu options and create a nutritious meal plan that:
    1. Meets or slightly exceeds {calorie_goal} calories and {protein_goal}g protein.
    2. Selects the healthiest items for {selected_meals_str}, based on their nutritional information.
    3. Combines multiple items per meal or includes multiple servings of the same item if it's a healthy choice and needed to meet calorie and protein goals.

    For each meal, provide a brief explanation (no longer than 200 characters) of why it is the best choice compared to other options."""

    meal_items_schema = {
        "type": "object",
        "properties": {
            "items": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "key": {"type": "integer"},
                        "quantity": {"type": "integer"},
                    },
                    "required": ["key", "quantity"]
                }
            },
            "explanation": {"type": "string"}
        },
        "required": ["items", "explanation"]
    }

    meals_schema = {meal: meal_items_schema for meal in selected_meals}

    response = openai_client.chat.completions.create(
        model="gpt-5-nano",
        messages=[{"role": "user", "content": prompt}],
        store=True,
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": "meal_recommendation",
                "schema": {
                    "type": "object",
                    "properties": meals_schema,
                    "required": selected_meals,
                    "additionalProperties": False
                }
            }
        }
    )

    return json.loads(response.choices[0].message.content)

@app.post("/get_meal_plan")
async def get_meal_plan(request: MealPlanRequest):
    user_preferences = await get_user_preferences(request.user_id)
    filtered_menu_items = await filter_menu_items(request.date, user_preferences)
    meal_plan = await generate_meal_plan(filtered_menu_items, user_preferences)
    return meal_plan

@app.get("/helloworld")
async def helloworld():
    return {"Hello": "World"}
