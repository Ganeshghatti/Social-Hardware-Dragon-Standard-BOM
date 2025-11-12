import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Robotic Arm Manufacturing Dashboard",
  description: "7DOF Robotic Arm Manufacturing Management System",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Robotic Arm Manufacturing Dashboard",
    description: "7DOF Robotic Arm Manufacturing Management System",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Social Hardware Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Robotic Arm Manufacturing Dashboard",
    description: "7DOF Robotic Arm Manufacturing Management System",
    images: ["/logo.png"],
  },
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
