import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";

interface Review {
  id: string;
  title: string;
  comment: string;
  rating: number;
  customer_name: string;
  created_at: string;
  is_approved?: boolean;
}

interface ReviewCardProps {
  review: Review;
  showStatus?: boolean;
  onEdit?: (review: Review) => void;
  onApprove?: (reviewId: string) => void;
  className?: string;
}

export default function ReviewCard({
  review,
  showStatus = false,
  onEdit,
  onApprove,
  className = ""
}: ReviewCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-500 fill-yellow-400' : 'text-gray-300'}`}
        fill={i < rating ? 'currentColor' : 'none'}
      />
    ));
  };

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow duration-300 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 mb-2">{review.title}</h3>
            <div className="flex items-center gap-2 mb-2">
              {renderStars(review.rating)}
              <span className="text-sm text-gray-600">({review.rating}/5)</span>
            </div>
          </div>
          {showStatus && (
            <Badge 
              variant={review.is_approved ? "default" : "secondary"}
              className={review.is_approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
            >
              {review.is_approved ? 'Approved' : 'Pending'}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="relative">
          <Quote className="h-6 w-6 text-gray-300 absolute -top-2 -left-1" />
          <p className="text-gray-600 mb-4 pl-6 italic">"{review.comment}"</p>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>By {review.customer_name}</span>
          <span>{new Date(review.created_at).toLocaleDateString()}</span>
        </div>

        {/* Action buttons for admin */}
        {(onEdit || onApprove) && (
          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
            {onEdit && (
              <button
                onClick={() => onEdit(review)}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Edit
              </button>
            )}
            {onApprove && !review.is_approved && (
              <button
                onClick={() => onApprove(review.id)}
                className="text-sm text-green-600 hover:text-green-800 transition-colors"
              >
                Approve
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 