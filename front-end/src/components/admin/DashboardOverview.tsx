import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  Users, 
  MessageSquare, 
  Trophy, 
  Utensils 
} from "lucide-react";
import { DashboardStats } from "@/types/admin";

interface DashboardOverviewProps {
  stats: DashboardStats;
  onNavigate: (tab: string) => void;
}

export default function DashboardOverview({ stats, onNavigate }: DashboardOverviewProps) {
  const statCards = [
    {
      title: "Total Reservations",
      value: stats.totalReservations,
      icon: Calendar,
      gradient: "from-blue-50 to-blue-100",
      border: "border-blue-200",
      textColor: "text-blue-600",
      valueColor: "text-blue-800",
      iconColor: "text-blue-600"
    },
    {
      title: "Pending",
      value: stats.pendingReservations,
      icon: Clock,
      gradient: "from-yellow-50 to-yellow-100",
      border: "border-yellow-200",
      textColor: "text-yellow-600",
      valueColor: "text-yellow-800",
      iconColor: "text-yellow-600"
    },
    {
      title: "Today",
      value: stats.todayReservations,
      icon: Users,
      gradient: "from-green-50 to-green-100",
      border: "border-green-200",
      textColor: "text-green-600",
      valueColor: "text-green-800",
      iconColor: "text-green-600"
    },
    {
      title: "Testimonials",
      value: stats.totalTestimonials,
      icon: MessageSquare,
      gradient: "from-purple-50 to-purple-100",
      border: "border-purple-200",
      textColor: "text-purple-600",
      valueColor: "text-purple-800",
      iconColor: "text-purple-600"
    },
    {
      title: "Awards",
      value: stats.totalAwards,
      icon: Trophy,
      gradient: "from-orange-50 to-orange-100",
      border: "border-orange-200",
      textColor: "text-orange-600",
      valueColor: "text-orange-800",
      iconColor: "text-orange-600"
    },
    {
      title: "Menu Items",
      value: stats.totalMenuItems,
      icon: Utensils,
      gradient: "from-red-50 to-red-100",
      border: "border-red-200",
      textColor: "text-red-600",
      valueColor: "text-red-800",
      iconColor: "text-red-600"
    }
  ];

  const quickActions = [
    {
      title: "Manage Reservations",
      icon: Calendar,
      tab: "reservations",
      gradient: "from-blue-500 to-blue-600",
      hoverGradient: "from-blue-600 to-blue-700"
    },
    {
      title: "Review Testimonials",
      icon: MessageSquare,
      tab: "testimonials",
      gradient: "from-purple-500 to-purple-600",
      hoverGradient: "from-purple-600 to-purple-700"
    },
    {
      title: "Update Menu",
      icon: Utensils,
      tab: "menu",
      gradient: "from-red-500 to-red-600",
      hoverGradient: "from-red-600 to-red-700"
    },
    {
      title: "Manage Gallery",
      icon: Users,
      tab: "gallery",
      gradient: "from-green-500 to-green-600",
      hoverGradient: "from-green-600 to-green-700"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className={`bg-gradient-to-br ${stat.gradient} ${stat.border}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${stat.textColor}`}>{stat.title}</p>
                    <p className={`text-2xl font-bold ${stat.valueColor}`}>{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.iconColor}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button 
                  key={action.title}
                  onClick={() => onNavigate(action.tab)}
                  className={`h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br ${action.gradient} hover:from-${action.hoverGradient.split('-')[1]}-600 hover:to-${action.hoverGradient.split('-')[2]}-700`}
                >
                  <Icon className="h-6 w-6" />
                  <span>{action.title}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 