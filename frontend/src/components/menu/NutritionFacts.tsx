import { MenuItemData } from "./MenuItem";

interface NutritionFactsProps {
    item: MenuItemData;
    layout: "row" | "grid";
}

export function NutritionFacts({ item, layout }: NutritionFactsProps) {
    const parseFact = (fact: string) => fact === "N/A" ? "N/A" : Math.round(parseFloat(fact));
    const facts = [
        { label: "Serving Size", value: `${item.serving_size_oz} oz` },
        { label: "Calories", value: `${parseFact(item.calories)} cal` },
        { label: "Protein", value: `${parseFact(item.protein_g)}g` },
        { label: "Fat", value: `${parseFact(item.fat_g)}g` },
        { label: "Carbs", value: `${parseFact(item.carbohydrates_g)}g` },
    ];

    return (
        <div className={`grid grid-cols-2 gap-3 ${layout === "row" && "sm:grid-cols-5"}`}>
            {facts.map((fact, i) => (
                <div key={i} className="bg-muted/50 rounded-lg p-3 text-center">
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">{fact.label}</div>
                    <div className="font-semibold text-foreground mt-1">{fact.value}</div>
                </div>
            ))}
        </div>
    );
};