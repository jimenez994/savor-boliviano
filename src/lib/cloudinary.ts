import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function getCloudinaryUrl(publicId: string, options?: { width?: number; height?: number }) {
  const transformations: string[] = [];

  if (options?.width) transformations.push(`w_${options.width}`);
  if (options?.height) transformations.push(`h_${options.height}`);
  if (transformations.length > 0) transformations.push('c_fill');

  const transformation = transformations.length > 0 ? transformations.join(',') + '/' : '';

  return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${transformation}${publicId}`;
}

export default cloudinary;
