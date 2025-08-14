# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Create a new project
3. Wait for the project to be set up

## 2. Get Your Project Credentials

1. Go to your project dashboard
2. Click on "Settings" → "API"
3. Copy your:
   - **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

## 3. Update Environment Variables

1. Open `.env.local` in your project root
2. Replace the placeholder values:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 4. Create Your Database Table

In your Supabase dashboard, go to "SQL Editor" and run this SQL:

```sql
CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date DATE NOT NULL,
  dining_hall TEXT NOT NULL,
  meal TEXT NOT NULL,
  platform TEXT,
  item_name TEXT NOT NULL,
  serving_size_oz TEXT,
  calories TEXT,
  fat_g TEXT,
  carbohydrates_g TEXT,
  protein_g TEXT,
  allergens TEXT[],
  diets TEXT[],
  ingredients TEXT,
  description TEXT,
  feature TEXT
);

-- Insert some sample data
INSERT INTO menu_items (date, dining_hall, meal, platform, item_name, serving_size_oz, calories, fat_g, carbohydrates_g, protein_g, allergens, diets, ingredients, description, feature) VALUES
('2025-01-15', 'tercero', 'breakfast', 'Pacific Fusion', 'Scrambled Eggs', '3.05', '138.75', '9.54', '1.82', '10.86', ARRAY['egg'], ARRAY['vegetarian'], 'Liquid whole eggs, Canola oil', 'Softly scrambled cage-free eggs', 'Served with fresh herbs'),
('2025-01-15', 'tercero', 'breakfast', 'Grille Works', 'Blueberry Pancakes', '6.0', '320.00', '8.5', '58.2', '9.1', ARRAY['wheat', 'milk', 'egg'], ARRAY['vegetarian'], 'Flour, milk, eggs, sugar, blueberries', 'Fluffy pancakes loaded with fresh blueberries', 'Served with maple syrup');
```

## 5. Test Your Setup

1. Start your development server: `npm run dev`
2. Open your app in the browser
3. You should see real data loading from Supabase instead of mock data

## Troubleshooting

- **"Missing Supabase environment variables"**: Check your `.env.local` file
- **"Failed to fetch menu data"**: Check your table name and column names match
- **No data showing**: Verify your table has data and the date format matches

## Security Notes

- The anon key is safe to use in the browser
- Never commit your `.env.local` file to git
- Consider setting up Row Level Security (RLS) for production use
