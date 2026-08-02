import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { DEFAULT_CAR_IMAGE } from '@/utils/helpers';

export default function VehicleImage({
  src,
  alt,
  className,
  imageClassName,
  eager = false,
}) {
  const [resolvedSource, setResolvedSource] = useState(src || DEFAULT_CAR_IMAGE);

  useEffect(() => {
    setResolvedSource(src || DEFAULT_CAR_IMAGE);
  }, [src]);

  return (
    <div className={clsx('aspect-[16/10] overflow-hidden bg-[var(--surface-subtle)]', className)}>
      <img
        src={resolvedSource}
        alt={alt}
        width="1600"
        height="1000"
        loading={eager ? 'eager' : 'lazy'}
        onError={() => setResolvedSource(DEFAULT_CAR_IMAGE)}
        className={clsx('h-full w-full object-cover', imageClassName)}
      />
    </div>
  );
}
