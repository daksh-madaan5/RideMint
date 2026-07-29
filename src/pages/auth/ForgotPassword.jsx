import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { HiOutlineArrowLeft, HiOutlineCheckCircle } from 'react-icons/hi2';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await resetPassword(data.email);
      setIsSent(true);
    } catch (error) {
      toast.error(error.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-[var(--background)] px-4 py-12 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--surface)] px-4 py-8 shadow-[var(--shadow-card)] sm:px-10">
          
          {isSent ? (
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--success-subtle)]">
                <HiOutlineCheckCircle className="h-6 w-6 text-[var(--success)]" />
              </div>
              <h2 className="mt-4 text-2xl font-bold text-[var(--text-primary)]">Check your email</h2>
              <p className="mb-6 mt-2 text-sm text-[var(--text-secondary)]">
                We've sent password reset instructions to your email address.
              </p>
              <Button as={Link} to="/login" className="w-full flex justify-center">
                Return to Login
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">Reset password</h2>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  label="Email address"
                  type="email"
                  placeholder="name@example.com"
                  error={errors.email?.message}
                  {...register('email')}
                />

                <Button type="submit" className="w-full" isLoading={loading}>
                  Send Reset Link
                </Button>
              </form>
            </>
          )}

          {!isSent && (
            <div className="mt-6 flex items-center justify-center">
              <Link to="/login" className="focus-ring flex items-center rounded text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)]">
                <HiOutlineArrowLeft className="h-4 w-4 mr-2" />
                Back to sign in
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
