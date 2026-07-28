import { Link } from 'react-router';
import { HiOutlineArrowRight } from 'react-icons/hi2';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[65vh] max-w-xl flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">Error 404</p>
      <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">That road ends here.</h1>
      <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
        The page may have moved, or the address may be incomplete. You can return home or continue browsing cars.
      </p>
      <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
        <Button as={Link} to="/" variant="secondary">Go home</Button>
        <Button as={Link} to="/cars" iconRight={HiOutlineArrowRight}>Explore cars</Button>
      </div>
    </section>
  );
}
