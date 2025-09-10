// App constants
export const APP_TITLE = 'AggieMenus';
export const APP_TAGLINE = 'UC Davis Dining Guide';
export const APP_LOGO_SRC = '/logo.png';
export const APP_404_LOGO_SRC = '/404.png';

// Filter options
export const DINING_HALLS = ['tercero', 'segundo', 'latitude', 'cuarto'];
export const MEALS = ['breakfast', 'lunch', 'dinner'];
export const DIET_OPTIONS = ['halal', 'vegan', 'vegetarian'];
export const ALLERGEN_OPTIONS = [
  'egg',
  'fish',
  'gluten',
  'milk',
  'peanuts',
  'sesame',
  'shellfish',
  'soy',
  'tree nuts',
  'wheat',
];

// Backend constants
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Meal planner constants
export const CALORIE_REC = 2500;                  // Recommended calories per day
export const PROTEIN_REC = 75;                    // Recommended protein per day
export const PD_REC = PROTEIN_REC / CALORIE_REC;  // Recommended protein density
export const MIN_CALORIES = 1200;                 // Minimum recommended calories per day
export const MAX_CALORIES = 4500;                 // Maximum recommended calories per day

// Social constants
export const AGGIEWORKS_WEBSITE = 'https://aggieworks.org';
export const AGGIEWORKS_INSTAGRAM = 'https://www.instagram.com/ucd.aggieworks';
export const AGGIEWORKS_LINKEDIN = 'https://www.linkedin.com/company/aggieworks';
export const AGGIEWORKS_LOGO_SRC = '/aggieworks-logo.png';