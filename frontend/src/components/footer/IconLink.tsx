interface IconLinkProps {
  icon: React.ReactElement;
  href: string;
}

export default function IconLink({ icon, href }: IconLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary-foreground/80 hover:text-primary-foreground transition-colors p-2 hover:bg-white/10 rounded-full"
    >
      {icon}
    </a>
  );
}
