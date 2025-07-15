import { Auth0Provider } from "@auth0/nextjs-auth0";
import "./globals.css";
import { geistMono, geistSans } from "../ui/fonts";
import { Analytics } from "@vercel/analytics/next";

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
        <Auth0Provider>{children}</Auth0Provider>
      </body>
    </html>
  );
}
