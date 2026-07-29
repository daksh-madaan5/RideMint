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
    <div className="flex min-h-screen bg-[var(--background)]">
      {/* Left Branding Panel */}
      <div data-dark-surface className="relative hidden overflow-hidden bg-[var(--dark-surface)] lg:flex lg:w-1/2">
        <div className="relative z-10 flex max-w-xl flex-col justify-center px-16">
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 font-heading text-4xl font-bold leading-tight tracking-tight text-[var(--dark-text-primary)] lg:text-5xl"
          >
            Welcome back to RideMint
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg leading-relaxed text-[var(--dark-text-secondary)]"
          >
            Manage your listings, booking requests, and upcoming rentals in one place.
          </motion.p>
        </div>
      </div>

      {/* Right Form Container */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 py-12">
        <motion.div 
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          className="mx-auto w-full max-w-sm rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow-card)] lg:max-w-md"
        >
          <div className="text-center mb-8">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">Sign in</h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">Enter your account details to continue.</p>
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
                <Link to="/forgot-password" className="focus-ring rounded text-xs font-semibold text-[var(--primary)] underline-offset-4 transition-colors hover:text-[var(--primary-hover)] hover:underline">
                  Forgot password?
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
                <div className="w-full border-t border-[var(--border)]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wider">
                <span className="bg-[var(--surface)] px-3 text-[var(--text-tertiary)]">Or continue with</span>
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

          <p className="mt-8 text-center text-xs text-[var(--text-secondary)] sm:text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="focus-ring rounded font-semibold text-[var(--primary)] underline underline-offset-4 hover:text-[var(--primary-hover)]">
              Create account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
