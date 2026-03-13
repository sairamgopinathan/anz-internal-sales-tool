import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ANZ Internal Sales",
  description: "Internal sales workspace with admin access and mock data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <Script id="theme-init" strategy="beforeInteractive">
          {`try {
  var savedTheme = localStorage.getItem('anzapp-theme');
  document.documentElement.dataset.theme = savedTheme === 'light' ? 'light' : 'dark';
} catch (error) {
  document.documentElement.dataset.theme = 'dark';
}`}
        </Script>
        {children}
      </body>
    </html>
  );
}
