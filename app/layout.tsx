import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rizky Saputra — Personal Portfolio",
  description: "Portfolio pribadi Rizky Saputra — perjalanan, skill, pengalaman, karya, dan kontak.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
