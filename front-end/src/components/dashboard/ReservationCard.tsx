import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, MapPin, X, AlertCircle } from "lucide-react";

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

interface ReservationCardProps {
  reservation: Reservation;
  onCancel: (id: string) => Promise<void>;
  cancelling: string | null;
  formatDate: (dateString: string) => string;
  formatTime: (timeString: string) => string;
}

const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  onCancel,
  cancelling,
  formatDate,
  formatTime
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isUpcoming = (dateString: string) => {
    const reservationDate = new Date(dateString);
    const now = new Date();
    return reservationDate > now;
  };

  const date = reservation.reservation_date || reservation.date || '';
  const time = reservation.reservation_time || reservation.time || '';
  const guests = reservation.number_of_guests || reservation.party_size || 0;

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">
                {formatDate(date)}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                {formatTime(time)}
              </CardDescription>
            </div>
          </div>
          <Badge className={getStatusColor(reservation.status)}>
            {reservation.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{guests} guests</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>Table {reservation.table_number}</span>
          </div>
          
          {isUpcoming(date) && reservation.status.toLowerCase() === 'confirmed' && (
            <div className="pt-3 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCancel(reservation.id)}
                disabled={cancelling === reservation.id}
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                {cancelling === reservation.id ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Cancelling...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <X className="w-4 h-4" />
                    <span>Cancel Reservation</span>
                  </div>
                )}
              </Button>
            </div>
          )}
          
          {reservation.status.toLowerCase() === 'cancelled' && (
            <div className="pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>This reservation has been cancelled</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReservationCard; 