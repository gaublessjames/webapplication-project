import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, Heart, Leaf } from "lucide-react";

interface Value {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  gradient: string;
}

interface MissionSectionProps {
  mission: string;
  values: Value[];
}

const MissionSection: React.FC<MissionSectionProps> = ({ mission, values }) => {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-r from-yellow-50 via-primary-100 to-yellow-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">🌟</div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary-700 mb-6">Our Mission</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-primary-700 mx-auto mb-8 rounded-full"></div>
          <p className="text-lg md:text-xl text-primary-600 max-w-4xl mx-auto leading-relaxed">
            {mission}
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {values.map((value, index) => (
            <Card key={index} className={`text-center bg-gradient-to-br ${value.gradient} border-2 border-primary-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300`}>
              <CardHeader>
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-primary-700">{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700 leading-relaxed">{value.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MissionSection; 