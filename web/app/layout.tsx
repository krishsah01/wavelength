import type { Metadata } from "next";
import { Newsreader, Inter } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Wavelength — Find Your People",
    template: "%s | Wavelength",
  },
  description:
    "Wavelength uses AI to match you with people who share your exact interests — no matter how niche. Write freely about what you love, and find your people.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://wavelength.app"),
  keywords: [
    "find people with same interests",
    "niche interest community",
    "AI friend finder",
    "meet people with similar hobbies",
    "pen pal app for adults",
    "find friends with unusual interests",
    "AI social matching",
    "interest-based connections",
  ],
  authors: [{ name: "Wavelength" }],
  creator: "Wavelength",
  openGraph: {
    type: "website",
    siteName: "Wavelength",
    title: "Wavelength — Find Your People",
    description:
      "AI-powered matching for people with niche, specific, and unusual interests. Write about what you love — we find who else loves it.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Wavelength" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wavelength — Find Your People",
    description:
      "AI-powered matching for people with niche, specific, and unusual interests.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1 },
  },
};

const appStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Wavelength",
  url: "https://wavelength.app",
  description:
    "AI-powered platform that matches people based on niche interests using semantic embeddings. Find your people — no matter how specific your interests.",
  applicationCategory: "SocialNetworkingApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${newsreader.variable} ${inter.variable} antialiased bg-[#1a1208] text-[#ede8d8]`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(appStructuredData) }}
        />
        {children}
      </body>
    </html>
  );
}