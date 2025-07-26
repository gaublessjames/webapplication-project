import jsPDF from "jspdf";

export interface ReservationDetails {
  reservationId?: string;
  customerName?: string;
  customerEmail?: string;
  reservationDate?: string;
  reservationTime?: string;
  numberOfGuests?: number;
  tableNumber?: string;
  status?: string;
}

export function generateReservationPDF(reservationDetails: ReservationDetails): void {
  const doc = new jsPDF();
  
  // Set up document styling
  doc.setFont('times', 'normal');
  doc.setFontSize(22);
  doc.setTextColor(221, 82, 76); // Title color
  doc.text('Café Fausse', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(102, 102, 102);
  doc.text('An Exceptional Dining Experience', 105, 28, { align: 'center' });
  
  // Draw separator line
  doc.setDrawColor(221, 82, 76);
  doc.line(20, 32, 190, 32);
  
  // Header section
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.setFillColor(221, 82, 76);
  doc.rect(20, 38, 170, 14, 'F');
  doc.text('RESERVATION RECEIPT', 105, 48, { align: 'center' });
  
  // Confirmation number
  if (reservationDetails.reservationId) {
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(221, 82, 76);
    doc.rect(20, 56, 170, 10, 'F');
    doc.text(
      `Confirmation Number: ${String(reservationDetails.reservationId).substring(0, 8).toUpperCase()}`,
      105,
      63,
      { align: 'center' }
    );
  }
  
  // Reservation details
  let yPosition = 80;
  
  // Guest Name
  doc.setFontSize(14);
  doc.setTextColor(221, 82, 76);
  doc.text('Guest Name:', 30, yPosition);
  doc.setTextColor(51, 51, 51);
  doc.text(reservationDetails.customerName || '', 80, yPosition);
  
  // Email
  yPosition += 10;
  doc.setTextColor(221, 82, 76);
  doc.text('Email:', 30, yPosition);
  doc.setTextColor(51, 51, 51);
  doc.text(reservationDetails.customerEmail || '', 80, yPosition);
  
  // Date
  yPosition += 10;
  doc.setTextColor(221, 82, 76);
  doc.text('Date:', 30, yPosition);
  doc.setTextColor(51, 51, 51);
  doc.text(reservationDetails.reservationDate || '', 80, yPosition);
  
  // Time
  yPosition += 10;
  doc.setTextColor(221, 82, 76);
  doc.text('Time:', 30, yPosition);
  doc.setTextColor(51, 51, 51);
  doc.text(reservationDetails.reservationTime || '', 80, yPosition);
  
  // Number of Guests
  yPosition += 10;
  doc.setTextColor(221, 82, 76);
  doc.text('Guests:', 30, yPosition);
  doc.setTextColor(51, 51, 51);
  doc.text(String(reservationDetails.numberOfGuests || ''), 80, yPosition);
  
  // Table Number (if available)
  if (reservationDetails.tableNumber) {
    yPosition += 10;
    doc.setTextColor(221, 82, 76);
    doc.text('Table:', 30, yPosition);
    doc.setTextColor(51, 51, 51);
    doc.text(reservationDetails.tableNumber, 80, yPosition);
  }
  
  // Status (if available)
  if (reservationDetails.status) {
    yPosition += 10;
    doc.setTextColor(221, 82, 76);
    doc.text('Status:', 30, yPosition);
    doc.setTextColor(51, 51, 51);
    doc.text(reservationDetails.status, 80, yPosition);
  }
  
  // Footer
  yPosition += 20;
  doc.setFontSize(10);
  doc.setTextColor(102, 102, 102);
  doc.text('Thank you for choosing Café Fausse!', 105, yPosition, { align: 'center' });
  
  yPosition += 8;
  doc.text('Please arrive 5 minutes before your reservation time.', 105, yPosition, { align: 'center' });
  
  yPosition += 8;
  doc.text('For any changes, please contact us at +1 (555) 123-4567', 105, yPosition, { align: 'center' });
  
  // Save the PDF
  const fileName = `reservation_${reservationDetails.reservationId || Date.now()}.pdf`;
  doc.save(fileName);
}

// Legacy function for backward compatibility
export function handleDownloadPDF(reservationDetails: any): void {
  generateReservationPDF(reservationDetails);
} 