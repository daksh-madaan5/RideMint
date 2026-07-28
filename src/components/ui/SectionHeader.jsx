import { clsx } from 'clsx';

export default function SectionHeader({ title, description, action, className }) {
  return (
    <div className={clsx('flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div>
        <h2 className="type-section-heading">{title}</h2>
        {description && <p className="type-supporting mt-2 max-w-2xl">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

