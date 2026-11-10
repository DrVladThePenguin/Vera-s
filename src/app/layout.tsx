import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { StoreProvider } from "@/lib/store";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "VentureOS",
  description: "Founder and investor onboarding for VentureOS.",
  icons: { icon: "/logo.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
