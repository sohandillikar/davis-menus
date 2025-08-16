import { APP_TITLE, APP_TAGLINE, APP_LOGO_SRC } from "@/lib/constants";

export function LogoAndTitle() {
    return (
        <div className="flex items-center gap-3">
            <img 
            src={APP_LOGO_SRC}
            alt={`${APP_TITLE} Logo`} 
            className="w-12 h-12 rounded-full bg-white p-1 shadow-medium"
            />
            <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                {APP_TITLE}
            </h1>
            <p className="text-white/80 text-sm">
                {APP_TAGLINE}
            </p>
            </div>
        </div>
    );
};
