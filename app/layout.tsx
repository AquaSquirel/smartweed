import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://smartweed.mateuss.com.br'),
  title: "SmartWeed Dashboard",
  description: "Monitoramento em tempo real de sensores IoT — Distância via HC-SR04 e ESP32",
  openGraph: {
    title: "SmartWeed Dashboard",
    description: "Monitoramento em tempo real de sensores IoT — Distância via HC-SR04 e ESP32",
    siteName: "SmartWeed",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartWeed Dashboard",
    description: "Monitoramento em tempo real de sensores IoT — Distância via HC-SR04 e ESP32",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col grid-bg radial-glow">{children}</body>
    </html>
  );
}
