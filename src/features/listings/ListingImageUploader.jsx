import { useEffect, useRef, useState } from 'react';
import { HiArrowUpTray, HiPhoto, HiTrash } from 'react-icons/hi2';
import Button from '@/components/ui/Button';

const WIDGET_SCRIPT = 'https://upload-widget.cloudinary.com/global/all.js';
let widgetScriptPromise;

function loadCloudinaryWidget() {
  if (window.cloudinary?.createUploadWidget) return Promise.resolve(window.cloudinary);
  if (widgetScriptPromise) return widgetScriptPromise;

  widgetScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${WIDGET_SCRIPT}"]`);
    const script = existing || document.createElement('script');
    const handleLoad = () => resolve(window.cloudinary);
    const handleError = () => reject(new Error('Cloudinary upload tools could not be loaded.'));

    script.addEventListener('load', handleLoad, { once: true });
    script.addEventListener('error', handleError, { once: true });
    if (!existing) {
      script.src = WIDGET_SCRIPT;
      script.async = true;
      document.head.appendChild(script);
    }
  });

  return widgetScriptPromise;
}

export default function ListingImageUploader({ images, onChange, error }) {
  const widgetRef = useRef(null);
  const [uploadState, setUploadState] = useState('idle');
  const [message, setMessage] = useState('');

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const configurationReady = Boolean(cloudName && uploadPreset);
  const remaining = 4 - images.length;

  useEffect(() => () => widgetRef.current?.destroy?.(), []);

  const openWidget = async () => {
    if (!configurationReady || remaining <= 0) return;
    setUploadState('loading');
    setMessage('Opening secure image uploader…');

    try {
      const cloudinary = await loadCloudinaryWidget();
      widgetRef.current?.destroy?.();
      widgetRef.current = cloudinary.createUploadWidget(
        {
          cloudName,
          uploadPreset,
          sources: ['local'],
          multiple: true,
          maxFiles: remaining,
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
          maxFileSize: 5_000_000,
          showAdvancedOptions: false,
          cropping: false,
          showUploadMoreButton: false,
          text: {
            en: {
              local: { browse: 'Choose vehicle images' },
            },
          },
        },
        (widgetError, result) => {
          if (widgetError) {
            setUploadState('error');
            setMessage(widgetError.message || 'An image could not be uploaded.');
            return;
          }

          if (result.event === 'queues-start') {
            setUploadState('uploading');
            setMessage('Uploading images…');
          }

          if (result.event === 'success') {
            const info = result.info;
            const uploaded = {
              url: info.secure_url,
              publicId: info.public_id,
              assetId: info.asset_id,
              width: info.width,
              height: info.height,
              format: info.format,
            };
            onChange((current) => {
              if (current.some((image) => image.assetId === uploaded.assetId || image.publicId === uploaded.publicId)) {
                return current;
              }
              return [...current, uploaded].slice(0, 4);
            });
            setUploadState('success');
            setMessage('Image uploaded successfully.');
          }

          if (result.event === 'queues-end') {
            setUploadState('success');
            setMessage('Image upload complete.');
          }
        }
      );
      widgetRef.current.open();
    } catch (loadError) {
      setUploadState('error');
      setMessage(loadError.message);
    }
  };

  const removeImage = (imageId) => {
    onChange((current) => current.filter((image) => (image.assetId || image.publicId) !== imageId));
    setMessage('Image removed from this form. The uploaded Cloudinary asset was not deleted.');
    setUploadState('idle');
  };

  return (
    <section aria-labelledby="vehicle-images-title">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="vehicle-images-title" className="font-heading text-lg font-semibold">Vehicle images</h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">Upload 1–4 JPG, PNG, or WebP images, up to 5 MB each.</p>
        </div>
        <Button
          type="button"
          variant="secondary"
          icon={HiArrowUpTray}
          onClick={openWidget}
          disabled={!configurationReady || remaining <= 0 || uploadState === 'loading'}
        >
          {remaining > 0 ? `Upload images (${remaining} left)` : 'Maximum reached'}
        </Button>
      </div>

      {!configurationReady && (
        <p className="mt-4 rounded-[var(--radius-control)] border border-[var(--danger)] bg-[var(--danger-subtle)] px-4 py-3 text-sm text-[var(--danger)]" role="alert">
          Image uploads are not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET, then restart the development server.
        </p>
      )}
      {message && configurationReady && (
        <p
          className={`mt-4 text-sm ${uploadState === 'error' ? 'text-[var(--danger)]' : 'text-[var(--text-secondary)]'}`}
          role={uploadState === 'error' ? 'alert' : 'status'}
        >
          {message}
        </p>
      )}
      {error && <p className="mt-3 text-sm text-[var(--danger)]" role="alert">{error}</p>}

      {images.length === 0 ? (
        <div className="mt-5 flex min-h-40 flex-col items-center justify-center rounded-[var(--radius-card)] border border-dashed border-[var(--border-strong)] bg-[var(--surface-subtle)] p-6 text-center">
          <HiPhoto className="h-8 w-8 text-[var(--text-tertiary)]" aria-hidden="true" />
          <p className="mt-3 text-sm font-medium">No vehicle images uploaded</p>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">The first image becomes the catalogue cover.</p>
        </div>
      ) : (
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {images.map((image, index) => (
            <li key={image.assetId || image.publicId} className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)]">
              <img
                src={image.url}
                alt={`Vehicle listing preview ${index + 1}`}
                width={image.width || 800}
                height={image.height || 500}
                className="aspect-[16/10] w-full object-cover"
              />
              <div className="flex items-center justify-between gap-3 p-3">
                <span className="text-xs text-[var(--text-secondary)]">{index === 0 ? 'Cover image' : `Image ${index + 1}`}</span>
                <Button type="button" variant="ghost" size="sm" icon={HiTrash} onClick={() => removeImage(image.assetId || image.publicId)}>
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
