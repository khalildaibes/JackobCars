/**
 * Video utility functions for validation and processing
 */

export interface VideoValidationResult {
  isValid: boolean;
  duration?: number;
  error?: string;
}

/**
 * Validates video file format and duration
 * @param file - The video file to validate
 * @param maxDurationSeconds - Maximum allowed duration in seconds
 * @returns Promise<VideoValidationResult>
 */
export const validateVideo = async (
  file: File, 
  maxDurationSeconds: number = 15
): Promise<VideoValidationResult> => {
  // Check file type
  const validVideoTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/quicktime'];
  if (!validVideoTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid video format. Please upload MP4, MOV, or AVI files.'
    };
  }

  // Check file size (max 100MB)
  const maxSizeBytes = 100 * 1024 * 1024; // 100MB
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: 'Video file is too large. Maximum size is 100MB.'
    };
  }

  try {
    // Create video element to check duration
    const video = document.createElement('video');
    const url = URL.createObjectURL(file);
    
    return new Promise((resolve) => {
      video.onloadedmetadata = () => {
        const duration = video.duration;
        URL.revokeObjectURL(url);
        
        if (duration > maxDurationSeconds) {
          resolve({
            isValid: false,
            duration,
            error: `Video duration (${duration.toFixed(1)}s) exceeds maximum allowed duration (${maxDurationSeconds}s)`
          });
        } else {
          resolve({
            isValid: true,
            duration
          });
        }
      };
      
      video.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({
          isValid: false,
          error: 'Failed to read video file. Please try again.'
        });
      };
      
      video.src = url;
    });
  } catch (error) {
    return {
      isValid: false,
      error: 'Error validating video file. Please try again.'
    };
  }
};

/**
 * Formats duration in seconds to MM:SS format
 * @param seconds - Duration in seconds
 * @returns Formatted duration string
 */
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Gets video file extension from MIME type
 * @param mimeType - Video MIME type
 * @returns File extension
 */
export const getVideoExtension = (mimeType: string): string => {
  const extensions: { [key: string]: string } = {
    'video/mp4': 'mp4',
    'video/mov': 'mov',
    'video/avi': 'avi',
    'video/quicktime': 'mov'
  };
  return extensions[mimeType] || 'mp4';
};
