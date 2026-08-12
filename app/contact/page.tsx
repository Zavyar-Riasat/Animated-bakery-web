import React from "react";
import InquiryForm from "@/components/InquiryForm";
import { Clock, MapPin, Phone, Mail, Award, Sparkles } from "lucide-react";

export const metadata = {
  title: "Custom Cake Inquiry & Contact | Maison du Pain",
  description: "Request a custom wedding or celebration cake consultation with executive pastry chefs at Maison du Pain.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-bakery-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto pt-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bakery-gold/10 border border-bakery-gold/30 text-bakery-gold text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Tailored Pastry Artistry
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-bakery-warmWhite tracking-tight mb-4">
            Custom Cake Consultations
          </h1>
          <p className="text-bakery-subtext text-base sm:text-lg leading-relaxed">
            Whether for an intimate luxury wedding, milestone gala, or private celebration, our pastry team crafts custom tiered showpieces tailored to your exact taste and aesthetic.
          </p>
        </div>

        {/* Form Component */}
        <InquiryForm />

        {/* Boutique Location & Information Grid */}
        <div className="bg-bakery-card border border-bakery-border rounded-3xl p-8 sm:p-12">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
            <div className="space-y-3 text-center md:text-left">
              <div className="w-10 h-10 rounded-full bg-bakery-gold/10 border border-bakery-gold/30 flex items-center justify-center mx-auto md:mx-0 text-bakery-gold">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-bakery-warmWhite text-base">
                Flagship Boutique
              </h3>
              <p className="text-bakery-subtext text-xs leading-relaxed">
                742 Artisan Lane, Culinary District
                <br />
                New York, NY 10012
              </p>
            </div>

            <div className="space-y-3 text-center md:text-left">
              <div className="w-10 h-10 rounded-full bg-bakery-gold/10 border border-bakery-gold/30 flex items-center justify-center mx-auto md:mx-0 text-bakery-gold">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-bakery-warmWhite text-base">
                Tasting & Consultation Hours
              </h3>
              <p className="text-bakery-subtext text-xs leading-relaxed">
                Tuesday - Saturday: 10:00 AM - 4:00 PM
                <br />
                (By Appointment Only)
              </p>
            </div>

            <div className="space-y-3 text-center md:text-left">
              <div className="w-10 h-10 rounded-full bg-bakery-gold/10 border border-bakery-gold/30 flex items-center justify-center mx-auto md:mx-0 text-bakery-gold">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-bakery-warmWhite text-base">
                Concierge Contact
              </h3>
              <p className="text-bakery-subtext text-xs leading-relaxed">
                Direct: (555) 839-2253
                <br />
                Email: concierge@maisondupain.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
