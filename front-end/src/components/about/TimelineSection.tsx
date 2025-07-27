import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

interface TimelineSectionProps {
  events: TimelineEvent[];
}

const TimelineSection: React.FC<TimelineSectionProps> = ({ events }) => {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-blue-50 via-blue-100 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">📅</div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary-700 mb-6">Our Journey Through Time</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-primary-700 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            From humble beginnings to international recognition, discover the milestones that shaped Café Fausse
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary-300 hidden md:block"></div>
          
          <div className="space-y-8 md:space-y-12">
            {events.map((event, index) => (
              <div key={index} className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className="w-full md:w-5/12 mb-4 md:mb-0">
                  <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-primary-200">
                    <CardHeader>
                      <div className="flex items-center mb-2">
                        <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {event.year.slice(-2)}
                        </div>
                        <div className="ml-4">
                          <CardTitle className="text-primary-700 text-lg">{event.title}</CardTitle>
                          <CardDescription className="text-primary-600 font-semibold">{event.year}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{event.description}</p>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Timeline dot */}
                <div className="hidden md:flex w-2/12 justify-center">
                  <div className="w-6 h-6 bg-primary-600 rounded-full border-4 border-white shadow-lg"></div>
                </div>
                
                <div className="w-full md:w-5/12"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection; 