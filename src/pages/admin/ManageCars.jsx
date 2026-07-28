import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { HiPlus, HiMagnifyingGlass, HiPencilSquare, HiTrash, HiTruck } from 'react-icons/hi2';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { getCars, deleteCar } from '@/firebase/cars';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Pagination from '@/components/ui/Pagination';
import { formatPrice } from '@/utils/helpers';
import useDebounce from '@/hooks/useDebounce';

export default function ManageCars() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [filter, setFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  
  const itemsPerPage = 10;

  const { data: cars = [], isLoading } = useQuery({
    queryKey: ['admin-cars'],
    queryFn: getCars,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCar,
    onSuccess: () => {
      toast.success('Car deleted successfully');
      queryClient.invalidateQueries(['admin-cars']);
      setDeleteId(null);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete car');
      setDeleteId(null);
    }
  });

  const filteredCars = cars.filter(car => {
    const matchesSearch = (car.brand + ' ' + car.model).toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesFilter = filter === 'All' 
      ? true 
      : filter === 'Available' ? car.available : !car.available;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const paginatedCars = filteredCars.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Cars</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Add, edit, or remove cars from your fleet.</p>
        </div>
        <Link to="/admin/cars/new">
          <Button className="flex items-center gap-2">
            <HiPlus className="w-5 h-5" />
            Add New Car
          </Button>
        </Link>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative max-w-md w-full">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
              placeholder="Search by brand or model..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {['All', 'Available', 'Unavailable'].map((f) => (
              <button
                key={f}
                onClick={() => { setFilter(f); setPage(1); }}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === f 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4 text-gray-400">
              <HiTruck className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No cars found</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Car</th>
                  <th className="px-6 py-4 font-medium">Year</th>
                  <th className="px-6 py-4 font-medium">Price/Day</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Rating</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {paginatedCars.map((car, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={car.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 flex items-center gap-4">
                      <img 
                        src={car.images?.[0] || 'https://via.placeholder.com/150'} 
                        alt={car.model} 
                        className="w-16 h-12 rounded-lg object-cover bg-gray-100"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{car.brand} {car.model}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{car.transmission} • {car.fuel}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{car.year}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{formatPrice(car.pricePerDay)}</td>
                    <td className="px-6 py-4">
                      <Badge variant={car.available ? 'success' : 'default'}>
                        {car.available ? 'Available' : 'Unavailable'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      ★ {car.rating || 'N/A'} ({car.reviewsCount || 0})
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/cars/edit/${car.id}`}>
                          <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                            <HiPencilSquare className="w-5 h-5" />
                          </button>
                        </Link>
                        <button 
                          onClick={() => setDeleteId(car.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        >
                          <HiTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination 
              currentPage={page} 
              totalPages={totalPages} 
              onPageChange={setPage} 
            />
          </div>
        )}
      </Card>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Car"
        description="Are you sure you want to delete this car? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
