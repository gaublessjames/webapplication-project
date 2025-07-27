import restaurantHero from "@/assets/restaurant-hero.jpg";

interface MenuHeroProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function MenuHero({
  title = "Culinary Excellence",
  subtitle = "Discover our chef's artfully crafted dishes, featuring premium ingredients and innovative techniques",
  className = ""
}: MenuHeroProps) {
  return (
    <section className={`relative min-h-[70vh] flex items-center justify-center overflow-hidden ${className}`}>
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${restaurantHero})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/80"></div>
      </div>
      
      <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-fade-in">
          <div className="text-6xl mb-6">🍽️</div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
            {title}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 text-white/95 font-light max-w-3xl mx-auto drop-shadow-md">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
} 