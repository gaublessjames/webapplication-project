# Database Components Refactoring Plan

This document outlines the plan for refactoring components that directly interact with the Supabase database to use the local API instead.

## MyReservations Component Refactoring

The `MyReservations.tsx` component currently uses Supabase directly for fetching and canceling reservations.

### Current Implementation

```typescript
// Fetch reservations
const fetchReservations = async () => {
  try {
    // First get the customer record for this user
    const { data: customers, error: customerError } = await supabase
      .from('customers')
      .select('id')
      .eq('email', user?.email)
      .single();

    if (customerError) {
      console.error('Error fetching customer:', customerError);
      setReservations([]);
      return;
    }

    // Then get reservations for this customer
    const { data: reservationsData, error: reservationsError } = await supabase
      .from('reservations')
      .select('*')
      .eq('customer_id', customers.id)
      .order('reservation_date', { ascending: false });

    if (reservationsError) {
      console.error('Error fetching reservations:', reservationsError);
      return;
    }

    setReservations(reservationsData || []);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
};

// Cancel reservation
const cancelReservation = async (reservationId: string) => {
  setCancelling(reservationId);
  try {
    const { error } = await supabase
      .from('reservations')
      .update({ status: 'cancelled' })
      .eq('id', reservationId);

    if (error) throw error;

    setReservations(prev => 
      prev.map(res => 
        res.id === reservationId 
          ? { ...res, status: 'cancelled' }
          : res
      )
    );

    toast({
      title: "Reservation cancelled",
      description: "Your table has been freed up for other guests.",
    });
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    toast({
      title: "Error",
      description: "Failed to cancel reservation. Please try again.",
      variant: "destructive",
    });
  } finally {
    setCancelling(null);
  }
};
```

### Refactored Implementation

```typescript
import { useApi } from '@/hooks/useApi';

// In component
const { getReservations, cancelReservation: cancelReservationApi } = useApi();

// Fetch reservations
const fetchReservations = async () => {
  try {
    if (!user?.email) {
      setReservations([]);
      return;
    }

    const response = await getReservations(user.email);
    
    if (response.error) {
      console.error('Error fetching reservations:', response.error);
      setReservations([]);
      return;
    }

    setReservations(response.reservations || []);
  } catch (error) {
    console.error('Error:', error);
    setReservations([]);
  } finally {
    setLoading(false);
  }
};

// Cancel reservation
const cancelReservation = async (reservationId: string) => {
  setCancelling(reservationId);
  try {
    const response = await cancelReservationApi(reservationId);

    if (response.error) throw new Error(response.error);

    setReservations(prev => 
      prev.map(res => 
        res.id === reservationId 
          ? { ...res, status: 'cancelled' }
          : res
      )
    );

    toast({
      title: "Reservation cancelled",
      description: "Your table has been freed up for other guests.",
    });
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    toast({
      title: "Error",
      description: "Failed to cancel reservation. Please try again.",
      variant: "destructive",
    });
  } finally {
    setCancelling(null);
  }
};
```

### Changes Required

1. Import `useApi` hook instead of Supabase
2. Replace Supabase database queries with local API methods
3. Update error handling to match the new API response format
4. Update the reservation fetching logic to use the local API
5. Update the reservation cancellation logic to use the local API

## CancelReservation Component Refactoring

The `CancelReservation.tsx` component currently uses both the local API and Supabase as a fallback. We need to refactor it to use only the local API.

### Current Implementation

```typescript
// Fetch reservation
async function fetchReservation() {
  setLoading(true);
  setError("");
  setReservation(null);
  if (!email || !id) {
    setError("Missing reservation information.");
    setLoading(false);
    return;
  }
  try {
    // Try local API first
    const customerRes = await getCustomerByEmail(email);
    const customer = customerRes && customerRes.customer;
    if (!customer) {
      setError("Reservation not found for this email.");
      setLoading(false);
      return;
    }
    // Find reservation by id and customer_id
    // Try to fetch from local API (if available)
    let reservationData = null;
    if (customer.reservations && Array.isArray(customer.reservations)) {
      reservationData = customer.reservations.find((r: any) => r.id === id);
    }
    // If not found in customer object, try fetching directly from backend
    if (!reservationData) {
      // Try local API direct fetch
      try {
        const res = await fetch(`/api/reservations/${id}`);
        if (res.ok) {
          reservationData = await res.json();
        }
      } catch {}
    }
    if (!reservationData) {
      // Try Supabase direct fetch
      try {
        const { data: supaRes, error: supaErr } = await supabase
          .from('reservations')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        if (supaRes) reservationData = supaRes;
      } catch {}
    }
    if (!reservationData) {
      // As a fallback, just set a minimal reservation object
      reservationData = { id, reservation_date: '', reservation_time: '', number_of_guests: '', table_number: '', status: '' };
    }
    if (reservationData.status === "cancelled") {
      setError("This reservation has already been cancelled.");
      setLoading(false);
      return;
    }
    setReservation(reservationData);
    setLoading(false);
  } catch (err: any) {
    setError("Reservation not found or error fetching reservation.");
    setLoading(false);
  }
}
```

### Refactored Implementation

```typescript
import { useApi } from '@/hooks/useApi';

// In component
const { getReservationById, getCustomerByEmail } = useApi();

// Fetch reservation
async function fetchReservation() {
  setLoading(true);
  setError("");
  setReservation(null);
  if (!email || !id) {
    setError("Missing reservation information.");
    setLoading(false);
    return;
  }
  try {
    // Try to get the reservation directly by ID
    const reservationResponse = await getReservationById(id);
    
    if (reservationResponse.error || !reservationResponse.reservation) {
      // If that fails, try to get it through the customer
      const customerRes = await getCustomerByEmail(email);
      const customer = customerRes && customerRes.customer;
      
      if (!customer) {
        setError("Reservation not found for this email.");
        setLoading(false);
        return;
      }
      
      // Find reservation in customer's reservations
      let reservationData = null;
      if (customer.reservations && Array.isArray(customer.reservations)) {
        reservationData = customer.reservations.find((r: any) => r.id === id);
      }
      
      if (!reservationData) {
        setError("Reservation not found.");
        setLoading(false);
        return;
      }
      
      if (reservationData.status === "cancelled") {
        setError("This reservation has already been cancelled.");
        setLoading(false);
        return;
      }
      
      setReservation(reservationData);
    } else {
      // We got the reservation directly
      const reservationData = reservationResponse.reservation;
      
      if (reservationData.status === "cancelled") {
        setError("This reservation has already been cancelled.");
        setLoading(false);
        return;
      }
      
      setReservation(reservationData);
    }
    
    setLoading(false);
  } catch (err: any) {
    setError("Reservation not found or error fetching reservation.");
    setLoading(false);
  }
}
```

### Changes Required

1. Import `useApi` hook instead of Supabase
2. Replace Supabase database queries with local API methods
3. Remove the Supabase fallback logic
4. Add a new `getReservationById` method to the API client
5. Update error handling to match the new API response format

## Footer Component Refactoring

The `Footer.tsx` component currently uses Supabase directly for newsletter signup.

### Current Implementation

```typescript
const handleNewsletterSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!newsletterEmail.match(/^\S+@\S+\.\S+$/)) {
    toast({ title: "Invalid Email", description: "Please enter a valid email address.", variant: "destructive" });
    return;
  }
  setNewsletterLoading(true);
  // Try to insert or update newsletter signup in customers table
  const { error } = await supabase
    .from('customers')
    .upsert({ email: newsletterEmail, name: 'Newsletter Signup', newsletter_signup: true }, { onConflict: 'email' });
  setNewsletterLoading(false);
  if (error) {
    toast({ title: "Error", description: "Failed to sign up for newsletter.", variant: "destructive" });
  } else {
    toast({ title: "Success!", description: "You've been signed up for our newsletter." });
    setNewsletterEmail("");
  }
};
```

### Refactored Implementation

```typescript
import { useApi } from '@/hooks/useApi';

// In component
const { newsletterSignup } = useApi();

const handleNewsletterSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!newsletterEmail.match(/^\S+@\S+\.\S+$/)) {
    toast({ title: "Invalid Email", description: "Please enter a valid email address.", variant: "destructive" });
    return;
  }
  setNewsletterLoading(true);
  
  try {
    const response = await newsletterSignup(newsletterEmail, 'Newsletter Signup');
    
    if (response.error) {
      toast({ title: "Error", description: "Failed to sign up for newsletter.", variant: "destructive" });
    } else {
      toast({ title: "Success!", description: "You've been signed up for our newsletter." });
      setNewsletterEmail("");
    }
  } catch (error) {
    toast({ title: "Error", description: "Failed to sign up for newsletter.", variant: "destructive" });
  } finally {
    setNewsletterLoading(false);
  }
};
```

### Changes Required

1. Import `useApi` hook instead of Supabase
2. Replace Supabase database queries with local API methods
3. Update error handling to match the new API response format
4. Use the existing `newsletterSignup` method from the API client

## API Client Updates

To support these refactorings, we need to add the following methods to the API client:

```typescript
// In useApi.ts
const getReservations = async (email: string) => {
  const res = await fetch(`${LOCAL_API_URL}/reservations/user?email=${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

const getReservationById = async (id: string) => {
  const res = await fetch(`${LOCAL_API_URL}/reservations/${id}`);
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

// Return these methods
return {
  // ... existing methods
  getReservations,
  getReservationById,
};
```

## Implementation Strategy

1. First, update the API client with the necessary methods
2. Refactor the Footer component (simplest)
3. Refactor the CancelReservation component
4. Refactor the MyReservations component
5. Test each component to ensure it works correctly