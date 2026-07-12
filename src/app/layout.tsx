import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";
import { Providers } from "@/providers/Providers";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import UniversalRightSidebar from "@/components/layout/UniversalRightSidebar";
import CommandCenter from "@/components/layout/CommandCenter";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "sonner";
import { GlobalWebSocketListener } from "@/components/GlobalWebSocketListener";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "DataPact | Enterprise Data OS",
  description: "Enterprise Data Observability & Reliability Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased h-screen flex bg-background text-foreground overflow-hidden`}>
        <Providers>
          <ThemeProvider>
            <QueryProvider>
              <ErrorBoundary fallback={<div className="flex items-center justify-center h-screen">Something went wrong in the application.</div>}>
                {/* Command Center (Ctrl+K) */}
                <CommandCenter />

                {/* Sidebar Navigation */}
                <Sidebar />
                
                {/* Main Content Container */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                  <TopNav />
                  <main className="flex-1 overflow-y-auto p-6 md:p-12 relative z-0">
                    {children}
                  </main>
                </div>

                {/* Universal Right Sidebar (Copilot, Tasks, Notifications) */}
                <UniversalRightSidebar />
                <Toaster position="bottom-right" richColors />
                <GlobalWebSocketListener />
              </ErrorBoundary>
            </QueryProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
