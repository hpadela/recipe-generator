import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "MouseChef AI - Transform what you have into something delicious",
  description: "Upload photos of your ingredients and let AI create personalized recipes based on your dietary preferences, skill level, and available time.",
  keywords: ["recipe generator", "AI cooking", "ingredient recognition", "meal planning"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${fraunces.variable} antialiased`}
        style={{ fontFamily: "var(--font-inter), var(--font-sans)" }}
      >
        {children}
      </body>
    </html>
  );
}
