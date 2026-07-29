import { HiCalendarDays, HiKey, HiMagnifyingGlass } from 'react-icons/hi2';
import SectionHeader from '@/components/ui/SectionHeader';

const steps = [
  {
    icon: HiMagnifyingGlass,
    title: 'Find your fit',
    description: 'Filter nearby listings by city, body style, gearbox, fuel type, seats, and daily price.',
  },
  {
    icon: HiCalendarDays,
    title: 'Review the details',
    description: 'Check availability, specifications, host information, and listing details before continuing.',
  },
  {
    icon: HiKey,
    title: 'Send a request',
    description: 'Choose rental dates, sign in, and send a booking request when online booking is available.',
  },
];

export default function HowItWorks() {
  return (
    <section className="border-y border-[var(--border)] bg-[var(--surface)] py-16 sm:py-20">
      <div className="mx-auto max-w-[var(--content-customer)] px-4 sm:px-6 lg:px-8">
        <SectionHeader title="From search to pickup" description="A straightforward path with the important information shown early." />
        <ol className="mt-10 grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--background)] p-6">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-control)] bg-[var(--primary-subtle)] text-[var(--primary)]">
                  <step.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="font-heading text-sm font-semibold text-[var(--text-tertiary)]">0{index + 1}</span>
              </div>
              <h3 className="mt-6 font-heading text-xl font-semibold">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
