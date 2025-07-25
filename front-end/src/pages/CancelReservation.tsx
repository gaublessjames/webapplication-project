import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LOCAL_API_URL } from "@/integrations/supabase/client";

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
    <div className="min-h-screen bg-primary-50 flex items-center justify-center px-4">
      <Card className="max-w-lg w-full shadow-xl border border-primary-100">
        <CardHeader>
          <CardTitle className="text-primary-700 text-2xl font-bold text-center">
            Cancel Reservation
          </CardTitle>
        </CardHeader>
        <CardContent>
          {uiState === "loading" && (
            <div className="text-center py-8 text-gray-600">Loading reservation...</div>
          )}
          {uiState === "error" && (
            <div className="text-red-600 text-center mt-8">
              <h2 className="text-xl font-semibold mb-2">Reservation not found.</h2>
              <p>
                This reservation could not be found. It may have already been cancelled, deleted, or the link is invalid.<br/>
                Please contact us if you need help.
              </p>
            </div>
          )}
          {uiState === "cancelled" && (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">✅</div>
              <div className="text-lg font-semibold text-primary-700 mb-2">Reservation Cancelled</div>
              <div className="text-gray-700 mb-6">Your reservation has been successfully cancelled. We hope to see you another time!</div>
              <Button asChild className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-2 rounded-lg">
                <Link to="/">Return Home</Link>
              </Button>
            </div>
          )}
          {uiState === "ready" && reservation && (
            <div className="text-center">
              <div className="text-4xl mb-4">🗓️</div>
              <div className="text-lg font-semibold text-primary-700 mb-2">Reservation Details</div>
              <div className="mb-4 text-gray-700">
                <div><b>Date:</b> {date}</div>
                <div><b>Time:</b> {time}</div>
                <div><b>Guests:</b> {guests}</div>
                <div><b>Table:</b> {table}</div>
                <div className="mt-2 text-sm text-gray-500">Reservation ID: {reservation?.id}</div>
              </div>
              <div className="mb-6 text-gray-600">Are you sure you want to cancel this reservation?</div>
              <Button
                onClick={handleCancel}
                disabled={isCancelling}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg"
              >
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