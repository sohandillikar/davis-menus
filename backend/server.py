import json
from config import *
from fastapi import FastAPI

app = FastAPI()

async def get_user_preferences(user_id):
    user_preferences = supabase_client.table('meal_preferences') \
        .select('*') \
        .eq('user_id', user_id) \
        .execute().data[0]
    return user_preferences

async def get_personalized_menu_options(date, user_preferences):
    menu_options = {}

    for meal in user_preferences['meals']:
        menu_options[meal] = []
        meal_options = supabase_client.table('menu_items') \
            .select('*') \
            .eq('date', date) \
            .eq('meal', meal) \
            .eq('dining_hall', user_preferences['meals'][meal]) \
            .contains('diets', json.dumps(user_preferences['diets'])) \
            .neq('calories', 'N/A') \
            .neq('protein_g', 'N/A') \
            .execute().data

        # Filter out items that contain user's allergens
        for option in meal_options:
            found_allergen = False
            for allergen_preference in user_preferences['allergens']:
                for option_allergen in option['allergens']:
                    if option_allergen.find(allergen_preference) != -1:
                        found_allergen = True
                        break
                if found_allergen == True:
                    break
            if found_allergen == False:
                menu_options[meal].append(option)

    return menu_options

async def generate_meal_plan(menu_options, user_preferences):
    selected_meals = list(user_preferences['meals'].keys())
    selected_meals_str = ', '.join(selected_meals)

    calorie_goal = user_preferences['calories']
    protein_goal = user_preferences['protein']

    prompt = f"""You are a professional nutritionist tasked with creating a healthy meal plan. 

    AVAILABLE MENU OPTIONS:
    {json.dumps(menu_options, indent=2)}

    TASK:
    Analyze the menu options and create a nutritious meal plan that:
    1. Meets or slightly exceeds {calorie_goal} calories and {protein_goal}g protein.
    2. Selects the healthiest items for {selected_meals_str}, based on their nutritional info and ingredients.
    3. Combines multiple items per meal if needed to meet calorie and protein goals.
    4. Includes multiple servings of the same item if it's a healthy choice and needed to meet calorie and protein goals.

    For each selected item in each meal, provide a brief explanation of why it's the best choice compared to other options provided."""

    menu_item_schema = {
                        "type": "object",
                        "properties": {
                            "items": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "id": {"type": "integer"},
                                        "created_at": {"type": "string"},
                                        "date": {"type": "string"},
                                        "dining_hall": {"type": "string"},
                                        "meal": {"type": "string"},
                                        "platform": {"type": "string"},
                                        "item_name": {"type": "string"},
                                        "quantity": {"type": "integer"},
                                        "serving_size_oz": {"type": "number"},
                                        "calories": {"type": "number"},
                                        "fat_g": {"type": "number"},
                                        "carbohydrates_g": {"type": "number"},
                                        "protein_g": {"type": "number"},
                                        "allergens": {
                                            "type": "array",
                                            "items": {"type": "string"}
                                        },
                                        "diets": {
                                            "type": "array",
                                            "items": {"type": "string"}
                                        },
                                        "ingredients": {"type": "string"},
                                        "explanation": {"type": "string"}
                                    },
                                    "required": [
                                        "id", "created_at", "date", "dining_hall", "meal", "platform", "item_name", 
                                        "quantity", "serving_size_oz", "calories", "fat_g", "carbohydrates_g", 
                                        "protein_g", "allergens", "diets", "ingredients", "explanation"
                                    ]
                                }
                            },
                            "total_calories": {"type": "number"},
                            "total_protein": {"type": "number"}
                        },
                        "required": ["items", "total_calories", "total_protein"]
                    }

    meal_schema = {m: menu_item_schema for m in selected_meals}

    response = openai_client.chat.completions.create(
        model="o4-mini",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        store=True,
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": "meal_recommendation",
                "schema": {
                    "type": "object",
                    "properties": meal_schema,
                    "required": selected_meals,
                    "additionalProperties": False
                }
            }
        }
    )

    return json.loads(response.choices[0].message.content)

@app.get("/get_meal_plan")
async def get_meal_plan(user_id: str, date: str):
    user_preferences = await get_user_preferences(user_id)
    menu_options = await get_personalized_menu_options(date, user_preferences)
    meal_plan = await generate_meal_plan(menu_options, user_preferences)

    return meal_plan

@app.get("/helloworld")
async def helloworld():
    return {"Hello": "World"}
