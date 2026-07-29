import { Link } from 'react-router';
import RideMintLogo from '@/components/brand/RideMintLogo';

const footerLinks = [
  { label: 'Home', path: '/' },
  { label: 'Explore cars', path: '/cars' },
  { label: 'About', path: '/about' },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--dark-border)] bg-[var(--dark-surface)] text-[var(--dark-text-primary)]">
      <div className="mx-auto flex max-w-[var(--content-customer)] flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-end md:justify-between lg:px-8">
        <div>
          <Link to="/" className="focus-ring-dark inline-flex items-center gap-2 rounded-lg" aria-label="RideMint home">
            <RideMintLogo variant="footer" onDark />
          </Link>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--dark-text-secondary)]">
            Browse self-drive cars from local hosts with clear pricing and practical listing details.
          </p>
        </div>
        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            {footerLinks.map((link) => (
              <li key={link.path}>
                <Link className="focus-ring-dark rounded text-sm text-[var(--dark-text-secondary)] transition-colors hover:text-[var(--dark-text-primary)]" to={link.path}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-[var(--dark-border)]">
        <div className="mx-auto max-w-[var(--content-customer)] px-4 py-5 text-sm text-[var(--dark-text-tertiary)] sm:px-6 lg:px-8">
          © {new Date().getFullYear()} RideMint. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
