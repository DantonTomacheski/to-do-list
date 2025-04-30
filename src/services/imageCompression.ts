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
export const compressProfilePhoto = (file: File): Promise<CompressedImageResult> => {
  return compressImage(file, 200, 150);
};

// Utility to compress project logos - 100x100 pixels max
export const compressProjectLogo = (file: File): Promise<CompressedImageResult> => {
  return compressImage(file, 200, 100);
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
