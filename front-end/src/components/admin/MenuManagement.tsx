import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Utensils } from "lucide-react";
import { MenuCategory, MenuWithItems, MenuItem } from "@/types/admin";

interface MenuManagementProps {
  menuCategories: MenuCategory[];
  menuWithItems: MenuWithItems[];
  categoriesLoading: boolean;
  categoriesError: string;
  itemsLoading: boolean;
  itemsError: string;
  onAddCategory: () => void;
  onEditCategory: (category: MenuCategory) => void;
  onAddItem: () => void;
  onEditItem: (item: MenuItem) => void;
}

export default function MenuManagement({
  menuCategories,
  menuWithItems,
  categoriesLoading,
  categoriesError,
  itemsLoading,
  itemsError,
  onAddCategory,
  onEditCategory,
  onAddItem,
  onEditItem
}: MenuManagementProps) {
  return (
    <div className="space-y-6">
      {/* Menu Categories */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Menu Categories</CardTitle>
          <Button onClick={onAddCategory} className="bg-primary-600 hover:bg-primary-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </CardHeader>
        <CardContent>
          {categoriesLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-3 text-slate-600">Loading menu categories...</span>
            </div>
          ) : categoriesError ? (
            <div className="text-center py-12">
              <div className="h-12 w-12 text-red-500 mx-auto mb-4">⚠️</div>
              <p className="text-red-600">{categoriesError}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuCategories.map((category) => (
                <Card key={category.id} className="overflow-hidden bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg border border-slate-200 hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-primary-100 to-primary-200 shadow mb-4 text-3xl">
                      <span>{category.icon || '🍽️'}</span>
                    </div>
                    <h3 className="font-bold text-lg text-primary-800 mb-1">{category.name}</h3>
                    <p className="text-sm text-slate-500 mb-2">{category.description}</p>
                    <div className="flex items-center justify-between text-xs text-slate-400 w-full mb-2">
                      <span>{category.is_active ? 'Active' : 'Inactive'}</span>
                      <span>Order: {category.display_order}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => onEditCategory(category)} 
                        className="bg-white/90 hover:bg-white"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    <Badge 
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${category.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}
                      variant="secondary"
                    >
                      {category.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Menu Items */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Menu Items</CardTitle>
          <Button onClick={onAddItem} className="bg-primary-600 hover:bg-primary-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </CardHeader>
        <CardContent>
          {itemsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-3 text-slate-600">Loading menu items...</span>
            </div>
          ) : itemsError ? (
            <div className="text-center py-12">
              <div className="h-12 w-12 text-red-500 mx-auto mb-4">⚠️</div>
              <p className="text-red-600">{itemsError}</p>
            </div>
          ) : (
            <div className="space-y-10">
              {menuWithItems.map((category) => (
                <div key={category.id}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-primary-100 to-primary-200 shadow text-2xl">
                      <span>{category.icon || '🍽️'}</span>
                    </div>
                    <h4 className="text-xl font-bold text-primary-700">{category.name}</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(category.items || []).length === 0 ? (
                      <div className="col-span-full text-slate-400 italic">No items in this category.</div>
                    ) : (
                      category.items.map((item) => (
                        <Card key={item.id} className="overflow-hidden bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg border border-slate-200 hover:shadow-2xl transition-all duration-300">
                          <CardContent className="p-6 flex flex-col items-center text-center">
                            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-orange-200 shadow mb-3 text-2xl">
                              <Utensils className="h-7 w-7 text-orange-500" />
                            </div>
                            <h3 className="font-bold text-lg text-primary-800 mb-1">{item.name}</h3>
                            <p className="text-sm text-slate-500 mb-2">{item.description}</p>
                            <div className="flex items-center justify-between w-full mb-2">
                              <span className="text-2xl font-bold text-orange-600 bg-orange-50 px-4 py-1 rounded-full shadow-sm border border-orange-200">
                                ${typeof item.price === 'number' ? item.price.toFixed(2) : (parseFloat(item.price.toString()) ? Number(item.price).toFixed(2) : '0.00')}
                              </span>
                              <Badge 
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}
                                variant="secondary"
                              >
                                {item.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-center gap-2 mt-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => onEditItem(item)} 
                                className="bg-white/90 hover:bg-white"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 