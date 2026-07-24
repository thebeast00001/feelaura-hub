"use client";

/** Trigger the fly-a-dot-to-the-cart animation from a click position. */
export function flyToCart(x: number, y: number) {
  window.dispatchEvent(new CustomEvent("feelaura:fly", { detail: { x, y } }));
}
