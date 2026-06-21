"use client";

import { useState } from "react";
import { type LegalNeedType } from "@/data/legal-resources";
import { zipCodeToCounty } from "@/utils/zipCodeToCounty";

export type WizardAnswers = {
  needType: LegalNeedType;
  zipCode: string;
  urgency: "emergency" | "24-hours" | "this-week";
};

type SupportWizardProps = {
  onComplete: (answers: WizardAnswers) => void;
};

const needOptions: Array<{ value: LegalNeedType; label: string; emoji: string }> = [
  { value: "domestic-violence", label: "I need a restraining order", emoji: "💜" },
  { value: "custody", label: "I need custody help", emoji: "👨‍👩‍👧" },
  { value: "child-abuse", label: "I think my child was abused", emoji: "🤝" },
  { value: "housing", label: "I need housing assistance", emoji: "🏠" },
  { value: "immigration", label: "I need immigration help", emoji: "🌍" },
  { value: "mental-health", label: "I need mental health support", emoji: "💚" },
  { value: "general", label: "I need legal aid", emoji: "📋" },
];

const urgencyOptions = [
  { value: "emergency" as const, label: "Emergency - I need help NOW", emoji: "🚨", color: "bg-pastel-rose" },
  { value: "24-hours" as const, label: "Within 24 hours", emoji: "⏰", color: "bg-butter" },
  { value: "this-week" as const, label: "This week", emoji: "📅", color: "bg-sky" },
];

export function SupportWizard({ onComplete }: SupportWizardProps) {
  const [step, setStep] = useState(1);
  const [needType, setNeedType] = useState<LegalNeedType | null>(null);
  const [zipCode, setZipCode] = useState("");
  const [zipError, setZipError] = useState("");
  const [detectedCounty, setDetectedCounty] = useState<string | null>(null);
  const [urgency, setUrgency] = useState<"emergency" | "24-hours" | "this-week" | null>(null);

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setZipCode(value);
    setZipError("");

    if (value.length === 5) {
      const county = zipCodeToCounty(value);
      if (county) {
        setDetectedCounty(county);
      } else {
        setDetectedCounty(null);
        setZipError("This ZIP code is outside our service area.");
      }
    } else {
      setDetectedCounty(null);
    }
  };

  const handleNext = () => {
    if (step === 1 && !needType) {
      return;
    }
    if (step === 2) {
      if (!zipCode || zipCode.length !== 5 || !detectedCounty) {
        setZipError("Please enter a valid ZIP code in the Bay Area.");
        return;
      }
    }
    if (step === 3) {
      if (!urgency) {
        return;
      }
      // Wizard complete - call parent handler
      onComplete({
        needType: needType!,
        zipCode,
        urgency,
      });
      return;
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="rounded-2xl border-2 border-purple/40 bg-gradient-to-b from-purple/5 to-lavender/5 p-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-ink">Let's Find Help Together</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Answer a few questions to get personalized resources
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 flex gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition ${
              s <= step ? "bg-purple" : "bg-purple/20"
            }`}
          />
        ))}
      </div>

      {/* Step 1: What help do you need? */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-ink">What do you need help with?</h3>
          <div className="space-y-2">
            {needOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setNeedType(option.value)}
                className={`w-full rounded-xl border-2 p-4 text-left transition ${
                  needType === option.value
                    ? "border-purple bg-purple/10"
                    : "border-lavender-deep/30 hover:border-purple/40 hover:bg-lavender-light/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{option.emoji}</span>
                  <span className="font-medium text-ink">{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: ZIP Code */}
      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-ink">Where are you located?</h3>
          <p className="text-sm text-ink-muted">
            We'll find resources near you. We serve the Bay Area and Northern California.
          </p>

          <div className="space-y-2">
            <input
              type="text"
              inputMode="numeric"
              pattern="\d{5}"
              maxLength={5}
              placeholder="94102"
              value={zipCode}
              onChange={handleZipChange}
              className="w-full rounded-xl border-2 border-lavender-deep/60 bg-cream px-4 py-3 text-lg text-ink placeholder:text-ink-muted/50 focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/20"
            />

            {detectedCounty && (
              <p className="text-sm font-medium text-purple">✓ {detectedCounty} County</p>
            )}

            {zipError && <p className="text-sm text-pastel-rose">{zipError}</p>}
          </div>
        </div>
      )}

      {/* Step 3: Urgency */}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-ink">How urgent is your situation?</h3>
          <p className="text-sm text-ink-muted">
            This helps us prioritize the most relevant resources for you.
          </p>

          <div className="space-y-2">
            {urgencyOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setUrgency(option.value)}
                className={`w-full rounded-xl border-2 p-4 text-left transition ${
                  urgency === option.value
                    ? `border-${option.color.split("-")[1]} ${option.color}/20`
                    : "border-lavender-deep/30 hover:border-purple/40 hover:bg-lavender-light/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{option.emoji}</span>
                  <span className="font-medium text-ink">{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Summary of selections (shown on step 2 & 3) */}
      {step > 1 && (
        <div className="mt-6 rounded-lg bg-white/40 p-3">
          <p className="text-xs font-medium text-ink-muted uppercase">Your Selections</p>
          <p className="mt-1 text-sm text-ink">
            {needOptions.find((o) => o.value === needType)?.label}
          </p>
          {detectedCounty && (
            <p className="text-sm text-ink">ZIP: {zipCode} ({detectedCounty} County)</p>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 flex gap-3">
        {step > 1 && (
          <button
            onClick={handleBack}
            className="flex-1 rounded-full border-2 border-purple/30 bg-lavender-light px-4 py-3 font-semibold text-purple-deep transition hover:border-purple/50 hover:bg-lavender focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-soft"
          >
            ← Back
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={
            (step === 1 && !needType) ||
            (step === 2 && (!zipCode || zipCode.length !== 5 || !detectedCounty)) ||
            (step === 3 && !urgency)
          }
          className={`flex-1 rounded-full px-4 py-3 font-semibold text-cream shadow-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-cream ${
            step === 3
              ? "bg-purple hover:bg-purple-deep shadow-purple/25 focus-visible:ring-purple disabled:opacity-60"
              : "bg-purple hover:bg-purple-deep shadow-purple/25 focus-visible:ring-purple disabled:opacity-60"
          }`}
        >
          {step === 3 ? "Find Resources" : "Next"}
        </button>
      </div>

      {/* Step indicator */}
      <p className="mt-4 text-center text-xs text-ink-muted">
        Step {step} of 3
      </p>
    </div>
  );
}
