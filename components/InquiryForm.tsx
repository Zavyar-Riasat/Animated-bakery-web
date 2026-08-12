"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Sparkles, Calendar, Users, DollarSign, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const inquirySchema = z.object({
  fullName: z.string().min(2, "Please enter your full name (at least 2 characters)"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid 10-digit US phone number"),
  eventDate: z.string().min(1, "Please select an event date"),
  guestCount: z.number().min(1, "Guest count must be at least 1"),
  cakeTier: z.string().min(1, "Please select a cake size or tier count"),
  flavorProfile: z.string().min(1, "Please select your preferred flavor profile"),
  budgetRange: z.string().min(1, "Please select a budget range"),
  designDescription: z.string().min(10, "Please describe your vision in at least 10 characters"),
  dietaryRestrictions: z.array(z.string()).default([]),
});

type InquiryFormValues = z.infer<typeof inquirySchema>;

const CAKE_TIERS = [
  "Single Tier (Serves 12-15)",
  "2-Tier Classic (Serves 25-35)",
  "3-Tier Grand (Serves 50-70)",
  "4-Tier Luxury Wedding (Serves 100+)",
  "Custom Sculpture / Multi-Level",
];

const FLAVORS = [
  "Signature Valrhona Chocolate & Espresso",
  "Tahitian Vanilla Bean & Wild Raspberry",
  "Sicilian Pistachio & Cardamom Cream",
  "Lemon Lavender & White Chocolate",
  "Salted Caramel Hazelnut Praline",
  "Custom Tasting Consultation",
];

const BUDGETS = [
  "$150 - $300 (Single / Small 2-Tier)",
  "$300 - $600 (2-3 Tier Signature)",
  "$600 - $1,200 (Grand Celebration)",
  "$1,200+ (Bespoke Luxury Tier)",
];

const DIETARY_OPTIONS = ["Gluten-Free", "Dairy-Free", "Nut-Free", "Vegan", "Eggless"];

export const InquiryForm: React.FC = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successResponse, setSuccessResponse] = useState<{
    referenceId: string;
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      eventDate: "",
      guestCount: 30,
      cakeTier: "2-Tier Classic (Serves 25-35)",
      flavorProfile: "Signature Valrhona Chocolate & Espresso",
      budgetRange: "$300 - $600 (2-3 Tier Signature)",
      designDescription: "",
      dietaryRestrictions: [] as string[],
    },
  });

  const selectedDietary = watch("dietaryRestrictions") || [];

  const handleDietaryToggle = (item: string) => {
    if (selectedDietary.includes(item)) {
      setValue(
        "dietaryRestrictions",
        selectedDietary.filter((d) => d !== item)
      );
    } else {
      setValue("dietaryRestrictions", [...selectedDietary, item]);
    }
  };

  const onSubmit = async (data: InquiryFormValues) => {
    setServerError(null);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (json.success) {
        setSuccessResponse({
          referenceId: json.referenceId,
          message: json.message,
        });
        reset();
      } else {
        setServerError(json.error || "Failed to submit inquiry.");
      }
    } catch (err) {
      setServerError("Network error connecting to inquiry API.");
    }
  };

  if (successResponse) {
    return (
      <div className="bg-bakery-card border border-bakery-gold/40 rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-bakery-amber via-bakery-gold to-yellow-200" />
        <div className="w-16 h-16 rounded-full bg-bakery-gold/10 border border-bakery-gold/40 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-bakery-gold" />
        </div>
        <h3 className="text-3xl font-serif font-bold text-bakery-warmWhite mb-3">
          Inquiry Received
        </h3>
        <p className="text-bakery-subtext text-base leading-relaxed mb-6">
          {successResponse.message}
        </p>

        <div className="bg-bakery-dark/80 border border-bakery-border rounded-xl p-4 mb-8 font-mono text-xs text-bakery-subtext inline-block max-w-full">
          Reference Confirmation ID:{" "}
          <span className="text-bakery-gold font-bold">{successResponse.referenceId}</span>
        </div>

        <div>
          <button
            onClick={() => setSuccessResponse(null)}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-bakery-amber to-bakery-gold text-bakery-dark font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-md"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-bakery-card/90 border border-bakery-border rounded-3xl p-6 sm:p-10 shadow-2xl max-w-3xl mx-auto backdrop-blur-md"
    >
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-bakery-gold/10 border border-bakery-gold/30 text-bakery-gold text-xs font-semibold uppercase tracking-widest mb-2">
          <Sparkles className="w-3.5 h-3.5 text-bakery-amber" /> Bespoke Creation Service
        </div>
        <h3 className="text-3xl sm:text-4xl font-serif font-bold text-bakery-warmWhite tracking-tight">
          Custom Cake Inquiry
        </h3>
        <p className="text-bakery-subtext text-sm mt-2">
          Fill out your event requirements below. Our executive pastry chef will review your vision and reply with a tailored proposal.
        </p>
      </div>

      {serverError && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-800/50 text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {serverError}
        </div>
      )}

      <div className="space-y-6">
        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-bakery-warmWhite uppercase tracking-wider mb-2">
              Full Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Eleanor Vance"
              {...register("fullName")}
              className="w-full px-4 py-3 rounded-xl bg-bakery-dark/70 border border-bakery-border focus:border-bakery-gold text-bakery-warmWhite placeholder:text-bakery-subtext/50 text-sm outline-none transition-colors"
            />
            {errors.fullName && (
              <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-bakery-warmWhite uppercase tracking-wider mb-2">
              Email Address *
            </label>
            <input
              type="email"
              placeholder="eleanor@example.com"
              {...register("email")}
              className="w-full px-4 py-3 rounded-xl bg-bakery-dark/70 border border-bakery-border focus:border-bakery-gold text-bakery-warmWhite placeholder:text-bakery-subtext/50 text-sm outline-none transition-colors"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold text-bakery-warmWhite uppercase tracking-wider mb-2">
              Phone Number (US) *
            </label>
            <input
              type="tel"
              placeholder="(555) 019-2834"
              {...register("phone")}
              className="w-full px-4 py-3 rounded-xl bg-bakery-dark/70 border border-bakery-border focus:border-bakery-gold text-bakery-warmWhite placeholder:text-bakery-subtext/50 text-sm outline-none transition-colors"
            />
            {errors.phone && (
              <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-bakery-warmWhite uppercase tracking-wider mb-2 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-bakery-gold" /> Event Date *
            </label>
            <input
              type="date"
              {...register("eventDate")}
              className="w-full px-4 py-3 rounded-xl bg-bakery-dark/70 border border-bakery-border focus:border-bakery-gold text-bakery-warmWhite text-sm outline-none transition-colors"
            />
            {errors.eventDate && (
              <p className="text-red-400 text-xs mt-1">{errors.eventDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-bakery-warmWhite uppercase tracking-wider mb-2 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-bakery-gold" /> Guest Count *
            </label>
            <input
              type="number"
              min={1}
              {...register("guestCount", { valueAsNumber: true })}
              className="w-full px-4 py-3 rounded-xl bg-bakery-dark/70 border border-bakery-border focus:border-bakery-gold text-bakery-warmWhite text-sm outline-none transition-colors"
            />
            {errors.guestCount && (
              <p className="text-red-400 text-xs mt-1">{errors.guestCount.message}</p>
            )}
          </div>
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-bakery-warmWhite uppercase tracking-wider mb-2">
              Cake Size & Tiers *
            </label>
            <select
              {...register("cakeTier")}
              className="w-full px-4 py-3 rounded-xl bg-bakery-dark/70 border border-bakery-border focus:border-bakery-gold text-bakery-warmWhite text-sm outline-none transition-colors"
            >
              {CAKE_TIERS.map((tier) => (
                <option key={tier} value={tier} className="bg-bakery-card text-bakery-warmWhite">
                  {tier}
                </option>
              ))}
            </select>
            {errors.cakeTier && (
              <p className="text-red-400 text-xs mt-1">{errors.cakeTier.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-bakery-warmWhite uppercase tracking-wider mb-2">
              Preferred Flavor Profile *
            </label>
            <select
              {...register("flavorProfile")}
              className="w-full px-4 py-3 rounded-xl bg-bakery-dark/70 border border-bakery-border focus:border-bakery-gold text-bakery-warmWhite text-sm outline-none transition-colors"
            >
              {FLAVORS.map((f) => (
                <option key={f} value={f} className="bg-bakery-card text-bakery-warmWhite">
                  {f}
                </option>
              ))}
            </select>
            {errors.flavorProfile && (
              <p className="text-red-400 text-xs mt-1">{errors.flavorProfile.message}</p>
            )}
          </div>
        </div>

        {/* Budget */}
        <div>
          <label className="block text-xs font-semibold text-bakery-warmWhite uppercase tracking-wider mb-2 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-bakery-gold" /> Budget Range (USD) *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BUDGETS.map((b) => (
              <label
                key={b}
                className={`flex items-center p-3 rounded-xl border cursor-pointer text-xs transition-all ${
                  watch("budgetRange") === b
                    ? "bg-bakery-gold/15 border-bakery-gold text-bakery-gold font-semibold"
                    : "bg-bakery-dark/50 border-bakery-border text-bakery-subtext hover:border-bakery-gold/30"
                }`}
              >
                <input
                  type="radio"
                  value={b}
                  {...register("budgetRange")}
                  className="sr-only"
                />
                {b}
              </label>
            ))}
          </div>
          {errors.budgetRange && (
            <p className="text-red-400 text-xs mt-1">{errors.budgetRange.message}</p>
          )}
        </div>

        {/* Dietary Checkboxes */}
        <div>
          <label className="block text-xs font-semibold text-bakery-warmWhite uppercase tracking-wider mb-2">
            Dietary Requirements (Optional)
          </label>
          <div className="flex flex-wrap gap-2">
            {DIETARY_OPTIONS.map((opt) => {
              const isChecked = selectedDietary.includes(opt);
              return (
                <button
                  type="button"
                  key={opt}
                  onClick={() => handleDietaryToggle(opt)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    isChecked
                      ? "bg-bakery-gold text-bakery-dark font-bold border-bakery-gold"
                      : "bg-bakery-dark/50 border-bakery-border text-bakery-subtext hover:text-bakery-warmWhite"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Design Description */}
        <div>
          <label className="block text-xs font-semibold text-bakery-warmWhite uppercase tracking-wider mb-2">
            Design Description & Theme Vision *
          </label>
          <textarea
            rows={4}
            placeholder="Tell us about your event theme, color palette, flower choices, or inspiration photos..."
            {...register("designDescription")}
            className="w-full px-4 py-3 rounded-xl bg-bakery-dark/70 border border-bakery-border focus:border-bakery-gold text-bakery-warmWhite placeholder:text-bakery-subtext/50 text-sm outline-none transition-colors"
          />
          {errors.designDescription && (
            <p className="text-red-400 text-xs mt-1">{errors.designDescription.message}</p>
          )}
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-bakery-amber to-bakery-gold text-bakery-dark font-bold text-sm uppercase tracking-wider hover:brightness-110 transition-all shadow-xl shadow-bakery-gold/15 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Submitting Request...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" /> Submit Custom Inquiry
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default InquiryForm;
