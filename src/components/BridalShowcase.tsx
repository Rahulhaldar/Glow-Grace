import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';
import { Service } from '../types';
import { MockDB } from '../data';

interface BridalShowcaseProps {
  onBook?: (serviceName: string) => void;
  onViewAll?: () => void;
}

export const BridalShowcase: React.FC<BridalShowcaseProps> = ({ onBook, onViewAll }) => {
  const [bridalServices, setBridalServices] = useState<Service[]>([]);

  const load = () => {
    const services = MockDB.getServices().filter(
      s => s.status === 'Active' && 
      (s.name.toLowerCase().includes('bridal') || s.category.toLowerCase().includes('bridal'))
    );
    setBridalServices(services);
  };

  useEffect(() => {
    load();
    window.addEventListener('gg_db_update', load);
    return () => window.removeEventListener('gg_db_update', load);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="text-center mb-10">
        <span className="text-xs uppercase tracking-[0.2em] text-[#B85C72] font-bold block mb-2">
          The Ultimate Bride
        </span>
        <h2 className="font-serif text-3xl text-[#3B0F19] font-bold mb-4">Bridal Services</h2>
        <p className="text-stone-600 max-w-xl mx-auto text-sm">
          Discover our bespoke bridal packages tailored for your special day. Let our artists craft your dream look.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {bridalServices.length > 0 ? (
          bridalServices.map(service => (
            <div key={service.id} className="bg-white rounded-3xl overflow-hidden shadow-xs border border-[#F5DDE1] group">
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={service.image || service.imageUrl} 
                  alt={service.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                  <span className="text-xs font-bold text-[#B85C72] font-serif">₹{service.price}</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-[#D4A373]" />
                  <span className="text-[10px] uppercase tracking-widest text-[#D4A373] font-bold">{service.category}</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-[#3B0F19] mb-2">{service.name}</h3>
                <p className="text-sm text-stone-600 mb-6">{service.description}</p>
                <button 
                  onClick={() => onBook && onBook(service.name)}
                  className="w-full py-3 bg-[#FFF0F2] text-[#B85C72] font-bold text-sm tracking-wide rounded-xl border border-[#F5DDE1] hover:bg-[#B85C72] hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  Book this style <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center text-stone-500 bg-white rounded-3xl border border-stone-100">
            <Heart className="w-8 h-8 text-stone-300 mx-auto mb-3" />
            <p className="text-sm">We are currently updating our bridal services. Please check back later or contact us directly.</p>
          </div>
        )}
      </div>

      {onViewAll && (
        <div className="mt-10 text-center">
          <button 
            onClick={onViewAll}
            className="text-sm font-bold text-[#B85C72] hover:text-[#802339] transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            View full gallery <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
