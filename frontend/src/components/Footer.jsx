import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Headphones, Mail, Phone, MapPin, Instagram, Facebook, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-20">
      {/* Value Proposition Highlights Banner (Contrasting Warm Luxury Strip) */}
      <div className="bg-gradient-to-r from-[#FFF6F7] via-[#FCF9F5] to-[#FFF6F7] border-t border-b border-brand-200/50">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center group">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-brand-200/70 flex items-center justify-center text-brand-600 mb-2.5 group-hover:scale-105 group-hover:shadow-md transition-all">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Fast Pan-India Delivery</h4>
            <p className="text-[11px] text-gray-500 mt-0.5 font-medium">Free shipping above ₹999</p>
          </div>

          <div className="flex flex-col items-center group">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-brand-200/70 flex items-center justify-center text-brand-600 mb-2.5 group-hover:scale-105 group-hover:shadow-md transition-all">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">7-Day Easy Returns</h4>
            <p className="text-[11px] text-gray-500 mt-0.5 font-medium">Hassle-free doorstep pickup</p>
          </div>

          <div className="flex flex-col items-center group">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-brand-200/70 flex items-center justify-center text-brand-600 mb-2.5 group-hover:scale-105 group-hover:shadow-md transition-all">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">100% Genuine Quality</h4>
            <p className="text-[11px] text-gray-500 mt-0.5 font-medium">Direct from master craftsmen</p>
          </div>

          <div className="flex flex-col items-center group">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-brand-200/70 flex items-center justify-center text-brand-600 mb-2.5 group-hover:scale-105 group-hover:shadow-md transition-all">
              <Headphones className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Dedicated Support</h4>
            <p className="text-[11px] text-gray-500 mt-0.5 font-medium">Mon - Sat: 9:00 AM - 8:00 PM</p>
          </div>
        </div>
      </div>

      {/* Main Dark Footer Links */}
      <div className="bg-[#0B0F19] text-gray-400 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-display text-2xl font-bold tracking-widest text-white">MensVibe</span>
              <span className="block text-[9px] tracking-[0.3em] font-semibold text-gray-500 uppercase">
                Luxury Fashion
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-gray-400 max-w-sm">
              Crafting timeless elegance and modern silhouettes. Every piece in our collection is thoughtfully designed with premium fabrics, intricate craftsmanship, and effortless comfort.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:text-white hover:bg-brand-600 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:text-white hover:bg-brand-600 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:text-white hover:bg-brand-600 transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Shop By Category</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/shop?gender=Men" className="hover:text-white transition-colors">Men's Apparel & Shirts</Link></li>
              <li><Link to="/shop?gender=Women" className="hover:text-white transition-colors">Women's Collection</Link></li>
              <li><Link to="/shop?gender=Kids" className="hover:text-white transition-colors">Kids Wear</Link></li>
              <li><Link to="/shop?isNewArrival=true" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop?sort=discount" className="hover:text-white transition-colors">Special Offers</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Customer Care</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/my-orders" className="hover:text-white transition-colors">Track Order</Link></li>
              <li><Link to="/my-orders" className="hover:text-white transition-colors">Return / Exchange</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-white transition-colors">Shipping Policy</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Get In Touch</h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                <span>104, Fashion Boulevard, Designer District, India</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span>care@mensvibe.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {new Date().getFullYear()} MensVibe. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <span>100% Secure Payment (Razorpay / UPI / Cards)</span>
          </div>
        </div>
      </div>
      </div>
    </footer>
  );
};

export default Footer;
