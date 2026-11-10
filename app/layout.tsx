import type { Metadata } from "next";
import "./globals.css";

import ReduxProvider from "@/store/provider";
import { AuthProvider } from "@/auth/auth-provider";


export const metadata: Metadata = {
  title: {
    default: "Sowilo | Creative Content & Production Agency in London",
    template: "%s | Sowilo",
  },

  description:
    "Sowilo is a London-based creative content and production agency specialising in photography, video production, brand storytelling, and advertising campaigns.",

  keywords: [
    "Sowilo",
    "Sowilo Agency",
    "Creative Agency London",
    "Content Creation Agency London",
    "Creative Production London",
    "Photography Agency London",
    "Video Production London",
    "Commercial Photography",
    "Advertising Production",
    "Brand Photography",
    "Fashion Photography London",
    "Fashion Film Production",
    "Social Media Content Creation",
    "Creative Campaigns",
    "Brand Storytelling",
    "Digital Content Production",
  ],

  authors: [
    {
      name: "Sowilo Creative Agency",
    },
  ],

  creator: "Sowilo",
  publisher: "Sowilo",

  metadataBase: new URL("https://YOUR-DOMAIN.com"),

  alternates: {
    canonical: "/",
  },

  icons: {
    icon: [
      {
        url: "/favicon.ico",
      },
      {
        url: "/icons/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/icons/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],

    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],

    other: [
      {
        rel: "icon",
        url: "/icons/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/icons/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },

  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "/",
    siteName: "Sowilo",
    title: "Sowilo | Creative Content & Production Agency",
    description:
      "Creative direction, photography, video production and visual storytelling. Sowilo is a London-based agency creating distinctive content and campaigns for brands.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sowilo Creative Content & Production Agency",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Sowilo | Creative Content & Production Agency",
    description:
      "Photography, film, creative production and advertising for ambitious brands. Based in London.",
    images: ["/images/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  category: "creative services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <AuthProvider>{children}</AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}