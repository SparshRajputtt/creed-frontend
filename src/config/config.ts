//@ts-nocheck
// export const config = {
//   companyName: "Creed",

//   api: "http://localhost:3000/api",

//   API_BASE_URL: "http://localhost:3000",
// };

export const config = {
  API_BASE_URL: 'https://creedhomewares.in',
  api: 'https://creedhomewares.in/api',

  // api: 'http://localhost:3000/api',

  // API_BASE_URL: 'http://localhost:3000',

  RAZORPAY_KEY_ID: 'rzp_test_1234567890',
  APP_NAME: 'Creed Store',
  APP_VERSION: '1.0.0',
  ENVIRONMENT: 'development',

  // Feature flags
  FEATURES: {
    PAYMENT_RAZORPAY: true,
    PAYMENT_COD: true,
    WISHLIST: true,
    REVIEWS: true,
    ANALYTICS: true,
  },

  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 12,
    MAX_PAGE_SIZE: 100,
  },

  // File upload limits
  UPLOAD: {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  },
};
