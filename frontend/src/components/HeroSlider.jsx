import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import api from '../services/api';

const defaultBanners = [
  {
    title: 'THE RESORT & LINEN CAPSULE',
    subtitle: 'Relaxed Striped Shirts, Tailored Linen Trousers & Effortless Style',
    buttonText: 'EXPLORE MEN\'S COLLECTION',
    linkUrl: '/shop?gender=Men',
    desktopImage: '/banners/hero_slide_1.jpg',
  },
  {
    title: 'TRENDY PANTS & URBAN CHINOS',
    subtitle: 'Pleated Trousers, Relaxed Korean Fits & Premium Cargo Pants',
    buttonText: 'SHOP TRENDY PANTS',
    linkUrl: '/shop?keyword=pants',
    desktopImage: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1920&q=85',
  },
  {
    title: 'ROYAL HERITAGE KURTAS',
    subtitle: 'Handwoven Jacquard Silk & Celebratory Festive Wear for Men',
    buttonText: 'EXPLORE ETHNIC',
    linkUrl: '/shop?gender=Men',
    desktopImage: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1920&q=85',
  },
  {
    title: 'CASUAL VIBES & LINENS',
    subtitle: 'Breathable Cotton Shirts, Relaxed Fits & Contemporary Streetwear',
    buttonText: 'DISCOVER CASUALS',
    linkUrl: '/shop?gender=Men',
    desktopImage: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1920&q=85',
  },
];

const HeroSlider = () => {
  const [banners, setBanners] = useState(defaultBanners);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await api.get('/banners');
        if (res.data.success && res.data.banners.length > 0) {
          setBanners(res.data.banners);
        }
      } catch (err) {
        // Fallback to default
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) nextSlide();
    if (distance < -50) prevSlide();
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-[500px] sm:h-[580px] lg:h-[680px] overflow-hidden bg-gray-950 select-none"
    >
      {banners.map((banner, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          {/* Background Image with Dark Vignette Gradient */}
          <img
            src={banner.desktopImage}
            alt={banner.title}
            className="w-full h-full object-cover object-[70%_top] sm:object-center"
          />
          
          {/* Mobile & Desktop Optimized Contrast Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/25 sm:bg-gradient-to-r sm:from-black/85 sm:via-black/40 sm:to-transparent flex items-center">
            <div className="max-w-7xl mx-auto px-5 sm:px-12 lg:px-16 w-full">
              <div className="max-w-lg space-y-3.5 sm:space-y-6 animate-fadeIn">
                
                <div className="inline-flex items-center space-x-2 bg-brand-500/20 backdrop-blur-md border border-brand-400/40 text-rose-200 px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold tracking-widest uppercase">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Exclusive Brand Collection</span>
                </div>

                <h1 className="text-2xl sm:text-4xl lg:text-6xl font-display font-bold text-white leading-tight tracking-wide drop-shadow-md">
                  {banner.title}
                </h1>

                <p className="text-xs sm:text-base text-gray-200 font-normal leading-relaxed max-w-md drop-shadow-sm">
                  {banner.subtitle}
                </p>

                <div className="pt-2">
                  <Link
                    to={banner.linkUrl || '/shop'}
                    className="inline-flex items-center justify-center bg-white text-gray-950 hover:bg-brand-600 hover:text-white px-7 py-3 sm:px-8 sm:py-3.5 rounded-full font-bold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 shadow-2xl hover:shadow-brand-500/50 hover:scale-105 active:scale-95"
                  >
                    {banner.buttonText || 'SHOP NOW'}
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows: Hidden on mobile to prevent blocking text, visible on tablet/desktop */}
      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-all shadow-lg hover:scale-110"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-all shadow-lg hover:scale-110"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Bottom Dots Indicator */}
      <div className="absolute bottom-5 inset-x-0 z-20 flex justify-center space-x-2">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Slide ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'w-8 bg-brand-500' : 'w-2 bg-white/50 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
