import imageCompression from 'browser-image-compression'

interface CompressImageOptions {
  maxSizeMB?: number
  maxWidthOrHeight?: number
}

/**
 * Compresses an image file and returns it as a base64 string
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns Promise with the compressed image as base64 string
 */
export async function compressImageToBase64(
  file: File,
  options: CompressImageOptions = {}
): Promise<string> {
  try {
    // Default options: 200KB max size, 150x150 max dimensions
    const defaultOptions = {
      maxSizeMB: 0.2, // 200KB
      maxWidthOrHeight: 150,
      useWebWorker: true,
    }
    
    const mergedOptions = { ...defaultOptions, ...options }
    
    // Compress the image
    const compressedFile = await imageCompression(file, mergedOptions)
    
    // Convert to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(compressedFile)
      reader.onloadend = () => {
        const base64data = reader.result as string
        resolve(base64data)
      }
      reader.onerror = () => {
        reject(new Error('Failed to convert image to base64'))
      }
    })
  } catch (error) {
    console.error('Error compressing image:', error)
    throw error
  }
}