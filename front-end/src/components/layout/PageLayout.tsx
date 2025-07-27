import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen bg-white text-foreground ${className}`}>
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout; 