import { Link } from 'react-router';
import { HiArrowRight } from 'react-icons/hi2';
import Button from '@/components/ui/Button';

export default function CTASection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-[var(--content-customer)] px-4 sm:px-6 lg:px-8">
        <div data-dark-surface className="flex flex-col items-start justify-between gap-8 rounded-[var(--radius-panel)] border border-[var(--dark-border)] bg-[var(--dark-surface)] px-6 py-10 sm:px-10 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--dark-link)]">Ready when you are</p>
            <h2 className="mt-3 max-w-xl font-heading text-3xl font-semibold tracking-tight text-[var(--dark-text-primary)]">Compare nearby cars with confidence.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--dark-text-secondary)]">Browse available cars from local hosts across supported cities.</p>
          </div>
          <Button as={Link} to="/cars" size="lg" className="focus-ring-dark bg-[var(--dark-action)] text-[var(--dark-action-text)] hover:bg-[var(--dark-action-hover)]" iconRight={HiArrowRight}>
            Explore cars
          </Button>
        </div>
      </div>
    </section>
  );
}
