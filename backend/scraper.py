import requests
from config import *
from pytz import timezone
from datetime import datetime
from bs4 import BeautifulSoup

def extract_meal_items(date, dining_hall):
    url = f"https://housing.ucdavis.edu/dining/menus/dining-commons/{dining_hall}/"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    h3s = soup.find_all("h3", string=date.strftime("%A, %B %d, %Y"))
    date_div = h3s[0].find_parent("div")

    items = []
    
    for meal_name in ["Breakfast", "Lunch", "Dinner"]:
        meal_h4 = date_div.find("h4", string=meal_name)
    
        if not meal_h4:
            continue
    
        sibling = meal_h4.find_next_sibling()
        
        while sibling and sibling.name != "h4":
            if sibling.name == "h5":
                platform = sibling.get_text(strip=True)
                ul = sibling.find_next_sibling("ul")
                if ul:
                    for li in ul.find_all("li", recursive=False):
                        item_name = li.find("span").get_text(strip=True)
                        nutrition = {}
                        
                        # Extract diet information from img tags
                        diets_list = []
                        img_tags = li.find_all("img")
                        for img in img_tags:
                            alt_text = img.get("alt", "").strip()
                            if alt_text and alt_text.lower() in ["vegan", "vegetarian", "halal", "gluten-free", "dairy-free"]:
                                diets_list.append(alt_text.strip().lower())
                        
                        for h6 in li.find_all("h6"):
                            key = h6.get_text(strip=True)
                            value_tag = h6.find_next_sibling("p")
                            value = value_tag.get_text(strip=True) if value_tag else ""
                            if value.startswith(":"):
                                value = value[1:].strip()
                            if key == "Serving Size":
                                if value.endswith("oz"):
                                    value = value.replace("oz", "").strip()
                                nutrition["serving_size_oz"] = value
                            elif key == "Calories":
                                nutrition["calories"] = value
                            elif key == "Fat (g)":
                                nutrition["fat_g"] = value
                            elif key == "Carbohydrates (g)":
                                nutrition["carbohydrates_g"] = value
                            elif key == "Protein (g)":
                                nutrition["protein_g"] = value
                            elif key == "Contains":
                                nutrition["allergens"] = value
                            elif key == "Ingredients":
                                nutrition["ingredients"] = value

                        # Allergens: split by comma, strip, lowercase, handle "NO MAJOR ALLERGENS"
                        raw_allergens = nutrition.get("allergens", "")
                        if raw_allergens.upper() == "NO MAJOR ALLERGENS":
                            allergens_list = []
                        else:
                            allergens_list = [a.strip().lower() for a in raw_allergens.split(",") if a.strip()]

                        items.append({
                            "date": date.strftime("%Y-%m-%d"),
                            "dining_hall": dining_hall,
                            "meal": meal_name.lower(),
                            "platform": platform,
                            "item_name": item_name,
                            "serving_size_oz": nutrition.get("serving_size_oz", ""),
                            "calories": nutrition.get("calories", ""),
                            "fat_g": nutrition.get("fat_g", ""),
                            "carbohydrates_g": nutrition.get("carbohydrates_g", ""),
                            "protein_g": nutrition.get("protein_g", ""),
                            "diets": diets_list,
                            "allergens": allergens_list,
                            "ingredients": nutrition.get("ingredients", ""),
                        })
            sibling = sibling.find_next_sibling()
    
    return items

all_menu_items = []
today = datetime.now(timezone('US/Pacific')).date()

for dining_hall in ["tercero", "segundo", "latitude", "cuarto"]:
    meal_items = extract_meal_items(today, dining_hall)
    all_menu_items.extend(meal_items)

# Delete existing entries for today's date before inserting new data
today_formatted = today.strftime("%Y-%m-%d")
supabase_client.table("menu_items").delete().eq("date", today_formatted).execute()
print(f'Deleted existing menu items for {today_formatted}')

# Insert all menu items
supabase_client.table("menu_items").insert(all_menu_items).execute()
print(f'Inserted {len(all_menu_items)} menu items into database')