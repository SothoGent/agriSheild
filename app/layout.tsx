import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgriShield // C2 Dashboard",
  description:
    "Environmental intelligence console for agricultural parametric insurance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="min-h-full">
        {children}
      </body>
    </html>
  );
}
