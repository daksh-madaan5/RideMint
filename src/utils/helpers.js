import { clsx } from 'clsx';
import { differenceInDays } from 'date-fns';

export const DEFAULT_CAR_IMAGE = '/images/cars/vehicle-placeholder.svg';

export const getCarImages = (car) => {
  if (!car) return [DEFAULT_CAR_IMAGE];
  if (Array.isArray(car.images) && car.images.length > 0) return car.images.filter(Boolean);
  if (Array.isArray(car.gallery) && car.gallery.length > 0) return car.gallery.filter(Boolean);
  if (car.image) return [car.image];
  if (car.imageUrl) return [car.imageUrl];
  return [DEFAULT_CAR_IMAGE];
};

export const getCarImage = (car) => {
  const images = getCarImages(car);
  return images[0] || DEFAULT_CAR_IMAGE;
};

export const getCarFuel = (car) => {
  if (!car) return 'Petrol';
  return car.fuelType || car.fuel || 'Petrol';
};

export const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date) => {
  if (!date) return '';
  const parsedDate = typeof date.toDate === 'function' ? date.toDate() : new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return '';
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(parsedDate);
};

export const calculateRentalDays = (pickupDate, returnDate) => {
  if (!pickupDate || !returnDate) return 0;
  return Math.max(1, differenceInDays(new Date(returnDate), new Date(pickupDate)));
};

export const calculateTotalPrice = (pricePerDay, days) => {
  return pricePerDay * days;
};

export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

export const getInitials = (name) => {
  if (!name) return '';
  const parts = name.split(' ');
  const initials = parts.map(p => p[0]).join('');
  return initials.slice(0, 2).toUpperCase();
};

export const cn = (...classes) => {
  return clsx(...classes);
};

export const generateId = () => {
  return Math.random().toString(36).substring(2, 9);
};

export const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};
