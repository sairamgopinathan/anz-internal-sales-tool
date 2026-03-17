import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "DealPilot – Find what helps you win",
  description: "Internal sales workspace with admin access and mock data.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
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
