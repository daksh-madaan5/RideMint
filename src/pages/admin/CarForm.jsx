import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { HiArrowLeft, HiPlus, HiXMark } from 'react-icons/hi2';

import { getCarById, createCar, updateCar } from '@/firebase/cars';
import { FUEL_TYPES, TRANSMISSION_TYPES, SUPPORTED_LOCATIONS } from '@/constants';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';

const currentYear = new Date().getFullYear();

const carSchema = z.object({
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number({ invalid_type_error: 'Year must be a number' })
         .min(1990, 'Year must be at least 1990')
         .max(currentYear + 1, `Year cannot exceed ${currentYear + 1}`),
  fuel: z.string().min(1, 'Fuel type is required'),
  transmission: z.string().min(1, 'Transmission is required'),
  pricePerDay: z.number({ invalid_type_error: 'Price must be a number' })
                .min(1, 'Price must be greater than 0'),
  seats: z.number({ invalid_type_error: 'Seats must be a number' })
          .min(1, 'Must have at least 1 seat')
          .max(12, 'Cannot exceed 12 seats'),
  location: z.string().min(1, 'Location is required'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  available: z.boolean().default(true),
});

export default function CarForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const [features, setFeatures] = useState([]);
  const [featureInput, setFeatureInput] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  const [imageUrlInput, setImageUrlInput] = useState('');

  const { data: carData, isLoading: isLoadingCar } = useQuery({
    queryKey: ['admin-car', id],
    queryFn: () => getCarById(id),
    enabled: isEditMode,
  });

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: zodResolver(carSchema),
    defaultValues: {
      available: true,
    }
  });

  useEffect(() => {
    if (carData && isEditMode) {
      reset({
        brand: carData.brand,
        model: carData.model,
        year: carData.year,
        fuel: carData.fuel,
        transmission: carData.transmission,
        pricePerDay: carData.pricePerDay,
        seats: carData.seats,
        location: carData.location,
        description: carData.description,
        available: carData.available,
      });
      setFeatures(carData.features || []);
      setImageUrls(carData.images || carData.gallery || []);
    }
  }, [carData, isEditMode, reset]);

  const addFeature = () => {
    if (featureInput.trim() && !features.includes(featureInput.trim())) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const removeFeature = (feat) => {
    setFeatures(features.filter(f => f !== feat));
  };

  const addImageUrl = () => {
    if (imageUrlInput.trim() && !imageUrls.includes(imageUrlInput.trim())) {
      setImageUrls([...imageUrls, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const removeImageUrl = (urlToRemove) => {
    setImageUrls(imageUrls.filter(url => url !== urlToRemove));
  };

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const carPayload = {
        ...data,
        features,
        images: imageUrls,
        gallery: imageUrls, // Store in both places to be safe with existing UI components
      };

      if (isEditMode) {
        return updateCar(id, carPayload);
      } else {
        return createCar(carPayload);
      }
    },
    onSuccess: () => {
      toast.success(isEditMode ? 'Car updated successfully' : 'Car created successfully');
      queryClient.invalidateQueries(['admin-cars']);
      navigate('/admin/cars');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to save car');
    }
  });

  const onSubmit = (data) => {
    if (imageUrls.length === 0) {
      toast.error('Please provide at least one image URL');
      return;
    }
    saveMutation.mutate(data);
  };

  if (isLoadingCar) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/cars" className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
          <HiArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEditMode ? 'Edit Car' : 'Add New Car'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {isEditMode ? 'Update the details of this vehicle.' : 'Add a new vehicle to your fleet.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">General Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input label="Brand" placeholder="e.g. BMW" error={errors.brand?.message} {...register('brand')} />
                </div>
                <div>
                  <Input label="Model" placeholder="e.g. M4 Competition" error={errors.model?.message} {...register('model')} />
                </div>
                <div>
                  <Input label="Year" type="number" placeholder="e.g. 2023" error={errors.year?.message} {...register('year', { valueAsNumber: true })} />
                </div>
                <div>
                  <Select label="Fuel Type" error={errors.fuel?.message} {...register('fuel')}>
                    <option value="">Select Fuel Type</option>
                    {FUEL_TYPES.map(ft => <option key={ft} value={ft}>{ft}</option>)}
                  </Select>
                </div>
                <div>
                  <Select label="Transmission" error={errors.transmission?.message} {...register('transmission')}>
                    <option value="">Select Transmission</option>
                    {TRANSMISSION_TYPES.map(tt => <option key={tt} value={tt}>{tt}</option>)}
                  </Select>
                </div>
                <div>
                  <Input label="Seats" type="number" placeholder="e.g. 4" error={errors.seats?.message} {...register('seats', { valueAsNumber: true })} />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  className={`w-full rounded-lg border ${errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white`}
                  rows={4}
                  placeholder="Describe the car..."
                  {...register('description')}
                />
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Pricing & Location</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input label="Price Per Day (₹)" type="number" placeholder="e.g. 3200" error={errors.pricePerDay?.message} {...register('pricePerDay', { valueAsNumber: true })} />
                </div>
                <div>
                  <Select label="Location" error={errors.location?.message} options={SUPPORTED_LOCATIONS} placeholder="Select a city" {...register('location')} />
                </div>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="available"
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  {...register('available')}
                />
                <label htmlFor="available" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Car is available for rent
                </label>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Features</h2>
              <div className="flex gap-2">
                <Input 
                  placeholder="e.g. Apple CarPlay" 
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addFeature();
                    }
                  }}
                  className="flex-1"
                />
                <Button type="button" onClick={addFeature} variant="secondary">
                  <HiPlus className="w-5 h-5 mr-1" /> Add
                </Button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-1 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1 rounded-full text-sm">
                    {feat}
                    <button type="button" onClick={() => removeFeature(feat)} className="hover:text-blue-900 dark:hover:text-blue-100 ml-1">
                      <HiXMark className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Images (URLs)</h2>
              <p className="text-sm text-gray-500 mb-4">Provide valid image URLs (e.g. from Unsplash). The first image will be used as the thumbnail.</p>
              
              <div className="flex gap-2 mb-4">
                <Input 
                  placeholder="https://..." 
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addImageUrl();
                    }
                  }}
                  className="flex-1"
                />
                <Button type="button" onClick={addImageUrl} variant="secondary">
                  Add
                </Button>
              </div>

              {imageUrls.length > 0 && (
                <div className="space-y-3 mt-4">
                  <div className="grid grid-cols-2 gap-3">
                    {imageUrls.map((url, idx) => (
                      <div key={`img-${idx}`} className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        <img src={url} alt={`Car ${idx}`} className="w-full h-24 object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImageUrl(url)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <HiXMark className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            <Button 
              type="submit" 
              className="w-full py-3" 
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? (
                <span className="flex items-center gap-2"><Spinner size="sm" color="white" /> Saving...</span>
              ) : (
                isEditMode ? 'Update Car' : 'Create Car'
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
