import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

interface ContactInfoProps {
  className?: string;
}

export default function ContactInfo({ className = "" }: ContactInfoProps) {
  const contactDetails = [
    {
      icon: MapPin,
      title: "Address",
      content: "1234 Culinary Ave, Suite 100\nWashington, DC 20002",
      description: "Located in the heart of Washington, DC"
    },
    {
      icon: Phone,
      title: "Phone",
      content: "(202) 555-4567",
      description: "Call us for reservations or inquiries"
    },
    {
      icon: Clock,
      title: "Hours",
      content: "Monday–Saturday: 5:00PM – 11:00 PM\nSunday: 5:00 PM – 9:00 PM",
      description: "Kitchen closes 30 minutes before closing"
    },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h2 className="text-2xl font-bold text-primary-600 mb-4">Get in Touch</h2>
        <p className="text-gray-600 mb-6">
          We're here to help and answer any questions you might have. We look forward to hearing from you.
        </p>
      </div>

      <div className="space-y-4">
        {contactDetails.map((detail, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <detail.icon className="h-5 w-5 text-primary-600" />
                </div>
                <CardTitle className="text-lg text-gray-900">{detail.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="font-medium text-gray-800 mb-1 whitespace-pre-line">
                {detail.content}
              </p>
              <p className="text-sm text-gray-600">
                {detail.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Information */}
      <Card className="bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-primary-800 mb-3">Special Requests</h3>
          <p className="text-primary-700 text-sm mb-4">
            Planning a special occasion? We're happy to accommodate dietary restrictions, 
            special celebrations, and custom menu requests.
          </p>
          <ul className="text-primary-700 text-sm space-y-1">
            <li>• Dietary accommodations (vegetarian, gluten-free, etc.)</li>
            <li>• Special celebrations and events</li>
            <li>• Private dining arrangements</li>
            <li>• Wine pairing recommendations</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
} 