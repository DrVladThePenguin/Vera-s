import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter, Mozilla_Text } from "next/font/google";
import { StoreProvider } from "@/lib/store";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const mozillaText = Mozilla_Text({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  adjustFontFallback: false,
  fallback: ["system-ui", "Segoe UI", "sans-serif"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "VentureOS",
  description: "Founder and investor onboarding for VentureOS.",
  icons: { icon: "/logo.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${mozillaText.variable} ${plexMono.variable} font-sans antialiased`}
      >
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}