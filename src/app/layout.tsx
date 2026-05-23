import type { Metadata, Viewport } from "next";
import { Poppins, Inter, Manrope } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Butwal Snake Rescuers | 24/7 Emergency Snake Rescue & Wildlife Conservation",
  description:
    "Professional 24/7 emergency snake rescue and wildlife conservation in Rupandehi District, Nepal. Safe rescue, snakebite first aid support, and local awareness campaigns.",
  keywords:
    "snake rescue nepal, butwal snake rescuers, krait bite first aid nepal, spectacled cobra rescue butwal, wildlife conservation rupandehi",
  authors: [{ name: "Butwal Snake Rescuers" }],
};

export const viewport: Viewport = {
  themeColor: "#2ECC71",
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} ${manrope.variable} h-full antialiased dark`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="bg-background text-foreground min-h-screen font-sans">
        {/* AppProvider wraps everything — each page includes its own Navbar/Footer */}
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
