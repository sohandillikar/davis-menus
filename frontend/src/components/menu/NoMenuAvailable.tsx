interface NoMenuAvailableProps {
	meal: string;
	diningHall: string;
}

export function NoMenuAvailable({ meal, diningHall }: NoMenuAvailableProps) {
	return (
		<div className="flex flex-col items-center justify-center py-12 px-6">
			<img src="/logo.png" alt="AggieMenus logo" className="w-24 h-24 mb-4" />
			<h3 className="text-xl font-semibold text-foreground mb-2">No menu available</h3>
			<p className="text-muted-foreground text-center">
				Menu information for {meal} at {diningHall.charAt(0).toUpperCase() + diningHall.slice(1)} 
				{' '}is not available for this date.
			</p>
		</div>
	);
}