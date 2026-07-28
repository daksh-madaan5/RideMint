import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await login(data.email, data.password);
      toast.success('Successfully logged in!');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      await loginWithGoogle();
      toast.success('Successfully logged in with Google!');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message || 'Failed to login with Google');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-surface-50 dark:bg-surface-950">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-surface-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-900 via-surface-950 to-black opacity-90" />
        <div className="relative z-10 flex flex-col justify-center px-16 text-white max-w-xl">
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-heading font-bold mb-4 tracking-tight leading-tight"
          >
            Welcome back to RideMint
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-surface-400 leading-relaxed"
          >
            Access your premium fleet account and get behind the wheel of world-class supercars.
          </motion.p>
        </div>
      </div>

      {/* Right Form Container */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 py-12">
        <motion.div 
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          className="mx-auto w-full max-w-sm lg:max-w-md bg-white dark:bg-surface-900 rounded-3xl shadow-card p-8 border border-surface-200 dark:border-surface-800"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-surface-900 dark:text-surface-50 tracking-tight">Sign In</h2>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Please enter your credentials below.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
            
            <div className="space-y-1">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />
              <div className="flex justify-end pt-1">
                <Link to="/forgot-password" className="text-xs font-medium text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100 transition-colors">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              Sign In
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-surface-200 dark:border-surface-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wider">
                <span className="px-3 bg-white dark:bg-surface-900 text-surface-400">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                variant="secondary"
                className="w-full flex items-center justify-center gap-3"
                onClick={handleGoogleLogin}
                loading={googleLoading}
              >
                <FcGoogle className="h-5 w-5" />
                <span>Google</span>
              </Button>
            </div>
          </div>

          <p className="mt-8 text-center text-xs sm:text-sm text-surface-500 dark:text-surface-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-surface-900 dark:text-surface-100 underline hover:opacity-80">
              Create Account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
