import React from 'react';

interface Owner {
  name: string;
  role: string;
  description: string;
  initial: string;
}

interface OwnersSectionProps {
  owners: Owner[];
}

const OwnersSection: React.FC<OwnersSectionProps> = ({ owners }) => {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-gray-100 via-white to-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none select-none opacity-30 z-0" aria-hidden="true">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120vw] h-[60vh] bg-gradient-to-br from-primary-100 via-primary-50 to-white rounded-full blur-3xl"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">👥</div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary-700 mb-6">Owners Profile</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-primary-700 mx-auto mb-8 rounded-full"></div>
          <p className="text-lg md:text-xl text-primary-600 max-w-4xl mx-auto leading-relaxed">
            Meet the visionaries behind Café Fausse, whose passion and leadership shape our story and guest experience.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {owners.map((owner, index) => (
            <div key={index} className="flex flex-col items-center bg-white/90 rounded-3xl shadow-xl border border-primary-100 p-10 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary-200 via-primary-100 to-white flex items-center justify-center mb-4 text-4xl text-primary-700 font-bold border-4 border-primary-300 shadow-lg">
                {owner.initial}
              </div>
              <h3 className="text-2xl font-bold text-primary-800 mb-1 tracking-tight">{owner.name}</h3>
              <p className="text-primary-500 font-medium mb-2">{owner.role}</p>
              <p className="text-gray-700 text-center text-base">{owner.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OwnersSection; 