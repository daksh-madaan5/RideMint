import { Link, Navigate, useParams } from 'react-router';
import { HiInformationCircle } from 'react-icons/hi2';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import {
  BOOKING_PREVIEW_MESSAGE,
  isLocalSecureBooking,
} from '@/features/bookings/bookingMode';

export default function Booking() {
  const { carId } = useParams();

  if (isLocalSecureBooking) {
    return <Navigate to={`/cars/${carId}#booking-request`} replace />;
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl items-center px-4 py-12">
      <EmptyState
        icon={HiInformationCircle}
        title="Booking preview"
        description={`${BOOKING_PREVIEW_MESSAGE} Open the vehicle details page to review its public information.`}
        action={(
          <div className="flex flex-wrap justify-center gap-3">
            <Button as={Link} to={`/cars/${carId}`}>View car details</Button>
            <Button as={Link} to="/cars" variant="secondary">Browse cars</Button>
          </div>
        )}
      />
    </div>
  );
}
