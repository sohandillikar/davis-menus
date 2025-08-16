import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { filterStyles } from "./FilterStyles";

interface FilterButtonProps {
    title: string;
    description: string;
    options: string[];
    selectedOptions: string[];
    onOptionsChange: (options: string[]) => void;
    color: string;
}

export function FilterButton(props: FilterButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const styles = filterStyles[props.color];
    const tooManyOptions = props.options.length > 5;
  
    const handleOptionChange = (option: string, checked: boolean) => {
      if (checked) {
        props.onOptionsChange([...props.selectedOptions, option]);
      } else {
        props.onOptionsChange(props.selectedOptions.filter(o => o !== option));
      }
    };
  
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className={`h-8 border-dashed ${styles.buttonHover}
              ${props.selectedOptions.length > 0 ?
                styles.buttonSelected :
                "bg-transparent border-gray-300"
            }`}
          >
            {props.title}
            {props.selectedOptions.length > 0 && (
              <Badge className={`ml-2 h-5 w-5 p-0 text-xs rounded-full flex items-center justify-center ${styles.countBadge}`}>
                {props.selectedOptions.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className={`w-${tooManyOptions ? 56 : 48} p-3`} align="start">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">{props.description}</h4>
            <div className={tooManyOptions ? "grid grid-cols-2 gap-2" : "space-y-2"}>
              {props.options.map((option, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Checkbox
                    id={`option-${option}`}
                    checked={props.selectedOptions.includes(option)}
                    onCheckedChange={(checked) => handleOptionChange(option, checked as boolean)}
                  />
                  <label
                    htmlFor={`option-${option}`}
                    className={`text-${tooManyOptions ? "xs" : "sm"} capitalize cursor-pointer`}>
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  };
