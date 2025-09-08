import os
from dotenv import load_dotenv
import psycopg2
import json

load_dotenv()

INTERNAL_DB_URL = os.getenv("INTERNAL_DB_URL")

def get_connection():
    return psycopg2.connect(INTERNAL_DB_URL)

def table_exists(table_name: str) -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(f"""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = '{table_name}'
            );
        """)
        result = cursor.fetchone()
        return result[0] if result else False
    except Exception as e:
        print(f"Error checking if table {table_name} exists: {e}")
        return False
    finally:
        cursor.close()
        conn.close()

def execute_sql_file(file_path: str):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        with open(file_path, 'r') as file:
            sql_script = file.read()
        cursor.execute(sql_script)
        conn.commit()
        print(f"Executed {file_path} successfully")
    except Exception as e:
        print(f"Error executing SQL file {file_path}: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

def execute(query: str, return_type: str = "fetchall"):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(query)
        conn.commit()
        if return_type == "fetchall":
            return cursor.fetchall()
        elif return_type == "fetchone":
            return cursor.fetchone()
        elif return_type == "fetchmany":
            return cursor.fetchmany()
        elif return_type == "rowcount":
            return cursor.rowcount
    except Exception as e:
        print(f"Error executing SQL query {query}: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

def clear_table(table_name: str):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(f"DELETE FROM {table_name}")
        rows_deleted = cursor.rowcount
        conn.commit()
        print(f"Cleared {rows_deleted} rows from {table_name} table")
    except Exception as e:
        print(f"Error clearing table {table_name}: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

def insert_json_menu_items(menu_items: list[dict]):
    insert_query = """INSERT INTO menu_items (
        date, dining_hall, meal, platform, name, description, feature,
        serving_size_oz, calories, fat_g, carbohydrates_g, protein_g,
        allergens, diets, ingredients
    ) VALUES (
        %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
    )"""
    conn = get_connection()
    cursor = conn.cursor()
    try:
        for item in menu_items:
            cursor.execute(insert_query, (
                item.get('date'),
                item.get('dining_hall'),
                item.get('meal'),
                item.get('platform'),
                item.get('name'),
                item.get('description'),
                item.get('feature'),
                item.get('serving_size_oz'),
                item.get('calories'),
                item.get('fat_g'),
                item.get('carbohydrates_g'),
                item.get('protein_g'),
                json.dumps(item.get('allergens', [])),
                json.dumps(item.get('diets', [])),
                item.get('ingredients')
            ))
        conn.commit()
        print(f"Inserted {len(menu_items)} rows into menu_items table")
    except Exception as e:
        print(f"Error inserting JSON menu items: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

def get_menu_items(options: str = ""):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(f"SELECT * FROM menu_items {options}")
        
        rows = cursor.fetchall()
        col_names = cursor.description
        
        menu_items = []
        
        for i in range(len(rows)):
            menu_item = {}
            for j in range(len(col_names)):
                menu_item[col_names[j][0]] = rows[i][j]
            menu_items.append(menu_item)
        
        return menu_items
    
    except Exception as e:
        print(f"Error getting all menu items: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

def main():
    # Create tables if they don't exist
    for table_name in ["menu_items"]:
        if not table_exists(table_name):
            execute_sql_file(f"./tables/{table_name}.sql")


main()
