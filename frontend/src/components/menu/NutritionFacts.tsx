import { MenuItemData } from "./MenuItem";

interface NutritionFactsProps {
    item: MenuItemData;
    layout: "row" | "grid";
}

export function NutritionFacts({ item, layout }: NutritionFactsProps) {
    const parseFact = (fact: string) => fact === "N/A" ? "N/A" : Math.round(parseFloat(fact));
    const facts = [
        { label: "Serving Size", value: parseFact(item.serving_size_oz), valueType: " oz" },
        { label: "Calories", value: parseFact(item.calories), valueType: " cal" },
        { label: "Protein", value: parseFact(item.protein_g), valueType: "g" },
        { label: "Fat", value: parseFact(item.fat_g), valueType: "g" },
        { label: "Carbs", value: parseFact(item.carbohydrates_g), valueType: "g" },
    ];

    return (
        <div className={`grid grid-cols-2 gap-3 ${layout === "row" && "sm:grid-cols-5"}`}>
            {facts.map((fact, i) => (
                <div key={i} className="bg-muted/50 rounded-lg p-3 text-center">
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">{fact.label}</div>
                    <div className="font-semibold text-foreground mt-1">{fact.value}{fact.value !== "N/A" &&fact.valueType}</div>
                </div>
            ))}
        </div>
    );
};