import imageCompression from 'browser-image-compression';

export interface CompressedImageResult {
  compressedFile: File;
  dataUrl: string;
}

export const compressImage = async (
  file: File,
  maxSizeKB: number = 200,
  maxWidthOrHeight: number = 150
): Promise<CompressedImageResult> => {
  try {
    // Compression options
    const options = {
      maxSizeMB: maxSizeKB / 1024, // Convert KB to MB
      maxWidthOrHeight,
      useWebWorker: true,
    };

    // Compress the image file
    const compressedFile = await imageCompression(file, options);
    
    // Convert to data URL for preview
    const dataUrl = await imageCompression.getDataUrlFromFile(compressedFile);
    
    console.log('Original file size:', file.size / 1024, 'KB');
    console.log('Compressed file size:', compressedFile.size / 1024, 'KB');
    
    return {
      compressedFile,
      dataUrl
    };
  } catch (error) {
    console.error('Error compressing image:', error);
    throw new Error('Failed to compress image');
  }
};

// Utility to compress profile photos - 150x150 pixels max
export const compressProfilePhoto = async (file: File): Promise<CompressedImageResult> => {
  // Use 10MB limit for profile photo
  return compressImage(file, 10240, 150);
};

// Utility to compress project logos - 100x100 pixels max
export const compressProjectLogo = async (file: File): Promise<CompressedImageResult> => {
  // Use 10MB limit for project logo
  return compressImage(file, 10240, 100);
};

// Convert a base64 string to a File object
export const dataUrlToFile = async (
  dataUrl: string, 
  fileName: string,
  type: string = 'image/jpeg'
): Promise<File> => {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], fileName, { type });
};

/**
 * Compresses an image file and returns it as a base64 string.
 * Reuses the core compressImage logic.
 * @param file - The image file to compress
 * @param maxSizeKB - Optional max size in KB (defaults to compressImage default)
 * @param maxWidthOrHeight - Optional max width/height (defaults to compressImage default)
 * @returns Promise with the compressed image as base64 data URL string
 */
export const compressImageToBase64 = async (
  file: File,
  maxSizeKB?: number,
  maxWidthOrHeight?: number
): Promise<string> => {
  const { dataUrl } = await compressImage(file, maxSizeKB, maxWidthOrHeight);
  return dataUrl;
};
