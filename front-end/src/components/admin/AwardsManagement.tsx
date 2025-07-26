import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit } from "lucide-react";
import { Award } from "@/types/admin";

interface AwardsManagementProps {
  awards: Award[];
  loading: boolean;
  error: string;
  onAdd: () => void;
  onEdit: (award: Award) => void;
}

export default function AwardsManagement({
  awards,
  loading,
  error,
  onAdd,
  onEdit
}: AwardsManagementProps) {
  // Show loading state only if we're actively loading
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-slate-600">Loading awards...</span>
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
          <CardTitle>Awards</CardTitle>
          <Button onClick={onAdd} className="bg-primary-600 hover:bg-primary-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Award
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {awards.map((award) => (
              <Card key={award.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-slate-800 mb-1">{award.name}</h3>
                  <p className="text-sm text-slate-500 mb-2">{award.description}</p>
                  <p className="text-sm text-slate-500">Year: {award.year}</p>
                  <p className="text-sm text-slate-500">Category: {award.category}</p>
                  <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
                    <span>{award.is_featured ? 'Featured' : 'Normal'}</span>
                    <span>{award.display_order}</span>
                  </div>
                  <div className="flex items-center justify-end mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(award)}
                      className="bg-white/90 hover:bg-white"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
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