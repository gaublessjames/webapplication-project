import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LOCAL_API_URL } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/shared";
import { Calendar, Users, Clock, AlertTriangle, CheckCircle, X } from "lucide-react";

const CancelReservation = () => {
  const { id: idFromParams } = useParams();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const id = idFromParams || searchParams.get("id") || "";
  const [reservation, setReservation] = useState<any>(null);
  const [uiState, setUiState] = useState<'loading' | 'ready' | 'cancelling' | 'cancelled' | 'error'>("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchReservation() {
      setUiState("loading");
      setError("");
      setReservation(null);
      if (!id) {
        setError("Missing reservation information.");
        setUiState("error");
        return;
      }
      const fetchUrl = `${LOCAL_API_URL}/reservations/${id}`;
      try {
        const res = await fetch(fetchUrl);
        let data;
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.toLowerCase().includes('application/json')) {
          data = await res.json();
        } else {
          data = { error: "Unexpected server response. Please try again later." };
        }
        if (!res.ok) {
          setError(data.error || "Failed to load reservation.");
          setUiState("error");
          return;
        }
        // Accept both {reservation: {...}} and {...} for backward compatibility
        let reservationData = null;
        if (data && data.id) {
          reservationData = data;
        } else if (data && data.reservation && data.reservation.id) {
          reservationData = data.reservation;
        }
        if (!reservationData) {
          setError("Reservation not found.");
          setUiState("error");
          return;
        }
        setReservation(reservationData);
        setUiState("ready");
      } catch (err: any) {
        setError(err.message || "Reservation not found.");
        setUiState("error");
      }
    }
    fetchReservation();
  }, [email, id]);

  async function handleCancel() {
    setUiState("cancelling");
    setError("");
    const cancelUrl = `${LOCAL_API_URL}/reservations/cancel/${id}`;
    try {
      const res = await fetch(cancelUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      let data;
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.toLowerCase().includes('application/json')) {
        data = await res.json();
      } else {
        data = { error: "Unexpected server response. Please try again later." };
      }
      if (!res.ok) {
        setError(data.error || "Failed to cancel reservation.");
        setUiState("error");
        return;
      }
      setUiState("cancelled");
    } catch (err: any) {
      setError("Failed to cancel reservation. Please try again or contact us.");
      setUiState("error");
    }
  }

  // Map fields for robust display
  const date = reservation?.reservation_date || reservation?.date || "";
  const time = reservation?.reservation_time || reservation?.time || "";
  const guests = reservation?.number_of_guests || reservation?.party_size || reservation?.guests || "";
  const table = reservation?.table_number || reservation?.tableNumber || "";

  const isCancelling = uiState === "cancelling";

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4">
      <Card className="max-w-lg w-full shadow-xl border border-primary-200">
        <CardHeader className="text-center">
          <CardTitle className="text-primary-700 text-2xl font-bold">
            Cancel Reservation
          </CardTitle>
        </CardHeader>
        <CardContent>
          {uiState === "loading" && (
            <div className="text-center py-8">
              <LoadingSpinner text="Loading reservation..." />
            </div>
          )}
          {uiState === "error" && (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-red-700">Reservation not found</h2>
              <p className="text-gray-600">
                This reservation could not be found. It may have already been cancelled, deleted, or the link is invalid.<br/>
                Please contact us if you need help.
              </p>
            </div>
          )}
          {uiState === "cancelled" && (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <div className="text-lg font-semibold text-green-700 mb-2">Reservation Cancelled</div>
              <div className="text-gray-700 mb-6">Your reservation has been successfully cancelled. We hope to see you another time!</div>
              <Button asChild className="bg-primary-600 hover:bg-primary-700 text-white">
                <Link to="/" className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Return Home
                </Link>
              </Button>
            </div>
          )}
          {uiState === "ready" && reservation && (
            <div className="text-center">
              <Calendar className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <div className="text-lg font-semibold text-primary-700 mb-4">Reservation Details</div>
              <div className="mb-6 space-y-3 text-gray-700">
                <div className="flex items-center justify-center space-x-2">
                  <Calendar className="h-4 w-4 text-primary-600" />
                  <span><b>Date:</b> {date}</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Clock className="h-4 w-4 text-primary-600" />
                  <span><b>Time:</b> {time}</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Users className="h-4 w-4 text-primary-600" />
                  <span><b>Guests:</b> {guests}</span>
                </div>
                {table && (
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-2xl">🍽️</span>
                    <span><b>Table:</b> {table}</span>
                  </div>
                )}
                <div className="mt-4 text-sm text-gray-500">Reservation ID: {reservation?.id}</div>
              </div>
              <div className="mb-6 text-gray-600">Are you sure you want to cancel this reservation?</div>
              <Button
                onClick={handleCancel}
                disabled={isCancelling}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <X className="h-4 w-4 mr-2" />
                {isCancelling ? "Cancelling..." : "Yes, Cancel Reservation"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CancelReservation;