import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ToastViewport() {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={3500}
      newestOnTop
      closeOnClick
      pauseOnFocusLoss
      pauseOnHover
      theme="light"
      toastClassName="!rounded-[var(--radius-card)] !border !border-[var(--border)] !bg-[var(--surface)] !text-[var(--text-primary)] !shadow-[var(--shadow-raised)]"
    />
  );
}
