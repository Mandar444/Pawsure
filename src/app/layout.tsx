import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pawsure — Every pet cared for. Every stray seen.",
  description:
    "Hyperlocal pet care in Lokhandwala, Andheri West — walkers, groomers, vets, boarding. Plus Pawsure Watch: report a street animal in trouble and nearby rescue NGOs are alerted instantly.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
