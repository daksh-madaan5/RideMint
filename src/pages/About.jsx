import { Link } from 'react-router';
import { HiArrowRight, HiCheckBadge, HiMapPin, HiUsers } from 'react-icons/hi2';
import Button from '@/components/ui/Button';
import { SUPPORTED_LOCATIONS } from '@/constants';

export default function About() {
  return (
    <>
      <section className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-[var(--content-customer)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">About RideMint</p>
          <h1 className="mt-4 max-w-3xl font-heading text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            A clearer way to choose a self-drive car.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
            RideMint helps people compare cars listed by local hosts using practical vehicle details, clear daily prices, and transparent listing status.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[var(--content-customer)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          <Value icon={HiUsers} title="Local hosts" text="Authenticated members can submit a car listing for administrator review." />
          <Value icon={HiCheckBadge} title="Moderated listings" text="Only approved and available host listings appear alongside the clearly labelled demo fallback." />
          <Value icon={HiMapPin} title="Built around cities" text="Browse by pickup city first, then narrow the marketplace to a suitable vehicle." />
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto grid max-w-[var(--content-customer)] gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="font-heading text-3xl font-semibold tracking-tight">Supported cities</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
              Host listings currently use these seven city options. Demo cars remain available when no approved Firestore listings exist.
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {SUPPORTED_LOCATIONS.map((city) => (
              <li key={city} className="rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-medium">
                {city}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto grid max-w-[var(--content-customer)] gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:px-8">
        <div>
          <h2 className="font-heading text-2xl font-semibold">How a rental works</h2>
          <ol className="mt-5 space-y-4 text-sm leading-6 text-[var(--text-secondary)]">
            <li><strong className="text-[var(--text-primary)]">1. Browse:</strong> choose a city and compare approved host listings and demo cars.</li>
            <li><strong className="text-[var(--text-primary)]">2. Review:</strong> check vehicle details, availability, and the minimal public host profile.</li>
            <li><strong className="text-[var(--text-primary)]">3. Request later:</strong> booking requests and secure contact exchange are outside this MVP phase.</li>
          </ol>
        </div>
        <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="font-heading text-2xl font-semibold">Customer support</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
            RideMint support is intended to help with marketplace and listing questions. This MVP does not invent a phone number, email address, or support hours.
          </p>
        </div>
      </section>

      <section className="border-t border-[var(--border)]">
        <div className="mx-auto flex max-w-[var(--content-customer)] flex-col items-start justify-between gap-6 px-4 py-16 sm:px-6 md:flex-row md:items-center lg:px-8">
        <div>
          <h2 className="font-heading text-3xl font-semibold tracking-tight">Start with nearby cars.</h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">No account is needed to browse and compare vehicles.</p>
        </div>
        <Button as={Link} to="/cars" iconRight={HiArrowRight}>Explore cars</Button>
        </div>
      </section>
    </>
  );
}

function Value({ icon: Icon, title, text }) {
  return (
    <article className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-6">
      <span className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-control)] bg-[var(--primary-subtle)] text-[var(--primary)]">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h2 className="mt-6 font-heading text-xl font-semibold">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">{text}</p>
    </article>
  );
}
