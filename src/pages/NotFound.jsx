import { Link } from 'react-router';
import { motion } from 'motion/react';
import Button from '@/components/ui/Button';
import { HiOutlineArrowRight } from 'react-icons/hi2';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">
          404
        </h1>
        <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
          Page Not Found
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button as={Link} to="/" variant="outline" className="w-full sm:w-auto">
            Go Home
          </Button>
          <Button as={Link} to="/cars" className="w-full sm:w-auto group">
            Browse Cars
            <HiOutlineArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
