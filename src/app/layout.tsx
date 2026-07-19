import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Space_Grotesk } from "next/font/google";
import { cn } from "@/lib/utils";

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    default: "People's Voices — Anonymous Civic Participation Platform",
    template: "%s | People's Voices",
  },
  description:
    "An anonymous, open-source platform where people voluntarily share why they support or participate in the CJP protest. Privacy-first. No personal data collected.",
  keywords: [
    "CJP protest",
    "anonymous participation",
    "civic platform",
    "open source",
    "India",
    "people's voice",
    "protest tracker",
  ],
  authors: [{ name: "People's Voices Contributors" }],
  openGraph: {
    title: "People's Voices",
    description:
      "An anonymous, open-source civic participation platform for the CJP protest.",
    type: "website",
    locale: "en_IN",
    siteName: "People's Voices",
  },
  twitter: {
    card: "summary_large_image",
    title: "People's Voices",
    description:
      "An anonymous, open-source civic participation platform for the CJP protest.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", spaceGrotesk.variable)}>
      <body className="min-h-screen bg-background text-foreground antialiased custom-scrollbar">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 pt-24">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
