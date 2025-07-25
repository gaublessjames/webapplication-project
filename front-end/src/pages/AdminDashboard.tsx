import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useApi } from "@/hooks/useApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Calendar, 
  Clock, 
  Users, 
  Star, 
  StarOff, 
  Trophy, 
  Utensils, 
  Image, 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Upload, 
  Eye, 
  EyeOff,
  CheckCircle,
  XCircle,
  AlertCircle,
  Settings,
  BarChart3,
  FileText,
  MessageSquare,
  Palette,
  LogOut,
  Menu,
  X,
  Brain
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import HeroBookingForm, { handleDownloadPDF } from "@/components/HeroBookingForm";

const ADMIN_EMAILS = ["admin@cafefausse.com"];

export default function AdminDashboard() {
  const { user, loading, role, signOut } = useAuth();
  const { toast } = useToast();
  
  // State management
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Reservations
  const [reservations, setReservations] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState({ date: '', status: '' });
  const [editReservation, setEditReservation] = useState<any | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<any | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [cancelLoadingId, setCancelLoadingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReservations, setTotalReservations] = useState(0);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<any | null>(null);
  const [cancelError, setCancelError] = useState("");
  
  // Testimonials
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(false);
  const [testimonialError, setTestimonialError] = useState("");
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<any | null>(null);
  const [testimonialForm, setTestimonialForm] = useState<any>({ 
    title: '', 
    comment: '', 
    rating: 5, 
    customer_name: '', 
    is_approved: false 
  });
  
  // Awards
  const [awards, setAwards] = useState<any[]>([]);
  const [awardsLoading, setAwardsLoading] = useState(false);
  const [awardsError, setAwardsError] = useState("");
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [editingAward, setEditingAward] = useState<any | null>(null);
  const [awardForm, setAwardForm] = useState<any>({ 
    name: '', 
    description: '', 
    year: '', 
    category: '', 
    is_featured: false, 
    display_order: 1 
  });
  
  // Menu Categories
  const [menuCategories, setMenuCategories] = useState<any[]>([]);
  const [menuCategoriesLoading, setMenuCategoriesLoading] = useState(false);
  const [menuCategoriesError, setMenuCategoriesError] = useState("");
  const [showMenuCategoryModal, setShowMenuCategoryModal] = useState(false);
  const [editingMenuCategory, setEditingMenuCategory] = useState<any | null>(null);
  const [menuCategoryForm, setMenuCategoryForm] = useState<any>({ 
    name: '', 
    description: '', 
    display_order: 1, 
    is_active: true, 
    icon: '' 
  });
  
  // Menu Items
  const [menuWithItems, setMenuWithItems] = useState<any[]>([]);
  const [menuItemsLoading, setMenuItemsLoading] = useState(false);
  const [menuItemsError, setMenuItemsError] = useState("");
  const [showMenuItemModal, setShowMenuItemModal] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<any | null>(null);
  const [menuItemForm, setMenuItemForm] = useState<any>({ 
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
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryError, setGalleryError] = useState("");
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [editingGalleryImage, setEditingGalleryImage] = useState<any | null>(null);
  const [galleryForm, setGalleryForm] = useState<any>({ 
    url: '', 
    alt: '', 
    category: '', 
    display_order: 0, 
    is_active: true 
  });
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
    updateTestimonial
  } = useApi();

  // File upload handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        // Convert to data URL for preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setGalleryForm(prev => ({ ...prev, url: e.target?.result as string }));
        };
        reader.readAsDataURL(file);
      } else {
        toast({ 
          title: "Invalid file type", 
          description: "Please select an image file.", 
          variant: "destructive" 
        });
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setGalleryForm(prev => ({ ...prev, url: e.target?.result as string }));
        };
        reader.readAsDataURL(file);
      } else {
        toast({ 
          title: "Invalid file type", 
          description: "Please select an image file.", 
          variant: "destructive" 
        });
      }
    }
  };

  // Load data effects
  useEffect(() => {
    if (!user || role !== 'admin') return;
    loadDashboardData();
  }, [user, role, currentPage]);

  // Load testimonials
  useEffect(() => {
    if (!user || role !== 'admin') return;
    setTestimonialsLoading(true);
    getAllTestimonialsAdmin()
      .then(data => setTestimonials(data))
      .catch(e => setTestimonialError(e.message || 'Failed to load testimonials'))
      .finally(() => setTestimonialsLoading(false));
  }, [user, role]);

  // Load awards
  useEffect(() => {
    if (!user || role !== 'admin') return;
    setAwardsLoading(true);
    getAllAwards()
      .then(data => setAwards(data))
      .catch(e => setAwardsError(e.message || 'Failed to load awards'))
      .finally(() => setAwardsLoading(false));
  }, [user, role]);

  // Load menu categories
  useEffect(() => {
    if (!user || role !== 'admin') return;
    setMenuCategoriesLoading(true);
    getMenuCategories()
      .then(data => setMenuCategories(data))
      .catch(e => setMenuCategoriesError(e.message || 'Failed to load menu categories'))
      .finally(() => setMenuCategoriesLoading(false));
  }, [user, role]);

  // Load menu with items
  useEffect(() => {
    if (!user || role !== 'admin') return;
    setMenuItemsLoading(true);
    getMenuWithItems()
      .then(data => setMenuWithItems(data))
      .catch(e => setMenuItemsError(e.message || 'Failed to load menu items'))
      .finally(() => setMenuItemsLoading(false));
  }, [user, role]);

  // Load gallery images
  useEffect(() => {
    if (activeTab === 'gallery') {
      setGalleryLoading(true);
      getGalleryImages()
        .then(data => setGalleryImages(data))
        .catch(e => setGalleryError(e.message || 'Failed to load gallery images'))
        .finally(() => setGalleryLoading(false));
    }
  }, [activeTab]);

  // Add this useEffect after the other useEffects
  useEffect(() => {
    if (activeTab === 'reservations' && user && role === 'admin') {
      loadDashboardData();
    }
    // eslint-disable-next-line
  }, [activeTab, user, role, currentPage]);

  const loadDashboardData = async () => {
    setFetching(true);
    try {
      const response = await getAllReservationsWithCustomers(currentPage);
      if (response.error) {
        setError("Failed to fetch reservations.");
      } else {
        if (Array.isArray(response.reservations)) {
          setReservations(response.reservations);
          setCurrentPage(response.current_page || 1);
          setTotalPages(response.pages || 1);
          setTotalReservations(response.total || response.reservations.length);
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
    setSelectedFile(null);
    setUploadMethod('url');
    setShowGalleryModal(true);
  };

  const handleEditGalleryImage = (img: any) => {
    setEditingGalleryImage(img);
    setGalleryForm({ ...img });
    setSelectedFile(null);
    setUploadMethod('url');
    setShowGalleryModal(true);
  };

  const handleGalleryFormChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setGalleryForm((f: any) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleGalleryFormSubmit = async (e: any) => {
    e.preventDefault();
    try {
      // Only send allowed fields
      const payload = {
        url: galleryForm.url,
        alt: galleryForm.alt,
        category: galleryForm.category,
        display_order: parseInt(galleryForm.display_order, 10) || 0,
        is_active: Boolean(galleryForm.is_active),
      };
      if (editingGalleryImage) {
        const updated = await updateGalleryImage(editingGalleryImage.id, payload);
        setGalleryImages((prev: any[]) => prev.map(img => img.id === editingGalleryImage.id ? updated : img));
      } else {
        const created = await createGalleryImage(payload);
        setGalleryImages((prev: any[]) => [...prev, created]);
      }
      setShowGalleryModal(false);
      setEditingGalleryImage(null);
      setGalleryForm({ url: '', alt: '', category: '', display_order: 0, is_active: true });
      setSelectedFile(null);
      toast({ title: 'Gallery image saved', description: 'Gallery image has been saved successfully.' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to save gallery image', variant: 'destructive' });
    }
  };

  const handleDeleteGalleryImage = async (img: any) => {
    try {
      await deleteGalleryImage(img.id);
      setGalleryImages(galleryImages.filter((g: any) => g.id !== img.id));
      toast({ title: 'Gallery image deleted' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to delete gallery image', variant: 'destructive' });
    }
  };

  // Other handlers (simplified for brevity)
  const handleCancel = async (reservation: any) => {
    try {
      setCancelTarget(reservation);
      setShowCancelModal(true);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to open cancel modal', variant: 'destructive' });
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
    } catch (err: any) {
      setCancelError(err.message || 'Failed to cancel reservation');
    } finally {
      setCancelLoadingId(null);
    }
  };

  const handleEdit = async (reservation: any) => {
    try {
      setEditReservation(reservation);
      setEditForm({ ...reservation });
      setShowEditModal(true);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to open edit modal', variant: 'destructive' });
    }
  };

  const handleEditSave = async () => {
    if (!editReservation || !editForm) return;
    setEditLoading(true);
    try {
      await updateReservation(editReservation.id, editForm);
      setReservations(reservations.map(r => r.id === editReservation.id ? { ...r, ...editForm } : r));
      setShowEditModal(false);
      setEditReservation(null);
      setEditForm(null);
      toast({ title: 'Reservation updated' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to update reservation', variant: 'destructive' });
    } finally {
      setEditLoading(false);
    }
  };

  // Export to CSV
  const exportCSV = () => {
    const headers = [
      'Date', 'Time', 'Guests', 'Table', 'Status', 'Name', 'Email'
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
      r.customers?.name || r.name || '-',
      r.customers?.email || r.email || '-'
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

  // Add handler to open testimonial modal for editing
  const handleEditTestimonial = (testimonial: any) => {
    setEditingTestimonial(testimonial);
    setTestimonialForm({
      title: testimonial.title || '',
      comment: testimonial.comment || '',
      rating: testimonial.rating || 5,
      customer_name: testimonial.customer_name || '',
      is_approved: testimonial.is_approved || false,
    });
    setShowTestimonialModal(true);
  };

  // Add handler to open award modal for editing
  const handleEditAward = (award: any) => {
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

  // Add handlers for editing menu category and menu item
  const handleEditMenuCategory = (category: any) => {
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
  const handleEditMenuItem = (item: any) => {
    setEditingMenuItem(item);
    setMenuItemForm({
      name: item.name || '',
      description: item.description || '',
      price: item.price || '',
      category_id: item.category_id || '',
      is_vegetarian: item.is_vegetarian ?? false,
      is_gluten_free: item.is_gluten_free ?? false,
      is_spicy: item.is_spicy ?? false,
      is_active: item.is_active ?? true,
    });
    setShowMenuItemModal(true);
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

  if (!user || role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h2>
          <p className="text-slate-600">You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  const stats = {
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
      <div className={`z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0 fixed inset-y-0 left-0' : 'lg:relative -translate-x-full lg:translate-x-0'
      }`} style={{ minHeight: '100vh' }}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div>
              <h1 className="text-xl font-bold text-slate-800">Admin Dashboard</h1>
              <p className="text-sm text-slate-500">Café Fausse</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
            >
              <Brain className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "overview" 
                  ? "bg-primary-50 text-primary-700 border border-primary-200" 
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab("reservations")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "reservations" 
                  ? "bg-primary-50 text-primary-700 border border-primary-200" 
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Calendar className="h-5 w-5" />
              <span>Reservations</span>
            </button>

            <button
              onClick={() => setActiveTab("testimonials")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "testimonials" 
                  ? "bg-primary-50 text-primary-700 border border-primary-200" 
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <MessageSquare className="h-5 w-5" />
              <span>Testimonials</span>
            </button>

            <button
              onClick={() => setActiveTab("awards")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "awards" 
                  ? "bg-primary-50 text-primary-700 border border-primary-200" 
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Trophy className="h-5 w-5" />
              <span>Awards</span>
            </button>

            <button
              onClick={() => setActiveTab("menu")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "menu" 
                  ? "bg-primary-50 text-primary-700 border border-primary-200" 
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Utensils className="h-5 w-5" />
              <span>Menu</span>
            </button>

            <button
              onClick={() => setActiveTab("gallery")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "gallery" 
                  ? "bg-primary-50 text-primary-700 border border-primary-200" 
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Image className="h-5 w-5" />
              <span>Gallery</span>
            </button>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center space-x-3 px-4 py-2 text-sm text-slate-600">
              <Users className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
            <button
              onClick={signOut}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

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
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">Total Reservations</p>
                        <p className="text-2xl font-bold text-blue-800">{stats.totalReservations}</p>
                      </div>
                      <Calendar className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-yellow-600">Pending</p>
                        <p className="text-2xl font-bold text-yellow-800">{stats.pendingReservations}</p>
                      </div>
                      <Clock className="h-8 w-8 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">Today</p>
                        <p className="text-2xl font-bold text-green-800">{stats.todayReservations}</p>
                      </div>
                      <Users className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">Testimonials</p>
                        <p className="text-2xl font-bold text-purple-800">{stats.totalTestimonials}</p>
                      </div>
                      <MessageSquare className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-orange-600">Awards</p>
                        <p className="text-2xl font-bold text-orange-800">{stats.totalAwards}</p>
                      </div>
                      <Trophy className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-red-600">Menu Items</p>
                        <p className="text-2xl font-bold text-red-800">{stats.totalMenuItems}</p>
                      </div>
                      <Utensils className="h-8 w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Button 
                      onClick={() => setActiveTab("reservations")}
                      className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    >
                      <Calendar className="h-6 w-6" />
                      <span>Manage Reservations</span>
                    </Button>
                    <Button 
                      onClick={() => setActiveTab("testimonials")}
                      className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                    >
                      <MessageSquare className="h-6 w-6" />
                      <span>Review Testimonials</span>
                    </Button>
                    <Button 
                      onClick={() => setActiveTab("menu")}
                      className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                    >
                      <Utensils className="h-6 w-6" />
                      <span>Update Menu</span>
                    </Button>
                    <Button 
                      onClick={() => setActiveTab("gallery")}
                      className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    >
                      <Image className="h-6 w-6" />
                      <span>Manage Gallery</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Reservations Tab */}
          {activeTab === "reservations" && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-primary-700 text-2xl font-bold flex items-center justify-between">
                  <span>All Reservations</span>
                  <Button onClick={exportCSV} variant="outline" className="ml-4 flex items-center gap-2">
                    <Download className="w-4 h-4" /> Export CSV
                  </Button>
                </CardTitle>
                <div className="flex flex-wrap gap-4 mt-4">
                  <Input
                    type="date"
                    value={filter.date}
                    onChange={e => setFilter(f => ({ ...f, date: e.target.value }))}
                    className="border rounded px-3 py-2 w-48"
                    placeholder="Filter by date"
                  />
                  <Select
                    value={filter.status}
                    onValueChange={value => setFilter(f => ({ ...f, status: value }))}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-gray-600">
                      Showing page {currentPage} of {totalPages} ({totalReservations} reservations)
                    </div>
                    {totalPages > 1 && (
                      <div className="flex gap-2">
                        <Button size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>Prev</Button>
                        <Button size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>Next</Button>
                      </div>
                    )}
                  </div>
                  <table className="min-w-full border text-sm md:text-base">
                    <thead>
                      <tr className="bg-primary-100 text-primary-700">
                        <th className="px-4 py-2 border">Date</th>
                        <th className="px-4 py-2 border">Time</th>
                        <th className="px-4 py-2 border">Guests</th>
                        <th className="px-4 py-2 border">Table</th>
                        <th className="px-4 py-2 border">Status</th>
                        <th className="px-4 py-2 border">Name</th>
                        <th className="px-4 py-2 border">Email</th>
                        <th className="px-4 py-2 border">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fetching ? (
                        <tr><td colSpan={8} className="text-center py-8 text-gray-600">Loading reservations...</td></tr>
                      ) : error ? (
                        <tr><td colSpan={8} className="text-center py-8 text-red-600 font-medium">{error}</td></tr>
                      ) : reservations.length === 0 ? (
                        <tr><td colSpan={8} className="text-center py-8 text-gray-400 italic">No reservations found.</td></tr>
                      ) : (
                        reservations.filter(r => {
                          const matchDate = filter.date ? r.reservation_date === filter.date || r.date === filter.date : true;
                          const matchStatus = filter.status && filter.status !== 'all' ? r.status === filter.status : true;
                          return matchDate && matchStatus;
                        }).map((r) => (
                          <tr key={r.id} className="border-b hover:bg-primary-50 transition-colors">
                            <td className="px-4 py-2 border">{r.date || r.reservation_date}</td>
                            <td className="px-4 py-2 border">{r.time || r.reservation_time}</td>
                            <td className="px-4 py-2 border">{r.party_size}</td>
                            <td className="px-4 py-2 border">{r.table_number}</td>
                            <td className="px-4 py-2 border capitalize">{r.status}</td>
                            <td className="px-4 py-2 border">{r.customers?.name || r.name || "-"}</td>
                            <td className="px-4 py-2 border">{r.customers?.email || r.email || "-"}</td>
                            <td className="px-4 py-2 border flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleEdit(r)} className="px-2 py-1"><Edit className="w-4 h-4" /></Button>
                              <Button size="sm" variant="destructive" onClick={() => handleCancel(r)} className="px-2 py-1" disabled={cancelLoadingId === r.id}>
                                {cancelLoadingId === r.id ? <span className="animate-spin w-4 h-4 border-b-2 border-white rounded-full"></span> : <XCircle className="w-4 h-4" />}
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleDownloadPDF({
                                  reservationId: r.id,
                                  customerName: r.customers?.name || r.name || '',
                                  customerEmail: r.customers?.email || r.email || '',
                                  reservationDate: r.date || r.reservation_date || '',
                                  reservationTime: r.time || r.reservation_time || '',
                                  numberOfGuests: r.party_size || r.number_of_guests || 0,
                                  tableNumber: r.table_number || '',
                                })}
                                className="w-full md:w-auto mt-2"
                              >
                                Download PDF
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Testimonials Tab */}
          {activeTab === "testimonials" && (
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Testimonials</CardTitle>
                </CardHeader>
                <CardContent>
                  {testimonialsLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                      <span className="ml-3 text-slate-600">Loading testimonials...</span>
                    </div>
                  ) : testimonialError ? (
                    <div className="text-center py-12">
                      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                      <p className="text-red-600">{testimonialError}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {testimonials.map((testimonial) => (
                        <Card key={testimonial.id} className="overflow-hidden">
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-slate-800 mb-2">{testimonial.title}</h3>
                            <p className="text-slate-600 mb-3">"{testimonial.comment}"</p>
                            <p className="text-sm text-slate-500 flex items-center gap-1">Rating: {Array.from({ length: 5 }).map((_, i) => (
  <Star key={i} className={
    `h-4 w-4 ${i < testimonial.rating ? 'text-yellow-500 fill-yellow-400' : 'text-slate-300'}`
  } fill={i < testimonial.rating ? 'currentColor' : 'none'} />
))}</p>
                            <p className="text-sm text-slate-500 mt-2">By {testimonial.customer_name}</p>
                            <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
                              <span>{testimonial.is_approved ? 'Approved' : 'Pending Approval'}</span>
                              <span>{testimonial.created_at}</span>
                            </div>
                            <div className="flex items-center justify-end mt-4 space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditTestimonial(testimonial)}
                                className="bg-white/90 hover:bg-white"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              {/* Approve button for pending testimonials */}
                              {!testimonial.is_approved && (
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={async () => {
                                    try {
                                      await approveTestimonial(testimonial.id, true);
                                      setTestimonials((prev: any[]) => prev.map(t => t.id === testimonial.id ? { ...t, is_approved: true } : t));
                                      toast({ title: 'Testimonial approved', description: 'The testimonial has been approved.' });
                                    } catch (err: any) {
                                      toast({ title: 'Error', description: err.message || 'Failed to approve testimonial', variant: 'destructive' });
                                    }
                                  }}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  Approve
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Awards Tab */}
          {activeTab === "awards" && (
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Awards</CardTitle>
                  <Button onClick={() => setShowAwardModal(true)} className="bg-primary-600 hover:bg-primary-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Award
                  </Button>
                </CardHeader>
                <CardContent>
                  {awardsLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                      <span className="ml-3 text-slate-600">Loading awards...</span>
                    </div>
                  ) : awardsError ? (
                    <div className="text-center py-12">
                      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                      <p className="text-red-600">{awardsError}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {awards.map((award) => (
                        <Card key={award.id} className="overflow-hidden">
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-slate-800 mb-1">{award.name}</h3>
                            <p className="text-sm text-slate-500 mb-2">{award.description}</p>
                            <p className="text-sm text-slate-500">Year: {award.year}</p>
                            <p className="text-sm text-slate-500">Category: {award.category}</p>
                            <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
                              <span>{award.is_featured ? 'Featured' : 'Normal'}</span>
                              <span>{award.display_order}</span>
                            </div>
                            <div className="flex items-center justify-end mt-4">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditAward(award)}
                                className="bg-white/90 hover:bg-white"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              {/* <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteAward(award)}
                                className="bg-red-500/90 hover:bg-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button> */}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Menu Tab */}
          {activeTab === "menu" && (
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Menu Categories</CardTitle>
                  <Button onClick={() => setShowMenuCategoryModal(true)} className="bg-primary-600 hover:bg-primary-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </CardHeader>
                <CardContent>
                  {menuCategoriesLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                      <span className="ml-3 text-slate-600">Loading menu categories...</span>
                    </div>
                  ) : menuCategoriesError ? (
                    <div className="text-center py-12">
                      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                      <p className="text-red-600">{menuCategoriesError}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {menuCategories.map((category) => (
                        <Card key={category.id} className="overflow-hidden bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg border border-slate-200 hover:shadow-2xl transition-all duration-300">
                          <CardContent className="p-6 flex flex-col items-center text-center">
                            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-primary-100 to-primary-200 shadow mb-4 text-3xl">
                              {/* Render icon as emoji or lucide icon if available */}
                              <span>{category.icon || '🍽️'}</span>
                            </div>
                            <h3 className="font-bold text-lg text-primary-800 mb-1">{category.name}</h3>
                            <p className="text-sm text-slate-500 mb-2">{category.description}</p>
                            <div className="flex items-center justify-between text-xs text-slate-400 w-full mb-2">
                              <span>{category.is_active ? 'Active' : 'Inactive'}</span>
                              <span>Order: {category.display_order}</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 mt-2">
                              <Button size="sm" variant="outline" onClick={() => handleEditMenuCategory(category)} className="bg-white/90 hover:bg-white">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                            <Badge className={`px-3 py-1 rounded-full text-xs font-semibold ${category.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}
                              variant="secondary"
                            >
                              {category.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Menu Items</CardTitle>
                  <Button onClick={() => setShowMenuItemModal(true)} className="bg-primary-600 hover:bg-primary-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </CardHeader>
                <CardContent>
                  {menuItemsLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                      <span className="ml-3 text-slate-600">Loading menu items...</span>
                    </div>
                  ) : menuItemsError ? (
                    <div className="text-center py-12">
                      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                      <p className="text-red-600">{menuItemsError}</p>
                    </div>
                  ) : (
                    <div className="space-y-10">
                      {menuWithItems.map((category) => (
                        <div key={category.id}>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-primary-100 to-primary-200 shadow text-2xl">
                              <span>{category.icon || '🍽️'}</span>
                            </div>
                            <h4 className="text-xl font-bold text-primary-700">{category.name}</h4>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(category.items || []).length === 0 ? (
                              <div className="col-span-full text-slate-400 italic">No items in this category.</div>
                            ) : (
                              category.items.map((item) => (
                                <Card key={item.id} className="overflow-hidden bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg border border-slate-200 hover:shadow-2xl transition-all duration-300">
                                  <CardContent className="p-6 flex flex-col items-center text-center">
                                    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-orange-200 shadow mb-3 text-2xl">
                                      <Utensils className="h-7 w-7 text-orange-500" />
                                    </div>
                                    <h3 className="font-bold text-lg text-primary-800 mb-1">{item.name}</h3>
                                    <p className="text-sm text-slate-500 mb-2">{item.description}</p>
                                    <div className="flex items-center justify-between w-full mb-2">
                                      <span className="text-2xl font-bold text-orange-600 bg-orange-50 px-4 py-1 rounded-full shadow-sm border border-orange-200">
                                        ${typeof item.price === 'number' ? item.price.toFixed(2) : (parseFloat(item.price) ? Number(item.price).toFixed(2) : '0.00')}
                                      </span>
                                      <Badge className={`px-3 py-1 rounded-full text-xs font-semibold ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}
                                        variant="secondary"
                                      >
                                        {item.is_active ? 'Active' : 'Inactive'}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 mt-2">
                                      <Button size="sm" variant="outline" onClick={() => handleEditMenuItem(item)} className="bg-white/90 hover:bg-white">
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === "gallery" && (
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Gallery Images</CardTitle>
                  <Button onClick={handleAddGalleryImage} className="bg-primary-600 hover:bg-primary-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Image
                  </Button>
                </CardHeader>
                <CardContent>
                  {galleryLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                      <span className="ml-3 text-slate-600">Loading gallery images...</span>
                    </div>
                  ) : galleryError ? (
                    <div className="text-center py-12">
                      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                      <p className="text-red-600">{galleryError}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {galleryImages.map((img) => (
                        <Card key={img.id} className="overflow-hidden group">
                          <div className="relative aspect-square">
                            <img 
                              src={img.url} 
                              alt={img.alt} 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => handleEditGalleryImage(img)}
                                  className="bg-white/90 hover:bg-white"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteGalleryImage(img)}
                                  className="bg-red-500/90 hover:bg-red-500"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            {!img.is_active && (
                              <Badge variant="secondary" className="absolute top-2 left-2">
                                <EyeOff className="h-3 w-3 mr-1" />
                                Inactive
                              </Badge>
                            )}
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-slate-800 mb-1">{img.alt}</h3>
                            <p className="text-sm text-slate-500 mb-2">{img.category}</p>
                            <div className="flex items-center justify-between text-xs text-slate-400">
                              <span>Order: {img.display_order}</span>
                              <span>{img.is_active ? 'Active' : 'Inactive'}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Gallery Modal */}
          <Dialog open={showGalleryModal} onOpenChange={setShowGalleryModal}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingGalleryImage ? 'Edit Gallery Image' : 'Add Gallery Image'}
                </DialogTitle>
                <DialogDescription>
                  Upload an image or provide a URL to add it to the gallery.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleGalleryFormSubmit} className="space-y-6">
                {/* Upload Method Toggle */}
                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant={uploadMethod === 'url' ? 'default' : 'outline'}
                    onClick={() => setUploadMethod('url')}
                    className="flex-1"
                  >
                    Image URL
                  </Button>
                  <Button
                    type="button"
                    variant={uploadMethod === 'file' ? 'default' : 'outline'}
                    onClick={() => setUploadMethod('file')}
                    className="flex-1"
                  >
                    File Upload
                  </Button>
                </div>

                {/* URL Input */}
                {uploadMethod === 'url' && (
                  <div className="space-y-2">
                    <Label htmlFor="url">Image URL</Label>
                    <Input
                      id="url"
                      name="url"
                      type="url"
                      value={galleryForm.url}
                      onChange={handleGalleryFormChange}
                      placeholder="https://example.com/image.jpg"
                      required
                    />
                    {galleryForm.url && (
                      <div className="mt-2">
                        <Label>Preview</Label>
                        <img 
                          src={galleryForm.url} 
                          alt="Preview" 
                          className="w-full h-48 object-cover rounded-lg border"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* File Upload */}
                {uploadMethod === 'file' && (
                  <div className="space-y-2">
                    <Label>Upload Image</Label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        dragActive 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-slate-300 hover:border-slate-400'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600 mb-2">
                        Drag and drop an image here, or click to select
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Choose File
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>
                    {selectedFile && (
                      <div className="mt-2">
                        <Label>Selected File</Label>
                        <p className="text-sm text-slate-600">{selectedFile.name}</p>
                        <img 
                          src={galleryForm.url} 
                          alt="Preview" 
                          className="w-full h-48 object-cover rounded-lg border mt-2"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="alt">Alt Text</Label>
                    <Input
                      id="alt"
                      name="alt"
                      value={galleryForm.alt}
                      onChange={handleGalleryFormChange}
                      placeholder="Description of the image"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      name="category"
                      value={galleryForm.category}
                      onChange={handleGalleryFormChange}
                      placeholder="e.g., Food, Interior, Events"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="display_order">Display Order</Label>
                    <Input
                      id="display_order"
                      name="display_order"
                      type="number"
                      value={galleryForm.display_order}
                      onChange={handleGalleryFormChange}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center space-x-2">
                      <Checkbox
                        name="is_active"
                        checked={galleryForm.is_active}
                        onCheckedChange={(checked) => 
                          setGalleryForm(prev => ({ ...prev, is_active: checked as boolean }))
                        }
                      />
                      <span>Active</span>
                    </Label>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setShowGalleryModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary-600 hover:bg-primary-700">
                    {editingGalleryImage ? 'Update' : 'Add'} Image
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Cancel Reservation Modal */}
          <AlertDialog open={showCancelModal} onOpenChange={setShowCancelModal}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel Reservation</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to cancel this reservation? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmCancel} className="bg-red-600 hover:bg-red-700">
                  {cancelLoadingId === cancelTarget?.id ? 'Cancelling...' : 'Yes, Cancel'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Edit Reservation Modal */}
          <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Reservation</DialogTitle>
              </DialogHeader>
              {editForm && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={editForm.date || ''}
                        onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Time</Label>
                      <Input
                        type="time"
                        value={editForm.time || ''}
                        onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Party Size</Label>
                      <Input
                        type="number"
                        value={editForm.party_size || editForm.number_of_guests || ''}
                        onChange={(e) => setEditForm({ 
                          ...editForm, 
                          party_size: e.target.value,
                          number_of_guests: e.target.value 
                        })}
                      />
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Select
                        value={editForm.status || ''}
                        onValueChange={(value) => setEditForm({ ...editForm, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditSave} disabled={editLoading}>
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Testimonial Modal */}
          <Dialog open={showTestimonialModal} onOpenChange={setShowTestimonialModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    if (editingTestimonial) {
                      await updateTestimonial(editingTestimonial.id, testimonialForm);
                      setTestimonials((prev: any[]) => prev.map(t => t.id === editingTestimonial.id ? { ...t, ...testimonialForm } : t));
                      toast({ title: 'Testimonial updated', description: 'The testimonial has been updated.' });
                    }
                    setShowTestimonialModal(false);
                    setEditingTestimonial(null);
                  } catch (err: any) {
                    toast({ title: 'Error', description: err.message || 'Failed to update testimonial', variant: 'destructive' });
                  }
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={testimonialForm.title}
                    onChange={e => setTestimonialForm((f: any) => ({ ...f, title: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comment">Comment</Label>
                  <Textarea
                    id="comment"
                    name="comment"
                    value={testimonialForm.comment}
                    onChange={e => setTestimonialForm((f: any) => ({ ...f, comment: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating</Label>
                  <Input
                    id="rating"
                    name="rating"
                    type="number"
                    min={1}
                    max={5}
                    value={testimonialForm.rating}
                    onChange={e => setTestimonialForm((f: any) => ({ ...f, rating: Number(e.target.value) }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer_name">Customer Name</Label>
                  <Input
                    id="customer_name"
                    name="customer_name"
                    value={testimonialForm.customer_name}
                    onChange={e => setTestimonialForm((f: any) => ({ ...f, customer_name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2 flex items-center">
                  <Checkbox
                    name="is_approved"
                    checked={testimonialForm.is_approved}
                    onCheckedChange={checked => setTestimonialForm((f: any) => ({ ...f, is_approved: checked as boolean }))}
                  />
                  <span>Approved</span>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setShowTestimonialModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary-600 hover:bg-primary-700">
                    {editingTestimonial ? 'Update' : 'Add'} Testimonial
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Award Modal */}
          <Dialog open={showAwardModal} onOpenChange={setShowAwardModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingAward ? 'Edit Award' : 'Add Award'}</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    if (editingAward) {
                      await updateAward(editingAward.id, awardForm);
                      setAwards((prev: any[]) => prev.map(a => a.id === editingAward.id ? { ...a, ...awardForm } : a));
                      toast({ title: 'Award updated', description: 'The award has been updated.' });
                    } else {
                      await createAward(awardForm);
                      // Optionally reload awards
                    }
                    setShowAwardModal(false);
                    setEditingAward(null);
                  } catch (err: any) {
                    toast({ title: 'Error', description: err.message || 'Failed to save award', variant: 'destructive' });
                  }
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={awardForm.name}
                    onChange={e => setAwardForm((f: any) => ({ ...f, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={awardForm.description}
                    onChange={e => setAwardForm((f: any) => ({ ...f, description: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    name="year"
                    type="number"
                    value={awardForm.year}
                    onChange={e => setAwardForm((f: any) => ({ ...f, year: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    value={awardForm.category}
                    onChange={e => setAwardForm((f: any) => ({ ...f, category: e.target.value }))}
                  />
                </div>
                <div className="space-y-2 flex items-center">
                  <Checkbox
                    name="is_featured"
                    checked={awardForm.is_featured}
                    onCheckedChange={checked => setAwardForm((f: any) => ({ ...f, is_featured: checked as boolean }))}
                  />
                  <span>Featured</span>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    name="display_order"
                    type="number"
                    value={awardForm.display_order}
                    onChange={e => setAwardForm((f: any) => ({ ...f, display_order: Number(e.target.value) }))}
                    placeholder="0"
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setShowAwardModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary-600 hover:bg-primary-700">
                    {editingAward ? 'Update' : 'Add'} Award
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Menu Category Modal */}
          <Dialog open={showMenuCategoryModal} onOpenChange={setShowMenuCategoryModal}>
            <DialogContent className="max-w-lg bg-white rounded-2xl shadow-2xl p-8">
              <DialogHeader>
                <DialogTitle>{editingMenuCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    if (editingMenuCategory) {
                      await updateMenuCategory(editingMenuCategory.id, menuCategoryForm);
                      setMenuCategories((prev: any[]) => prev.map(c => c.id === editingMenuCategory.id ? { ...c, ...menuCategoryForm } : c));
                      toast({ title: 'Category updated', description: 'The category has been updated.' });
                    } else {
                      const newCategory = await createMenuCategory(menuCategoryForm);
                      setMenuCategories((prev: any[]) => [...prev, newCategory]);
                      toast({ title: 'Category added', description: 'The category has been added.' });
                    }
                    setShowMenuCategoryModal(false);
                    setEditingMenuCategory(null);
                  } catch (err: any) {
                    toast({ title: 'Error', description: err.message || 'Failed to save category', variant: 'destructive' });
                  }
                }}
                className="space-y-6"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-primary-700 mb-2">Category Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={menuCategoryForm.name}
                        onChange={e => setMenuCategoryForm((f: any) => ({ ...f, name: e.target.value }))}
                        required
                        autoFocus
                        className="border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 rounded-lg px-3 py-2 w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={menuCategoryForm.description}
                        onChange={e => setMenuCategoryForm((f: any) => ({ ...f, description: e.target.value }))}
                        className="border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 rounded-lg px-3 py-2 w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="icon">Icon</Label>
                      <Input
                        id="icon"
                        name="icon"
                        value={menuCategoryForm.icon}
                        onChange={e => setMenuCategoryForm((f: any) => ({ ...f, icon: e.target.value }))}
                        placeholder="e.g., Utensils, Wine, Coffee"
                        className="border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 rounded-lg px-3 py-2 w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="display_order">Display Order</Label>
                      <Input
                        id="display_order"
                        name="display_order"
                        type="number"
                        value={menuCategoryForm.display_order}
                        onChange={e => setMenuCategoryForm((f: any) => ({ ...f, display_order: Number(e.target.value) }))}
                        placeholder="0"
                        className="border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 rounded-lg px-3 py-2 w-full"
                      />
                    </div>
                    <div className="space-y-2 flex items-center">
                      <Checkbox
                        name="is_active"
                        checked={menuCategoryForm.is_active}
                        onCheckedChange={checked => setMenuCategoryForm((f: any) => ({ ...f, is_active: checked as boolean }))}
                      />
                      <span>Active</span>
                    </div>
                  </div>
                </div>
                <DialogFooter className="flex flex-row gap-4 justify-end mt-6">
                  <Button type="button" variant="outline" onClick={() => setShowMenuCategoryModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary-600 hover:bg-primary-700">
                    {editingMenuCategory ? 'Update' : 'Add'} Category
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Menu Item Modal */}
          <Dialog open={showMenuItemModal} onOpenChange={setShowMenuItemModal}>
            <DialogContent className="max-w-lg bg-white rounded-2xl shadow-2xl p-8">
              <DialogHeader>
                <DialogTitle>{editingMenuItem ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    if (editingMenuItem) {
                      await updateMenuItem(editingMenuItem.id, menuItemForm);
                      setMenuWithItems((prev: any[]) => prev.map(i => i.id === editingMenuItem.id ? { ...i, ...menuItemForm } : i));
                      toast({ title: 'Menu item updated', description: 'The menu item has been updated.' });
                    } else {
                      const newItem = await createMenuItem(menuItemForm);
                      setMenuWithItems((prev: any[]) => {
                        // Find the category and add the item to its items array
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
                  } catch (err: any) {
                    toast({ title: 'Error', description: err.message || 'Failed to save menu item', variant: 'destructive' });
                  }
                }}
                className="space-y-6"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-primary-700 mb-2">Menu Item Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={menuItemForm.name}
                        onChange={e => setMenuItemForm((f: any) => ({ ...f, name: e.target.value }))}
                        required
                        autoFocus
                        className="border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 rounded-lg px-3 py-2 w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={menuItemForm.description}
                        onChange={e => setMenuItemForm((f: any) => ({ ...f, description: e.target.value }))}
                        className="border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 rounded-lg px-3 py-2 w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        value={menuItemForm.price}
                        onChange={e => setMenuItemForm((f: any) => ({ ...f, price: e.target.value }))}
                        required
                        className="border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 rounded-lg px-3 py-2 w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category_id">Category</Label>
                      <Select
                        value={menuItemForm.category_id}
                        onValueChange={(value) => setMenuItemForm((f: any) => ({ ...f, category_id: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {menuCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 flex items-center">
                      <Checkbox
                        name="is_vegetarian"
                        checked={menuItemForm.is_vegetarian}
                        onCheckedChange={checked => setMenuItemForm((f: any) => ({ ...f, is_vegetarian: checked as boolean }))}
                      />
                      <span>Vegetarian</span>
                    </div>
                    <div className="space-y-2 flex items-center">
                      <Checkbox
                        name="is_gluten_free"
                        checked={menuItemForm.is_gluten_free}
                        onCheckedChange={checked => setMenuItemForm((f: any) => ({ ...f, is_gluten_free: checked as boolean }))}
                      />
                      <span>Gluten-Free</span>
                    </div>
                    <div className="space-y-2 flex items-center">
                      <Checkbox
                        name="is_spicy"
                        checked={menuItemForm.is_spicy}
                        onCheckedChange={checked => setMenuItemForm((f: any) => ({ ...f, is_spicy: checked as boolean }))}
                      />
                      <span>Spicy</span>
                    </div>
                    <div className="space-y-2 flex items-center">
                      <Checkbox
                        name="is_active"
                        checked={menuItemForm.is_active}
                        onCheckedChange={checked => setMenuItemForm((f: any) => ({ ...f, is_active: checked as boolean }))}
                      />
                      <span>Active</span>
                    </div>
                  </div>
                </div>
                <DialogFooter className="flex flex-row gap-4 justify-end mt-6">
                  <Button type="button" variant="outline" onClick={() => setShowMenuItemModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary-600 hover:bg-primary-700">
                    {editingMenuItem ? 'Update' : 'Add'} Menu Item
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}