import { clsx } from 'clsx';

export default function PageHeader({ eyebrow, title, description, actions, className }) {
  return (
    <header className={clsx('flex flex-col gap-5 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="max-w-3xl">
        {eyebrow && <p className="type-label mb-2 text-[var(--primary)]">{eyebrow}</p>}
        <h1 className="type-page-heading">{title}</h1>
        {description && <p className="type-supporting mt-3 max-w-2xl">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

