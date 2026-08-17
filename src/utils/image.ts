/**
 * Helper to dynamically optimize Cloudinary image URLs with on-the-fly transformations.
 * Adds automatic format (f_auto), automatic quality compression (q_auto),
 * and width/crop constraints.
 */
export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'limit' | 'fit' | 'thumb';
  quality?: 'auto' | 'auto:good' | 'auto:eco' | number | string;
}

export function optimizeCloudinaryUrl(
  url?: string | null,
  options: CloudinaryTransformOptions = { width: 360, crop: 'limit', quality: 'auto:good' },
): string {
  if (!url) return '';
  if (!url.includes('res.cloudinary.com') || !url.includes('/image/upload/')) {
    return url;
  }

  // Check if transformations are already present
  const uploadIndex = url.indexOf('/image/upload/');
  if (uploadIndex === -1) return url;

  const prefix = url.substring(0, uploadIndex + '/image/upload/'.length);
  const rest = url.substring(uploadIndex + '/image/upload/'.length);

  // Build transformation params
  const quality = options.quality ?? 'auto:good';
  const transforms: string[] = ['f_auto', `q_${quality}`];
  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);
  if (options.crop) transforms.push(`c_${options.crop}`);

  const transformString = transforms.join(',');

  // Avoid duplicate injection
  if (rest.startsWith('f_auto') || rest.startsWith('w_') || rest.startsWith('c_')) {
    return url;
  }

  return `${prefix}${transformString}/${rest}`;
}
