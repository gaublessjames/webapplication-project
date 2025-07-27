import React from 'react';
import { User } from 'lucide-react';

interface DashboardHeroProps {
  userEmail: string;
}

const DashboardHero: React.FC<DashboardHeroProps> = ({ userEmail }) => {
  return (
    <section className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Welcome to Your Dashboard
          </h1>
          <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto">
            Manage your reservations, view your dining history, and book new tables with ease.
          </p>
          <div className="mt-6 text-primary-200">
            <span className="font-medium">Signed in as:</span> {userEmail}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardHero; 