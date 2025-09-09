import requests
import database as db
from pytz import timezone
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
from typing import List, Dict, Any, Optional

DINING_HALLS = ["tercero", "segundo", "latitude", "cuarto"]
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

# Configure a resilient HTTP session (retries, timeouts, headers)
def _build_http_session() -> requests.Session:
    session = requests.Session()
    session.headers.update(
        {
            "User-Agent": (
                "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
                "(KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
            ),
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Connection": "keep-alive",
        }
    )
    return session

HTTP_SESSION = _build_http_session()

def get_dates_till_saturday(start: datetime) -> List[datetime]:
    """Returns a list of days from the start date till the upcoming Saturday."""
    days = [start]
    days_till_sat = 6 - (start.weekday() + 1) % 7

    for i in range(days_till_sat):
        start += timedelta(days=1)
        days.append(start)

    return days

def get_dining_hall_html(dining_hall: str) -> str:
    """Fetch HTML content from dining hall menu page."""
    url = f"https://housing.ucdavis.edu/dining/menus/dining-commons/{dining_hall}/"
    response = HTTP_SESSION.get(url) # requests.get(url)
    return response.text

def find_date_div(soup: BeautifulSoup, date: datetime) -> Optional[Any]:
    """Find the div containing menu items for the specified date."""
    date_str = date.strftime("%A, %B %d, %Y")
    h3s = soup.find_all("h3", string=date_str)
    
    if not h3s:
        return None
    
    return h3s[0].find_parent("div")

def extract_description(nutrition_ul: Any) -> str:
    """Extract description from the first div in the nutrition_ul."""
    first_div = nutrition_ul.find("div")
    if first_div:
        desc_p = first_div.find("p")
        if desc_p:
            return desc_p.get_text(strip=True)
    return ""

def extract_feature(nutrition_ul: Any) -> str:
    """Extract feature from li with class 'feature' in the nutrition_ul."""
    feature_li = nutrition_ul.find("li", class_="feature")
    if feature_li:
        return feature_li.get_text(strip=True)
    return ""

def extract_diet_info(nutrition_ul: Any) -> List[str]:
    """Extract diet info from the img tags in the nutrition_ul."""
    diets = []
    for img in nutrition_ul.find_all("img"):
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
        allergens = []
        for a in value.split(","):
            if "/" in a:
                a = [_.strip().lower() for _ in a.split("/") if _.strip()]
                allergens.extend(a)
            elif a.strip():
                allergens.append(a.strip().lower())
        return allergens
    return value

def extract_nutrition_info(nutrition_ul: Any) -> Dict[str, Any]:
    """Extract nutrition information from h6 and p tags in the nutrition_ul."""
    nutrition = {
        "allergens": [],
        "ingredients": ""
    }
    
    for h6 in nutrition_ul.find_all("h6"):
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
    
    name = span_element.get_text(strip=True)
    
    nutrition_ul = li_element.find("ul", class_="nutrition")
    
    # Extract description, features, diet, and nutrition info
    description = extract_description(nutrition_ul)
    feature = extract_feature(nutrition_ul)
    diets = extract_diet_info(nutrition_ul)
    nutrition = extract_nutrition_info(nutrition_ul)
    
    # Build menu item dictionary
    item = {
        "date": date.strftime("%Y-%m-%d"),
        "dining_hall": dining_hall,
        "meal": meal_name.lower(),
        "platform": platform,
        "name": name,
        "description": description,
        "feature": feature,
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

def scrape_and_load_menu_items(start_date: datetime = None):
    if start_date is None:
        start_date = datetime.now(timezone("US/Pacific")).date()
    
    dates_till_saturday = get_dates_till_saturday(start_date)

    week_menu_items = []

    for dining_hall in DINING_HALLS:
        for date in dates_till_saturday:
            html = get_dining_hall_html(dining_hall)
            menu_items = extract_menu_items(html, date, dining_hall)
            week_menu_items += menu_items

            print(f"Extracted {len(menu_items)} items from {dining_hall.title()}\'s menu for {date.strftime('%a, %b %d')}")
        print()

    # If start_date is Sunday, clear the menu_items table
    if start_date.weekday() == 6:
        db.clear_table("menu_items")
    else:
        dates_till_saturday_str = str([d.strftime("%Y-%m-%d") for d in dates_till_saturday])[1:-1]
        rows_deleted = db.execute(f"DELETE FROM menu_items WHERE date IN ({dates_till_saturday_str})", return_type="rowcount")
        print(f"DELETED {rows_deleted} rows from menu_items where date was in ({dates_till_saturday_str})")

    # Insert all menu items
    if len(week_menu_items) > 0:
        db.insert_json_menu_items(week_menu_items)
    else:
        print("NO ITEMS TO INSERT")

if __name__ == "__main__":
    scrape_and_load_menu_items()