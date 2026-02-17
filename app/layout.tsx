import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import Footer from "@/components/common/footer/Footer";
import NetworkProvider from "@/components/providers/NetworkProvider";
import AuthBootstrap from "@/components/providers/AuthBootstrap";
import NavbarWrapper from "@/components/common/navbar/NavbarWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:
    "టీ టైం తెలుగు - AP మరియు TS రాజకీయాలు, సినిమాలు మరియు గాసిప్‌లపై తెలుగు వార్తలు",
  description:
    "తెలుగు మాట్లాడే ప్రేక్షకుల కోసం తాజా వార్తలు, సినిమా అప్‌డేట్స్, గాసిప్స్ మరియు వినోదం. బ్రేకింగ్ న్యూస్, సినిమా సమీక్షలు, OTT రిలీజ్ అప్‌డేట్స్, రాజకీయ విశ్లేషణలు మరియు స్టార్‌ల ఇంటర్వ్యూలతో ప్రత్యేకంగా అందించే ప్లాట్‌ఫార్మ్.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const user = await getServerUser(); // runs on server
  return (
    <html lang="te">
      <body className={`${geistSans.variable} antialiased`}>
        <Toaster position="top-center" richColors />
        <AuthBootstrap>
          {/* <HydrateUser user={user}> */}
          <div className="page-container">
            <NavbarWrapper />
            <NetworkProvider>{children}</NetworkProvider>
            <Footer />
          </div>
        </AuthBootstrap>
        {/* </HydrateUser> */}
      </body>
    </html>
  );
}
