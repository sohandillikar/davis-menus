interface ProgressBarProps {
	currentStep: number;
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
	return (<>
        {currentStep < 4 &&
            <div className="flex items-center gap-2 mb-6">
                {[1, 2, 3].map((step, i) => (
                    <div key={i} className={`flex-1 h-2 rounded-full transition-colors ${step <= currentStep ? "bg-primary" : "bg-muted-foreground/20"}`}/>
                ))}
            </div>
        }
	</>);
}