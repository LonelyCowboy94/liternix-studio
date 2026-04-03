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

const SITE_URL = "https://liternix-studio.vercel.app/";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Luka Jokić | Professional Video Editor & Visual Storyteller",
    template: "%s | Luka Jokić",
  },
  description:
    "Transforming raw footage into cinematic masterpieces. Expert video editing, motion graphics, and post-production for brands and creators who demand excellence.",
  keywords: [
    "Video Editing",
    "Post-Production",
    "Video Crafting",
    "Motion Graphics",
    "Color Grading",
    "Cinematic Editing",
    "Commercial Video Editor",
    "YouTube Editor",
    "Visual Storytelling",
  ],
  authors: [{ name: "Luka Jokić" }],
  creator: "Luka Jokić",
  openGraph: {
    type: "website",
    locale: "en_US", 
    url: SITE_URL,
    title: "Luka Jokić | Professional Video Editor",
    description: "High-end video editing services. From raw cut to cinematic finish.",
    siteName: "Luka Jokić Portfolio",
    images: [
      {
        url: "/og-image.jpg", 
        width: 1200,
        height: 630,
        alt: "Luka Jokić Video Editing Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Luka Jokić | Video Crafter",
    description: "Turning visions into visual reality. Professional video editing and post-production.",
    images: ["/og-image.jpg"],
    creator: "@tvoj_handle",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`custom-scroll ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
