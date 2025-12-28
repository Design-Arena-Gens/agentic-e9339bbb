import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Email Finder Agent",
  description: "Generate high-confidence email guesses with an agentic workflow",
  metadataBase: new URL("https://agentic-e9339bbb.vercel.app")
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
