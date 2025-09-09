import database as db
from pytz import timezone
from datetime import datetime, timedelta
from scraper import scrape_and_load_menu_items

def init_tables():
    """Initializes database tables"""
    for table_name in ["menu_items"]:
        if not db.table_exists(table_name):
            db.execute_sql_file(f"./tables/{table_name}.sql")

def load_menu_items():
    """Scrapes and loads menu items from Sunday till Saturday"""
    today = datetime.now(timezone("US/Pacific")).date()
    if today.weekday() == 6:
        scrape_and_load_menu_items(today)
    else:
        scrape_and_load_menu_items(today - timedelta(days=today.weekday() + 1))

init_tables()
load_menu_items()