import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Edit, 
  XCircle, 
  Download 
} from "lucide-react";
import { Reservation, ReservationFilter } from "@/types/admin";
import { handleDownloadPDF } from "@/components/HeroBookingForm";

interface ReservationsManagementProps {
  reservations: Reservation[];
  fetching: boolean;
  error: string;
  filter: ReservationFilter;
  setFilter: (filter: ReservationFilter) => void;
  currentPage: number;
  totalPages: number;
  totalReservations: number;
  setCurrentPage: (page: number) => void;
  onEdit: (reservation: Reservation) => void;
  onCancel: (reservation: Reservation) => void;
  cancelLoadingId: string | null;
}

export default function ReservationsManagement({
  reservations,
  fetching,
  error,
  filter,
  setFilter,
  currentPage,
  totalPages,
  totalReservations,
  setCurrentPage,
  onEdit,
  onCancel,
  cancelLoadingId
}: ReservationsManagementProps) {
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

  return (
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
            onChange={e => setFilter({ ...filter, date: e.target.value })}
            className="border rounded px-3 py-2 w-48"
            placeholder="Filter by date"
          />
          <Select
            value={filter.status}
            onValueChange={value => setFilter({ ...filter, status: value })}
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
                <Button 
                  size="sm" 
                  disabled={currentPage === 1} 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                >
                  Prev
                </Button>
                <Button 
                  size="sm" 
                  disabled={currentPage === totalPages} 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                >
                  Next
                </Button>
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
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => onEdit(r)} 
                        className="px-2 py-1"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => onCancel(r)} 
                        className="px-2 py-1" 
                        disabled={cancelLoadingId === r.id}
                      >
                        {cancelLoadingId === r.id ? (
                          <span className="animate-spin w-4 h-4 border-b-2 border-white rounded-full"></span>
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
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
  );
} 