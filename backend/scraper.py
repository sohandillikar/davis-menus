import requests
from config import *
from pytz import timezone
from datetime import datetime
from bs4 import BeautifulSoup
from typing import List, Dict, Any, Optional

# Constants
MEAL_NAMES = ["Breakfast", "Lunch", "Dinner"]
DIET_TYPES = ["vegan", "vegetarian", "halal"]
NUTRITION_KEYS = {
    "Serving Size": "serving_size_oz",
    "Calories": "calories", 
    "Fat (g)": "fat_g",
    "Carbohydrates (g)": "carbohydrates_g",
    "Protein (g)": "protein_g",
    "Contains": "allergens",
    "Ingredients": "ingredients"
}

def get_dining_hall_html(dining_hall: str) -> str:
    """Fetch HTML content from dining hall menu page."""
    url = f"https://housing.ucdavis.edu/dining/menus/dining-commons/{dining_hall}/"
    response = requests.get(url)
    return response.text

def find_date_div(soup: BeautifulSoup, date: datetime) -> Optional[Any]:
    """Find the div containing menu items for the specified date."""
    date_str = date.strftime("%A, %B %d, %Y")
    h3s = soup.find_all("h3", string=date_str)
    
    if not h3s:
        return None
    
    return h3s[0].find_parent("div")

def extract_diet_info(li_element: Any) -> List[str]:
    """Extract diet information from img tags in a list/menu item."""
    diets = []
    for img in li_element.find_all("img"):
        alt_text = img.get("alt", "").strip().lower()
        if alt_text in DIET_TYPES:
            diets.append(alt_text)
    return diets

def parse_nutrition_value(value: str, key: str) -> Any:
    """Parse nutrition value based on the key type."""
    if key == "Serving Size":
        return value.replace("oz", "").strip()
    elif key == "Contains":
        if value.upper() == "NO MAJOR ALLERGENS":
            return []
        return [a.strip().lower() for a in value.split(",") if a.strip()]
    return value

def extract_nutrition_info(li_element: Any) -> Dict[str, Any]:
    """Extract nutrition information from h6 and p tags in a list/menu item."""
    nutrition = {}
    
    for h6 in li_element.find_all("h6"):
        key = h6.get_text(strip=True)
        value_tag = h6.find_next_sibling("p")
        
        if not value_tag:
            continue
            
        value = value_tag.get_text(strip=True).replace(":", "").strip()
        
        if key in NUTRITION_KEYS:
            nutrition_key = NUTRITION_KEYS[key]
            nutrition[nutrition_key] = parse_nutrition_value(value, key)
    
    return nutrition

def extract_menu_item(li_element: Any, date: datetime, dining_hall: str, 
                     meal_name: str, platform: str) -> Dict[str, Any]:
    """Extract a single menu item from a list element underneath the platform name."""
    # Get item name
    span_element = li_element.find("span")
    if not span_element:
        return {}
    
    item_name = span_element.get_text(strip=True)
    
    # Extract diet and nutrition info
    diets = extract_diet_info(li_element)
    nutrition = extract_nutrition_info(li_element)
    
    # Build menu item dictionary
    item = {
        "date": date.strftime("%Y-%m-%d"),
        "dining_hall": dining_hall,
        "meal": meal_name.lower(),
        "platform": platform,
        "item_name": item_name,
        "diets": diets,
    }
    item.update(nutrition)
    
    return item

def extract_meal_items(date_div: Any, meal_name: str, date: datetime, 
                      dining_hall: str) -> List[Dict[str, Any]]:
    """Extract all menu items for a specific meal."""
    meal_items = []
    meal_h4 = date_div.find("h4", string=meal_name)
    
    if not meal_h4:
        return meal_items
    
    # Navigate through siblings to find platforms and their menu items
    sibling = meal_h4.find_next_sibling()
    
    while sibling and sibling.name != "h4":
        if sibling.name == "h5":
            platform = sibling.get_text(strip=True)
            ul_element = sibling.find_next_sibling("ul")
            
            if ul_element:
                for li in ul_element.find_all("li", recursive=False):
                    item = extract_menu_item(li, date, dining_hall, meal_name, platform)
                    if item:  # Only add if item was successfully extracted
                        meal_items.append(item)
        
        sibling = sibling.find_next_sibling()
    
    return meal_items

def extract_menu_items(html: str, date: datetime, dining_hall: str) -> List[Dict[str, Any]]:
    """
    Extract menu items from HTML content for a specific date and dining hall.
    
    Args:
        html: HTML content of the dining hall menu page
        date: Date to extract menu items for
        dining_hall: Name of the dining hall
        
    Returns:
        List of menu item dictionaries
    """
    soup = BeautifulSoup(html, 'html.parser')
    
    # Find the section for the specified date
    date_div = find_date_div(soup, date)
    if not date_div:
        print(f"No menu found for {date.strftime('%Y-%m-%d')} at {dining_hall}")
        return []
    
    menu_items = []
    
    # Extract items for each meal
    for meal_name in MEAL_NAMES:
        meal_items = extract_meal_items(date_div, meal_name, date, dining_hall)
        menu_items.extend(meal_items)
    
    return menu_items

"""
all_menu_items = []
today = datetime.now(timezone('US/Pacific')).date()

for dining_hall in ["tercero", "segundo", "latitude", "cuarto"]:
    meal_items = extract_menu_items(today, dining_hall)
    all_menu_items.extend(meal_items)

# Delete existing entries for today's date before inserting new data
today_formatted = today.strftime("%Y-%m-%d")
supabase_client.table("menu_items").delete().eq("date", today_formatted).execute()
print(f'Deleted existing menu items for {today_formatted}')

# Insert all menu items
supabase_client.table("menu_items").insert(all_menu_items).execute()
print(f'Inserted {len(all_menu_items)} menu items into database')
"""

import json

html = get_dining_hall_html("tercero")

menu_items = extract_menu_items(html, datetime.now(timezone('US/Pacific')).date(), "tercero")

with open("./test/tercero2.json", "w") as f:
    json.dump(menu_items, f, indent=4)
