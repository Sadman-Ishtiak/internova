// Type definitions for the Job Portal application

// User types
export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  profileImage?: string;
  role: 'admin' | 'user';
  isBanned: boolean;
  companyId?: string;
  skills?: string[];
  experience?: string;
  certifications?: string[];
  title?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Company types
export interface ICompany {
  _id: string;
  name: string;
  description: string;
  imageUrl?: string;
  status: 'active' | 'sunset';
  industry: string;
  contact?: {
    website?: string;
    linkedin?: string;
    email?: string;
    phone?: string;
    location?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

// Salary types
export interface ISalary {
  min?: number;
  max?: number;
  currency?: string;
  period?: 'annually' | 'monthly' | 'hourly';
}

// Applicant types
export interface IApplicant {
  userId: IUser | string;
  appliedAt?: Date;
  matchScore?: number;
}

// Job types
export interface IJob {
  _id: string;
  companyId: ICompany | string;
  title: string;
  type: 'job' | 'internship';
  imageUrl?: string;
  salary?: ISalary;
  requiredSkills: string[];
  deadline: Date;
  applicants: IApplicant[];
  createdAt?: Date;
  updatedAt?: Date;
}

// OTP types
export interface IOtp {
  _id: string;
  email: string;
  otp: string;
  createdAt?: Date;
  expiresAt?: Date;
}

// API Response types
export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination types
export interface PaginationInfo {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationInfo;
}

// Session types
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  companyId?: string;
  image?: string;
}

// Filters/Query types
export interface JobFilter {
  companyId?: string;
  search?: string;
  type?: 'job' | 'internship' | 'all';
  includeExpired?: boolean;
  page?: number;
  limit?: number;
}
