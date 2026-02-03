//@ts-nocheck
import { config } from '@/config';
export const getImageUrl = (imageUrl: string) => {
  if (!imageUrl) return null;

  // If URL is already absolute, return as is
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }

  // If URL starts with /, prepend base URL
  if (imageUrl.startsWith('/')) {
    return `${config.API_BASE_URL}${imageUrl}`;
  }

  // Otherwise, construct full path
  return `${config.API_BASE_URL}/${imageUrl}`;
};
