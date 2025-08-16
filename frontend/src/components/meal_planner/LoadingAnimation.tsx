import { APP_LOGO_SRC, APP_TITLE } from "@/lib/constants";

export function LoadingAnimation() {
	return (
		<div className="flex flex-col items-center justify-center py-16">
			<div className="relative">
				<img src={APP_LOGO_SRC} alt={`${APP_TITLE} Logo`} className="w-24 h-24 animate-pulse" />
				<div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
			</div>
			<div className="text-center space-y-2">
				<h3 className="text-xl font-semibold text-foreground animate-fade-in">Lemme me cook...</h3>
				<p className="text-muted-foreground text-sm animate-fade-in delay-300">
				Preparing your personalized meal plan
				</p>
			</div>
			<div className="flex space-x-1">
				<div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
				<div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
				<div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
			</div>
		</div>
	);
}