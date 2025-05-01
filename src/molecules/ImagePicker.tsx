import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { compressProjectLogo } from '../services/imageCompression';

interface ImagePickerProps {
  onSelect: (imageData: string) => void;
  onClose: () => void;
}

const ImagePicker: React.FC<ImagePickerProps> = ({ onSelect, onClose }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        // Check file size before compression (max 1MB)
        if (file.size > 1024 * 1024) {
          setError(t('imageTooLarge'));
          setIsLoading(false);
          return;
        }
        
        // Compress the image using our service
        const result = await compressProjectLogo(file);
        onSelect(result.dataUrl);
        onClose();
      } catch (error) {
        console.error('Error processing image:', error);
        setError(t('imageProcessingError'));
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle camera capture
  const handleCapture = () => {
    if (fileInputRef.current) {
      // Set accept attribute to capture with camera when available
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
      // Reset after click to allow normal file selection next time
      setTimeout(() => {
        if (fileInputRef.current) {
          fileInputRef.current.removeAttribute('capture');
        }
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-overlay flex flex-col items-center justify-end animate-fade-in">
      <div className="bg-white w-full rounded-t-xl max-w-md animate-slide-up">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">{t('selectLogo')}</h2>
        </div>

        <div className="p-4 flex flex-col space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
              <span className="ml-2 text-purple-700">{t('processingImage')}</span>
            </div>
          ) : error ? (
            <div className="text-red-500 mb-4 text-center">{error}</div>
          ) : null}
          
          <button
            type="button"
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
            onClick={(e) => {
              e.preventDefault();
              fileInputRef.current?.click();
            }}
            disabled={isLoading}
          >
            {t('projectUploadPhoto')}
          </button>
          <button
            type="button"
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
            onClick={(e) => {
              e.preventDefault();
              handleCapture();
            }}
            disabled={isLoading}
          >
            {t('projectTakePhoto')}
          </button>
          <button
            type="button"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
            disabled={isLoading}
          >
            {t('cancel')}
          </button>
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
        />
      </div>
    </div>
  );
};

export default ImagePicker;
