import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";
import { useDelayedLoading } from "@/hooks/useDelayedLoading";
import { Brain, AlertCircle } from "lucide-react";
import HeroBookingForm, { handleDownloadPDF } from "@/components/HeroBookingForm";

// Import all modular components
import {
  AdminSidebar,
  DashboardOverview,
  ReservationsManagement,
  TestimonialsManagement,
  MenuManagement,
  GalleryManagement,
  AwardsManagement,
  EditReservationModal,
  CancelReservationModal,
  AwardModal,
  MenuCategoryModal,
  MenuItemModal,
  GalleryModal
} from "@/components/admin";

// Import types
import {
  Reservation,
  Testimonial,
  Award,
  MenuCategory,
  MenuItem,
  MenuWithItems,
  GalleryImage,
  ReservationFilter,
  EditForm,
  TestimonialForm,
  AwardForm,
  MenuCategoryForm,
  MenuItemForm,
  GalleryForm,
  DashboardStats
} from "@/types/admin";

const ADMIN_EMAILS = ["admin@cafefausse.com"];

export default function AdminDashboard() {
  const { user, loading, role, signOut: authSignOut } = useAuth();
  const { toast } = useToast();

  // Custom signOut handler for admin dashboard
  const handleSignOut = async () => {
    try {
      await authSignOut();
      // Explicitly redirect to home page for admin
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      // Even if signOut fails, redirect to home
      window.location.href = '/';
    }
  };
  
  // State management
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Reservations
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<ReservationFilter>({ date: '', status: '' });
  const [editReservation, setEditReservation] = useState<Reservation | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [cancelLoadingId, setCancelLoadingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReservations, setTotalReservations] = useState(0);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<Reservation | null>(null);
  const [cancelError, setCancelError] = useState("");
  
  // Testimonials
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(false);
  const [testimonialError, setTestimonialError] = useState("");

  
  // Awards
  const [awards, setAwards] = useState<Award[]>([]);
  const [awardsLoading, setAwardsLoading] = useState(false);
  const [awardsError, setAwardsError] = useState("");
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [editingAward, setEditingAward] = useState<Award | null>(null);
  const [awardForm, setAwardForm] = useState<AwardForm>({ 
    name: '', 
    description: '', 
    year: '', 
    category: '', 
    is_featured: false, 
    display_order: 1 
  });
  
  // Menu Categories
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [menuCategoriesLoading, setMenuCategoriesLoading] = useState(false);
  const [menuCategoriesError, setMenuCategoriesError] = useState("");
  const [showMenuCategoryModal, setShowMenuCategoryModal] = useState(false);
  const [editingMenuCategory, setEditingMenuCategory] = useState<MenuCategory | null>(null);
  const [menuCategoryForm, setMenuCategoryForm] = useState<MenuCategoryForm>({ 
    name: '', 
    description: '', 
    display_order: 1, 
    is_active: true, 
    icon: '' 
  });
  
  // Menu Items
  const [menuWithItems, setMenuWithItems] = useState<MenuWithItems[]>([]);
  const [menuItemsLoading, setMenuItemsLoading] = useState(false);
  const [menuItemsError, setMenuItemsError] = useState("");
  const [showMenuItemModal, setShowMenuItemModal] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [menuItemForm, setMenuItemForm] = useState<MenuItemForm>({ 
    name: '', 
    description: '', 
    price: '', 
    category_id: '', 
    is_vegetarian: false, 
    is_gluten_free: false, 
    is_spicy: false, 
    is_active: true 
  });
  
  // Gallery Images
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryError, setGalleryError] = useState("");
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [editingGalleryImage, setEditingGalleryImage] = useState<GalleryImage | null>(null);
  const [galleryForm, setGalleryForm] = useState<GalleryForm>({ 
    url: '', 
    alt: '', 
    category: '', 
    display_order: 0, 
    is_active: true 
  });
  
  // API hooks
  const { 
    getAllReservationsWithCustomers, 
    updateReservation, 
    cancelReservation,
    getAllTestimonialsAdmin, 
    approveTestimonial,
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
    updateTestimonial,
    createTestimonial
  } = useApi();

  // Delayed loading states to prevent flickering
  const delayedTestimonialsLoading = useDelayedLoading(testimonialsLoading);
  const delayedAwardsLoading = useDelayedLoading(awardsLoading);
  const delayedMenuCategoriesLoading = useDelayedLoading(menuCategoriesLoading);
  const delayedMenuItemsLoading = useDelayedLoading(menuItemsLoading);
  const delayedGalleryLoading = useDelayedLoading(galleryLoading);
  const delayedFetching = useDelayedLoading(fetching);

  // Load data effects
  useEffect(() => {
    if (!user || role !== 'admin') return;
    loadDashboardData();
  }, [user, role, currentPage]);

  // Load testimonials only when testimonials tab is active or on initial load
  useEffect(() => {
    if (!user || role !== 'admin') return;
    if (activeTab === 'testimonials' || activeTab === 'overview') {
      setTestimonialsLoading(true);
      getAllTestimonialsAdmin()
        .then(data => setTestimonials(data))
        .catch(e => setTestimonialError(e.message || 'Failed to load testimonials'))
        .finally(() => setTestimonialsLoading(false));
    }
  }, [user, role, activeTab, getAllTestimonialsAdmin]);

  // Load awards only when awards tab is active or on initial load
  useEffect(() => {
    if (!user || role !== 'admin') return;
    if (activeTab === 'awards' || activeTab === 'overview') {
      setAwardsLoading(true);
      getAllAwards()
        .then(data => setAwards(data))
        .catch(e => setAwardsError(e.message || 'Failed to load awards'))
        .finally(() => setAwardsLoading(false));
    }
  }, [user, role, activeTab, getAllAwards]);

  // Load menu categories only when menu tab is active or on initial load
  useEffect(() => {
    if (!user || role !== 'admin') return;
    if (activeTab === 'menu' || activeTab === 'overview') {
      setMenuCategoriesLoading(true);
      getMenuCategories()
        .then(data => setMenuCategories(data))
        .catch(e => setMenuCategoriesError(e.message || 'Failed to load menu categories'))
        .finally(() => setMenuCategoriesLoading(false));
    }
  }, [user, role, activeTab, getMenuCategories]);

  // Load menu with items only when menu tab is active or on initial load
  useEffect(() => {
    if (!user || role !== 'admin') return;
    if (activeTab === 'menu' || activeTab === 'overview') {
      setMenuItemsLoading(true);
      getMenuWithItems()
        .then(data => setMenuWithItems(data))
        .catch(e => setMenuItemsError(e.message || 'Failed to load menu items'))
        .finally(() => setMenuItemsLoading(false));
    }
  }, [user, role, activeTab, getMenuWithItems]);

  // Load gallery images only when gallery tab is active
  useEffect(() => {
    if (!user || role !== 'admin') return;
    if (activeTab === 'gallery') {
      setGalleryLoading(true);
      getGalleryImages()
        .then(data => setGalleryImages(data))
        .catch(e => setGalleryError(e.message || 'Failed to load gallery images'))
        .finally(() => setGalleryLoading(false));
    }
  }, [activeTab, user, role, getGalleryImages]);

  // Load reservations when reservations tab is active
  useEffect(() => {
    if (activeTab === 'reservations' && user && role === 'admin') {
      loadDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, user, role, currentPage]);

  const loadDashboardData = async () => {
    setFetching(true);
    try {
      const response = await getAllReservationsWithCustomers(currentPage);
      
      if (response.error) {
        setError("Failed to fetch reservations.");
      } else {
        // Handle new paginated response format
        if (response.reservations && Array.isArray(response.reservations)) {
          setReservations(response.reservations);
          setCurrentPage(response.current_page || 1);
          setTotalPages(response.pages || 1);
          setTotalReservations(response.total || response.reservations.length);
        } else if (Array.isArray(response)) {
          // Handle old format (fallback)
          setReservations(response);
          setCurrentPage(1);
          setTotalPages(1);
          setTotalReservations(response.length);
        } else {
          setReservations([]);
          setCurrentPage(1);
          setTotalPages(1);
          setTotalReservations(0);
        }
        setError("");
      }
    } catch (err) {
      setError("Failed to fetch reservations.");
    } finally {
      setFetching(false);
    }
  };

  // Gallery handlers
  const handleAddGalleryImage = () => {
    setEditingGalleryImage(null);
    setGalleryForm({ url: '', alt: '', category: '', display_order: 0, is_active: true });
    setShowGalleryModal(true);
  };

  const handleEditGalleryImage = (img: GalleryImage) => {
    setEditingGalleryImage(img);
    setGalleryForm({ ...img });
    setShowGalleryModal(true);
  };

  const handleGalleryFormSubmit = async () => {
    try {
      const payload = {
        url: galleryForm.url,
        alt: galleryForm.alt,
        category: galleryForm.category,
        display_order: parseInt(galleryForm.display_order.toString(), 10) || 0,
        is_active: Boolean(galleryForm.is_active),
      };
      if (editingGalleryImage) {
        const updated = await updateGalleryImage(editingGalleryImage.id, payload);
        setGalleryImages((prev: GalleryImage[]) => prev.map(img => img.id === editingGalleryImage.id ? updated : img));
      } else {
        const created = await createGalleryImage(payload);
        setGalleryImages((prev: GalleryImage[]) => [...prev, created]);
      }
      setShowGalleryModal(false);
      setEditingGalleryImage(null);
      setGalleryForm({ url: '', alt: '', category: '', display_order: 0, is_active: true });
      toast({ title: 'Gallery image saved', description: 'Gallery image has been saved successfully.' });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save gallery image';
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    }
  };

  const handleDeleteGalleryImage = async (img: GalleryImage) => {
    try {
      await deleteGalleryImage(img.id);
      setGalleryImages(galleryImages.filter((g: GalleryImage) => g.id !== img.id));
      toast({ title: 'Gallery image deleted' });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete gallery image';
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    }
  };

  // Reservation handlers
  const handleCancel = async (reservation: Reservation) => {
    try {
      setCancelTarget(reservation);
      setShowCancelModal(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to open cancel modal';
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    }
  };

  const confirmCancel = async () => {
    if (!cancelTarget) return;
    setCancelLoadingId(cancelTarget.id);
    try {
      await cancelReservation(cancelTarget.id);
      setReservations(reservations.filter(r => r.id !== cancelTarget.id));
      setShowCancelModal(false);
      setCancelTarget(null);
      toast({ title: 'Reservation cancelled' });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel reservation';
      setCancelError(errorMessage);
    } finally {
      setCancelLoadingId(null);
    }
  };

  const handleEdit = async (reservation: Reservation) => {
    try {
      setEditReservation(reservation);
      setEditForm({ 
        date: reservation.date || reservation.reservation_date || '',
        time: reservation.time || reservation.reservation_time || '',
        party_size: reservation.party_size?.toString() || reservation.number_of_guests?.toString() || '',
        number_of_guests: reservation.number_of_guests?.toString() || reservation.party_size?.toString() || '',
        status: reservation.status || ''
      });
      setShowEditModal(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to open edit modal';
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    }
  };

  const handleEditSave = async () => {
    if (!editReservation || !editForm) return;
    setEditLoading(true);
    try {
      const updatedReservation = await updateReservation(editReservation.id, editForm);
      setReservations(reservations.map(r => r.id === editReservation.id ? {
        ...r,
        ...updatedReservation
      } : r));
      setShowEditModal(false);
      setEditReservation(null);
      setEditForm(null);
      toast({ title: 'Reservation updated', description: 'The reservation has been updated successfully.' });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update reservation';
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    } finally {
      setEditLoading(false);
    }
  };

  // Export to CSV
  const exportCSV = () => {
    const headers = [
      'Date', 'Time', 'Number of Guests', 'Table', 'Status', 'Name', 'Email'
    ];
    const rows = reservations.filter(r => {
      const matchDate = filter.date ? r.reservation_date === filter.date || r.date === filter.date : true;
      const matchStatus = filter.status ? r.status === filter.status : true;
      return matchDate && matchStatus;
    }).map(r => [
      r.date || r.reservation_date,
      r.time || r.reservation_time,
      r.party_size,
      r.table_number,
      r.status,
      r.customer?.name || r.name || '-',
      r.customer?.email || r.email || '-'
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reservations.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Testimonial handlers


  // Award handlers
  const handleEditAward = (award: Award) => {
    setEditingAward(award);
    setAwardForm({
      name: award.name || '',
      description: award.description || '',
      year: award.year || '',
      category: award.category || '',
      is_featured: award.is_featured || false,
      display_order: award.display_order || 1,
    });
    setShowAwardModal(true);
  };

  const handleAwardSubmit = async () => {
    try {
      if (editingAward) {
        const updatedAward = await updateAward(editingAward.id, awardForm);
        setAwards((prev: Award[]) => prev.map(a => a.id === editingAward.id ? { ...a, ...updatedAward } : a));
        toast({ title: 'Award updated', description: 'The award has been updated.' });
      } else {
        const newAward = await createAward(awardForm);
        setAwards((prev: Award[]) => [...prev, newAward]);
        toast({ title: 'Award added', description: 'The award has been added.' });
      }
      setShowAwardModal(false);
      setEditingAward(null);
      setAwardForm({ name: '', description: '', year: '', category: '', is_featured: false, display_order: 1 });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save award';
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    }
  };

  // Menu handlers
  const handleEditMenuCategory = (category: MenuCategory) => {
    setEditingMenuCategory(category);
    setMenuCategoryForm({
      name: category.name || '',
      description: category.description || '',
      display_order: category.display_order || 1,
      is_active: category.is_active ?? true,
      icon: category.icon || '',
    });
    setShowMenuCategoryModal(true);
  };
  
  const handleMenuCategorySubmit = async () => {
    try {
      if (editingMenuCategory) {
        const updatedCategory = await updateMenuCategory(editingMenuCategory.id, menuCategoryForm);
        setMenuCategories((prev: MenuCategory[]) => 
          prev.map(c => c.id === editingMenuCategory.id ? { ...c, ...updatedCategory } : c)
        );
        // Also update the menuWithItems state to reflect category changes
        setMenuWithItems((prev: MenuWithItems[]) => 
          prev.map(cat => cat.id === editingMenuCategory.id ? { ...cat, ...updatedCategory } : cat)
        );
        toast({ title: 'Category updated', description: 'The category has been updated.' });
      } else {
        const newCategory = await createMenuCategory(menuCategoryForm);
        setMenuCategories((prev: MenuCategory[]) => [...prev, newCategory]);
        toast({ title: 'Category added', description: 'The category has been added.' });
      }
      setShowMenuCategoryModal(false);
      setEditingMenuCategory(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save category';
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    }
  };

  const handleEditMenuItem = (item: MenuItem) => {
    setEditingMenuItem(item);
    setMenuItemForm({
      name: item.name || '',
      description: item.description || '',
      price: item.price?.toString() || '',
      category_id: item.category_id || '',
      is_vegetarian: item.is_vegetarian ?? false,
      is_gluten_free: item.is_gluten_free ?? false,
      is_spicy: item.is_spicy ?? false,
      is_active: item.is_active ?? true,
    });
    setShowMenuItemModal(true);
  };

  const handleMenuItemSubmit = async () => {
    try {
      if (editingMenuItem) {
        const updatedItem = await updateMenuItem(editingMenuItem.id, menuItemForm);
        setMenuWithItems((prev: MenuWithItems[]) => 
          prev.map(category => ({
            ...category,
            items: category.items?.map(item => 
              item.id === editingMenuItem.id ? { ...item, ...updatedItem } : item
            ) || []
          }))
        );
        toast({ title: 'Menu item updated', description: 'The menu item has been updated.' });
      } else {
        const newItem = await createMenuItem(menuItemForm);
        setMenuWithItems((prev: MenuWithItems[]) => {
          return prev.map(cat =>
            cat.id === newItem.category_id
              ? { ...cat, items: [...(cat.items || []), newItem] }
              : cat
          );
        });
        toast({ title: 'Menu item added', description: 'The menu item has been added.' });
      }
      setShowMenuItemModal(false);
      setEditingMenuItem(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save menu item';
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Debug authentication state
  console.log('🔍 AdminDashboard Auth State:', {
    loading,
    user: user?.email,
    role,
    jwt: localStorage.getItem('jwt') ? 'present' : 'missing'
  });

  if (!user || role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h2>
          <p className="text-slate-600 mb-4">You don't have permission to access the admin dashboard.</p>
          <div className="text-sm text-slate-500 space-y-1">
            <p>Loading: {loading.toString()}</p>
            <p>User: {user?.email || 'null'}</p>
            <p>Role: {role || 'null'}</p>
            <p>JWT Token: {localStorage.getItem('jwt') ? 'Present' : 'Missing'}</p>
          </div>
        </div>
      </div>
    );
  }

  const stats: DashboardStats = {
    totalReservations,
    pendingReservations: reservations.filter(r => r.status === 'pending').length,
    todayReservations: reservations.filter(r => {
      const today = new Date().toISOString().split('T')[0];
      return r.date === today;
    }).length,
    totalTestimonials: testimonials.length,
    totalAwards: awards.length,
    totalMenuItems: menuWithItems.reduce((acc, cat) => acc + cat.items.length, 0)
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userEmail={user.email}
        onSignOut={handleSignOut}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
            >
              <Brain className="h-5 w-5" />
            </button>
            <h2 className="text-2xl font-bold text-slate-800 capitalize">
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "reservations" && "Reservations"}
              {activeTab === "testimonials" && "Testimonials"}
              {activeTab === "awards" && "Awards"}
              {activeTab === "menu" && "Menu Management"}
              {activeTab === "gallery" && "Gallery Management"}
            </h2>
            <div className="w-8 lg:hidden"></div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 flex-1 overflow-y-auto">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <DashboardOverview 
              stats={stats}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {/* Reservations Tab */}
          {activeTab === "reservations" && (
            <ReservationsManagement
              reservations={reservations}
              fetching={delayedFetching}
              error={error}
              filter={filter}
              setFilter={setFilter}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              totalReservations={totalReservations}
              cancelLoadingId={cancelLoadingId}
              onEdit={handleEdit}
              onCancel={handleCancel}
            />
          )}

          {/* Testimonials Tab */}
          {activeTab === "testimonials" && (
            <TestimonialsManagement
              testimonials={testimonials}
              loading={delayedTestimonialsLoading}
              error={testimonialError}
              onApprove={async (testimonialId) => {
                try {
                  await approveTestimonial(testimonialId, true);
                  setTestimonials((prev: Testimonial[]) => prev.map(t => t.id === testimonialId ? { ...t, is_approved: true } : t));
                  toast({ title: 'Testimonial approved', description: 'The testimonial has been approved.' });
                } catch (err: unknown) {
                  const errorMessage = err instanceof Error ? err.message : 'Failed to approve testimonial';
                  toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
                }
              }}
            />
          )}

          {/* Awards Tab */}
          {activeTab === "awards" && (
            <AwardsManagement
              awards={awards}
              loading={delayedAwardsLoading}
              error={awardsError}
              onEdit={handleEditAward}
              onAdd={() => setShowAwardModal(true)}
            />
          )}

          {/* Menu Tab */}
          {activeTab === "menu" && (
            <MenuManagement
              menuCategories={menuCategories}
              menuWithItems={menuWithItems}
              categoriesLoading={delayedMenuCategoriesLoading}
              itemsLoading={delayedMenuItemsLoading}
              categoriesError={menuCategoriesError}
              itemsError={menuItemsError}
              onEditCategory={handleEditMenuCategory}
              onEditItem={handleEditMenuItem}
              onAddCategory={() => setShowMenuCategoryModal(true)}
              onAddItem={() => setShowMenuItemModal(true)}
            />
          )}

          {/* Gallery Tab */}
          {activeTab === "gallery" && (
            <GalleryManagement
              galleryImages={galleryImages}
              loading={delayedGalleryLoading}
              error={galleryError}
              onEdit={handleEditGalleryImage}
              onDelete={handleDeleteGalleryImage}
              onAdd={handleAddGalleryImage}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <EditReservationModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        editForm={editForm}
        setEditForm={setEditForm}
        onSave={handleEditSave}
        loading={editLoading}
      />

      <CancelReservationModal
        open={showCancelModal}
        onOpenChange={setShowCancelModal}
        reservation={cancelTarget}
        onConfirm={confirmCancel}
        loading={cancelLoadingId === cancelTarget?.id}
        error={cancelError}
      />



      <AwardModal
        open={showAwardModal}
        onOpenChange={setShowAwardModal}
        award={editingAward}
        form={awardForm}
        setForm={setAwardForm}
        onSubmit={handleAwardSubmit}
      />

      <MenuCategoryModal
        open={showMenuCategoryModal}
        onOpenChange={setShowMenuCategoryModal}
        category={editingMenuCategory}
        form={menuCategoryForm}
        setForm={setMenuCategoryForm}
        onSubmit={handleMenuCategorySubmit}
      />

      <MenuItemModal
        open={showMenuItemModal}
        onOpenChange={setShowMenuItemModal}
        item={editingMenuItem}
        form={menuItemForm}
        setForm={setMenuItemForm}
        categories={menuCategories}
        onSubmit={handleMenuItemSubmit}
      />

      <GalleryModal
        open={showGalleryModal}
        onOpenChange={setShowGalleryModal}
        image={editingGalleryImage}
        form={galleryForm}
        setForm={setGalleryForm}
        onSubmit={handleGalleryFormSubmit}
      />
    </div>
  );
} 