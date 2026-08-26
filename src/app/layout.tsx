import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pawsure — Every pet cared for. Every stray seen.",
  description:
    "Hyperlocal pet care in Lokhandwala, Andheri West — walkers, groomers, vets, boarding. Plus Pawsure Watch: report a street animal in trouble and nearby rescue NGOs are alerted instantly.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#ed176a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full overflow-x-hidden antialiased">
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      </head>
      <body className="min-h-full overflow-x-hidden bg-[#FFF7F3] text-[#0a0a0a]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
