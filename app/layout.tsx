import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Toaster } from "sonner";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Campus Placement Tracker",
    template: "%s | Campus Placement Tracker",
  },
  description:
    "Track your campus placement journey — companies, deadlines, applications, and offers in one place.",
  keywords: ["campus placement", "job tracker", "college placements", "OA tracker"],
  authors: [{ name: "Campus Placement Tracker" }],
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0f1e" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('placetrack-theme');
                var d = t === 'dark' ? 'dark'
                  : t === 'light' ? 'light'
                  : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                document.documentElement.classList.add(d);
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider>
          <AuthProvider>
            <QueryProvider>
              {children}
              <Toaster
                position="bottom-right"
                toastOptions={{
                  classNames: {
                    toast: "bg-card border border-border text-foreground shadow-card",
                    title: "text-foreground font-medium text-sm",
                    description: "text-muted-foreground text-xs",
                    success: "border-l-4 border-l-success",
                    error: "border-l-4 border-l-destructive",
                    warning: "border-l-4 border-l-warning",
                  },
                }}
              />
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}