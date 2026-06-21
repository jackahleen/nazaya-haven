const shortDialCodes = new Set([
  "211",
  "311",
  "411",
  "511",
  "711",
  "811",
  "911",
  "988",
]);

export function toTelHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  if (shortDialCodes.has(digits)) {
    return `tel:${digits}`;
  }

  if (digits.length === 10) {
    return `tel:+1${digits}`;
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    return `tel:+${digits}`;
  }

  return digits ? `tel:+${digits}` : "tel:";
}
