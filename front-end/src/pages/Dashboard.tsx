import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Clock, Users, MapPin, X, AlertCircle, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroBookingForm, { handleDownloadPDF } from "@/components/HeroBookingForm";
import UserReservationForm from "@/components/UserReservationForm";
import { useApi } from '@/hooks/useApi';

interface Reservation {
  id: string;
  reservation_date?: string;
  reservation_time?: string;
  number_of_guests?: number;
  table_number: number;
  status: string;
  created_at: string;
  date?: string;
  time?: string;
  party_size?: number;
}

const Dashboard = () => {
  const { user, loading: authLoading, profile } = useAuth();
  const { getCustomerByEmail, getReservations, cancelReservation } = useApi();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const { toast } = useToast();
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    if (user) {
      fetchReservations();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchReservations = async () => {
    try {
      // First get the customer record for this user
      const customerRes = await getCustomerByEmail(user?.email);
      // Then get reservations for this customer
      const res = await getReservations();
      let filtered: any[] = [];
      if (customerRes && customerRes.customer) {
        // Match by customer_id
        filtered = (res.reservations || []).filter((r: any) => r.customer_id === customerRes.customer.id);
      }
      // Also include reservations that match the user's email (for legacy or direct bookings)
      if (user?.email) {
        const emailMatches = (res.reservations || []).filter((r: any) => r.email === user.email);
        // Merge and deduplicate by reservation id
        const all = [...filtered, ...emailMatches];
        filtered = all.filter((r, idx, arr) => arr.findIndex(x => x.id === r.id) === idx);
      }
      setReservations(filtered);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelReservationHandler = async (reservationId: string) => {
    setCancelling(reservationId);
    try {
      await cancelReservation(reservationId);
      setReservations(prev => prev.map(res => res.id === reservationId ? { ...res, status: 'cancelled' } : res));
      toast({
        title: 'Reservation cancelled',
        description: 'Your table has been freed up for other guests.',
      });
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel reservation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setCancelling(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleReservationSuccess = () => {
    // Refresh reservations when a new one is created
    fetchReservations();
  };

  // Stats calculations
  const totalReservations = reservations.length;
  const activeReservations = reservations.filter(r => r.status === 'confirmed' || r.status === 'pending').length;
  const cancelledReservations = reservations.filter(r => r.status === 'cancelled').length;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-primary-600">Sign In Required</CardTitle>
              <CardDescription>
                You need to be signed in to access your dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild className="bg-primary-600 hover:bg-primary-700">
                <Link to="/auth">Sign In</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome back, {user.email?.split('@')[0]}! 👋
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Manage your reservations and book new dining experiences
          </p>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="my-reservations" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                My Reservations
              </TabsTrigger>
              <TabsTrigger value="new-reservation" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Reservation
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Total Reservations</p>
                        <p className="text-2xl font-bold text-primary-600">{totalReservations}</p>
                      </div>
                      <Calendar className="w-8 h-8 text-primary-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Active Reservations</p>
                        <p className="text-2xl font-bold text-green-600">
                          {activeReservations}
                        </p>
                      </div>
                      <Users className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Cancelled</p>
                        <p className="text-2xl font-bold text-red-600">
                          {cancelledReservations}
                        </p>
                      </div>
                      <X className="w-8 h-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Reservations */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Reservations</CardTitle>
                  <CardDescription>Your latest dining bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  {reservations.slice(0, 3).length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No reservations yet</h3>
                      <p className="text-gray-600 mb-4">Start by making your first reservation!</p>
                      <Button className="bg-primary-600 hover:bg-primary-700" onClick={() => setTab("new-reservation")}>Make Reservation</Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reservations.slice(0, 3).map((reservation) => (
                        <div key={reservation.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className={`w-3 h-3 rounded-full ${
                              reservation.status === 'confirmed' ? 'bg-green-500' :
                              reservation.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'
                            }`}></div>
                            <div>
                              <p className="font-medium">{formatDate(reservation.date || '')}</p>
                              <p className="text-sm text-gray-600">
                                {formatTime(reservation.time || '')} • {reservation.party_size || 0} guests • Table {reservation.table_number}
                              </p>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500 capitalize">
                            {reservation.status}
                          </div>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleDownloadPDF({
                              reservationId: reservation.id,
                              customerName: profile?.full_name || user?.email?.split('@')[0] || '',
                              customerEmail: user?.email || '',
                              reservationDate: formatDate(reservation.date || reservation.reservation_date || ''),
                              reservationTime: formatTime(reservation.time || reservation.reservation_time || ''),
                              numberOfGuests: reservation.party_size || reservation.number_of_guests || 0,
                              tableNumber: reservation.table_number || '',
                            })}
                            className="w-full md:w-auto mt-2"
                          >
                            Download PDF
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* My Reservations Tab */}
            <TabsContent value="my-reservations" className="space-y-6">
              {reservations.length === 0 ? (
                <Card className="text-center p-8">
                  <CardContent className="pt-6">
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No reservations found</h3>
                    <p className="text-gray-600 mb-6">
                      You haven't made any reservations yet. Book your table now!
                    </p>
                    <Button className="bg-primary-600 hover:bg-primary-700" onClick={() => setTab("new-reservation")}>Make a Reservation</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">
                      All Reservations ({reservations.length})
                    </h2>
                  </div>

                  {reservations.map((reservation) => (
                    <Card key={reservation.id} className="shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-3">
                              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                reservation.status === 'confirmed' 
                                  ? 'bg-green-100 text-green-800'
                                  : reservation.status === 'cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {reservation.status === 'confirmed' && '✅ Confirmed'}
                                {reservation.status === 'cancelled' && '❌ Cancelled'}
                                {reservation.status === 'pending' && '⏳ Pending'}
                              </div>
                              <span className="text-sm text-gray-500">
                                Table #{reservation.table_number}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div className="flex items-center text-gray-600">
                                <Calendar className="w-4 h-4 mr-2 text-primary-600" />
                                <span>{formatDate(reservation.date || reservation.reservation_date || '')}</span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <Clock className="w-4 h-4 mr-2 text-primary-600" />
                                <span>{formatTime(reservation.time || reservation.reservation_time || '')}</span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <Users className="w-4 h-4 mr-2 text-primary-600" />
                                <span>{reservation.party_size || reservation.number_of_guests || 0} {(reservation.party_size === 1 || reservation.number_of_guests === 1) ? 'guest' : 'guests'}</span>
                              </div>
                            </div>

                            <div className="mt-3 text-xs text-gray-500">
                              Booked on {new Date(reservation.created_at).toLocaleDateString()}
                            </div>
                          </div>

                          {/* Always show Download PDF button, regardless of status */}
                          <div className="flex flex-col gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleDownloadPDF({
                                reservationId: reservation.id,
                                customerName: profile?.full_name || user?.email?.split('@')[0] || '',
                                customerEmail: user?.email || '',
                                reservationDate: formatDate(reservation.date || reservation.reservation_date || ''),
                                reservationTime: formatTime(reservation.time || reservation.reservation_time || ''),
                                numberOfGuests: reservation.party_size || reservation.number_of_guests || 0,
                                tableNumber: reservation.table_number || '',
                              })}
                              className="w-full md:w-auto mt-2"
                            >
                              Download PDF
                            </Button>
                            {/* Existing Cancel button and other controls remain below if needed */}
                            {reservation.status === 'confirmed' && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => cancelReservationHandler(reservation.id)}
                                disabled={cancelling === reservation.id}
                                className="w-full md:w-auto"
                              >
                                {cancelling === reservation.id ? (
                                  <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Cancelling...
                                  </div>
                                ) : (
                                  <>
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                  </>
                                )}
                              </Button>
                            )}
                            <div className="text-xs text-center text-gray-500 md:text-right">
                              Free cancellation
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Cancellation Policy */}
                  <Alert className="border-blue-200 bg-blue-50">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <strong>Cancellation Policy:</strong> You can cancel your reservation at any time. 
                      For large parties (6+ guests), we recommend 48-hour notice. Cancelled tables are 
                      immediately available for other guests to book.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </TabsContent>

            {/* New Reservation Tab */}
            <TabsContent value="new-reservation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Make a New Reservation</CardTitle>
                  <CardDescription>
                    Book your table for an exceptional dining experience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UserReservationForm onSuccess={handleReservationSuccess} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Dashboard;