import { clsx } from 'clsx';

const variants = {
  default: {
    src: '/images/brand/ridemint-logo.png',
    width: 47,
    height: 44,
    className: 'h-11 w-auto',
  },
  compact: {
    src: '/images/brand/ridemint-mark.png',
    width: 46,
    height: 36,
    className: 'h-9 w-auto',
  },
  footer: {
    src: '/images/brand/ridemint-logo.png',
    width: 55,
    height: 52,
    className: 'h-[3.25rem] w-auto',
  },
};

export default function RideMintLogo({
  variant = 'default',
  onDark = false,
  className,
}) {
  const selected = variants[variant] || variants.default;

  return (
    <img
      src={selected.src}
      alt="RideMint"
      width={selected.width}
      height={selected.height}
      className={clsx(
        'shrink-0 object-contain',
        selected.className,
        onDark && 'rounded-[var(--radius-control)] bg-white p-1',
        className
      )}
    />
  );
}
