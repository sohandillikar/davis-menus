export interface MenuItemData {
    id: number;
    created_at: string;
    date: string;
    dining_hall: string;
    meal: string;
    platform: string;
    item_name: string;
    description: string;
    feature: string;
    serving_size_oz: string;
    calories: string;
    fat_g: string;
    carbohydrates_g: string;
    protein_g: string;
    allergens: string[];
    diets: string[];
    ingredients: string;
  }

export class MenuItem {
    constructor(public data: MenuItemData) {}

    public isLiked(): boolean {
      const currentFavs = JSON.parse(localStorage.getItem("aggiemenus.favoriteItems") || "[]");
      return currentFavs.some(item => this.equals(new MenuItem(item)));
    }

    public like(): void {
      const currentFavs = JSON.parse(localStorage.getItem("aggiemenus.favoriteItems") || "[]");
      if (this.isLiked()) return;
      currentFavs.push(this.data);
      localStorage.setItem("aggiemenus.favoriteItems", JSON.stringify(currentFavs));
    }

    public unlike(): void {
      const currentFavs = JSON.parse(localStorage.getItem("aggiemenus.favoriteItems") || "[]");
      const newFavs = currentFavs.filter(item => !this.equals(new MenuItem(item)));
      localStorage.setItem("aggiemenus.favoriteItems", JSON.stringify(newFavs));
    }
    
    // TRUE if the menu item contains at least one allergen from the given list, FALSE otherwise
    public containsAllergens(allergens: string[]): boolean {
      for (let menuItemAllergen of this.data.allergens) {
        menuItemAllergen = menuItemAllergen.toLowerCase().trim();
        for (let a of allergens) {
          a = a.toLowerCase().trim();
          if (menuItemAllergen.includes(a))
            return true;
        }
      }
      return false;
    }

    public equals(other: MenuItem): boolean {
      return this.data.item_name === other.data.item_name;
    }
}