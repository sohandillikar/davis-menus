import { APP_TITLE, APP_LOGO_SRC } from "@/lib/constants";

interface NoMenuAvailableProps {
	meal: string;
	diningHall: string;
}

export function NoMenuAvailable({ meal, diningHall }: NoMenuAvailableProps) {
	return (
		<div className="flex flex-col items-center justify-center py-12 px-6">
			<img src={APP_LOGO_SRC} alt={`${APP_TITLE} Logo`} className="w-24 h-24 mb-4" />
			<h3 className="text-xl font-semibold text-foreground mb-2">No menu available</h3>
			<p className="text-muted-foreground text-center">
				Menu information for {meal} at {diningHall.charAt(0).toUpperCase() + diningHall.slice(1)} 
				{' '}is not available for this date.
			</p>
		</div>
	);
}