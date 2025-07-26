import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, CheckCircle, Clock, Users, Calendar } from "lucide-react";
import { generateReservationPDF, ReservationDetails } from "@/utils/pdf";

function formatTimeForDisplay(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

interface ReservationSummaryProps {
  reservation: ReservationDetails;
  onDownloadPDF?: () => void;
  showDownloadButton?: boolean;
  className?: string;
}

export default function ReservationSummary({
  reservation,
  onDownloadPDF,
  showDownloadButton = true,
  className = ""
}: ReservationSummaryProps) {
  const handleDownload = () => {
    generateReservationPDF(reservation);
    onDownloadPDF?.();
  };

  return (
    <Card className={`bg-gradient-to-br from-green-50 to-white border-green-200 ${className}`}>
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-2">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <CardTitle className="text-green-800 text-xl">Reservation Confirmed!</CardTitle>
        <p className="text-green-600 text-sm">
          Your table has been successfully reserved
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Confirmation Number */}
        {reservation.reservationId && (
          <div className="bg-green-100 rounded-lg p-3 text-center">
            <p className="text-sm text-green-700 font-medium">Confirmation Number</p>
            <p className="text-lg font-bold text-green-800">
              {String(reservation.reservationId).substring(0, 8).toUpperCase()}
            </p>
          </div>
        )}

        {/* Reservation Details */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Users className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Guest</p>
              <p className="font-medium">{reservation.customerName}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Date</p>
              <p className="font-medium">{reservation.reservationDate}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Time</p>
              <p className="font-medium">{formatTimeForDisplay(reservation.reservationTime || '')}</p>
            </div>
          </div>

          {reservation.numberOfGuests && (
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Guests</p>
                <p className="font-medium">{reservation.numberOfGuests}</p>
              </div>
            </div>
          )}

          {reservation.tableNumber && (
            <div className="flex items-center space-x-3">
              <div className="h-5 w-5 text-gray-500">🍽️</div>
              <div>
                <p className="text-sm text-gray-600">Table</p>
                <p className="font-medium">{reservation.tableNumber}</p>
              </div>
            </div>
          )}
        </div>

        {/* Status */}
        {reservation.status && (
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-sm text-blue-700 font-medium">Status</p>
            <p className="text-blue-800 font-semibold capitalize">{reservation.status}</p>
          </div>
        )}

        {/* Download Button */}
        {showDownloadButton && (
          <Button
            onClick={handleDownload}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Receipt
          </Button>
        )}

        {/* Additional Information */}
        <div className="text-xs text-gray-500 text-center space-y-1">
          <p>Please arrive 5 minutes before your reservation time</p>
          <p>For any changes, please contact us at +1 (555) 123-4567</p>
        </div>
      </CardContent>
    </Card>
  );
} 