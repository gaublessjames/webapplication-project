import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, CheckCircle } from "lucide-react";

interface DashboardStatsProps {
  totalReservations: number;
  upcomingReservations: number;
  completedReservations: number;
  cancelledReservations: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalReservations,
  upcomingReservations,
  completedReservations,
  cancelledReservations
}) => {
  const stats = [
    {
      title: "Total Reservations",
      value: totalReservations,
      description: "All time bookings",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Upcoming",
      value: upcomingReservations,
      description: "Future bookings",
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Completed",
      value: completedReservations,
      description: "Past experiences",
      icon: CheckCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Cancelled",
      value: cancelledReservations,
      description: "Cancelled bookings",
      icon: Users,
      color: "text-red-600",
      bgColor: "bg-red-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats; 