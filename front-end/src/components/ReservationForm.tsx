import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import SimpleCalendar from "@/components/ui/simple-calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/hooks/useAuth';

const reservationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  date: z.date({
    required_error: "Please select a reservation date",
  }),
  time: z.string({
    required_error: "Please select a time slot",
  }),
  guests: z.number().min(1, "Must have at least 1 guest").max(8, "Maximum 8 guests allowed"),
  newsletterSignup: z.boolean().default(false),
});

type ReservationFormData = z.infer<typeof reservationSchema>;

const allTimeSlots = [
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", 
  "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00"
];

function getTimeSlotsForDate(date: Date | undefined) {
  if (!date) return allTimeSlots;
  const day = date.getDay(); // 0 = Sunday
  if (day === 0) {
    // Sunday: 5:00 PM – 9:00 PM
    return allTimeSlots.filter(t => t >= "17:00" && t <= "21:00");
  }
  // Mon-Sat: 5:00 PM – 11:00 PM
  return allTimeSlots;
}

const ReservationForm = () => {
  const { toast } = useToast();
  const { getCustomerByEmail, upsertCustomer, createReservation } = useApi();
  const { user, profile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservationDetails, setReservationDetails] = useState<any | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [tablesRemaining, setTablesRemaining] = useState<number | null>(null);

  const form = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      name: user?.email ? (profile?.full_name || user.email.split('@')[0]) : '',
      email: user?.email || '',
      newsletterSignup: false,
    },
  });

  const onSubmit = async (data: ReservationFormData) => {
    setIsSubmitting(true);
    try {
      // First, create or get customer
      let customerId;
      let customerRes = await getCustomerByEmail(data.email);
      if (customerRes && customerRes.customer) {
        customerId = customerRes.customer.id;
      } else {
        const upsertRes = await upsertCustomer({
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          newsletter_signup: data.newsletterSignup,
        });
        customerId = upsertRes.customer?.id;
      }
      if (!customerId) throw new Error('Could not create or find customer');

      // Create reservation
      const reservationData: any = {
        customer_id: customerId,
        reservation_date: format(data.date, 'yyyy-MM-dd'),
        reservation_time: data.time,
        number_of_guests: data.guests,
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        // Add table_number, status, etc. as needed
      };
      const reservationRes = await createReservation(reservationData);
      if (reservationRes.error) throw new Error(reservationRes.error);

      // Store tables remaining information
      if (reservationRes.tables_remaining !== undefined) {
        setTablesRemaining(reservationRes.tables_remaining);
      }

      toast({
        title: 'Reservation confirmed!',
        description: `Your table #${reservationRes.reservation?.table_number || ''} has been reserved.`,
      });
      setReservationDetails(reservationRes.reservation || reservationRes);
      form.reset();
    } catch (error: any) {
      console.error('Reservation error:', error);
      toast({
        title: 'Reservation failed',
        description: error.message || 'There was an error processing your reservation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  async function handleDownloadPDF(reservationDetails: any) {
    const doc = new jsPDF();
    doc.setFont('times', 'normal');
    doc.setFontSize(22);
    doc.setTextColor(221, 82, 76); // Title
    doc.text('Café Fausse', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.setTextColor(102, 102, 102);
    doc.text('An Exceptional Dining Experience', 105, 28, { align: 'center' });
    doc.setDrawColor(221, 82, 76); // Line color
    doc.line(20, 32, 190, 32);
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(221, 82, 76); // Red background
    doc.rect(20, 38, 170, 14, 'F');
    doc.text('RESERVATION RECEIPT', 105, 48, { align: 'center' });
    if (reservationDetails.reservationId) {
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(221, 82, 76);
      doc.rect(20, 56, 170, 10, 'F');
      doc.text(
        `Confirmation Number: ${String(reservationDetails.reservationId || '').substring(0, 8).toUpperCase()}`,
        105,
        63,
        { align: 'center' }
      );
    }
    doc.setFontSize(14);
    doc.setTextColor(221, 82, 76); // Label color
    doc.text('Guest Name:', 30, 80);
    doc.setTextColor(51, 51, 51);
    doc.text(reservationDetails.customerName || '', 80, 80);
    doc.setTextColor(221, 82, 76);
    doc.text('Email:', 30, 90);
    doc.setTextColor(51, 51, 51);
    doc.text(reservationDetails.customerEmail || '', 80, 90);
    doc.setTextColor(221, 82, 76);
    doc.text('Date:', 30, 100);
    doc.setTextColor(51, 51, 51);
    doc.text(reservationDetails.reservationDate || '', 80, 100);
    doc.setTextColor(221, 82, 76);
    doc.text('Time:', 30, 110);
    doc.setTextColor(51, 51, 51);
    doc.text(reservationDetails.reservationTime || '', 80, 110);
    doc.setTextColor(221, 82, 76);
    doc.text('Number of Guests:', 30, 120);
    doc.setTextColor(51, 51, 51);
    doc.text(`${reservationDetails.numberOfGuests || reservationDetails.guests || reservationDetails.number_of_guests || reservationDetails.party_size || ''}`, 80, 120);
    doc.setTextColor(221, 82, 76);
    doc.text('Table Number:', 30, 130);
    doc.setTextColor(51, 51, 51);
    doc.text(`Table ${reservationDetails.tableNumber || ''}`, 80, 130);
    doc.setFontSize(12);
    doc.setTextColor(221, 82, 76);
    doc.text('Restaurant Information', 30, 150);
    doc.setTextColor(51, 51, 51);
    doc.text('123 Culinary District, Fine Dining Ave', 30, 158);
    doc.text('(202) 555-4567', 30, 166);
    doc.text('Tuesday - Sunday, 5:00 PM - 11:00 PM', 30, 174);
    doc.text('Dress Code: Smart Casual', 30, 182);
    doc.setTextColor(221, 82, 76);
    doc.text('Important Notes', 30, 200);
    doc.setTextColor(51, 51, 51);
    doc.text('- Please arrive 15 minutes before your reservation time', 30, 208);
    doc.text('- Cancellations must be made 24 hours in advance', 30, 216);
    doc.text('- For parties of 8 or more, a 20% gratuity will be added', 30, 224);
    doc.text('- We accommodate dietary restrictions with advance notice', 30, 232);
    doc.setFontSize(10);
    doc.setTextColor(102, 102, 102);
    doc.text(`Receipt generated on ${new Date().toLocaleDateString()}`, 30, 250);
    doc.text('We look forward to welcoming you to Café Fausse!', 30, 256);
    doc.text('"Where every meal is a masterpiece"', 30, 262);
    // --- Add links section ---
    const email = reservationDetails.customerEmail || '';
    const pdfReservationId = reservationDetails.id || reservationDetails.reservationId || '';
    const cancelUrl = `${window.location.origin}/cancel-reservation/${encodeURIComponent(pdfReservationId)}`;
    const authUrl = `${window.location.origin}/auth?signup=1&email=${encodeURIComponent(email)}`;
    let y = 270;
    doc.setFontSize(12);
    doc.setTextColor(221, 82, 76);
    doc.textWithLink('Cancel your reservation', 30, y, { url: cancelUrl });
    y += 8;
    doc.textWithLink('Sign up for an account', 30, y, { url: authUrl });
    doc.save('reservation_receipt.pdf');
  }

  let pdfDetails = null;
  if (reservationDetails) {
    pdfDetails = {
      customerName: reservationDetails.customerName || reservationDetails.name || '',
      customerEmail: reservationDetails.customerEmail || reservationDetails.email || '',
      reservationDate: reservationDetails.reservationDate || reservationDetails.date || reservationDetails.reservation_date || '',
      reservationTime: reservationDetails.reservationTime || reservationDetails.time || reservationDetails.reservation_time || '',
      tableNumber: reservationDetails.tableNumber || reservationDetails.table_number || '',
      numberOfGuests: reservationDetails.numberOfGuests || reservationDetails.guests || reservationDetails.number_of_guests || reservationDetails.party_size || '',
      reservationId: reservationDetails.id || reservationDetails.reservationId || '', // Always use full UUID
    };
  }
  return (
    <div className="w-full">
      {reservationDetails && pdfDetails ? (
        <div className="w-full text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <CalendarIcon className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-primary-700 mb-2">Reservation Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Your table for {pdfDetails.numberOfGuests} guest{pdfDetails.numberOfGuests === 1 ? '' : 's'} has been reserved for {pdfDetails.reservationDate} at {pdfDetails.reservationTime}.<br />
            Table number: {pdfDetails.tableNumber}.
          </p>
          
          {tablesRemaining !== null && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 inline-block">
              <p className="text-amber-800">
                <strong>Tables Remaining:</strong> {tablesRemaining} out of 30
                {tablesRemaining < 5 && (
                  <span className="block mt-1 text-sm">
                    Hurry! Only a few tables left for this date.
                  </span>
                )}
              </p>
            </div>
          )}
          <Button onClick={async () => { setPdfLoading(true); await handleDownloadPDF(pdfDetails); setPdfLoading(false); }} disabled={pdfLoading} className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-all duration-300">
            {pdfLoading ? 'Generating PDF...' : 'Download Reservation PDF'}
          </Button>
        </div>
      ) : (
        <div>
          {/* Show a different form for logged-in users */}
          {user ? (
            <div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <CalendarIcon className="w-8 h-8 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-primary-700 mb-2">Book a Table as a Member</h2>
                <p className="text-gray-600">Welcome back! Your name and email are pre-filled. Just pick your date, time, and party size.</p>
              </div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700">Full Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your full name"
                            {...field}
                            className="h-12 border-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-lg"
                            value={field.value}
                            disabled
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700">Email Address *</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email address"
                            {...field}
                            className="h-12 border-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-lg"
                            value={field.value}
                            disabled
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700">Phone Number (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            type="tel" 
                            placeholder="Enter your phone number" 
                            {...field} 
                            className="h-12 border-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-lg"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-sm font-semibold text-gray-700">Reservation Date *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full h-12 pl-4 text-left font-normal border-gray-300 hover:border-primary-500 focus:border-primary-500 rounded-lg",
                                  !field.value && "text-gray-500"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 z-50" align="start">
                            <SimpleCalendar
                              selected={field.value}
                              onSelect={(date) => {
                                field.onChange(date);
                                document.body.click();
                              }}
                              disabled={(date) => {
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                return date < today;
                              }}
                              className="border-0"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700">Time Slot *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 border-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-lg">
                              <SelectValue placeholder="Select a time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {getTimeSlotsForDate(form.watch('date')).map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="guests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700">Number of Guests *</FormLabel>
                        <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                          <FormControl>
                            <SelectTrigger className="h-12 border-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-lg">
                              <SelectValue placeholder="Select number of guests" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: 8 }, (_, i) => i + 1).map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} {num === 1 ? 'Guest' : 'Guests'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="newsletterSignup"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 bg-primary-50 rounded-lg border border-primary-200">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-primary-400 text-primary-600"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-medium text-primary-700 cursor-pointer">
                            Subscribe to our newsletter for special offers and exclusive updates
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full h-14 bg-primary-600 hover:bg-primary-700 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing Reservation...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <CalendarIcon className="w-5 h-5 mr-2" />
                        Confirm Reservation
                      </div>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          ) : (
            <div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <CalendarIcon className="w-8 h-8 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-primary-700 mb-2">Complete Your Reservation</h2>
                <p className="text-gray-600">All fields marked with * are required</p>
              </div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700">Full Name *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your full name" 
                            {...field} 
                            className="h-12 border-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-lg"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700">Email Address *</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="Enter your email address" 
                            {...field} 
                            className="h-12 border-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-lg"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700">Phone Number (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            type="tel" 
                            placeholder="Enter your phone number" 
                            {...field} 
                            className="h-12 border-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-lg"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-sm font-semibold text-gray-700">Reservation Date *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full h-12 pl-4 text-left font-normal border-gray-300 hover:border-primary-500 focus:border-primary-500 rounded-lg",
                                  !field.value && "text-gray-500"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 z-50" align="start">
                            <SimpleCalendar
                              selected={field.value}
                              onSelect={(date) => {
                                field.onChange(date);
                                document.body.click();
                              }}
                              disabled={(date) => {
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                return date < today;
                              }}
                              className="border-0"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700">Time Slot *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 border-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-lg">
                              <SelectValue placeholder="Select a time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {getTimeSlotsForDate(form.watch('date')).map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="guests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700">Number of Guests *</FormLabel>
                        <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                          <FormControl>
                            <SelectTrigger className="h-12 border-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-lg">
                              <SelectValue placeholder="Select number of guests" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: 8 }, (_, i) => i + 1).map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} {num === 1 ? 'Guest' : 'Guests'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="newsletterSignup"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 bg-primary-50 rounded-lg border border-primary-200">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-primary-400 text-primary-600"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-medium text-primary-700 cursor-pointer">
                            Subscribe to our newsletter for special offers and exclusive updates
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full h-14 bg-primary-600 hover:bg-primary-700 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing Reservation...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <CalendarIcon className="w-5 h-5 mr-2" />
                        Confirm Reservation
                      </div>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReservationForm;