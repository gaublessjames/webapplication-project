import { apiRequest, LOCAL_API_URL } from '@/lib/api-client';

export function useApi() {
  // Auth: Register
  const register = async (email: string, password: string, full_name?: string) => {
    const res = await fetch(`${LOCAL_API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name }),
    });
    const data = await res.json();
    if (res.ok) {
      if (data.token) {
        localStorage.setItem('jwt', data.token);
      }
      return data;
    } else {
      throw new Error(data.error || 'Registration failed');
    }
  };

  // Auth: Login
  const login = async (email: string, password: string) => {
    const res = await fetch(`${LOCAL_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem('jwt', data.token);
      return data;
    } else {
      throw new Error(data.error || 'Login failed');
    }
  };

  // Auth: Get current user
  const getCurrentUser = async () => {
    const token = localStorage.getItem('jwt');
    const res = await fetch(`${LOCAL_API_URL}/auth/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  };

  // Example: get reservations (admin)
  const getReservations = async () => {
    const res = await fetch(`${LOCAL_API_URL}/reservations/`);
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  };

  // Get all reservations with customer details (admin)
  const getAllReservationsWithCustomers = async (page = 1, per_page = 10) => {
    let token = localStorage.getItem('jwt');
    
    // If no token but admin bypass is enabled, try to get a token
    if (!token && localStorage.getItem('admin_bypass') === 'true') {
      try {
        const loginRes = await fetch(`${LOCAL_API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'admin@cafefausse.com',
            password: 'demo123456'
          }),
        });
        if (loginRes.ok) {
          const loginData = await loginRes.json();
          token = loginData.token;
          localStorage.setItem('jwt', token);
        }
      } catch (error) {
        console.error('Failed to get admin token:', error);
      }
    }
    
    const res = await fetch(`${LOCAL_API_URL}/admin/reservations?page=${page}&per_page=${per_page}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  };

  // Update reservation (admin)
  const updateReservation = async (id: string, data: any) => {
    const token = localStorage.getItem('jwt');
    const res = await fetch(`${LOCAL_API_URL}/reservations/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    const response = await res.json();
    return response.reservation || response; // Handle both formats
  };

  // Get reservations for a specific user by email
  const getUserReservations = async (email: string) => {
    const token = localStorage.getItem('jwt');
    const res = await fetch(`${LOCAL_API_URL}/reservations/user?email=${encodeURIComponent(email)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  };

  // Get reservation by ID
  const getReservationById = async (id: string) => {
    const res = await fetch(`${LOCAL_API_URL}/reservations/${id}`);
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  };

  // Get customer by email
  const getCustomerByEmail = async (email: string) => {
    const res = await fetch(`${LOCAL_API_URL}/customers/?email=${encodeURIComponent(email)}`);
    return await res.json();
  };

  // Upsert customer (for newsletter signup)
  const upsertCustomer = async (customer: any) => {
    console.log('Creating customer with data:', customer);
    
    const res = await fetch(`${LOCAL_API_URL}/customers/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    });
    
    const data = await res.json();
    console.log('Customer creation response:', data);
    
    if (!res.ok) {
      throw new Error(data.error || `HTTP ${res.status}: ${res.statusText}`);
    }
    
    return data;
  };

  // Create reservation
  const createReservation = async (reservation: any) => {
    const token = localStorage.getItem('jwt');
    
    // Map frontend field names to backend field names
    const mappedReservation = {
      name: reservation.name,
      email: reservation.email,
      phone: reservation.phone,
      date: reservation.reservation_date || reservation.date,
      time: reservation.reservation_time || reservation.time,
      party_size: reservation.number_of_guests || reservation.party_size,
      special_requests: reservation.special_requests,
      customer_id: reservation.customer_id
    };
    
    console.log('Creating reservation with data:', mappedReservation);
    
    const res = await fetch(`${LOCAL_API_URL}/reservations/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(mappedReservation),
    });
    
    const data = await res.json();
    console.log('Reservation creation response:', data);
    
    if (!res.ok) {
      throw new Error(data.error || `HTTP ${res.status}: ${res.statusText}`);
    }
    
    return data;
  };

  // Cancel reservation
  const cancelReservation = async (reservationId: string, email?: string) => {
    const token = localStorage.getItem('jwt');
    const res = await fetch(`${LOCAL_API_URL}/reservations/cancel/${reservationId}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ email }),
    });
    return await res.json();
  };

  // Newsletter signup
  const newsletterSignup = async (email: string, name: string) => {
    const res = await fetch(`${LOCAL_API_URL}/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name }),
    });
    return await res.json();
  };

  // Admin: Get all testimonials
  const getAllTestimonialsAdmin = async () => {
    const API_BASE_URL = import.meta.env.VITE_LOCAL_API_URL || "http://localhost:5001/api";
    const token = localStorage.getItem('jwt');
    const res = await fetch(`${API_BASE_URL}/admin/testimonials`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  };

  // Admin: Approve or reject a testimonial
  const approveTestimonial = async (id: string, is_approved: boolean) => {
    const API_BASE_URL = import.meta.env.VITE_LOCAL_API_URL || "http://localhost:5001/api";
    const token = localStorage.getItem('jwt');
    const res = await fetch(`${API_BASE_URL}/admin/testimonials/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ is_approved }),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  };

  // Admin: Update a testimonial
  const updateTestimonial = async (id: string, data: any) => {
    const API_BASE_URL = import.meta.env.VITE_LOCAL_API_URL || "http://localhost:5001/api";
    const token = localStorage.getItem('jwt');
    const res = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  };

  // Admin: Create a new testimonial
  const createTestimonial = async (testimonial: any) => {
    const API_BASE_URL = import.meta.env.VITE_LOCAL_API_URL || "http://localhost:5001/api";
    const token = localStorage.getItem('jwt');
    const res = await fetch(`${API_BASE_URL}/testimonials/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(testimonial),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  };

  // Admin: Get all awards
  const getAllAwards = async () => {
    const API_BASE_URL = import.meta.env.VITE_LOCAL_API_URL || "http://localhost:5001/api";
    const res = await fetch(`${API_BASE_URL}/awards/`);
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  };

  // Admin: Create a new award
  const createAward = async (award: any) => {
    const API_BASE_URL = import.meta.env.VITE_LOCAL_API_URL || "http://localhost:5001/api";
    const token = localStorage.getItem('jwt');
    const res = await fetch(`${API_BASE_URL}/awards/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(award),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  };

  // Admin: Update an award
  const updateAward = async (id: string, award: any) => {
    const API_BASE_URL = import.meta.env.VITE_LOCAL_API_URL || "http://localhost:5001/api";
    const token = localStorage.getItem('jwt');
    const res = await fetch(`${API_BASE_URL}/awards/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(award),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  };

  // Get all menu categories
  const getMenuCategories = async () => {
    const API_BASE_URL = import.meta.env.VITE_LOCAL_API_URL || "http://localhost:5001/api";
    const res = await fetch(`${API_BASE_URL}/menu/categories`);
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  };

  // Admin: Create a new menu category
  const createMenuCategory = async (category: any) => {
    const API_BASE_URL = import.meta.env.VITE_LOCAL_API_URL || "http://localhost:5001/api";
    const token = localStorage.getItem('jwt');
    const res = await fetch(`${API_BASE_URL}/menu/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(category),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  };

  // Admin: Update a menu category
  const updateMenuCategory = async (id: string, category: any) => {
    const API_BASE_URL = import.meta.env.VITE_LOCAL_API_URL || "http://localhost:5001/api";
    const token = localStorage.getItem('jwt');
    const res = await fetch(`${API_BASE_URL}/menu/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(category),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  };

  // Get menu categories with items
  const getMenuWithItems = async () => {
    const API_BASE_URL = import.meta.env.VITE_LOCAL_API_URL || "http://localhost:5001/api";
    const res = await fetch(`${API_BASE_URL}/menu/categories`);
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  };

  // Admin: Create a new menu item
  const createMenuItem = async (item: any) => {
    const API_BASE_URL = import.meta.env.VITE_LOCAL_API_URL || "http://localhost:5001/api";
    const token = localStorage.getItem('jwt');
    const res = await fetch(`${API_BASE_URL}/menu/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  };

  // Admin: Update a menu item
  const updateMenuItem = async (id: string, item: any) => {
    const API_BASE_URL = import.meta.env.VITE_LOCAL_API_URL || "http://localhost:5001/api";
    const token = localStorage.getItem('jwt');
    const res = await fetch(`${API_BASE_URL}/menu/items/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  };

  // Gallery: Get all images
  const getGalleryImages = async () => {
    const API_BASE_URL = import.meta.env.VITE_LOCAL_API_URL || "http://localhost:5001/api";
    const res = await fetch(`${API_BASE_URL}/gallery/images`);
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  };

  // Admin: Create gallery image
  const createGalleryImage = async (image: any) => {
    const API_BASE_URL = import.meta.env.VITE_LOCAL_API_URL || "http://localhost:5001/api";
    const token = localStorage.getItem('jwt');
    const res = await fetch(`${API_BASE_URL}/gallery/images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      credentials: 'include',
      body: JSON.stringify(image),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  };

  // Admin: Update gallery image
  const updateGalleryImage = async (id: string, image: any) => {
    const API_BASE_URL = import.meta.env.VITE_LOCAL_API_URL || "http://localhost:5001/api";
    const token = localStorage.getItem('jwt');
    const res = await fetch(`${API_BASE_URL}/gallery/images/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      credentials: 'include',
      body: JSON.stringify(image),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  };

  // Admin: Delete gallery image
  const deleteGalleryImage = async (id: string) => {
    const API_BASE_URL = import.meta.env.VITE_LOCAL_API_URL || "http://localhost:5001/api";
    const res = await fetch(`${API_BASE_URL}/gallery/images/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  };

  return {
    register,
    login,
    getCurrentUser,
    getReservations,
    getAllReservationsWithCustomers,
    updateReservation,
    getUserReservations,
    getReservationById,
    getCustomerByEmail,
    upsertCustomer,
    createReservation,
    cancelReservation,
    newsletterSignup,
    getAllTestimonialsAdmin,
    approveTestimonial,
    updateTestimonial,
    createTestimonial,
    getAllAwards,
    createAward,
    updateAward,
    getMenuCategories,
    createMenuCategory,
    updateMenuCategory,
    getMenuWithItems,
    createMenuItem,
    updateMenuItem,
    getGalleryImages,
    createGalleryImage,
    updateGalleryImage,
    deleteGalleryImage,
  };
}