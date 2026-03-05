import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "TravelTour Pro - Explore Incredible India",
  description: "Discover and book amazing trips to all 28 states of India. Professional travel booking with detailed destination guides, secure payments, and travel guides.",
  keywords: ["Travel", "India", "Tourism", "Booking", "Holiday", "Vacation", "States of India"],
  icons: {
    icon: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=32&h=32&fit=crop",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
