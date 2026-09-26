export function getSupportedCurrencies(): { code: string; label: string }[] {
  return [
    { code: "USD", label: "US Dollar ($)" },
    { code: "EUR", label: "Euro (€)" },
    { code: "GBP", label: "British Pound (£)" },
    { code: "INR", label: "Indian Rupee (₹)" },
    { code: "CAD", label: "Canadian Dollar ($)" },
    { code: "AUD", label: "Australian Dollar ($)" },
    { code: "JPY", label: "Japanese Yen (¥)" },
    { code: "CHF", label: "Swiss Franc (CHF)" },
  ];
}
