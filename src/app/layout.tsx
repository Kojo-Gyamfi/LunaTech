import type { Metadata, Viewport } from "next";
import { Geist_Mono, Sora, Space_Grotesk } from "next/font/google";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import ToastProvider from "@/components/ToastProvider";
import "./globals.css";

const sora = Sora({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LunaTech - Premium Tech Collection",
  description:
    "Curated luxury electronics and gadgets for the discerning tech enthusiast",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${sora.variable} ${spaceGrotesk.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950">
        <ToastProvider>
          <Navbar />
          {children}
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
