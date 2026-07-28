import { HiOutlineExclamationCircle } from 'react-icons/hi2';
import EmptyState from './EmptyState';

export default function ErrorState({
  title = 'Something went wrong',
  description = 'We could not load this content. Please try again.',
  onRetry,
  className,
}) {
  return (
    <EmptyState
      icon={HiOutlineExclamationCircle}
      title={title}
      description={description}
      action={onRetry ? { label: 'Try again', onClick: onRetry } : undefined}
      className={className}
      role="alert"
    />
  );
}

