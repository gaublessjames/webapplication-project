# Frontend Modularization Plan

## Overview
The frontend currently has several large, monolithic files that need to be broken down into smaller, reusable components. This plan outlines the modularization strategy for the entire `front-end/src` directory.

## Current Issues
1. **Large Page Components**: Index.tsx (658 lines), Dashboard.tsx (446 lines), About.tsx (349 lines)
2. **Monolithic Forms**: HeroBookingForm.tsx (558 lines), ReservationForm.tsx (663 lines)
3. **Mixed Concerns**: Components handling multiple responsibilities
4. **Code Duplication**: Similar logic repeated across components

## Modularization Strategy

### 1. **Page Components** (src/pages/)
Break down large pages into smaller, focused components:

#### Index.tsx (658 lines) → Modular Components:
- `components/home/HeroSection.tsx` - Hero section with booking form
- `components/home/FeaturesSection.tsx` - Features/benefits section
- `components/home/ReviewsSection.tsx` - Customer reviews/testimonials
- `components/home/AwardsSection.tsx` - Awards and recognition
- `components/home/MenuPreviewSection.tsx` - Menu categories preview
- `components/home/ContactSection.tsx` - Contact information

#### Dashboard.tsx (446 lines) → Modular Components:
- `components/dashboard/DashboardHeader.tsx` - Dashboard header
- `components/dashboard/ReservationSummary.tsx` - Reservation summary cards
- `components/dashboard/RecentActivity.tsx` - Recent activity list
- `components/dashboard/QuickActions.tsx` - Quick action buttons

#### About.tsx (349 lines) → Modular Components:
- `components/about/AboutHero.tsx` - About page hero section
- `components/about/StorySection.tsx` - Restaurant story
- `components/about/TeamSection.tsx` - Team members
- `components/about/ValuesSection.tsx` - Company values

### 2. **Form Components** (src/components/)
Break down large forms into reusable components:

#### HeroBookingForm.tsx (558 lines) → Modular Components:
- `components/forms/BookingForm.tsx` - Core booking form logic
- `components/forms/CustomerDetailsForm.tsx` - Customer information form
- `components/forms/TimeSlotSelector.tsx` - Time slot selection
- `components/forms/DateSelector.tsx` - Date selection
- `components/utils/PDFGenerator.tsx` - PDF generation utilities

#### ReservationForm.tsx (663 lines) → Modular Components:
- `components/forms/ReservationForm.tsx` - Core reservation form
- `components/forms/ReservationSummary.tsx` - Reservation summary
- `components/forms/TableAvailability.tsx` - Table availability check

#### UserReservationForm.tsx (331 lines) → Modular Components:
- `components/forms/UserReservationForm.tsx` - User-specific reservation form
- `components/forms/ReservationHistory.tsx` - User's reservation history

### 3. **Layout Components** (src/components/layout/)
Organize layout-related components:

- `components/layout/Header.tsx` - Main header (already exists)
- `components/layout/Footer.tsx` - Main footer (already exists)
- `components/layout/Navigation.tsx` - Navigation menu
- `components/layout/Layout.tsx` - Main layout wrapper
- `components/layout/PageContainer.tsx` - Page container wrapper

### 4. **Feature Components** (src/components/features/)
Organize feature-specific components:

- `components/features/booking/` - Booking-related components
- `components/features/menu/` - Menu-related components
- `components/features/gallery/` - Gallery-related components
- `components/features/reviews/` - Review/testimonial components
- `components/features/contact/` - Contact-related components

### 5. **Shared Components** (src/components/shared/)
Common, reusable components:

- `components/shared/LoadingSpinner.tsx` - Loading spinner
- `components/shared/ErrorBoundary.tsx` - Error boundary
- `components/shared/Modal.tsx` - Generic modal
- `components/shared/Card.tsx` - Generic card component
- `components/shared/Button.tsx` - Generic button component

### 6. **Hooks** (src/hooks/)
Organize custom hooks by feature:

- `hooks/useBooking.ts` - Booking-related hooks
- `hooks/useReservation.ts` - Reservation-related hooks
- `hooks/useMenu.ts` - Menu-related hooks
- `hooks/useGallery.ts` - Gallery-related hooks
- `hooks/useReviews.ts` - Review-related hooks

### 7. **Types** (src/types/)
Organize TypeScript types by feature:

- `types/booking.ts` - Booking-related types
- `types/reservation.ts` - Reservation-related types
- `types/menu.ts` - Menu-related types
- `types/gallery.ts` - Gallery-related types
- `types/reviews.ts` - Review-related types
- `types/common.ts` - Common types

### 8. **Utils** (src/utils/)
Organize utility functions:

- `utils/date.ts` - Date manipulation utilities
- `utils/validation.ts` - Form validation utilities
- `utils/pdf.ts` - PDF generation utilities
- `utils/formatting.ts` - Data formatting utilities

## Implementation Plan

### Phase 1: Core Infrastructure
1. Create new directory structure
2. Set up barrel exports (index.ts files)
3. Create shared components and utilities

### Phase 2: Form Components
1. Break down HeroBookingForm.tsx
2. Break down ReservationForm.tsx
3. Break down UserReservationForm.tsx
4. Create reusable form components

### Phase 3: Page Components
1. Break down Index.tsx
2. Break down Dashboard.tsx
3. Break down About.tsx
4. Create page-specific components

### Phase 4: Feature Components
1. Create booking feature components
2. Create menu feature components
3. Create gallery feature components
4. Create review feature components

### Phase 5: Optimization
1. Implement lazy loading
2. Add error boundaries
3. Optimize bundle size
4. Add performance monitoring

## Benefits
1. **Maintainability**: Smaller, focused components
2. **Reusability**: Components can be used across pages
3. **Testability**: Easier to write unit tests
4. **Performance**: Better code splitting and lazy loading
5. **Developer Experience**: Clearer code organization
6. **Scalability**: Easier to add new features

## File Structure After Modularization
```
src/
├── components/
│   ├── admin/           # Admin components (already modularized)
│   ├── layout/          # Layout components
│   ├── features/        # Feature-specific components
│   │   ├── booking/
│   │   ├── menu/
│   │   ├── gallery/
│   │   └── reviews/
│   ├── shared/          # Shared/reusable components
│   ├── forms/           # Form components
│   └── ui/              # UI components (already exists)
├── hooks/               # Custom hooks
├── types/               # TypeScript types
├── utils/               # Utility functions
├── pages/               # Page components (simplified)
└── assets/              # Static assets
```

This modularization will significantly improve code maintainability, reusability, and developer experience while maintaining all existing functionality. 