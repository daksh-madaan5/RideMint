import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router';
import { HiRectangleStack } from 'react-icons/hi2';
import { toast } from 'react-toastify';
import Button from '@/components/ui/Button';
import ErrorState from '@/components/ui/ErrorState';
import Input from '@/components/ui/Input';
import PageHeader from '@/components/ui/PageHeader';
import Select from '@/components/ui/Select';
import Skeleton from '@/components/ui/Skeleton';
import Textarea from '@/components/ui/Textarea';
import ListingImageUploader from '@/features/listings/ListingImageUploader';
import { useOwnerListing } from '@/features/listings/listingHooks';
import {
  LISTING_FORM_OPTIONS,
  listingSchema,
} from '@/features/listings/listingSchema';
import {
  createVehicleListing,
  updateOwnListing,
} from '@/features/listings/listingService';
import { useAuth } from '@/hooks/useAuth';

const defaults = {
  make: '',
  model: '',
  year: new Date().getFullYear(),
  category: '',
  city: '',
  transmission: '',
  fuelType: '',
  seats: 5,
  pricePerDay: '',
  description: '',
  availabilityStatus: 'available',
};

export default function ListYourCar() {
  const { listingId } = useParams();
  const editing = Boolean(listingId);
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [imageError, setImageError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { data: listing, isLoading, isError, refetch } = useOwnerListing(listingId, user?.uid);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(listingSchema),
    defaultValues: defaults,
  });

  useEffect(() => {
    if (!listing) return;
    reset({
      make: listing.make,
      model: listing.model,
      year: listing.year,
      category: listing.category,
      city: listing.city,
      transmission: listing.transmission,
      fuelType: listing.fuelType,
      seats: listing.seats,
      pricePerDay: listing.pricePerDay,
      description: listing.description,
      availabilityStatus: listing.availabilityStatus || 'available',
    });
    setImages(listing.images || []);
  }, [listing, reset]);

  const onSubmit = async (values) => {
    if (images.length < 1 || images.length > 4) {
      setImageError(images.length < 1 ? 'Upload at least one vehicle image.' : 'A listing can contain no more than four images.');
      return;
    }

    setImageError('');
    setSubmitting(true);
    try {
      if (editing) {
        await updateOwnListing({
          listingId,
          ownerId: user.uid,
          current: listing,
          values,
          images,
        });
        toast.success('Listing updated and sent for review when required.');
      } else {
        await createVehicleListing({ user, userProfile, values, images });
        toast.success('Listing submitted for review.');
      }
      navigate('/my-listings', { replace: true });
    } catch (error) {
      toast.error(error.message || 'The listing could not be saved.');
    } finally {
      setSubmitting(false);
    }
  };

  if (editing && isLoading) {
    return <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6"><Skeleton className="h-10 w-64" /><Skeleton variant="paragraph" className="mt-8" /></div>;
  }
  if (editing && isError) {
    return <ErrorState className="mx-auto min-h-[60vh] max-w-xl" title="Listing could not be loaded" onRetry={refetch} />;
  }
  if (editing && !listing) {
    return <ErrorState className="mx-auto min-h-[60vh] max-w-xl" title="Listing not found" description="This listing is unavailable or does not belong to your account." />;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <PageHeader
        eyebrow={editing ? 'Edit listing' : 'List your car'}
        title={editing ? `Edit ${listing.make} ${listing.model}` : 'Share your car with local renters'}
        description="Add practical vehicle details and images. New listings start in pending review."
        actions={
          <Button as={Link} to="/my-listings" variant="secondary" icon={HiRectangleStack}>
            View My Listings
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-8" noValidate>
        <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6" aria-labelledby="vehicle-details-title">
          <h2 id="vehicle-details-title" className="font-heading text-xl font-semibold">Vehicle details</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Input label="Make" required error={errors.make?.message} {...register('make')} />
            <Input label="Model" required error={errors.model?.message} {...register('model')} />
            <Input label="Manufacturing year" type="number" required error={errors.year?.message} {...register('year')} />
            <Select label="Category" required placeholder="Choose category" options={LISTING_FORM_OPTIONS.categories} error={errors.category?.message} {...register('category')} />
            <Select label="City" required placeholder="Choose city" options={LISTING_FORM_OPTIONS.cities} error={errors.city?.message} {...register('city')} />
            <Select label="Transmission" required placeholder="Choose transmission" options={LISTING_FORM_OPTIONS.transmissions} error={errors.transmission?.message} {...register('transmission')} />
            <Select label="Fuel type" required placeholder="Choose fuel type" options={LISTING_FORM_OPTIONS.fuelTypes} error={errors.fuelType?.message} {...register('fuelType')} />
            <Input label="Seats" type="number" min="2" max="10" required error={errors.seats?.message} {...register('seats')} />
            <Input label="Price per day (INR)" type="number" min="1" required error={errors.pricePerDay?.message} {...register('pricePerDay')} />
            {editing && (
              <Select
                label="Availability"
                options={[
                  { value: 'available', label: 'Available' },
                  { value: 'unavailable', label: 'Unavailable' },
                ]}
                error={errors.availabilityStatus?.message}
                {...register('availabilityStatus')}
              />
            )}
          </div>
          <div className="mt-5">
            <Textarea
              label="Description"
              required
              rows={6}
              supportingText="Describe the car’s condition, comfort, and practical features. Do not include contact details."
              error={errors.description?.message}
              {...register('description')}
            />
          </div>
        </section>

        <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <ListingImageUploader images={images} onChange={setImages} error={imageError} />
        </section>

        <div className="rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface-subtle)] px-4 py-3 text-sm text-[var(--text-secondary)]">
          By submitting, you confirm these listing details are accurate. Approval, booking requests, payments, and contact exchange are separate product steps.
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={() => navigate('/my-listings')}>Cancel</Button>
          <Button type="submit" loading={submitting} loadingLabel="Saving listing">
            {editing ? 'Save listing' : 'Submit for review'}
          </Button>
        </div>
      </form>
    </div>
  );
}
