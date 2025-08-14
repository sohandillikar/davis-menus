interface LogoAndTitleProps {
    logoSrc: string;
    title: string;
    subtitle: string;
};

export function LogoAndTitle({ logoSrc, title, subtitle }: LogoAndTitleProps) {
    return (
        <div className="flex items-center gap-3">
            <img 
            src={logoSrc}
            alt={`${title} Logo`} 
            className="w-12 h-12 rounded-full bg-white p-1 shadow-medium"
            />
            <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                {title}
            </h1>
            <p className="text-white/80 text-sm">
                {subtitle}
            </p>
            </div>
        </div>
    );
};
