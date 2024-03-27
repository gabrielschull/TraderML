import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "TraderML",
  description: "Compare your machine learning trading bot strategy with historical data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(
          "min-h-screen bg-black font-sans antialiased",
          fontSans.variable,
          
        )}>{children}</body>
    </html>
  );
}
