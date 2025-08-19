import json
import time
from openai import OpenAI
from pprint import pprint

# Only keep relevant properties for each menu item
def del_unnecessary_props(menu_items):
    for meal in menu_items:
        for i in range(len(menu_items[meal])):
            menu_items[meal][i] = {
                'id': menu_items[meal][i]['id'],
                'item_name': menu_items[meal][i]['item_name'],
                'calories': menu_items[meal][i]['calories'],
                'protein_g': menu_items[meal][i]['protein_g'],
                'fat_g': menu_items[meal][i]['fat_g'],
                'carbohydrates_g': menu_items[meal][i]['carbohydrates_g'],
                'ingredients': menu_items[meal][i]['ingredients'],
            }
    return menu_items

openai_client = OpenAI(api_key='') # <--- API KEY GOES HERE

with open('./filtered_menu_items.json', 'r') as f:
    filtered_menu_items = del_unnecessary_props(json.load(f))


# --------------- IMPORTANT STUFF STARTS HERE ---------------
# PROBLEM: It takes anywhere from 25 to 50 seconds to generate a meal plan.

calorie_goal = 2500                                   # This can be edited
protein_goal = 120                                    # This can be edited
selected_meals = ['breakfast', 'lunch', 'dinner']     # This can be edited
selected_meals_str = ', '.join(selected_meals)

prompt = f"""
Create the healthiest meal plan for {selected_meals_str} that meets {calorie_goal} calories and {protein_goal}g protein using these items:

{json.dumps(filtered_menu_items)}

Combine multiple items per meal or include multiple servings of the same item if it's a healthy choice and needed to meet calorie and protein goals.
For each meal, provide a brief explanation (less than 200 characters) of why it is the best choice compared to other options."""

# OpenAI should return a meal plan with the item names/ids, quantities, and an explanation for each meal
meal_items_schema = {
    "type": "object",
    "properties": {
        "items": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"}, # You can change this to item id if you want
                    "quantity": {"type": "integer"},
                },
                "required": ["name", "quantity"]
            }
        },
        "explanation": {"type": "string"}
    },
    "required": ["items", "explanation"]
}

meals_schema = {meal: meal_items_schema for meal in selected_meals}

start_time = time.time()

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

end_time = time.time()

meal_plan = json.loads(response.choices[0].message.content)

pprint(meal_plan)

print(f"Time taken to generate meal plan: {end_time - start_time} seconds")
