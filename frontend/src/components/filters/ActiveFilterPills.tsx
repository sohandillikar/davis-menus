import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { filterStyles } from "./FilterStyles";
import { X } from "lucide-react";

interface ActiveFiltersProps {
    selectedOptions: string[];
    onOptionsChange: (options: string[]) => void;
    color: string;
    preText?: string;
}

export function ActiveFilterPills(props: ActiveFiltersProps) {
    const styles = filterStyles[props.color];
  
    const handleOptionChange = (option: string, checked: boolean) => {
      if (checked) {
        props.onOptionsChange([...props.selectedOptions, option]);
      } else {
        props.onOptionsChange(props.selectedOptions.filter(o => o !== option));
      }
    };
  
    return (<>
        {props.selectedOptions.map((option, i) => (
          <Badge
            key={i}
            variant="secondary"
            className={`${!props.preText && "capitalize"} ${styles.selectedPill}`}>
            {props.preText ? `${props.preText} ${option}` : option}
              <Button
                variant="ghost"
                size="sm"
                className={`h-auto p-0 ml-1 ${styles.deletePillButton}`}
                onClick={() => handleOptionChange(option, false)}
              >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </>);
};