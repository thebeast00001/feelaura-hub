import type { ActiveOrder } from "./orders-store";

export interface DeliveryStage {
  index: number;
  label: string;
  sub: string;
  /** 0..1 fill of the progress track */
  progress: number;
  delivered: boolean;
}

export const STAGE_LABELS = [
  "Order placed",
  "Wrapping your gift",
  "Dispatched",
  "Out for delivery",
  "Delivered",
];

/**
 * Compute the current delivery stage.
 *
 * The first three stages advance on a short, compressed timeline so the
 * activity visibly comes alive right after checkout (there's no real courier
 * in this demo). "Out for delivery" fires on the delivery day, "Delivered"
 * once it has passed. In production this would be driven by courier webhooks.
 */
export function deliveryStage(order: ActiveOrder, now: number): DeliveryStage {
  const mins = (now - order.placedAt) / 60000;
  const outStart = new Date(`${order.deliveryDate}T08:00:00`).getTime();
  const delivered = new Date(`${order.deliveryDate}T20:00:00`).getTime();

  let index: number;
  if (now >= delivered) index = 4;
  else if (now >= outStart) index = 3;
  else if (mins < 0.75) index = 0;
  else if (mins < 2) index = 1;
  else index = 2; // dispatched / in transit until the delivery day

  const friendly = new Date(`${order.deliveryDate}T09:00:00`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const subs = [
    "We've got your order",
    "Hand-wrapping in progress",
    `Arriving ${friendly}`,
    "Arriving today",
    "Enjoy your gift!",
  ];

  return {
    index,
    label: STAGE_LABELS[index],
    sub: subs[index],
    progress: index / 4,
    delivered: index === 4,
  };
}
