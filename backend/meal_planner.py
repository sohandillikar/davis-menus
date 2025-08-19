import json
import pandas as pd
from config import *
from pydantic import BaseModel

class MealPreferences(BaseModel):
    calories: int | str
    protein: int | str
    meals: dict[str, str]
    diets: list[str]
    allergens: list[str]

    def get_meals(self):
        meals_copy = self.meals.copy()
        for meal, dining_hall in self.meals.items():
            if not dining_hall in ["tercero", "segundo", "latitude", "cuarto"]:
                del meals_copy[meal]
        return meals_copy

    def to_dict(self):
        return {
            "calories": int(self.calories),
            "protein": int(self.protein),
            "meals": self.get_meals(),
            "diets": self.diets,
            "allergens": self.allergens
        }

class MealPlanner:
    FRUITS = [
        "apple", "banana", "orange", "grapefruit", "grape", "pear", "peach", "plum", "nectarine",
        "mango", "papaya", "pineapple", "kiwi", "pomegranate", "melon", "cantaloupe", "honeydew",
        "watermelon", "cherry", "blueberry", "strawberry", "raspberry", "blackberry", "apricot", "fruit"
    ]

    # Add "bean" from Five Bean Vegan Chili Soup
    # Add "mushroom" from Sliced Cremini Mushrooms
    VEGETABLES = [
        "spinach", "kale", "lettuce", "romaine", "arugula", "chard", "collard", "mustard greens",
        "mixed greens", "mesclun", "spring mix", "salad greens", "broccoli", "cauliflower", "cabbage",
        "brussels sprouts", "bok choy", "carrot", "beet", "turnip", "parsnip", "radish",
        "zucchini", "squash", "eggplant", "vegetable"
    ]
    DESSERTS = [
        "cake", "cupcake", "cookie", "brownie", "ice cream", "sundae", "pudding", "mousse",
        "cheesecake", "donut", "doughnut", "pie", "tart", "cobbler", "crisp", "crumble",
        "frosting", "glaze", "batter", "fudge", "sorbet", "gelato", "popsicle",
        "macaron", "macaroon", "pastry", "eclair", "cream puff", "churro", "sweet roll",
        "danish", "strudel", "trifle", "shortcake", "meringue", "bread pudding", "sweet bread",
        "caramel", "toffee", "marshmallow", "nougat", "sugar cookie", "snickerdoodle",
        "biscotti", "molten", "lava cake", "lemon bar", "chocolate", "vanilla", "dessert"
    ]

    LEAN_PROTEINS = [
        "chicken", "turkey", "fish", "cod", "tilapia", "tuna", "salmon", "shrimp", "crab", "scallops",
        "tofu", "tempeh", "edamame", "lentils", "chickpeas", "black beans", "kidney beans", "pinto beans",
        "egg", "omelet", "omelette", "greek yogurt"
    ]

    PROTEINS = [
        "beef", "steak", "ribeye", "brisket", "short ribs", "lamb", "prime rib", "burger", "meatloaf", "ham",
        "bacon", "pork", "spare ribs", "sausage", "chorizo", "hot dog", "pepperoni", "salami", "prosciutto", "bologna"
    ] + LEAN_PROTEINS

    WHOLE_GRAINS = [
        "brown rice", "quinoa", "oats", "steel cut oats", "whole grain", "whole wheat",
        "barley", "bulgur", "farro", "freekeh", "millet", "amaranth", "teff", "wild rice",
        "buckwheat", "rye bread", "whole rye"
    ]

    GRAINS = [
        "rice", "bread", "pasta", "noodles", "macaroni", "couscous", "cornmeal", "cornflakes",
        "polenta", "bagel", "biscuit", "roll", "bun", "cracker", "flatbread", "wrap", "tortilla",
        "naan", "pita", "sourdough", "toast", "muffin", "waffle", "pancake", "cereal"
    ] + WHOLE_GRAINS

    @staticmethod
    def contains_allergen(item, exclude_allergens):
        item_allergens = ', '.join(item['allergens'])
        for allergen in exclude_allergens:
            if item_allergens.find(allergen) != -1:
                return True
        return False

    @classmethod
    def is_food_type(cls, menu_item, food_group):
        return (
            any(food in menu_item['item_name'].lower() for food in food_group) or
            any(food in menu_item['description'].lower() for food in food_group)
        )

    @classmethod
    def is_food_type2(cls, menu_item, food_group):
        return (
            cls.is_food_type(menu_item, food_group) or
            any(food in menu_item['ingredients'].lower() for food in food_group)
        )

    def __init__(self, date: str, preferences: dict):
        self.date = date
        
        self.calorie_goal = preferences['calories']
        self.protein_goal = preferences['protein']
        self.meals = preferences['meals']
        self.diets = preferences['diets']
        self.allergens = preferences['allergens']
        
        self.menu_items = self.fetch_menu_items()
        self.healthy_items = self.filter_healthy_items()

    def fetch_menu_items(self):
        filtered_menu_items = {}

        for meal in self.meals:
            filtered_menu_items[meal] = []
            meal_items = supabase_client.table('menu_items') \
                .select('*') \
                .eq('date', self.date) \
                .eq('meal', meal) \
                .eq('dining_hall', self.meals[meal]) \
                .contains('diets', json.dumps(self.diets)) \
                .not_.in_('calories', ['N/A', '0']) \
                .not_.in_('protein_g', ['N/A', '0']) \
                .execute().data

            # Filter out items that contain user's allergens
            for item in meal_items:
                if not self.contains_allergen(item, self.allergens):
                    filtered_menu_items[meal].append(item)

        return filtered_menu_items

    def filter_healthy_items(self):
        flattened_menu_items = []

        for meal in self.menu_items:
            flattened_menu_items.extend(self.menu_items[meal])

        df = pd.DataFrame(flattened_menu_items)

        for col in ['calories', 'protein_g', 'fat_g', 'carbohydrates_g']:
            df[col] = pd.to_numeric(df[col])

        old_columns = df.columns

        df['protein_density'] = df['protein_g'] / df['calories']

        protein_density_goal = self.protein_goal / self.calorie_goal
        df['pd_difference'] = abs(protein_density_goal - df['protein_density'])
        
        df['is_fruit'] = df.apply(lambda x: self.is_food_type(x, self.FRUITS), axis=1)
        df['is_vegetable'] = df.apply(lambda x: self.is_food_type(x, self.VEGETABLES), axis=1)
        df['is_protein'] = df.apply(lambda x: self.is_food_type(x, self.PROTEINS), axis=1)
        df['is_lean_protein'] = df.apply(lambda x: self.is_food_type(x, self.LEAN_PROTEINS), axis=1)
        df['is_grain'] = df.apply(lambda x: self.is_food_type2(x, self.GRAINS), axis=1)
        df['is_whole_grain'] = df.apply(lambda x: self.is_food_type2(x, self.WHOLE_GRAINS), axis=1)
        df['is_dessert'] = df.apply(lambda x: self.is_food_type(x, self.DESSERTS), axis=1)

        self.NEW_HEALTH_COLUMNS = list(set(df.columns) - set(old_columns))

        df = df[
            (df['protein_density'] >= 0.01) &
            (df['is_dessert'] == False)
        ]
        
        df = df[
            (df['is_fruit'] == True) |
            (df['is_vegetable'] == True) |
            (df['is_protein'] == True) |
            (df['is_grain'] == True)
        ]

        return df

    def split_goals_by_meals(self):
        selected_meals = list(self.meals.keys())
        calorie_goal = self.calorie_goal
        protein_goal = self.protein_goal

        default_split = {
            'breakfast': 0.30,
            'lunch': 0.35,
            'dinner': 0.35
        }

        missing_meals = set(default_split.keys()) - set(selected_meals)

        for missing_meal in missing_meals:
            additional_split = round(default_split[missing_meal] / len(selected_meals), 2)

            for selected_meal in selected_meals:
                default_split[selected_meal] += additional_split

            del default_split[missing_meal]

        for meal in default_split:
            default_split[meal] = {
                'calories': round(calorie_goal * default_split[meal], 2),
                'protein': round(protein_goal * default_split[meal], 2)
            }

        return default_split
    
    def plan_meal(self, meal, calorie_goal, protein_goal, max_repeated_items=3):
        selected_items = self.healthy_items.head(0).copy()
        menu_items = self.healthy_items[self.healthy_items['meal'] == meal]

        i = 0
        empty_food_groups = set()
        order = ['protein', 'grain', 'vegetable', 'fruit']

        goals_met = lambda: sum(selected_items['calories']) >= calorie_goal and sum(selected_items['protein_g']) >= protein_goal

        def add_item(food_group):
            nonlocal selected_items
            
            selected_item_counts = selected_items['id'].value_counts()
            repeated_ids = selected_item_counts[selected_item_counts >= max_repeated_items].index

            filtered_items = menu_items[
                (menu_items[f'is_{food_group}'] == True) &
                (~menu_items['id'].isin(repeated_ids)) &
                (menu_items['calories'] < calorie_goal - sum(selected_items['calories'])) &
                (menu_items['protein_g'] < protein_goal - sum(selected_items['protein_g']))
            ]

            if food_group in ['protein', 'grain']:
                items_to_add = filtered_items[filtered_items['calories'] > 150]
            
            elif food_group in ['fruit', 'vegetable']:
                items_to_add = filtered_items[filtered_items['calories'] <= 150]

            if food_group in ['protein', 'grain'] and items_to_add.empty:
                items_to_add = filtered_items[filtered_items['calories'] <= 150]

            if items_to_add.empty:
                empty_food_groups.add(food_group)
            else:
                item_to_add = items_to_add.sort_values(by='pd_difference', ascending=True).iloc[0]
                selected_items = pd.concat([selected_items, pd.DataFrame([item_to_add])])

        while not goals_met() and len(empty_food_groups) < len(order):
            food_group = order[i % len(order)]

            # If the current food group is not in the meal plan OR the goals are still not met after the first iteration
            if not selected_items[f'is_{food_group}'].any() or (i >= len(order) and not goals_met()):
                add_item(food_group)

            i += 1

        id_counts = selected_items['id'].value_counts()
        selected_items = selected_items.drop_duplicates(subset=['id']) \
                        .drop(columns=self.NEW_HEALTH_COLUMNS, axis=1) \
                        .to_dict('records')

        for i in range(len(selected_items)):
            selected_items[i] = {
                'item': selected_items[i],
                'quantity': int(id_counts[selected_items[i]['id']])
            }

        return selected_items

    def plan_meals(self, max_repeated_items=3):
        goals_by_meals = self.split_goals_by_meals()
        
        for meal, goals in goals_by_meals.items():
            meal_plan = self.plan_meal(meal, goals['calories'], goals['protein'], max_repeated_items)
            goals_by_meals[meal] = meal_plan

        return goals_by_meals
