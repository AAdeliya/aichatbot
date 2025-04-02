// src/app/layout.tsx
// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { ClerkProvider } from "@clerk/nextjs"; // 👈 Add this

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MailGenie",
  description: "Email marketing and conversation platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      {" "}
      {/* 👈 Wrap everything inside */}
      <html lang="en">
        <body className={inter.className}>
          <ClientLayout>{children}</ClientLayout>
        </body>
      </html>
    </ClerkProvider>
  );
}
