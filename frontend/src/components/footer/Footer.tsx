interface FooterLinkProps {
  label: string;
  href: string;
}

function FooterLink({ label, href }: FooterLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
    >
      {label}
    </a>
  );
}

export function Footer() {
  return (
    <footer className="bg-gradient-primary shadow-glow">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="text-center space-y-4">
          <p className="text-primary-foreground text-sm font-medium">
            Made with ❤️ by AggieWorks
          </p>

          <div className="flex items-center justify-center gap-6 text-sm">
            <FooterLink
              label="Instagram"
              href="https://www.instagram.com/aggiemenus/"
            />
            <FooterLink label="AggieWorks" href="https://aggieworks.org" />
            <FooterLink label="Feedback" href="" />
          </div>
        </div>
      </div>
    </footer>
  );
}
