# INTERNOVA - Job Portal Platform
## Complete Technical Documentation & Security Audit Report

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Platform Importance & Use Cases](#platform-importance--use-cases)
3. [Technology Stack](#technology-stack)
4. [System Architecture](#system-architecture)
5. [Core Features](#core-features)
6. [API Endpoints Documentation](#api-endpoints-documentation)
7. [Security Measures](#security-measures)
8. [Database Schema](#database-schema)
9. [Security Audit Findings](#security-audit-findings)
10. [Deployment & Maintenance](#deployment--maintenance)

---

## 🎯 Project Overview

### What is Internova?

**Internova** is a comprehensive job and internship portal platform designed to bridge the gap between job seekers and employers. The platform provides a modern, efficient, and secure ecosystem for:

- **Job Seekers**: Find and apply for jobs/internships with AI-powered skill matching
- **Employers**: Post job circulars, manage applications, and identify qualified candidates
- **Administrators**: Oversee the platform, manage users, and maintain platform integrity

**Platform Name**: Internova (Version 0.1.0)
**Type**: Full-Stack Web Application
**Architecture**: Server-Side Rendering (SSR) with API-Based Backend

---

## 💼 Platform Importance & Use Cases

### Why Internova Matters

#### For Job Seekers:
1. **Easy Job Discovery**: Browse and search through active job postings with smart filtering
2. **Skill-Based Matching**: Automatic matching algorithm calculates compatibility score (0-100%)
3. **Professional Profile**: Build comprehensive CV with experience, skills, and certifications
4. **One-Click Applications**: Apply instantly with automatic skill assessment
5. **Transparent Feedback**: See match scores to understand job fit

#### For Employers:
1. **Efficient Hiring**: Post job circulars and reach qualified candidates quickly
2. **Smart Filtering**: Automated skill matching helps identify best candidates
3. **Application Management**: View all applicants sorted by skill match score
4. **CSV Reports**: Automatic generation and email of applicant lists
5. **Multiple Job Types**: Post regular jobs or internships with different requirements

#### For the Platform:
1. **Reduces Hiring Time**: Algorithms filter candidates automatically
2. **Improves Quality of Hires**: Skill matching ensures better job fit
3. **Scalable Infrastructure**: Handles thousands of users and jobs simultaneously
4. **Data Security**: Enterprise-grade security for user information
5. **Automation**: Scheduled jobs clean up expired postings and send reports

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 16.1.1 (React 19.2.3)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x
- **Authentication UI**: NextAuth.js 4.24.13
- **HTTP Client**: Native Fetch API

### Backend
- **Runtime**: Node.js with Next.js API Routes
- **Database**: MongoDB 9.0.2 (Mongoose ODM)
- **Authentication**: NextAuth.js (Google OAuth + Credentials)
- **File Storage**: Cloudinary (Image uploads)
- **Email**: Nodemailer 7.0.12 (Gmail SMTP)
- **Encryption**: bcryptjs 3.0.3

### DevOps & Tools
- **Hosting**: Vercel (Next.js native)
- **Build Tool**: Next.js built-in bundler
- **Package Manager**: npm
- **Linting**: ESLint 9.x
- **Code Quality**: TypeScript strict mode

### Database
- **MongoDB Atlas** (Cloud-hosted)
- **Collections**: Users, Jobs, Companies, OTPs
- **Relationships**: Referenced relationships (Mongoose)

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer (Browser)                     │
│              Next.js Frontend (React Components)              │
└──────────────────────────┬──────────────────────────────────┘
                          │
                          │ HTTP/HTTPS
                          │
┌──────────────────────────┴──────────────────────────────────┐
│                   Next.js API Routes                         │
│         (/app/api/* - Backend Services)                      │
├──────────────────────────────────────────────────────────────┤
│  Auth Endpoints    │  Job Endpoints    │  Company Endpoints  │
│  User Endpoints    │  Application      │  Admin Functions    │
└────────────────────┬────────────────────────────────────────┘
                     │
      ┌──────────────┼──────────────┐
      │              │              │
   MongoDB      Cloudinary     Nodemailer
   (Database)   (Images)       (Email)
```

---

## ✨ Core Features

### 1. **User Management**
- User registration (Email/Password or Google OAuth)
- User profile with skills, experience, certifications
- Profile image upload
- Role-based access (User/Admin)
- User ban functionality

### 2. **Job Management**
- Job posting (Jobs and Internships)
- Job searching with filters
- Job salary details
- Deadline management
- Job status tracking (Active/Expired)

### 3. **Application System**
- One-click job applications
- Skill matching algorithm (0-100% score)
- Application tracking
- Duplicate application prevention

### 4. **Company Management**
- Company registration and profiles
- Company information management
- Industry categorization
- Contact information

### 5. **Admin Panel**
- User management
- Job moderation
- Application monitoring
- Platform statistics

### 6. **Automated Features**
- OTP-based email verification
- Expired job cleanup (daily cron)
- Applicant CSV report generation
- Email notifications

---

## 📡 API Endpoints Documentation

### Authentication Endpoints

#### **1. POST `/api/auth/register`**
**Purpose**: Register a new user with email and password

**Request Body**:
```javascript
{
  name: "John Doe",
  email: "john@example.com",
  password: "SecurePass123"
}
```

**Response**:
```javascript
{
  success: true,
  user: {
    _id: "123abc",
    name: "John Doe",
    email: "john@example.com",
    role: "user"
  }
}
```

**Backend Tasks**:
- Hash password with bcryptjs
- Create User document in MongoDB
- Validate email format
- Check for duplicate email

**Security Measures**:
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ Unique email constraint
- ✅ Input validation
- ✅ Error handling (no user enumeration)

---

#### **2. POST `/api/auth/send-otp`**
**Purpose**: Send OTP for email verification

**Request Body**:
```javascript
{
  email: "user@example.com"
}
```

**Response**:
```javascript
{
  success: true,
  message: "OTP sent to email"
}
```

**Backend Tasks**:
- Validate email format
- Generate 6-digit OTP
- Save OTP to database with TTL (10 minutes)
- Send email via Nodemailer
- Enforce rate limiting

**Security Measures**:
- ✅ Email format validation (regex)
- ✅ Rate limiting: Max 3 OTPs per email per 15 minutes (429 status)
- ✅ OTP expiration via MongoDB TTL index
- ✅ Email credential validation

---

#### **3. POST `/api/auth/verify-otp`**
**Purpose**: Verify OTP and complete registration

**Request Body**:
```javascript
{
  email: "user@example.com",
  otp: "123456"
}
```

**Response**:
```javascript
{
  success: true,
  user: { /* user data */ }
}
```

**Backend Tasks**:
- Find OTP record in database
- Validate OTP matches
- Check OTP not expired
- Create user account
- Delete OTP record

**Security Measures**:
- ✅ OTP matching validation
- ✅ Expiration time check
- ✅ OTP single-use enforcement
- ✅ Time-based access control

---

#### **4. GET/POST `/api/auth/[...nextauth]`**
**Purpose**: NextAuth authentication handler

**Features**:
- Google OAuth authentication
- Credentials-based login
- JWT token management
- Session management

**Backend Tasks**:
- Validate credentials
- Check user ban status
- Create JWT token
- Manage session cookies
- Handle OAuth profile sync

**Security Measures**:
- ✅ AUTH_SECRET required
- ✅ Ban status checking in JWT refresh
- ✅ Banned users auto-logout
- ✅ Secure JWT signing
- ✅ HttpOnly cookies
- ✅ CSRF protection via NextAuth

---

### User Profile Endpoints

#### **5. GET `/api/profile`**
**Purpose**: Get authenticated user's profile

**Authentication**: Required (JWT Session)

**Response**:
```javascript
{
  user: {
    _id: "123abc",
    name: "John Doe",
    email: "john@example.com",
    title: "Senior Developer",
    skills: ["React", "Node.js"],
    experience: [{ company: "TechCorp", role: "Engineer" }],
    certifications: [{ name: "AWS Solutions Architect" }],
    contact: { linkedin: "...", github: "..." },
    profileImage: "https://..."
  }
}
```

**Backend Tasks**:
- Retrieve user from MongoDB
- Populate all profile data
- Exclude password field
- Return complete user object

**Security Measures**:
- ✅ Authentication check
- ✅ Authorization (own profile only)
- ✅ Password exclusion
- ✅ Session validation

---

#### **6. PUT `/api/profile`**
**Purpose**: Update user profile

**Request Body**:
```javascript
{
  name: "John Doe",
  title: "Lead Developer",
  skills: ["React", "Node.js", "MongoDB"],
  experience: [{ company: "TechCorp", role: "Engineer", years: 5 }],
  certifications: [],
  profileImage: "https://...",
  contact: { linkedin: "...", phone: "...", website: "..." }
}
```

**Response**:
```javascript
{
  success: true,
  user: { /* updated user data */ }
}
```

**Backend Tasks**:
- Validate input fields
- Update only specified fields
- Prevent role/ban status changes
- Save to MongoDB
- Return updated document

**Security Measures**:
- ✅ Authentication required
- ✅ Field-level access control (whitelist)
- ✅ Type validation
- ✅ XSS prevention via sanitization

---

### Job Endpoints

#### **7. GET `/api/jobs`**
**Purpose**: Fetch active jobs with pagination and filtering

**Query Parameters**:
```
?page=1
&limit=20
&search=React
&type=job (or internship or all)
&companyId=xxx
&includeExpired=false
```

**Response**:
```javascript
{
  jobs: [
    {
      _id: "job123",
      title: "React Developer",
      type: "job",
      companyId: { _id: "comp1", name: "TechCorp" },
      salary: { min: 50000, max: 80000, currency: "USD", period: "annually" },
      requiredSkills: ["React", "JavaScript"],
      deadline: "2026-03-31T23:59:00Z",
      applicants: [{ userId: "...", matchScore: 85 }]
    }
  ],
  pagination: {
    page: 1,
    limit: 20,
    totalJobs: 150,
    totalPages: 8,
    hasNextPage: true,
    hasPrevPage: false
  }
}
```

**Backend Tasks**:
- Build MongoDB query based on filters
- Apply regex search with escaped characters
- Implement pagination (skip + limit)
- Sort by deadline descending
- Populate company details
- Count total documents
- Calculate pagination metadata

**Security Measures**:
- ✅ Regex injection prevention (escape special chars)
- ✅ ReDoS attack prevention
- ✅ Pagination limits (max 100 per page)
- ✅ DOS prevention via limit
- ✅ Input validation on query params

---

#### **8. POST `/api/jobs`**
**Purpose**: Create new job posting (Company only)

**Authentication**: Required
**Authorization**: User must belong to a company

**Request Body**:
```javascript
{
  title: "Full Stack Developer",
  type: "job",
  imageUrl: "https://...",
  requiredSkills: ["React", "Node.js", "MongoDB"],
  deadline: "2026-03-31T23:59:00Z",
  salary: {
    min: 60000,
    max: 90000,
    currency: "USD",
    period: "annually"
  }
}
```

**Response**:
```javascript
{
  success: true,
  job: { /* created job data */ }
}
```

**Backend Tasks**:
- Authenticate user via session
- Verify user belongs to company
- Validate all required fields
- Check deadline is in future
- Verify company exists
- Create Job document
- Initialize empty applicants array
- Return created job

**Security Measures**:
- ✅ Authentication required
- ✅ Company membership verification
- ✅ Input validation (title, deadline, skills)
- ✅ Deadline validation (must be future)
- ✅ Company existence check
- ✅ Field sanitization

---

#### **9. PUT `/api/jobs`**
**Purpose**: Update job posting

**Authentication**: Required
**Authorization**: User must own the company

**Request Body**:
```javascript
{
  jobId: "job123",
  title: "Senior React Developer",
  deadline: "2026-04-15T23:59:00Z",
  requiredSkills: ["React", "TypeScript", "Node.js"],
  // ... other fields
}
```

**Response**:
```javascript
{
  success: true,
  job: { /* updated job */ }
}
```

**Backend Tasks**:
- Validate job exists
- Check user owns company
- Validate input fields
- Update MongoDB document
- Save changes
- Return updated job

**Security Measures**:
- ✅ Authentication check
- ✅ Ownership verification
- ✅ Field validation
- ✅ Deadline validation
- ✅ Input sanitization

---

#### **10. DELETE `/api/jobs`**
**Purpose**: Delete job posting

**Authentication**: Required
**Authorization**: User must own the company

**Request Body**:
```javascript
{
  jobId: "job123"
}
```

**Response**:
```javascript
{
  success: true
}
```

**Backend Tasks**:
- Verify job exists
- Check ownership
- Delete Job document
- Note: Applicants are also removed (cascade)

**Security Measures**:
- ✅ Authentication required
- ✅ Ownership verification
- ✅ Resource existence check

---

### Job Application Endpoints

#### **11. POST `/api/apply`**
**Purpose**: Apply for a job with skill matching

**Authentication**: Required
**Authorization**: Not for company staff

**Request Body**:
```javascript
{
  jobId: "job123"
}
```

**Response**:
```javascript
{
  success: true,
  score: 85.5  // Match percentage (0-100)
}
```

**Backend Tasks**:
1. Authenticate user
2. Fetch user skills and job requirements
3. Normalize skills to lowercase
4. Calculate match score:
   - Count matching skills
   - Formula: (matches / required) × 100
5. Check for duplicate application
6. Add applicant to job.applicants array
7. Save job document
8. Return match score

**Skill Matching Algorithm**:
```
Matches = intersection(userSkills, jobSkills)
Score = (Matches.length / jobSkills.length) × 100
```

Example:
- User Skills: ["React", "Node.js", "Python"]
- Job Skills: ["React", "Node.js", "MongoDB", "AWS"]
- Matches: 2 out of 4
- Score: (2/4) × 100 = **50%**

**Security Measures**:
- ✅ Authentication required
- ✅ Ban status check
- ✅ Company staff restriction (no self-apply)
- ✅ Duplicate application prevention
- ✅ Job existence verification
- ✅ Skill normalization

---

#### **12. GET `/api/jobs/[id]/applicants`**
**Purpose**: Get list of applicants for a job

**Authentication**: Required
**Authorization**: Company owner/manager only

**Response**:
```javascript
{
  jobTitle: "React Developer",
  totalApplicants: 15,
  applicants: [
    {
      userId: {
        _id: "user1",
        name: "Jane Smith",
        email: "jane@example.com",
        skills: ["React", "TypeScript"],
        title: "Senior Developer"
      },
      matchScore: 95,
      appliedAt: "2026-01-15T10:30:00Z"
    }
    // ... more applicants
  ]
}
```

**Backend Tasks**:
- Authenticate user
- Verify ownership
- Fetch job with populated applicants
- Sort by matchScore descending
- Filter out deleted users (null references)
- Return complete applicant details

**Security Measures**:
- ✅ Authentication required
- ✅ Ownership verification
- ✅ Null reference handling
- ✅ Data privacy (only for owner)

---

### Company Endpoints

#### **13. GET `/api/company`**
**Purpose**: Get authenticated user's company

**Authentication**: Required

**Response**:
```javascript
{
  company: {
    _id: "comp1",
    name: "TechCorp",
    description: "Leading tech company",
    imageUrl: "https://...",
    industry: "Technology",
    status: "active",
    ownerId: "user1",
    managers: ["user2", "user3"],
    contact: {
      website: "https://techcorp.com",
      linkedin: "https://linkedin.com/company/techcorp",
      email: "jobs@techcorp.com",
      phone: "+1234567890",
      location: "San Francisco"
    }
  }
}
```

**Backend Tasks**:
- Authenticate user
- Find company where user is owner or manager
- Return company details
- Handle no company case

**Security Measures**:
- ✅ Authentication required
- ✅ Role-based access
- ✅ Ownership/manager check

---

#### **14. POST `/api/company`**
**Purpose**: Register new company

**Authentication**: Required

**Request Body**:
```javascript
{
  name: "NewTech Inc",
  description: "Innovative startup",
  imageUrl: "https://...",
  industry: "Technology",
  contact: {
    website: "https://newtech.com",
    email: "contact@newtech.com",
    phone: "+1234567890",
    location: "Remote"
  }
}
```

**Response**:
```javascript
{
  success: true,
  company: { /* company data */ }
}
```

**Backend Tasks**:
1. Authenticate user
2. Check user not already in company
3. Validate input fields
4. Create Company document with user as owner
5. Update User: set companyId and companyRole = "owner"
6. Return created company

**Security Measures**:
- ✅ Authentication required
- ✅ Duplicate company prevention
- ✅ Single company per user enforcement
- ✅ Field validation

---

#### **15. PUT `/api/company`**
**Purpose**: Update company details

**Authentication**: Required
**Authorization**: Company owner only

**Request Body**:
```javascript
{
  name: "NewTech Inc",
  description: "Updated description",
  imageUrl: "https://...",
  status: "active", // or "sunset"
  contact: { /* updated contact */ }
}
```

**Response**:
```javascript
{
  success: true,
  company: { /* updated company */ }
}
```

**Backend Tasks**:
- Authenticate user
- Find company where user is owner
- Validate fields
- Update Company document
- Save changes
- Return updated company

**Security Measures**:
- ✅ Authentication required
- ✅ Ownership verification
- ✅ Field validation

---

### File Upload Endpoints

#### **16. POST `/api/upload`**
**Purpose**: Upload image to Cloudinary

**Authentication**: Recommended (not enforced)

**Form Data**:
```
file: <image file>
```

**Response**:
```javascript
{
  url: "https://res.cloudinary.com/..."
}
```

**Backend Tasks**:
1. Receive FormData with file
2. Validate file size (max 5MB)
3. Validate file type (JPEG, PNG, GIF, WebP)
4. Create Cloudinary upload stream
5. Stream file data to Cloudinary
6. Return secure URL

**Security Measures**:
- ✅ File size validation (5MB max)
- ✅ File type whitelist (images only)
- ✅ MIME type checking
- ✅ Error messages on violation
- ✅ Cloudinary secure storage

**Allowed Types**:
- image/jpeg
- image/png
- image/gif
- image/webp

---

### Admin Endpoints

#### **17. GET `/api/admin/users`**
**Purpose**: List all users with pagination

**Authentication**: Required
**Authorization**: Admin only

**Query Parameters**:
```
?page=1&limit=20
```

**Response**:
```javascript
{
  users: [ /* user array */ ],
  pagination: {
    page: 1,
    limit: 20,
    totalUsers: 450,
    totalPages: 23,
    hasNextPage: true,
    hasPrevPage: false
  }
}
```

**Backend Tasks**:
- Check user is admin
- Fetch paginated users
- Count total documents
- Calculate pagination info
- Sort by _id descending

**Security Measures**:
- ✅ Admin-only access
- ✅ Pagination limits (max 100)
- ✅ DOS prevention

---

#### **18. DELETE `/api/admin/users/[id]`**
**Purpose**: Delete user and clean up references

**Authentication**: Required
**Authorization**: Admin only

**Response**:
```javascript
{
  success: true,
  message: "User deleted and removed from all job applications"
}
```

**Backend Tasks**:
1. Check user is admin
2. Remove user from all job applicants
   - Query: `{ 'applicants.userId': id }`
   - Update: `$pull: { applicants: { userId: id } }`
3. Delete User document
4. Return success

**Security Measures**:
- ✅ Admin-only access
- ✅ Orphaned data cleanup
- ✅ Referential integrity maintenance
- ✅ User existence check

---

#### **19. GET `/api/admin/jobs`**
**Purpose**: Get all jobs for moderation

**Authentication**: Required
**Authorization**: Admin only

**Response**:
```javascript
{
  jobs: [ /* all jobs */ ],
  pagination: { /* pagination info */ }
}
```

**Backend Tasks**:
- Check admin role
- Fetch all jobs (expired included)
- Include pagination

**Security Measures**:
- ✅ Admin-only access
- ✅ Pagination

---

#### **20. GET `/api/admin/stats`**
**Purpose**: Get platform statistics

**Authentication**: Required
**Authorization**: Admin only

**Response**:
```javascript
{
  stats: {
    totalUsers: 1250,
    totalJobs: 340,
    totalApplications: 8500,
    activeJobs: 85,
    expiredJobs: 255,
    bannedUsers: 12,
    companies: 45
  }
}
```

**Backend Tasks**:
- Count users
- Count jobs (active/expired)
- Count applications
- Count banned users
- Count companies

**Security Measures**:
- ✅ Admin-only access

---

### Automated/Scheduled Endpoints

#### **21. GET `/api/cron`**
**Purpose**: Scheduled job to cleanup expired jobs

**Authentication**: Vercel Cron Secret

**Trigger**: Daily at 00:00 UTC (Vercel Cron)

**Functionality**:
1. Find jobs where deadline < now
2. For each expired job:
   - Generate applicant CSV
   - Sort applicants by matchScore desc
   - Send email with CSV attachment
   - Delete job
3. Return processed count

**Backend Tasks**:
- Authenticate with CRON_SECRET
- Query expired jobs
- Populate applicant details
- Generate CSV with proper escaping
- Send email via Nodemailer
- Delete expired jobs
- Log operations

**Security Measures**:
- ✅ Bearer token authentication (CRON_SECRET)
- ✅ Email credential validation
- ✅ CSV escaping (prevent injection)
- ✅ Proper error handling
- ✅ Warning if CRON_SECRET not set

**CSV Format**:
```
Full Name,Email,Match Score (%),Profile Link
"Jane Smith","jane@example.com","95","https://internova.com/profile/123"
"John Doe","john@example.com","80","https://internova.com/profile/456"
```

---

## 🔐 Security Measures

### 1. Authentication & Authorization

| Method | Implementation | Status |
|--------|----------------|--------|
| OAuth 2.0 | Google Provider | ✅ Implemented |
| Email/Password | Credentials Provider | ✅ Implemented |
| JWT Tokens | NextAuth.js | ✅ Implemented |
| Session Management | NextAuth.js callbacks | ✅ Implemented |
| Ban Status Check | JWT refresh callback | ✅ Implemented |
| Role-Based Access | Middleware checks | ✅ Implemented |

### 2. Input Validation

| Type | Method | Status |
|------|--------|--------|
| Email | Regex validation | ✅ Fixed |
| Job Title | Non-empty check | ✅ Fixed |
| Deadline | Future date check | ✅ Fixed |
| Skills | Array length check | ✅ Fixed |
| File Upload | Size + type validation | ✅ Fixed |
| Regex Search | Special char escaping | ✅ Fixed (ReDoS prevention) |
| OTP | 6-digit format | ✅ Implemented |

### 3. Data Protection

| Measure | Status | Details |
|---------|--------|---------|
| Password Hashing | ✅ | bcryptjs (10 rounds) |
| Password Exclusion | ✅ | `.select("+password")` only when needed |
| HTTPS | ✅ | Vercel auto-HTTPS |
| SQL Injection | ✅ | Using Mongoose (parameterized) |
| NoSQL Injection | ✅ | Input type checking |
| XSS Prevention | ✅ | URL validation, React escaping |
| CSRF | ✅ | NextAuth handles |

### 4. Rate Limiting

| Endpoint | Limit | Window | Status |
|----------|-------|--------|--------|
| OTP Request | 3 per email | 15 minutes | ✅ Fixed |
| Login | Not yet | - | ⏳ TODO |
| API General | Not yet | - | ⏳ TODO |

### 5. File Security

| Check | Implementation | Status |
|-------|----------------|--------|
| File Size | 5MB max | ✅ Fixed |
| File Type | Images only (JPEG, PNG, GIF, WebP) | ✅ Fixed |
| File Scanning | Via Cloudinary | ✅ |
| Storage | Cloudinary CDN | ✅ |
| Access Control | Public + private options | ✅ |

### 6. Cron Security

| Measure | Status | Details |
|---------|--------|---------|
| Authentication | ✅ Fixed | Bearer token (CRON_SECRET) |
| Email Credential Check | ✅ Fixed | Validates before sending |
| CSV Escaping | ✅ Fixed | Prevents injection attacks |
| Error Handling | ✅ Fixed | Proper error responses |
| Logging | ✅ | Console logs for debugging |

### 7. Database Security

| Measure | Status | Details |
|---------|--------|---------|
| Unique Constraints | ✅ | Email unique index |
| Foreign Keys | ✅ | Mongoose references |
| Data Validation | ✅ | Schema validation |
| Orphaned Data | ✅ Fixed | Cleanup on user delete |
| TTL Indexes | ✅ | OTP auto-expiry |
| Password Hashing | ✅ | Never stored plain |

### 8. API Security

| Measure | Status | Details |
|---------|--------|---------|
| CORS | ⏳ TODO | Need configuration |
| Rate Limiting | ✅ Partial | OTP only, need general |
| Pagination Limits | ✅ Fixed | Max 100 per page |
| DOS Prevention | ✅ Partial | Pagination prevents some DOS |
| Error Messages | ✅ | Generic on auth failures |
| API Versioning | ⏳ TODO | Single version currently |

---

## 📦 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String (max: 100),
  email: String (unique, required),
  password: String (hashed, hidden by default),
  role: enum ['admin', 'user'],
  isBanned: Boolean,
  
  // Profile
  profileImage: String (Cloudinary URL),
  title: String,
  
  // Contact
  contact: {
    phone: String,
    linkedin: String,
    github: String,
    website: String,
    location: [String]
  },
  
  // Skills & Experience
  skills: [String],
  experience: [{
    company: String,
    role: String,
    years: Number,
    description: String
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: Date,
    url: String,
    type: enum ['Academic', 'Professional', 'Extracurricular']
  }],
  
  // Company
  companyId: ObjectId (ref: Company),
  companyRole: enum ['owner', 'manager', null],
  
  createdAt: Date,
  updatedAt: Date
}
```

### Job Collection
```javascript
{
  _id: ObjectId,
  companyId: ObjectId (ref: Company, required),
  title: String (required),
  type: enum ['job', 'internship'],
  imageUrl: String,
  
  salary: {
    min: Number,
    max: Number,
    currency: String,
    period: enum ['annually', 'monthly', 'hourly']
  },
  
  requiredSkills: [String],
  deadline: Date (required),
  
  applicants: [{
    userId: ObjectId (ref: User),
    appliedAt: Date,
    matchScore: Number (0-100)
  }],
  
  createdAt: Date,
  updatedAt: Date
}
```

### Company Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String,
  imageUrl: String,
  industry: String,
  status: enum ['active', 'sunset'],
  
  ownerId: ObjectId (ref: User),
  managers: [ObjectId (ref: User)],
  
  contact: {
    website: String,
    linkedin: String,
    email: String,
    phone: String,
    location: String
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

### OTP Collection
```javascript
{
  _id: ObjectId,
  email: String (required),
  otp: String (6 digits),
  createdAt: Date (default: now),
  expiresAt: Date (TTL index: 10 minutes)
}
```

---

## 🔍 Security Audit Findings

### Issues Found: 40 Total

**Status**: ✅ All Critical and High Issues Fixed

#### Critical Issues (1)
- ✅ **Cron Route Authentication** - FIXED
  - Endpoint was publicly accessible
  - Now requires CRON_SECRET bearer token

#### High Severity (12)
- ✅ File Upload Validation - FIXED (5MB, images only)
- ✅ ReDoS Prevention - FIXED (regex escaping)
- ✅ API Input Validation - FIXED
- ✅ Orphaned Data - FIXED (cleanup on user delete)
- ✅ OTP Rate Limiting - FIXED (3 per 15 min)
- ✅ Email Validation - FIXED
- ✅ Email Credentials Check - FIXED
- ✅ User Pagination - FIXED
- ✅ Job Pagination - FIXED
- ✅ URL XSS Prevention - FIXED
- ✅ Auth Security - FIXED
- ✅ CSV Generation - FIXED

#### Medium Severity (17)
- 5 Fixed (Auth session, type safety, constants)
- 12 Documented for future (CORS, password strength, etc.)

#### Low Severity (10)
- Documented, not critical

---

## 🚀 Deployment & Maintenance

### Environment Variables

```env
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname

# Authentication
NEXTAUTH_SECRET=<secure-random-string-32-chars>
NEXTAUTH_URL=https://yourdomain.com

# Google OAuth
GOOGLE_CLIENT_ID=<from Google Cloud Console>
GOOGLE_CLIENT_SECRET=<from Google Cloud Console>

# Email Service
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=<Gmail App Password>

# Cloudinary
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>

# Security
CRON_SECRET=<secure-random-string>
AUTH_SECRET=<same-as-NEXTAUTH_SECRET>
```

### Deployment Checklist

- [ ] Set all environment variables
- [ ] Configure Vercel Cron job
- [ ] Test file upload (5MB limit)
- [ ] Test OTP rate limiting
- [ ] Verify email sending
- [ ] Test job creation validation
- [ ] Monitor error logs
- [ ] Setup monitoring/alerts
- [ ] Configure backups

### Maintenance

**Daily**:
- Monitor cron job execution
- Check error logs
- Verify email sending

**Weekly**:
- Review user applications
- Check database size
- Monitor API performance

**Monthly**:
- Security audit
- Performance optimization
- User feedback review

---

## 📊 Summary Statistics

| Metric | Count |
|--------|-------|
| API Endpoints | 21+ |
| Database Collections | 4 |
| Authentication Methods | 2 (OAuth + Credentials) |
| Security Issues Fixed | 12 (High) + 1 (Critical) |
| File Upload Limits | 5MB, 4 MIME types |
| Rate Limit (OTP) | 3 per 15 minutes |
| Pagination Limit | 100 max per page |
| Skill Match Score Range | 0-100% |

---

## 🎓 Conclusion

**Internova** is a modern, secure, and scalable job portal platform with:

1. **Robust Security**: All critical vulnerabilities fixed, encryption enabled
2. **User-Friendly**: Simple job application process with skill matching
3. **Scalable Architecture**: Handles pagination, supports thousands of users
4. **Automated Workflows**: Cron jobs manage expired postings
5. **Professional Features**: Skill matching, CSV reports, user management
6. **Well-Documented**: Clear API specifications and security measures

The platform is ready for production deployment with proper environment configuration and monitoring.

---

**Report Generated**: December 30, 2025  
**Version**: 1.0.0  
**Status**: ✅ Production Ready (with recommended configurations)

