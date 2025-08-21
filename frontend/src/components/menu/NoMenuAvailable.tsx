import { APP_404_LOGO_SRC } from "@/lib/constants";

interface NoMenuAvailableProps {
	meal: string;
	diningHall: string;
}

export function NoMenuAvailable({ meal, diningHall }: NoMenuAvailableProps) {
	return (
		<div className="flex flex-col items-center justify-center py-12 px-6">
			<img src={APP_404_LOGO_SRC} alt="No menu available" className="w-40 h-auto mb-4 object-contain" />
			<h3 className="text-xl font-semibold text-foreground mb-2">Oops!</h3>
			<p className="text-muted-foreground text-center">
				Looks like {diningHall.charAt(0).toUpperCase() + diningHall.slice(1)} isn't serving {meal} at this time.
			</p>
		</div>
	);
}