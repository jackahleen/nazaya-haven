"use client";

import { useCallback, useState } from "react";
import { type LegalNeedType, legalNeedLabels } from "@/data/legal-resources";
import { getAllSupportedLanguages } from "@/utils/findMatchingResources";
import { zipCodeToCounty } from "@/utils/zipCodeToCounty";

export type SearchParams = {
  zipCode: string;
  needType: LegalNeedType | "all";
  language: string;
};

type LegalSearchProps = {
  onSearch: (params: SearchParams) => void;
  isLoading?: boolean;
};

const legalNeeds: Array<{ value: LegalNeedType; label: string }> = [
  { value: "domestic-violence", label: legalNeedLabels["domestic-violence"] },
  { value: "child-abuse", label: legalNeedLabels["child-abuse"] },
  { value: "custody", label: legalNeedLabels["custody"] },
  { value: "child-support", label: legalNeedLabels["child-support"] },
  { value: "immigration", label: legalNeedLabels["immigration"] },
  { value: "housing", label: legalNeedLabels["housing"] },
  { value: "education", label: legalNeedLabels["education"] },
  { value: "mental-health", label: legalNeedLabels["mental-health"] },
  { value: "victim-compensation", label: legalNeedLabels["victim-compensation"] },
];

export function LegalSearch({ onSearch, isLoading = false }: LegalSearchProps) {
  const [zipCode, setZipCode] = useState("");
  const [detectedCounty, setDetectedCounty] = useState<string | null>(null);
  const [needType, setNeedType] = useState<LegalNeedType | "all">("all");
  const [language, setLanguage] = useState("Any");
  const [zipError, setZipError] = useState("");

  const languages = getAllSupportedLanguages();

  const handleZipChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setZipCode(value);
    setZipError("");

    // Real-time county detection
    if (value.length === 5) {
      const county = zipCodeToCounty(value);
      if (county) {
        setDetectedCounty(county);
      } else {
        setDetectedCounty(null);
        setZipError("This ZIP code is outside the Bay Area service area.");
      }
    } else {
      setDetectedCounty(null);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!zipCode || zipCode.length !== 5) {
      setZipError("Please enter a valid 5-digit ZIP code.");
      return;
    }

    if (!detectedCounty) {
      setZipError("This ZIP code is not in our service area.");
      return;
    }

    onSearch({
      zipCode,
      needType,
      language,
    });
  };

  return (
    <form onSubmit={handleSearch} className="space-y-6">
      {/* ZIP Code Section */}
      <div>
        <label htmlFor="zipCode" className="block text-sm font-semibold text-ink">
          Your ZIP Code
        </label>
        <p className="mt-1 text-xs text-ink-muted">
          We'll find legal resources in your area.
        </p>

        <div className="mt-3 space-y-2">
          <input
            id="zipCode"
            type="text"
            inputMode="numeric"
            pattern="\d{5}"
            maxLength={5}
            placeholder="94102"
            value={zipCode}
            onChange={handleZipChange}
            disabled={isLoading}
            className="w-full rounded-xl border-2 border-lavender-deep/60 bg-cream px-4 py-3 text-ink placeholder:text-ink-muted/50 disabled:opacity-60 focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/20"
          />

          {detectedCounty && (
            <p className="text-sm font-medium text-purple">
              ✓ Detected: {detectedCounty} County
            </p>
          )}

          {zipError && (
            <p className="text-sm text-pastel-rose">{zipError}</p>
          )}
        </div>
      </div>

      {/* Legal Need Type Section - Grid of Radio Buttons */}
      <div>
        <label className="block text-sm font-semibold text-ink">
          What legal help do you need?
        </label>
        <p className="mt-1 text-xs text-ink-muted">
          Select the type of legal assistance. (Optional)
        </p>

        <div className="mt-3 space-y-2">
          {/* Browse All Option */}
          <label className="flex items-center gap-3 rounded-lg border-2 border-lavender-deep/30 p-3 transition hover:border-purple/40 hover:bg-lavender-light/40">
            <input
              type="radio"
              name="needType"
              value="all"
              checked={needType === "all"}
              onChange={(e) => setNeedType(e.target.value as "all")}
              disabled={isLoading}
              className="h-4 w-4 cursor-pointer text-purple"
            />
            <span className="text-sm font-medium text-ink cursor-pointer">
              Browse all resources
            </span>
          </label>

          {/* Grid of Legal Need Categories */}
          <div className="grid gap-2 grid-cols-2 sm:grid-cols-1 md:grid-cols-2">
            {legalNeeds.map((need) => (
              <label
                key={need.value}
                className="flex items-center gap-3 rounded-lg border-2 border-lavender-deep/30 p-3 transition hover:border-purple/40 hover:bg-lavender-light/40"
              >
                <input
                  type="radio"
                  name="needType"
                  value={need.value}
                  checked={needType === need.value}
                  onChange={(e) => setNeedType(e.target.value as LegalNeedType)}
                  disabled={isLoading}
                  className="h-4 w-4 cursor-pointer text-purple shrink-0"
                />
                <span className="text-sm font-medium text-ink cursor-pointer">
                  {need.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Language Section */}
      <div>
        <label htmlFor="language" className="block text-sm font-semibold text-ink">
          Preferred Language (Optional)
        </label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          disabled={isLoading}
          className="mt-3 w-full rounded-xl border-2 border-lavender-deep/60 bg-cream px-4 py-3 text-ink disabled:opacity-60 focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/20"
        >
          <option value="Any">Any language</option>
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      {/* Search Button */}
      <button
        type="submit"
        disabled={isLoading || !zipCode || zipCode.length !== 5 || !detectedCounty}
        className="w-full rounded-full bg-purple px-6 py-3 text-sm font-semibold text-cream shadow-md shadow-purple/25 transition hover:bg-purple-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:opacity-60"
      >
        {isLoading ? "Searching..." : "Search Resources"}
      </button>
    </form>
  );
}
