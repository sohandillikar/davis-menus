import os
import time
import requests
from datetime import datetime
from pytz import timezone
from dotenv import load_dotenv
from supabase import create_client
import json
from pprint import pprint
from openai import OpenAI
import pickle
from config import *


# Test the FastAPI server endpoint
def test_helloworld_endpoint():
    try:
        response = requests.get("http://127.0.0.1:8000/helloworld")
        print("Status Code:", response.status_code)
        print("Response:", response.json())
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to server. Make sure the server is running on http://127.0.0.1:8000")
    except Exception as e:
        print(f"Error: {e}")

# Test the meal recommendations endpoint
def test_meal_recommendations_endpoint():
    try:
        # Get today's date in PST
        today = datetime.now(timezone('US/Pacific')).date()
        today_str = today.strftime("%Y-%m-%d")
        
        # Parameters
        user_id = "6e3a820d-e976-483d-9df2-6402bcfe78a0"
        
        # Make the request
        url = "http://127.0.0.1:8000/get_meal_plan"
        params = {
            "user_id": user_id,
            "date": today_str
        }
        
        print(f"Making request to: {url}")
        print(f"Parameters: {params}")
        
        response = requests.get(url, params=params)
        print("Status Code:", response.status_code)
        
        if response.status_code == 200:
            # Save response to JSON file
            test_folder = "test"
            with open(os.path.join(test_folder, 'meal_recommendation_response.json'), 'w') as f:
                json.dump(response.json(), f, indent=2, default=str)
            
            print("Response saved to test/meal_recommendation_response.json")
            print("Response preview:")
            print(json.dumps(response.json(), indent=2)[:500] + "...")  # Show first 500 chars
        else:
            print("Error Response:", response.text)
            
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to server. Make sure the server is running on http://127.0.0.1:8000")
    except Exception as e:
        print(f"Error: {e}")

# Call the test functions
start_time = time.time()

test_meal_recommendations_endpoint()

end_time = time.time()
execution_time = end_time - start_time
print(f"Code execution completed in {execution_time:.2f} seconds")






"""
user_id = "6e3a820d-e976-483d-9df2-6402bcfe78a0"
today = datetime.now(timezone('US/Pacific')).date()

user_preferences = get_user_preferences(user_id)
menu_options = get_menu_options_by_user_preferences(today, user_preferences)

# Get nutritionist recommendations
recommendations = get_meal_recommendations(menu_options, user_preferences)

# Export recommendations to a JSON file
test_folder = "test"
with open(os.path.join(test_folder, 'recommendations.json'), 'w') as f:
    json.dump(recommendations, f, indent=2, default=str)

print(f"Recommendations exported to {test_folder}/recommendations.json")
"""

"""
# Read recommendations from JSON file
test_folder = "test"
with open(os.path.join(test_folder, 'recommendations.json'), 'r') as f:
    recommendations = json.load(f)

print("Loaded recommendations from JSON file:")
pprint(recommendations)
"""

"""
    IMPORTANT:
    - When selecting items, return them with ALL their original fields exactly as they appear in the menu options data.
    - Do not modify or omit any fields from the original item structure.
    - Only add the "explanation" field to provide your nutritional reasoning.
    - The total calories and protein for the entire meal MUST meet or slightly exceed {calorie_goal} calories and {protein_goal}g protein.

    For each selected item in each meal, provide:
    - Item id, name, quantity, and nutritional info (use the exact item data from the menu options provided).
    - Brief explanation of why it's the best choice compared to other options provided.

    Focus on whole foods, balanced macronutrients, and nutrient density. Prioritize items with good protein content, healthy fats, and complex carbohydrates.
"""