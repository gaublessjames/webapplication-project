import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ReservationReceiptRequest {
  customerName: string;
  customerEmail: string;
  reservationDate: string;
  reservationTime: string;
  numberOfGuests: number;
  tableNumber: number;
  reservationId?: string;
}

const generateReceiptHTML = (data: ReservationReceiptRequest) => {
  const currentDate = new Date().toLocaleDateString();
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reservation Receipt - Café Fausse</title>
      <style>
        body {
          font-family: 'Georgia', serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background: #fff;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #8B4513;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 36px;
          font-weight: bold;
          color: #8B4513;
          margin-bottom: 5px;
        }
        .tagline {
          font-style: italic;
          color: #666;
          font-size: 16px;
        }
        .receipt-title {
          background: #8B4513;
          color: white;
          padding: 15px;
          text-align: center;
          font-size: 24px;
          font-weight: bold;
          margin: 20px 0;
        }
        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin: 30px 0;
        }
        .detail-item {
          padding: 15px;
          background: #f8f8f8;
          border-left: 4px solid #8B4513;
        }
        .detail-label {
          font-weight: bold;
          color: #8B4513;
          font-size: 14px;
          text-transform: uppercase;
          margin-bottom: 5px;
        }
        .detail-value {
          font-size: 18px;
          color: #333;
        }
        .restaurant-info {
          background: #f9f9f9;
          padding: 20px;
          margin: 30px 0;
          border-radius: 5px;
        }
        .restaurant-info h3 {
          color: #8B4513;
          margin-top: 0;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #8B4513;
          font-style: italic;
          color: #666;
        }
        .confirmation-number {
          background: #8B4513;
          color: white;
          padding: 10px;
          text-align: center;
          font-size: 16px;
          margin: 20px 0;
          font-family: monospace;
        }
        @media print {
          body { margin: 0; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">Café Fausse</div>
        <div class="tagline">An Exceptional Dining Experience</div>
      </div>

      <div class="receipt-title">
        RESERVATION RECEIPT
      </div>

      ${data.reservationId ? `
      <div class="confirmation-number">
        Confirmation Number: ${data.reservationId.substring(0, 8).toUpperCase()}
      </div>
      ` : ''}

      <div class="details-grid">
        <div class="detail-item">
          <div class="detail-label">Guest Name</div>
          <div class="detail-value">${data.customerName}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Email</div>
          <div class="detail-value">${data.customerEmail}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Date</div>
          <div class="detail-value">${data.reservationDate}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Time</div>
          <div class="detail-value">${data.reservationTime}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Party Size</div>
          <div class="detail-value">${data.numberOfGuests} ${data.numberOfGuests === 1 ? 'Guest' : 'Guests'}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Table Number</div>
          <div class="detail-value">Table ${data.tableNumber}</div>
        </div>
      </div>

      <div class="restaurant-info">
        <h3>Restaurant Information</h3>
        <p><strong>Address:</strong> 123 Culinary District, Fine Dining Ave</p>
        <p><strong>Phone:</strong> (202) 555-4567</p>
        <p><strong>Hours:</strong> Tuesday - Sunday, 5:00 PM - 11:00 PM</p>
        <p><strong>Dress Code:</strong> Smart Casual</p>
      </div>

      <div class="restaurant-info">
        <h3>Important Notes</h3>
        <ul>
          <li>Please arrive 15 minutes before your reservation time</li>
          <li>Cancellations must be made 24 hours in advance</li>
          <li>For parties of 8 or more, a 20% gratuity will be added</li>
          <li>We accommodate dietary restrictions with advance notice</li>
        </ul>
      </div>

      <div class="footer">
        <p>Receipt generated on ${currentDate}</p>
        <p>We look forward to welcoming you to Café Fausse!</p>
        <p><em>"Where every meal is a masterpiece"</em></p>
      </div>
    </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ReservationReceiptRequest = await req.json();

    console.log("Generating receipt for:", data.customerEmail);

    const receiptHTML = generateReceiptHTML(data);

    // Store email in database for manual sending
    const { data: emailRecord, error: emailError } = await supabase
      .from('reservation_emails')
      .insert({
        customer_email: data.customerEmail,
        subject: `Reservation Confirmation - ${data.reservationDate} at ${data.reservationTime}`,
        html_content: receiptHTML,
        email_type: 'receipt',
        reservation_id: data.reservationId
      })
      .select()
      .single();

    if (emailError) {
      console.error("Error storing email:", emailError);
      throw new Error("Failed to store email data");
    }

    console.log("Email data stored successfully:", emailRecord);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Receipt data stored successfully - email will be sent manually",
      emailId: emailRecord.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-receipt function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);