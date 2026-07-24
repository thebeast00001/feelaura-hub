import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "@fontsource-variable/fraunces/full.css";
import "@fontsource-variable/fraunces/full-italic.css";
import "@fontsource-variable/manrope";
import { BRAND } from "@/lib/brand";
import SmoothScroll from "@/components/providers/SmoothScroll";
import IntroLoader from "@/components/layout/IntroLoader";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${BRAND.name} — ${BRAND.tagline}`,
    template: `%s — ${BRAND.name}`,
  },
  description: BRAND.description,
};

export const viewport: Viewport = {
  themeColor: "#f6f3ed",
  viewportFit: "cover",
};

const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const app = (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Set theme before first paint — light by default for new visitors;
            dark only when the user has explicitly chosen it via the toggle */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('feelaura-theme');document.documentElement.dataset.theme=t==='dark'?'dark':'light'}catch(e){document.documentElement.dataset.theme='light'}})()",
          }}
        />
      </head>
      {/* suppressHydrationWarning: browser extensions (ColorZilla etc.) inject
          attributes into <body> before React hydrates — harmless, but noisy. */}
      <body suppressHydrationWarning>
        <IntroLoader />
        <SmoothScroll>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CartDrawer />
        </SmoothScroll>
      </body>
    </html>
  );

  // Auth is optional until Clerk keys are added to .env.local.
  if (!clerkEnabled) return app;

  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#bc4a25",
          colorForeground: "#1b1712",
          colorBackground: "#f6f3ed",
          borderRadius: "1.25rem",
          fontFamily: "'Manrope Variable', ui-sans-serif, system-ui, sans-serif",
        },
        elements: {
          formButtonPrimary: "rounded-full",
          card: "shadow-[0_24px_60px_-24px_rgb(27_23_18/0.3)]",
        },
      }}
    >
      {app}
    </ClerkProvider>
  );
}
