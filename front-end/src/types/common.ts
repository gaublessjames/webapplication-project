// Common form data types
export interface CustomerData {
  name: string;
  email: string;
  phone?: string;
  newsletterSignup?: boolean;
}

export interface BookingData {
  date: Date;
  time: string;
  guests: number;
}

export interface ReservationData extends BookingData, CustomerData {
  id?: string;
  status?: string;
  tableNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Loading and error states
export interface LoadingState {
  loading: boolean;
  error: string;
}

export interface AsyncState<T> extends LoadingState {
  data: T | null;
}

// Form validation types
export interface FormErrors {
  [key: string]: string;
}

export interface FormState {
  isValid: boolean;
  errors: FormErrors;
  isSubmitting: boolean;
}

// UI component props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface ButtonProps extends BaseComponentProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

// Navigation types
export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: React.ComponentType;
  children?: NavigationItem[];
}

// Filter and search types
export interface FilterOptions {
  search?: string;
  category?: string;
  status?: string;
  date?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

// Time and date types
export interface TimeSlot {
  time: string;
  available: boolean;
  reserved?: boolean;
}

export interface DateAvailability {
  date: string;
  available: boolean;
  timeSlots: TimeSlot[];
}

// File upload types
export interface FileUpload {
  file: File;
  preview?: string;
  progress?: number;
  error?: string;
}

export interface ImageUpload extends FileUpload {
  alt?: string;
  category?: string;
}

// Notification types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

// User and authentication types
export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  avatar?: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  fullName?: string;
  phone?: string;
  preferences?: Record<string, any>;
}

// Restaurant-specific types
export interface RestaurantInfo {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  hours: {
    [key: string]: {
      open: string;
      close: string;
      closed?: boolean;
    };
  };
}

export interface TableInfo {
  id: string;
  number: string;
  capacity: number;
  status: 'available' | 'reserved' | 'occupied' | 'maintenance';
}

// All interfaces are already exported above 