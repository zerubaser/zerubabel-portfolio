import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://zerubabel.et"),
  title: {
    default: "Zerubabel Shimeles — Full-Stack Developer",
    template: "%s — Zerubabel Shimeles",
  },
  description:
    "Portfolio of Zerubabel Shimeles, full-stack developer in Addis Ababa, Ethiopia — building ERP/SaaS, healthcare, LMS, and mobile systems.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
