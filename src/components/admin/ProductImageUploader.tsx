'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PhotoIcon,
  XMarkIcon,
  PlusIcon,
  ArrowUpTrayIcon,
  StarIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowPathIcon,
  LinkIcon,
  CheckCircleIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';

export interface ImageItem {
  id: string;
  url: string; // Data URL or remote URL
  fileName?: string;
  fileSize?: string;
  fileType?: string;
}

interface ProductImageUploaderProps {
  images: string[];
  onChange: (urls: string[]) => void;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

function formatBytes(bytes: number, decimals = 1) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export default function ProductImageUploader({ images, onChange }: ProductImageUploaderProps) {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);
  const [showUrlFallback, setShowUrlFallback] = useState(false);
  const [manualUrlInput, setManualUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

  // Helper to trigger backend upload or data URL generation
  const uploadSingleFile = async (file: File): Promise<string> => {
    try {
      const adminToken = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
      if (adminToken) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch(`${backendUrl}/products/upload`, {
          method: 'POST',
          headers: {
            'x-admin-token': adminToken,
          },
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          if (data.url) return data.url;
        }
      }
    } catch {
      // Fall back to data URL
    }

    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) || '');
      reader.readAsDataURL(file);
    });
  };

  const processFiles = async (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter(file => ALLOWED_TYPES.includes(file.type));

    if (validFiles.length === 0) {
      toast.error('Invalid File Type', 'Please upload JPEG or PNG images (.jpg, .jpeg, .png, .webp).');
      return;
    }

    toast.info('Uploading Images...', `Processing ${validFiles.length} file(s).`);

    const uploadedUrls = await Promise.all(validFiles.map(file => uploadSingleFile(file)));
    const successfulUrls = uploadedUrls.filter(u => u.length > 0);

    const updated = [...images.filter(u => u.trim().length > 0), ...successfulUrls];
    onChange(updated);
    toast.success('Image(s) Uploaded', `Successfully added ${successfulUrls.length} image(s).`);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleReplaceFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (replacingIndex === null || !e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Invalid File Type', 'Please upload a JPEG or PNG image.');
      return;
    }

    toast.info('Replacing Image...', 'Uploading selected JPEG/PNG image.');
    const url = await uploadSingleFile(file);
    if (url) {
      const copy = [...images];
      copy[replacingIndex] = url;
      onChange(copy);
      toast.success('Image Replaced', 'Product image has been updated.');
    }
    e.target.value = '';
    setReplacingIndex(null);
  };

  const removeImage = (index: number) => {
    const copy = images.filter((_, i) => i !== index);
    onChange(copy);
    toast.info('Image Removed', 'Removed image from product gallery.');
  };

  const setPrimary = (index: number) => {
    if (index === 0) return;
    const copy = [...images];
    const [selected] = copy.splice(index, 1);
    const updated = [selected, ...copy];
    onChange(updated);
    toast.success('Primary Image Set', 'Main cover image updated.');
  };

  const moveImage = (index: number, direction: 'left' | 'right') => {
    const target = direction === 'left' ? index - 1 : index + 1;
    if (target < 0 || target >= images.length) return;
    const copy = [...images];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    onChange(copy);
  };

  const addManualUrl = () => {
    const url = manualUrlInput.trim();
    if (!url) return;
    onChange([...images.filter(u => u.trim().length > 0), url]);
    setManualUrlInput('');
    toast.success('Image URL Added');
  };

  return (
    <div className="space-y-6">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept="image/png, image/jpeg, image/jpg, image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      <input
        type="file"
        ref={replaceInputRef}
        accept="image/png, image/jpeg, image/jpg, image/webp"
        className="hidden"
        onChange={handleReplaceFileChange}
      />

      {/* Main Drag & Drop Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFiles(e.dataTransfer.files);
          }
        }}
        className={cn(
          'relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 group',
          isDragging
            ? 'border-orange-500 bg-orange-100/50 scale-[1.01]'
            : 'border-orange-200 hover:border-orange-500 bg-gradient-to-b from-orange-50/50 to-white hover:bg-orange-50/80 shadow-sm hover:shadow'
        )}
      >
        <div className="p-4 bg-orange-500/10 text-orange-600 rounded-full group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-200">
          <ArrowUpTrayIcon className="w-8 h-8" />
        </div>
        <div>
          <h4 className="text-base font-bold text-gray-900">
            Click to upload JPEG or PNG images
          </h4>
          <p className="text-sm text-gray-500 mt-1">
            Drag & drop images here or browse files from your computer
          </p>
        </div>

        <div className="flex items-center gap-3 mt-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            PNG (.png)
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            JPEG (.jpeg, .jpg)
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            WEBP (.webp)
          </span>
        </div>
      </div>

      {/* Uploaded Images Grid */}
      {images.length > 0 && images.some(u => u.trim()) ? (
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">
              Product Gallery ({images.filter(u => u.trim()).length} image{images.filter(u => u.trim()).length === 1 ? '' : 's'})
            </span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline"
            >
              <PlusIcon className="w-4 h-4" />
              Upload More PNG/JPEG Files
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {images.map((url, i) => {
                if (!url.trim()) return null;
                const isMain = i === 0;

                return (
                  <motion.div
                    key={`${i}-${url.substring(0, 30)}`}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={cn(
                      'relative group rounded-xl border overflow-hidden bg-white shadow-xs transition-all duration-200 hover:shadow-md flex flex-col justify-between',
                      isMain ? 'border-2 border-orange-500 ring-2 ring-orange-500/20' : 'border-gray-200'
                    )}
                  >
                    {/* Image Preview Container */}
                    <div className="relative aspect-square w-full bg-gray-100 overflow-hidden">
                      <img
                        src={url}
                        alt={`Product Image ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://via.placeholder.com/400x400?text=Invalid+Image';
                        }}
                      />

                      {/* Main / Primary Badge */}
                      {isMain ? (
                        <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                          <StarSolidIcon className="w-3.5 h-3.5 text-yellow-300" />
                          Primary Image
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setPrimary(i)}
                          className="absolute top-2 left-2 bg-black/60 hover:bg-orange-500 text-white text-[11px] font-medium px-2 py-1 rounded-full backdrop-blur-xs transition-colors opacity-90 sm:opacity-0 group-hover:opacity-100 flex items-center gap-1"
                        >
                          <StarIcon className="w-3.5 h-3.5" />
                          Set Primary
                        </button>
                      )}

                      {/* Top Right Quick Delete */}
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-600 text-white rounded-full backdrop-blur-xs transition-colors"
                        title="Remove image"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="p-3 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1">
                        {/* Move Left */}
                        <button
                          type="button"
                          disabled={i === 0}
                          onClick={() => moveImage(i, 'left')}
                          className="p-1.5 text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white rounded-md transition-colors"
                          title="Move Left"
                        >
                          <ArrowLeftIcon className="w-3.5 h-3.5" />
                        </button>

                        {/* Move Right */}
                        <button
                          type="button"
                          disabled={i === images.length - 1}
                          onClick={() => moveImage(i, 'right')}
                          className="p-1.5 text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white rounded-md transition-colors"
                          title="Move Right"
                        >
                          <ArrowRightIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Replace Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setReplacingIndex(i);
                          replaceInputRef.current?.click();
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 transition-all"
                      >
                        <ArrowPathIcon className="w-3.5 h-3.5" />
                        Replace File
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      ) : null}

      {/* Secondary Option: Paste Image URL */}
      <div className="pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={() => setShowUrlFallback(prev => !prev)}
          className="text-xs font-medium text-gray-500 hover:text-orange-600 flex items-center gap-1 transition-colors"
        >
          <LinkIcon className="w-3.5 h-3.5" />
          {showUrlFallback ? 'Hide URL input' : 'Or paste image URL instead'}
        </button>

        <AnimatePresence>
          {showUrlFallback && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 overflow-hidden"
            >
              <div className="flex gap-2">
                <input
                  type="url"
                  value={manualUrlInput}
                  onChange={(e) => setManualUrlInput(e.target.value)}
                  placeholder="https://example.com/image.png"
                  className="flex-1 px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <button
                  type="button"
                  onClick={addManualUrl}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black text-sm font-semibold transition-colors"
                >
                  Add URL
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
