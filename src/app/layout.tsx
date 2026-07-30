import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Project.NURD Custom Lab — Build Your Box",
  description: "Design custom artwork for your own trading-card storage and display boxes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body">{children}</body>
    </html>
  );
}
