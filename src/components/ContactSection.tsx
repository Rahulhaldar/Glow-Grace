import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, Sparkles } from 'lucide-react';
import { WebsiteSettings } from '../types';
import { Button, Toast } from './Common';

interface ContactSectionProps {
  settings: WebsiteSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    // Simulate sending message
    setShowToast(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <section id="contact-details" className="py-20 bg-[#FFF9F7]">
      {showToast && (
        <Toast
          message="Thank you! Your beautiful message has been delivered to Glow & Grace."
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-[#B85C72] font-semibold font-sans block mb-3">
            Visit Our Sanctuary
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#24191B] mb-4">
            Connect With Us.
          </h2>
          <p className="text-[#24191B]/60 text-sm md:text-base leading-relaxed font-sans">
            Have custom bridal requests or general questions? Drop us a message, dial our desk, or let GPS guide you to our luxury lounge.
          </p>
        </div>

        {/* Grid split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Info blocks column (Left) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white border border-[#F5DDE1] p-8 rounded-3xl space-y-6 shadow-xs">
              <h3 className="font-serif text-xl font-bold text-[#24191B]">Contact Information</h3>

              {/* Address */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-[#FFF9F7] text-[#B85C72] flex items-center justify-center shrink-0 border border-[#F5DDE1]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold tracking-wider text-[#24191B]/50 uppercase mb-1">
                    Visit Us
                  </h4>
                  <p className="text-sm text-[#24191B]/80 font-sans leading-relaxed">
                    {settings.salonAddress}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-[#FFF9F7] text-[#B85C72] flex items-center justify-center shrink-0 border border-[#F5DDE1]">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold tracking-wider text-[#24191B]/50 uppercase mb-1">
                    Call Us
                  </h4>
                  <a
                    href={`tel:${settings.phoneNumber}`}
                    className="text-sm font-semibold text-[#B85C72] hover:underline"
                  >
                    {settings.phoneNumber}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-[#FFF9F7] text-[#B85C72] flex items-center justify-center shrink-0 border border-[#F5DDE1]">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold tracking-wider text-[#24191B]/50 uppercase mb-1">
                    Email
                  </h4>
                  <a
                    href={`mailto:${settings.emailAddress}`}
                    className="text-sm text-[#24191B]/80 hover:text-[#B85C72] break-all"
                  >
                    {settings.emailAddress}
                  </a>
                </div>
              </div>

              {/* Opening hours */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-[#FFF9F7] text-[#B85C72] flex items-center justify-center shrink-0 border border-[#F5DDE1]">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold tracking-wider text-[#24191B]/50 uppercase mb-1">
                    Opening Hours
                  </h4>
                  <p className="text-sm text-[#24191B]/80 font-sans leading-relaxed">
                    {settings.openingHours}
                  </p>
                </div>
              </div>
            </div>

            {/* CTAs Quick Action Panel */}
            <div className="flex gap-4">
              <a
                href={settings.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 border border-[#B85C72] text-[#B85C72] hover:bg-[#B85C72] hover:text-white transition-colors py-3.5 px-6 rounded-full font-semibold text-xs tracking-wider uppercase text-center"
              >
                <MapPin className="w-4 h-4" />
                Get Directions
              </a>

              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9+]/g, '')}?text=Hi%20Glow%20and%20Grace`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] text-white hover:bg-[#20ba59] transition-colors py-3.5 px-6 rounded-full font-semibold text-xs tracking-wider uppercase text-center"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                WhatsApp Chat
              </a>
            </div>
          </div>

          {/* Form and Maps column (Right) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white border border-[#F5DDE1] p-8 md:p-10 rounded-3xl shadow-xs">
              <h3 className="font-serif text-xl font-bold text-[#24191B] mb-6">Send an Inquiry</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="inquiry-name" className="block text-xs font-semibold tracking-wider uppercase text-[#24191B]/50 mb-2">
                    Name *
                  </label>
                  <input
                    id="inquiry-name"
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-2xl py-3 px-4 text-sm outline-none focus:ring-4 focus:ring-[#B85C72]/30 transition-all text-[#24191B]"
                  />
                </div>

                <div>
                  <label htmlFor="inquiry-email" className="block text-xs font-semibold tracking-wider uppercase text-[#24191B]/50 mb-2">
                    Email *
                  </label>
                  <input
                    id="inquiry-email"
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-2xl py-3 px-4 text-sm outline-none focus:ring-4 focus:ring-[#B85C72]/30 transition-all text-[#24191B]"
                  />
                </div>

                <div>
                  <label htmlFor="inquiry-message" className="block text-xs font-semibold tracking-wider uppercase text-[#24191B]/50 mb-2">
                    Your Message *
                  </label>
                  <textarea
                    id="inquiry-message"
                    required
                    placeholder="Tell us what you are looking for..."
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-2xl py-3 px-4 text-sm outline-none focus:ring-4 focus:ring-[#B85C72]/30 transition-all text-[#24191B]"
                  />
                </div>

                <Button type="submit" variant="primary" className="w-full flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Styled interactive maps iframe embed */}
            <div className="h-80 w-full overflow-hidden rounded-3xl border border-[#F5DDE1] relative shadow-xs">
              <iframe
                title="Glow & Grace Location Map"
                src={settings.iframeMapsUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
