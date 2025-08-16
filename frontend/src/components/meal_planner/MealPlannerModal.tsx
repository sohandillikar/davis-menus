import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Utensils, ChevronDown } from "lucide-react";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";
import { Step4 } from "./Step4";
import { NavigationButtons } from "./NavigationButtons";
import { LoadingAnimation } from "./LoadingAnimation";
import { ProgressBar } from "./ProgressBar";

interface MealPlannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface FormData {
  calories: string;
  protein: string;
  meals: string[];
  diningHalls: Record<string, string>;
  diets: string[];
  allergens: string[];
}

export function MealPlannerModal({ open, onOpenChange }: MealPlannerModalProps) {
  const defaultFormData: FormData = {
    calories: "2200",
    protein: "120",
    meals: [],
    diningHalls: {},
    diets: [],
    allergens: []
  };

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, string | null>>({});
  const [formData, setFormData] = useState<FormData>(defaultFormData);

  const resetModal = () => {
    setCurrentStep(1);
    setIsLoading(false);
    setFormData(defaultFormData);
  };

  const handleClose = () => {
    onOpenChange(false);
    resetModal();
  };

  useEffect(() => {
    if (currentStep === 5) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setCurrentStep(5);
      }, 2000);
    }
  }, [currentStep]);

  const toggleItemExpansion = (meal: string, item: string) => {
    const key = `${meal}-${item}`;
    setExpandedItems(prev => ({
      ...prev,
      [meal]: prev[meal] === key ? null : key
    }));
  };

  const mockMealPlan = {
    breakfast: {
      items: ["Scrambled Eggs", "Toast", "Hash Browns", "Orange Juice"],
      calories: 450,
      protein: 18,
      location: formData.diningHalls.breakfast || "Tercero",
      description: "High-protein breakfast with eggs and carbs for sustained energy throughout the morning."
    },
    lunch: {
      items: ["Grilled Chicken Salad", "Quinoa Bowl", "Apple", "Water"],
      calories: 520,
      protein: 35,
      location: formData.diningHalls.lunch || "Segundo",
      description: "Balanced meal combining lean protein and whole grains to fuel afternoon activities."
    },
    dinner: {
      items: ["Salmon Fillet", "Steamed Broccoli", "Brown Rice", "Sparkling Water"],
      calories: 580,
      protein: 42,
      location: formData.diningHalls.dinner || "Latitude",
      description: "Omega-3 rich salmon with fiber-dense vegetables to support recovery and sleep."
    }
  };

  const getItemNutrition = (item: string) => {
    const nutritionData: Record<string, any> = {
      "Scrambled Eggs": { 
        calories: "180", protein_g: "12", fat_g: "12", carbohydrates_g: "2", serving_size_oz: "4.0",
        allergens: ["egg", "milk"], diets: ["vegetarian"],
        description: "Fluffy scrambled eggs cooked to perfection with butter and seasoning.",
        feature: "High in protein and healthy fats",
        ingredients: "Eggs, butter, salt, pepper, milk"
      },
      "Toast": { 
        calories: "80", protein_g: "3", fat_g: "1", carbohydrates_g: "15", serving_size_oz: "1.0",
        allergens: ["gluten", "wheat"], diets: [],
        description: "Golden brown toasted bread, perfect for breakfast.",
        feature: "Whole grain goodness",
        ingredients: "Whole wheat flour, water, yeast, salt, sugar"
      },
      "Hash Browns": { 
        calories: "150", protein_g: "2", fat_g: "8", carbohydrates_g: "18", serving_size_oz: "3.0",
        allergens: [], diets: ["vegan", "vegetarian"],
        description: "Crispy golden hash browns made from fresh potatoes.",
        feature: "Crispy outside, fluffy inside",
        ingredients: "Potatoes, vegetable oil, salt, pepper"
      },
      "Orange Juice": { 
        calories: "40", protein_g: "1", fat_g: "0", carbohydrates_g: "10", serving_size_oz: "4.0",
        allergens: [], diets: ["vegan", "vegetarian"],
        description: "Fresh squeezed orange juice, no pulp.",
        feature: "Rich in Vitamin C",
        ingredients: "Fresh oranges"
      },
      "Grilled Chicken Salad": { 
        calories: "280", protein_g: "25", fat_g: "12", carbohydrates_g: "8", serving_size_oz: "6.0",
        allergens: [], diets: [],
        description: "Fresh mixed greens topped with perfectly grilled chicken breast.",
        feature: "Lean protein powerhouse",
        ingredients: "Chicken breast, mixed greens, olive oil, balsamic vinegar, tomatoes, cucumbers"
      },
      "Quinoa Bowl": { 
        calories: "180", protein_g: "8", fat_g: "3", carbohydrates_g: "30", serving_size_oz: "5.0",
        allergens: [], diets: ["vegan", "vegetarian"],
        description: "Nutrient-dense quinoa bowl with fresh vegetables.",
        feature: "Complete amino acid profile",
        ingredients: "Quinoa, bell peppers, onions, vegetable broth, olive oil, herbs"
      },
      "Apple": { 
        calories: "60", protein_g: "0", fat_g: "0", carbohydrates_g: "15", serving_size_oz: "3.0",
        allergens: [], diets: ["vegan", "vegetarian"],
        description: "Fresh, crisp apple - nature's perfect snack.",
        feature: "High in fiber and antioxidants",
        ingredients: "Fresh apple"
      },
      "Water": { 
        calories: "0", protein_g: "0", fat_g: "0", carbohydrates_g: "0", serving_size_oz: "8.0",
        allergens: [], diets: ["vegan", "vegetarian"],
        description: "Pure, refreshing water to keep you hydrated.",
        feature: "Essential for life",
        ingredients: "Pure water"
      },
      "Salmon Fillet": { 
        calories: "350", protein_g: "35", fat_g: "20", carbohydrates_g: "0", serving_size_oz: "6.0",
        allergens: ["fish"], diets: [],
        description: "Fresh Atlantic salmon fillet, grilled to perfection.",
        feature: "Rich in Omega-3 fatty acids",
        ingredients: "Atlantic salmon, olive oil, lemon, herbs, salt, pepper"
      },
      "Steamed Broccoli": { 
        calories: "30", protein_g: "3", fat_g: "0", carbohydrates_g: "6", serving_size_oz: "3.0",
        allergens: [], diets: ["vegan", "vegetarian"],
        description: "Fresh broccoli steamed to retain maximum nutrients.",
        feature: "Packed with vitamins and minerals",
        ingredients: "Fresh broccoli, water"
      },
      "Brown Rice": { 
        calories: "150", protein_g: "3", fat_g: "1", carbohydrates_g: "30", serving_size_oz: "4.0",
        allergens: [], diets: ["vegan", "vegetarian"],
        description: "Nutty flavored brown rice, a healthy whole grain choice.",
        feature: "High in fiber and nutrients",
        ingredients: "Brown rice, water, salt"
      },
      "Sparkling Water": { 
        calories: "0", protein_g: "0", fat_g: "0", carbohydrates_g: "0", serving_size_oz: "8.0",
        allergens: [], diets: ["vegan", "vegetarian"],
        description: "Refreshing sparkling water with natural bubbles.",
        feature: "Zero calories, maximum refreshment",
        ingredients: "Carbonated water"
      }
    };
    
    return nutritionData[item] || { 
      calories: "100", protein_g: "5", fat_g: "3", carbohydrates_g: "10", serving_size_oz: "3.0",
      allergens: [], diets: [], description: "Nutritious food item.", feature: "", ingredients: "Various ingredients"
    };
  };

  const renderStep = () => {
    if (isLoading)
      return <LoadingAnimation />;

    switch (currentStep) {
      case 1:
        return <Step1 formData={formData} setFormData={setFormData} />;

      case 2:
        return <Step2 formData={formData} setFormData={setFormData} />;

      case 3:
        return <Step3 formData={formData} setFormData={setFormData} />;

      case 4:
        return <Step4 formData={formData} setFormData={setFormData} />;

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <img src="/logo.png" alt="Cow logo" className="h-6 w-6" />
                Here's what I've got for ya
              </h2>
              
              <div className="space-y-4">
                {formData.meals.map((meal) => {
                  const mealData = mockMealPlan[meal as keyof typeof mockMealPlan];
                  return (
                    <Card key={meal}>
                      <CardHeader className="pb-3">
                        <CardTitle className="capitalize text-lg">{meal}</CardTitle>
                        <CardDescription>
                          {mealData.location.charAt(0).toUpperCase() + mealData.location.slice(1)} • {mealData.calories} cal • {mealData.protein}g protein
                        </CardDescription>
                        <p className="text-sm text-muted-foreground mt-2 italic">
                          {mealData.description}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-2">
                            {mealData.items.map((item, index) => {
                              const itemKey = `${meal}-${item}`;
                              const isExpanded = expandedItems[meal] === itemKey;
                              const nutrition = getItemNutrition(item);
                              
                              return (
                                <span key={index} className="bg-muted px-2 py-1 rounded-md text-sm cursor-pointer hover:bg-muted/80 transition-colors inline-flex items-center gap-1" onClick={() => toggleItemExpansion(meal, item)}>
                                  {item}
                                  <ChevronDown className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                </span>
                              );
                            })}
                          </div>
                          
                          {/* Expanded content for selected item */}
                          {formData.meals.map((mealType) => {
                            const selectedItemKey = expandedItems[mealType];
                            if (!selectedItemKey || mealType !== meal) return null;
                            
                            const selectedItem = selectedItemKey.split('-').slice(1).join('-');
                            const nutrition = getItemNutrition(selectedItem);
                            
                            return (
                              <div key={selectedItemKey} className="pt-3 border-t border-border/30 space-y-3 animate-fade-in">
                                {/* Description and Feature */}
                                {(nutrition.description || nutrition.feature) && (
                                  <div className="space-y-2">
                                    {nutrition.description && (
                                      <p className="text-muted-foreground text-sm leading-relaxed">
                                        {nutrition.description}
                                      </p>
                                    )}
                                    {nutrition.feature && (
                                      <p className="text-primary text-sm font-medium">
                                        {nutrition.feature}
                                      </p>
                                    )}
                                  </div>
                                )}
                                
                                {/* Nutrition Facts Grid */}
                                <div className="grid gap-3 grid-cols-2 sm:grid-cols-5">
                                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Serving Size</div>
                                    <div className="font-semibold text-foreground mt-1">{nutrition.serving_size_oz} oz</div>
                                  </div>
                                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Calories</div>
                                    <div className="font-semibold text-foreground mt-1">{Math.round(parseFloat(nutrition.calories))}</div>
                                  </div>
                                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Protein</div>
                                    <div className="font-semibold text-foreground mt-1">{Math.round(parseFloat(nutrition.protein_g))}g</div>
                                  </div>
                                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Fat</div>
                                    <div className="font-semibold text-foreground mt-1">{Math.round(parseFloat(nutrition.fat_g))}g</div>
                                  </div>
                                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Carbs</div>
                                    <div className="font-semibold text-foreground mt-1">{Math.round(parseFloat(nutrition.carbohydrates_g))}g</div>
                                  </div>
                                </div>

                                {/* Allergens */}
                                {nutrition.allergens.length > 0 && (
                                  <div>
                                    <h4 className="text-sm font-medium text-foreground mb-2">Allergens:</h4>
                                    <div className="flex flex-wrap gap-1">
                                      {nutrition.allergens.map((allergen: string) => (
                                        <Badge
                                          key={allergen}
                                          className="bg-red-100 text-red-700 font-medium px-2 py-1 text-xs border-0 capitalize pointer-events-none"
                                        >
                                          {allergen}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Diets */}
                                {nutrition.diets.length > 0 && (
                                  <div>
                                    <h4 className="text-sm font-medium text-foreground mb-2">Diets:</h4>
                                    <div className="flex flex-wrap gap-1">
                                      {nutrition.diets.map((diet: string) => (
                                        <Badge
                                          key={diet}
                                          className="bg-green-100 text-green-700 font-medium px-2 py-1 text-xs border-0 capitalize pointer-events-none"
                                        >
                                          {diet}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Ingredients */}
                                <div>
                                  <h4 className="text-sm font-medium text-foreground mb-2">Ingredients:</h4>
                                  <p className="text-xs text-muted-foreground leading-relaxed bg-muted/30 rounded-lg p-3">
                                    {nutrition.ingredients}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="flex items-center justify-center py-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Daily totals: {Array.from(formData.meals).reduce((acc, meal) => acc + mockMealPlan[meal as keyof typeof mockMealPlan].calories, 0)} calories • {Array.from(formData.meals).reduce((acc, meal) => acc + mockMealPlan[meal as keyof typeof mockMealPlan].protein, 0)}g protein
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            Meal Planner
          </DialogTitle>
        </DialogHeader>

        <ProgressBar currentStep={currentStep} />

        <div className="space-y-6">
          {renderStep()}
        </div>

        <NavigationButtons
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          formData={formData}
          isLoading={isLoading}
          onCloseModal={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
}