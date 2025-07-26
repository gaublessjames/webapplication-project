import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Testimonial } from "@/types/admin";

interface TestimonialsManagementProps {
  testimonials: Testimonial[];
  loading: boolean;
  error: string;
  onEdit: (testimonial: Testimonial) => void;
  onApprove: (testimonialId: string) => Promise<void>;
}

export default function TestimonialsManagement({
  testimonials,
  loading,
  error,
  onEdit,
  onApprove
}: TestimonialsManagementProps) {
  // Show loading state only if we're actively loading
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-slate-600">Loading testimonials...</span>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="h-12 w-12 text-red-500 mx-auto mb-4">⚠️</div>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Testimonials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-slate-800 mb-2">{testimonial.title}</h3>
                  <p className="text-slate-600 mb-3">"{testimonial.comment}"</p>
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    Rating: {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-500 fill-yellow-400' : 'text-slate-300'}`} 
                        fill={i < testimonial.rating ? 'currentColor' : 'none'} 
                      />
                    ))}
                  </p>
                  <p className="text-sm text-slate-500 mt-2">By {testimonial.customer_name}</p>
                  <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
                    <span>{testimonial.is_approved ? 'Approved' : 'Pending Approval'}</span>
                    <span>{testimonial.created_at}</span>
                  </div>
                  <div className="flex items-center justify-end mt-4 space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(testimonial)}
                      className="bg-white/90 hover:bg-white"
                    >
                      Edit
                    </Button>
                    {/* Approve button for pending testimonials */}
                    {!testimonial.is_approved && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => onApprove(testimonial.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Approve
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 