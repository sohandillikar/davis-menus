import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { Grid3X3, List } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconSwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const IconSwitch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  IconSwitchProps
>(({ className, checked, onCheckedChange, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'peer inline-flex h-8 w-16 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-muted data-[state=unchecked]:bg-muted relative',
      className
    )}
    checked={checked}
    onCheckedChange={onCheckedChange}
    {...props}
    ref={ref}
  >
    {/* Background icons */}
    <Grid3X3 className="absolute left-2 h-3 w-3 text-muted-foreground transition-opacity data-[state=checked]:opacity-30 data-[state=unchecked]:opacity-100" />
    <List className="absolute right-2 h-3 w-3 text-muted-foreground transition-opacity data-[state=checked]:opacity-100 data-[state=unchecked]:opacity-30" />

    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block h-6 w-6 rounded-full bg-background shadow ring-0 transition-transform data-[state=checked]:translate-x-8 data-[state=unchecked]:translate-x-0 flex items-center justify-center z-10 relative'
      )}
    >
      {checked ? (
        <List className="h-3 w-3 text-primary" />
      ) : (
        <Grid3X3 className="h-3 w-3 text-primary" />
      )}
    </SwitchPrimitives.Thumb>
  </SwitchPrimitives.Root>
));
IconSwitch.displayName = 'IconSwitch';

export { IconSwitch };