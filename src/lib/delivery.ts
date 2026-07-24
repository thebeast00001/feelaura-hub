/**
 * Delivery serviceability + date logic. Pure functions, shared by the
 * client UI and the checkout API's server-side validation.
 *
 * Phase 2: replace `checkDelivery` with a real courier/serviceability API —
 * every consumer reads through this module, so nothing else changes.
 */

export interface DeliveryInfo {
  serviceable: boolean;
  sameDay: boolean;
  /** Days until earliest delivery (0 = today) */
  etaDays: number;
  region: string;
}

const METRO_PREFIXES: Record<string, string> = {
  "11": "Delhi NCR",
  "12": "Delhi NCR",
  "20": "Noida & West UP",
  "30": "Jaipur",
  "40": "Mumbai",
  "41": "Pune",
  "50": "Hyderabad",
  "56": "Bengaluru",
  "60": "Chennai",
  "70": "Kolkata",
  "38": "Ahmedabad",
  "16": "Chandigarh",
};

const REGIONS: Record<string, string> = {
  "1": "North India",
  "2": "North India",
  "3": "West India",
  "4": "West India",
  "5": "South India",
  "6": "South India",
  "7": "East India",
  "8": "North-East India",
  "9": "APO/FPO",
};

export function isValidPincode(pin: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pin);
}

export function checkDelivery(pin: string): DeliveryInfo | null {
  if (!isValidPincode(pin)) return null;

  // A small deterministic set of unserviceable pins (remote areas)
  const digitSum = pin.split("").reduce((n, d) => n + Number(d), 0);
  if (pin[0] === "9" || digitSum % 17 === 0) {
    return { serviceable: false, sameDay: false, etaDays: -1, region: REGIONS[pin[0]] ?? "India" };
  }

  const metro = METRO_PREFIXES[pin.slice(0, 2)];
  if (metro) {
    return { serviceable: true, sameDay: true, etaDays: 0, region: metro };
  }

  // 2–4 day ETA for everywhere else, derived deterministically
  const etaDays = 2 + (Number(pin[5]) % 3);
  return { serviceable: true, sameDay: false, etaDays, region: REGIONS[pin[0]] ?? "India" };
}

export interface DeliveryDate {
  iso: string;
  label: string;
  sublabel: string;
}

/** Next `count` selectable delivery dates, starting from the ETA. */
export function getDeliveryDates(etaDays: number, count = 10): DeliveryDate[] {
  const dates: DeliveryDate[] = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + etaDays + i);
    const offset = etaDays + i;
    dates.push({
      iso: d.toISOString().slice(0, 10),
      label:
        offset === 0
          ? "Today"
          : offset === 1
            ? "Tomorrow"
            : d.toLocaleDateString("en-IN", { weekday: "short" }),
      sublabel: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    });
  }
  return dates;
}

/** Server-side: is this ISO date a plausible delivery choice? */
export function isValidDeliveryDate(iso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const max = new Date(today);
  max.setDate(today.getDate() + 30);
  return date >= today && date <= max;
}
