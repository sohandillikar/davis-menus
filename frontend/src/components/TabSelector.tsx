import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabStyles = {
  primary: {
      tabsList: "grid w-full grid-cols-4 bg-dining-hall-bg border border-border/50 rounded-xl p-1 h-12",
      tabTrigger: "capitalize flex items-center justify-center min-h-[2.5rem] py-2 data-[state=active]:bg-dining-hall-active data-[state=active]:text-white data-[state=active]:shadow-medium font-medium transition-all duration-300 rounded-lg text-sm md:text-base",
  },
  secondary: {
      tabsList: "grid w-full grid-cols-3 bg-meal-tab-bg border border-border/30 rounded-lg p-1",
      tabTrigger: "capitalize data-[state=active]:bg-meal-tab-active data-[state=active]:text-white data-[state=active]:shadow-soft font-medium transition-all duration-300 rounded-md text-sm",
  }
}

interface TabSelectorProps {
    selectedValue: string;
    onValueChange: (value: string) => void;
    tabs: string[];
    type: "primary" | "secondary";
};

export function TabSelector(props: TabSelectorProps) {
    const styles = tabStyles[props.type];
    return (
        <Tabs value={props.selectedValue} onValueChange={props.onValueChange} className="w-full">
        <TabsList className={styles.tabsList}>
          {props.tabs.map((tab, i) => (
            <TabsTrigger
              key={i}
              value={tab}
              className={styles.tabTrigger}>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>        
    );
};
