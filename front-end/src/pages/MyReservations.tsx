import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Clock, Users, MapPin, X, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroBookingForm, { handleDownloadPDF } from "@/components/HeroBookingForm";

interface Reservation {
  id: string;
  reservation_date: string;
  reservation_time: string;
  number_of_guests: number;
  table_number: number;
  status: string;
  created_at: string;
}

const MyReservations = () => {
  const { user, loading: authLoading } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const { toast } = useToast();
  const { getUserReservations, cancelReservation } = useApi();

  useEffect(() => {
    if (user) {
      fetchReservations();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchReservations = async () => {
    try {
      if (!user?.email) {
        setReservations([]);
        setLoading(false);
        return;
      }

      const response = await getUserReservations(user.email);
      
      if (response.error) {
        console.error('Error fetching reservations:', response.error);
        setReservations([]);
      } else {
        setReservations(response.reservations || []);
      }
    } catch (error) {
      console.error('Error:', error);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId: string) => {
    setCancelling(reservationId);
    try {
      const response = await cancelReservation(reservationId, user?.email || undefined);
      
      if (response.error) {
        throw new Error(response.error);
      }

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
    } catch (error: any) {
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your reservations...</p>
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
                You need to be signed in to view your reservations.
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
            My Reservations 📅
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Manage your dining reservations at Café Fausse
          </p>
        </div>
      </section>

      {/* Reservations Content */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {reservations.length === 0 ? (
            <Card className="text-center p-8">
              <CardContent className="pt-6">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No reservations found</h3>
                <p className="text-gray-600 mb-6">
                  You haven't made any reservations yet. Book your table now!
                </p>
                <Button asChild className="bg-primary-600 hover:bg-primary-700">
                  <Link to="/reservations">Make a Reservation</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Your Reservations ({reservations.length})
                </h2>
                <Button asChild variant="outline" className="border-primary-600 text-primary-600 hover:bg-primary-50">
                  <Link to="/reservations">Make New Reservation</Link>
                </Button>
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
                            <span>{formatDate(reservation.reservation_date)}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="w-4 h-4 mr-2 text-primary-600" />
                            <span>{formatTime(reservation.reservation_time)}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Users className="w-4 h-4 mr-2 text-primary-600" />
                            <span>{reservation.number_of_guests} {reservation.number_of_guests === 1 ? 'guest' : 'guests'}</span>
                          </div>
                        </div>

                        <div className="mt-3 text-xs text-gray-500">
                          Booked on {new Date(reservation.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      {reservation.status === 'confirmed' && (
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelReservation(reservation.id)}
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
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleDownloadPDF({
                              reservationId: reservation.id,
                              customerName: user?.email?.split('@')[0] || '',
                              customerEmail: user?.email || '',
                              reservationDate: formatDate(reservation.reservation_date),
                              reservationTime: formatTime(reservation.reservation_time),
                              numberOfGuests: reservation.number_of_guests,
                              tableNumber: reservation.table_number,
                            })}
                            className="w-full md:w-auto mt-2"
                          >
                            Download PDF
                          </Button>
                          <div className="text-xs text-center text-gray-500 md:text-right">
                            Free cancellation
                          </div>
                        </div>
                      )}
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
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MyReservations;