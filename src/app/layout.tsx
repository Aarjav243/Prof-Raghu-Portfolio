import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "@/visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Raghu VM Ganesh | Assistant Professor of Chemistry | Krea University",
  description:
    "Official academic portfolio of Raghu VM Ganesh — Assistant Professor of Chemistry at Krea University. Expert in Catalytic Nanomaterials, CO₂ Utilization, Green Hydrogen, and Intermetallic Nanoparticles.",
  keywords: [
    "Raghu VM Ganesh",
    "Raghu Maligal Ganesh",
    "Assistant Professor Chemistry",
    "Krea University",
    "Catalytic Nanomaterials",
    "CO2 Utilization",
    "Green Hydrogen",
    "Intermetallic Nanoparticles",
    "Heterogeneous Catalysis",
    "Dry Reforming Methane",
    "Electrocatalysis",
    "Metal-Organic Frameworks",
    "Iowa State University Chemistry",
    "KAUST Postdoctoral",
  ],
  authors: [{ name: "Raghu VM Ganesh" }],
  creator: "Raghu VM Ganesh",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://prof-raghu-portfolio.vercel.app/",
    title: "Raghu VM Ganesh | Assistant Professor of Chemistry",
    description:
      "Official academic portfolio of Raghu VM Ganesh — Assistant Professor of Chemistry at Krea University. Expert in Catalytic Nanomaterials, CO₂ Utilization, and Green Hydrogen.",
    siteName: "Raghu VM Ganesh Portfolio",
    images: [
      {
        url: "https://prof-raghu-portfolio.vercel.app/prof-raghu.jpg",
        width: 1200,
        height: 630,
        alt: "Raghu VM Ganesh — Assistant Professor of Chemistry at Krea University",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Raghu VM Ganesh | Assistant Professor of Chemistry",
    description:
      "Official academic portfolio of Raghu VM Ganesh — Assistant Professor of Chemistry at Krea University. Expert in Catalytic Nanomaterials and CO₂ Utilization.",
    images: ["https://prof-raghu-portfolio.vercel.app/prof-raghu.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "N3AwhgHf0M2fyTSXqFjR3B6fbui5myI7ebeUfzCCkDQ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/locomotive-scroll@4.1.4/dist/locomotive-scroll.min.css"
        />
      </head>
      <body className="antialiased">
        <Script
          id="orchids-browser-logs"
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
          strategy="afterInteractive"
          data-orchids-project-id="17378af7-a5d6-429e-b7e8-078e5524e67d"
        />
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        {children}
        <VisualEditsMessenger />
        {/* External libs loaded after content */}
        <Script
          src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/locomotive-scroll@4.1.4/dist/locomotive-scroll.min.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
