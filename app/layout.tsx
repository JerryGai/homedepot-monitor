import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

const montserrat = Montserrat({ subsets: ["latin"] });

const simpleToken = process.env.SIMPLE_TOKEN ?? "";


export const metadata: Metadata = {
  title: "HomeDepot Workshop Monitor",
  description: "Mnitor HomeDepot workshops near your location, and get notified when new workshops are available.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log(simpleToken);
  return (
    <html lang="en">
      <body className={montserrat.className}>
        {children}
        <SpeedInsights />
        <Analytics/>
      </body>
    </html>
  );
}
