import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Art of Mind — Creative Entertainment Universe",
  description: "The next-generation creative platform for novels, short vertical dramas, comics, interactive stories, and audio books. Build your story universe.",
  keywords: ["stories", "vertical series", "comics", "novels", "audio books", "creator platform"],
  openGraph: {
    title: "Art of Mind — Creative Entertainment Universe",
    description: "Publish novels, stream short vertical dramas, launch interactive games, podcasts, and comics — all in one interconnected franchise hub.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#020617] text-slate-100">{children}</body>
    </html>
  );
}
