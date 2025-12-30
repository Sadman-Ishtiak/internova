// User Roles
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

// Job Types
export const JOB_TYPES = {
  JOB: 'job',
  INTERNSHIP: 'internship',
} as const;

export type JobType = typeof JOB_TYPES[keyof typeof JOB_TYPES];

// Salary Periods
export const SALARY_PERIODS = {
  ANNUALLY: 'annually',
  MONTHLY: 'monthly',
  HOURLY: 'hourly',
} as const;

export type SalaryPeriod = typeof SALARY_PERIODS[keyof typeof SALARY_PERIODS];

// Currency Options
export const CURRENCIES = [
  'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'INR', 'AED'
] as const;

export type Currency = typeof CURRENCIES[number];

// Company Industries
export const INDUSTRIES = [
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'Marketing',
  'Service',
  'Other'
] as const;

export type Industry = typeof INDUSTRIES[number];

// Company Status
export const COMPANY_STATUSES = {
  ACTIVE: 'active',
  SUNSET: 'sunset',
} as const;

export type CompanyStatus = typeof COMPANY_STATUSES[keyof typeof COMPANY_STATUSES];

// File Upload Constants
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
} as const;

// API Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// OTP Configuration
export const OTP_CONFIG = {
  EXPIRY_MINUTES: 10,
  LENGTH: 6,
  MAX_REQUESTS_PER_WINDOW: 3,
  RATE_LIMIT_WINDOW_MINUTES: 15,
} as const;

// Regex Patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  PHONE: /^\+?[\d\s\-()]{10,}$/,
} as const;
