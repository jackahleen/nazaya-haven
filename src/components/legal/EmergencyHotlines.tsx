"use client";

const emergencyNumbers = [
  {
    id: "911",
    label: "Emergency",
    number: "911",
    description: "Immediate danger, police, fire, medical",
    color: "bg-pastel-rose/10 text-pastel-rose",
    icon: "🚨",
  },
  {
    id: "dv",
    label: "National DV Hotline",
    number: "1-800-799-7233",
    description: "Domestic violence support & resources (24/7)",
    color: "bg-rose/10 text-rose-deep",
    icon: "💜",
  },
  {
    id: "childhelp",
    label: "Childhelp Hotline",
    number: "1-800-422-4453",
    description: "Child abuse & neglect reporting (24/7)",
    color: "bg-sky/10 text-sky-deep",
    icon: "🤝",
  },
  {
    id: "988",
    label: "988 Crisis Line",
    number: "988",
    description: "Mental health & suicide crisis support (24/7)",
    color: "bg-mint/10 text-mint-deep",
    icon: "💚",
  },
];

export function EmergencyHotlines() {
  const handleCall = (number: string) => {
    const phoneDigits = number.replace(/\D/g, "");
    window.location.href = `tel:+1${phoneDigits}`;
  };

  return (
    <div className="rounded-2xl border-2 border-pastel-rose/40 bg-pastel-rose/5 p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-ink">🆘 Emergency Support</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Immediate help available 24/7. All calls are confidential.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {emergencyNumbers.map((hotline) => (
          <button
            key={hotline.id}
            onClick={() => handleCall(hotline.number)}
            className={`${hotline.color} flex flex-col items-start gap-3 rounded-xl border-2 border-current border-opacity-20 p-4 transition hover:border-opacity-40`}
          >
            <div className="flex items-start justify-between w-full">
              <div className="flex-1">
                <p className="text-sm font-bold">{hotline.icon} {hotline.label}</p>
                <p className="text-xs mt-1 opacity-75">{hotline.description}</p>
              </div>
            </div>
            <p className="text-lg font-bold font-mono">{hotline.number}</p>
            <span className="inline-block text-xs font-semibold opacity-75 mt-1">
              Tap to call →
            </span>
          </button>
        ))}
      </div>

      <p className="mt-4 text-xs text-ink-muted">
        <strong>Privacy:</strong> Calls to these numbers are confidential. If you&apos;re not safe speaking, text &quot;HELP&quot; to 741741 (Crisis Text Line).
      </p>
    </div>
  );
}
