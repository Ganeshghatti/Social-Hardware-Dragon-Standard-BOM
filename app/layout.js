import { Inter } from "next/font/google";
import "./globals.css";
import { initializeDatabase } from "@/lib/init-db";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Robotic Arm Manufacturing Dashboard",
  description: "7DOF Robotic Arm Manufacturing Management System",
};

// Initialize database on server startup
let isInitialized = false;

async function initDB() {
  if (!isInitialized && process.env.MONGODB_URI) {
    try {
      await initializeDatabase();
      isInitialized = true;
      console.log("✅ Database initialized on server startup");
    } catch (error) {
      console.error(
        "❌ Failed to initialize database on startup:",
        error.message
      );
    }
  }
}

export default async function RootLayout({ children }) {
  // Run initialization on server side
  await initDB();

  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
