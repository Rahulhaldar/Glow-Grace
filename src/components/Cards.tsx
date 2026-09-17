import React from 'react';
import { Sparkles, ArrowRight, Heart, Star, Award, Scissors, Eye, Clock, Calendar } from 'lucide-react';
import { Service, Package, Artist, Review } from '../types';
import { Button } from './Common';

// --- SERVICE CARD ---
interface ServiceCardProps {
  service: Service;
  onViewDetails: (slug: string) => void;
  onBook: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onViewDetails, onBook }) => {
  const fallbackImg = 'https://images.unsplash.com/photo-1481501940778-c8bb63e376c5?w=800&auto=format&fit=crop&q=80';
  const imgUrl = (service.image && service.image.trim() !== '')
    ? service.image
    : (service.imageUrl && service.imageUrl.trim() !== '' ? service.imageUrl : fallbackImg);

  return (
    <div className="bg-white border border-[#F5DDE1] rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-500 flex flex-col h-full">
      {/* Service Image */}
      <div className="relative h-64 overflow-hidden bg-pink-50">
        <img
          src={imgUrl}
          alt={service.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#B85C72] text-[10px] font-sans font-semibold tracking-wider uppercase px-3 py-1 rounded-full border border-[#F5DDE1]">
          {service.category}
        </span>
        <div className="absolute top-4 right-4 bg-white/95 text-xs text-[#24191B] font-medium px-3 py-1 rounded-full flex items-center gap-1 shadow-sm border border-[#F5DDE1]">
          <Clock className="w-3.5 h-3.5 text-[#B85C72]" />
          <span>{service.duration} mins</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-serif text-xl font-bold text-[#24191B] mb-2 group-hover:text-[#B85C72] transition-colors">
          {service.name}
        </h3>
        <p className="text-[#24191B]/70 text-sm font-sans mb-6 line-clamp-2 leading-relaxed flex-grow">
          {service.description}
        </p>

        <div className="border-t border-[#F5DDE1]/50 pt-5 mt-auto flex items-center justify-between">
          <div>
            <span className="text-[10px] font-sans text-[#24191B]/50 block uppercase tracking-widest">
              Starting from
            </span>
            <span className="text-xl font-serif font-extrabold text-[#B85C72]">
              ₹{service.startingPrice.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onViewDetails(service.slug)}
              className="p-2 border border-[#F5DDE1] text-[#24191B]/70 hover:text-[#B85C72] hover:border-[#B85C72] bg-[#FFF5F5]/30 rounded-full transition-colors cursor-pointer"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={onBook}
              className="px-5 py-2 bg-[#B85C72] hover:bg-[#802339] text-white rounded-full text-xs font-bold tracking-wide transition-colors cursor-pointer shadow-xs"
            >
              Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- PACKAGE CARD ---
interface PackageCardProps {
  pkg: Package;
  onBook: () => void;
}

export const PackageCard: React.FC<PackageCardProps> = ({ pkg, onBook }) => {
  return (
    <div
      className={`relative rounded-3xl p-8 transition-all duration-500 h-full flex flex-col justify-between ${
        pkg.isPopular
          ? 'bg-[#3B0F19] text-white shadow-2xl scale-[1.02] border border-[#D4A373]/30 border-t-4 border-t-[#D4A373]'
          : 'bg-white text-[#24191B] border border-[#F5DDE1] hover:shadow-lg rose-border-glow'
      }`}
    >
      {/* Popular Badge */}
      {pkg.isPopular && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#D4A373] text-[#24191B] text-[10px] font-sans font-extrabold tracking-widest uppercase px-4 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
          <Sparkles className="w-3 h-3" />
          Most Popular
        </span>
      )}

      {/* Header */}
      <div>
        <h3 className="font-serif text-2xl font-bold mb-2">{pkg.name}</h3>
        <p className={`text-sm mb-6 ${pkg.isPopular ? 'text-[#FFF9F7]/70' : 'text-[#24191B]/60'}`}>
          {pkg.description}
        </p>

        {/* Pricing */}
        <div className="mb-8">
          <span className="text-[10px] uppercase tracking-widest block opacity-60">Investment</span>
          <span className="text-4xl font-serif font-extrabold text-[#B85C72] flex items-baseline">
            ₹{pkg.price.toLocaleString('en-IN')}
            {pkg.name.toLowerCase().includes('bridal') && <span className="text-sm font-sans font-normal ml-1 opacity-70">+</span>}
          </span>
        </div>

        {/* Divider */}
        <hr className={`my-6 ${pkg.isPopular ? 'border-white/10' : 'border-[#F5DDE1]'}`} />

        {/* Features List */}
        <ul className="space-y-3.5 mb-8">
          {pkg.features.map((feat, i) => (
            <li key={i} className="flex gap-3 text-sm items-start">
              <span className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-xs ${
                pkg.isPopular ? 'bg-white/10 text-[#D4A373]' : 'bg-[#FFF9F7] text-[#B85C72] border border-[#F5DDE1]'
              }`}>
                ✓
              </span>
              <span className={pkg.isPopular ? 'text-white/80' : 'text-[#24191B]/80'}>{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Button */}
      <Button
        variant={pkg.isPopular ? 'accent' : 'outline'}
        onClick={onBook}
        className="w-full flex items-center justify-center gap-2 mt-auto"
      >
        <Calendar className="w-4 h-4" />
        {pkg.name.toLowerCase().includes('bridal') ? 'Book Bridal Appointment' : 'Book Now'}
      </Button>
    </div>
  );
};


// --- ARTIST CARD ---
interface ArtistCardProps {
  artist: Artist;
  onViewProfile: (slug: string) => void;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({ artist, onViewProfile }) => {
  return (
    <div className="bg-white border border-[#F5DDE1] rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-500">
      {/* Profile Photo */}
      <div className="relative h-72 overflow-hidden bg-amber-50/50">
        <img
          src={artist.photoUrl}
          alt={artist.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Rating overlay */}
        <div className="absolute bottom-4 left-4 bg-[#24191B]/90 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1 border border-white/10">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="font-semibold">{artist.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Info details */}
      <div className="p-6">
        <span className="text-[10px] font-sans text-[#B85C72] uppercase tracking-widest block font-bold mb-1">
          {artist.role}
        </span>
        <h3 className="font-serif text-xl font-bold text-[#24191B] mb-2">{artist.name}</h3>

        <div className="flex flex-col gap-2 mb-4 border-t border-[#F5DDE1]/40 pt-4 mt-2">
          <div className="flex justify-between text-xs">
            <span className="text-[#24191B]/50">Experience:</span>
            <span className="font-semibold text-[#24191B]">{artist.experience}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[#24191B]/50">Specialty:</span>
            <span className="font-semibold text-[#B85C72]">{artist.specialty}</span>
          </div>
        </div>

        {/* Services Badges */}
        {artist.services && artist.services.length > 0 && (
          <div className="mb-5">
            <div className="flex flex-wrap gap-1.5">
              {artist.services.slice(0, 4).map((svc, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-[#FFF0F2] text-[#B85C72] text-[10px] font-semibold rounded-md border border-[#F5DDE1]"
                >
                  {svc}
                </span>
              ))}
              {artist.services.length > 4 && (
                <span className="px-1.5 py-0.5 bg-stone-100 text-stone-500 text-[10px] font-semibold rounded-md">
                  +{artist.services.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewProfile(artist.slug)}
          className="w-full"
        >
          View Profile
        </Button>
      </div>
    </div>
  );
};


// --- REVIEW CARD ---
interface ReviewCardProps {
  review: Review;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="bg-white border border-[#F5DDE1] p-8 rounded-3xl shadow-xs flex flex-col justify-between h-full relative">
      {/* Star ratings */}
      <div>
        <div className="flex gap-1 mb-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Content body */}
        <blockquote className="text-[#24191B] font-serif italic text-base leading-relaxed mb-6">
          &ldquo;{review.reviewContent}&rdquo;
        </blockquote>
      </div>

      {/* Author and service info */}
      <div className="flex items-center gap-4 border-t border-[#F5DDE1]/40 pt-5 mt-auto">
        <img
          src={review.profileImageUrl}
          alt={review.customerName}
          className="w-11 h-11 rounded-full object-cover border border-[#F5DDE1]"
        />
        <div>
          <h4 className="font-serif text-sm font-bold text-[#24191B]">{review.customerName}</h4>
          <span className="text-[10px] text-[#B85C72] font-semibold uppercase tracking-wider block">
            {review.serviceName}
          </span>
        </div>
      </div>
    </div>
  );
};
