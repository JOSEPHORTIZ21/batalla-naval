import type { Metadata, Viewport } from "next";
import { Black_Ops_One, Chakra_Petch } from "next/font/google";
import "./globals.css";

const display = Chakra_Petch({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-chakra",
});

const estencil = Black_Ops_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-black-ops",
});

export const metadata: Metadata = {
  title: "Batalla Naval",
  description: "Hunde la flota enemiga antes de que hundan la tuya",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#040b16",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${display.variable} ${estencil.variable}`}>
      <body className="fondo-mar min-h-dvh text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}