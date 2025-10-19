import "./globals.css";
import { geistMono, geistSans } from "../ui/fonts";
import { Analytics } from "@vercel/analytics/next";
import { UserProvider } from "../lib/auth/UserProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Analytics />
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
