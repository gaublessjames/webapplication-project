// Admin Dashboard Types

export interface Customer {
  id: string;
  name: string;
  email: string;
}

export interface Reservation {
  id: string;
  date: string;
  time: string;
  party_size: number;
  table_number: string;
  status: string;
  customers?: Customer;
  reservation_date?: string;
  reservation_time?: string;
  number_of_guests?: number;
  name?: string; // For backward compatibility
  email?: string; // For backward compatibility
}

export interface Testimonial {
  id: string;
  title: string;
  comment: string;
  rating: number;
  customer_name: string;
  is_approved: boolean;
  created_at: string;
}

export interface Award {
  id: string;
  name: string;
  description: string;
  year: string;
  category: string;
  is_featured: boolean;
  display_order: number;
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string;
  display_order: number;
  is_active: boolean;
  icon: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string | number;
  category_id: string;
  is_vegetarian: boolean;
  is_gluten_free: boolean;
  is_spicy: boolean;
  is_active: boolean;
}

export interface MenuWithItems extends MenuCategory {
  items: MenuItem[];
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  category: string;
  display_order: number;
  is_active: boolean;
}

export interface ReservationFilter {
  date: string;
  status: string;
}

export interface EditForm {
  date: string;
  time: string;
  party_size: string;
  number_of_guests: string;
  status: string;
}

export interface TestimonialForm {
  title: string;
  comment: string;
  rating: number;
  customer_name: string;
  is_approved: boolean;
}

export interface AwardForm {
  name: string;
  description: string;
  year: string;
  category: string;
  is_featured: boolean;
  display_order: number;
}

export interface MenuCategoryForm {
  name: string;
  description: string;
  display_order: number;
  is_active: boolean;
  icon: string;
}

export interface MenuItemForm {
  name: string;
  description: string;
  price: string;
  category_id: string;
  is_vegetarian: boolean;
  is_gluten_free: boolean;
  is_spicy: boolean;
  is_active: boolean;
}

export interface GalleryForm {
  url: string;
  alt: string;
  category: string;
  display_order: number;
  is_active: boolean;
}

export interface DashboardStats {
  totalReservations: number;
  pendingReservations: number;
  todayReservations: number;
  totalTestimonials: number;
  totalAwards: number;
  totalMenuItems: number;
} 