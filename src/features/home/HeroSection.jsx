import { useState } from 'react';
import { useNavigate } from 'react-router';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { DEFAULT_LOCATION, SUPPORTED_LOCATIONS } from '@/constants';

function dateFromToday(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

export default function HeroSection() {
  const navigate = useNavigate();
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [pickupDate, setPickupDate] = useState(() => dateFromToday(1));
  const [returnDate, setReturnDate] = useState(() => dateFromToday(3));
  const [error, setError] = useState('');
  const minimumDate = dateFromToday(0);

  const handleSearch = (event) => {
    event.preventDefault();
    if (!pickupDate || !returnDate) {
      setError('Choose both pickup and return dates.');
      return;
    }
    if (returnDate <= pickupDate) {
      setError('Return date must be after the pickup date.');
      return;
    }

    setError('');
    const params = new URLSearchParams({ location, pickup: pickupDate, return: returnDate });
    navigate(`/cars?${params.toString()}`);
  };

  return (
    <section className="border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto grid max-w-[var(--content-customer)] gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16 lg:px-8 lg:py-24">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">Self-drive cars near you</p>
          <h1 className="mt-4 max-w-2xl font-heading text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            The right car for the road ahead.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-[var(--text-secondary)]">
            Browse cars from local hosts by city, compare clear daily rates, and review practical listing details.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--background)] p-5 shadow-[var(--shadow-card)] sm:p-6"
          noValidate
        >
          <h2 className="font-heading text-xl font-semibold">Plan your drive</h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">Start with a pickup city and travel dates.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Select
              label="Pickup city"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              options={SUPPORTED_LOCATIONS}
              required
              containerClassName="sm:col-span-2"
            />
            <Input
              label="Pickup date"
              type="date"
              min={minimumDate}
              value={pickupDate}
              onChange={(event) => setPickupDate(event.target.value)}
              required
            />
            <Input
              label="Return date"
              type="date"
              min={pickupDate || minimumDate}
              value={returnDate}
              onChange={(event) => setReturnDate(event.target.value)}
              required
            />
          </div>
          {error && <p className="mt-4 text-sm text-[var(--danger)]" role="alert">{error}</p>}
          <Button type="submit" fullWidth className="mt-6" icon={HiMagnifyingGlass}>
            Find cars
          </Button>
        </form>
      </div>
    </section>
  );
}
