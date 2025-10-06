import "./globals.css";
import { geistMono, geistSans } from "../ui/fonts";
import { Analytics } from "@vercel/analytics/next";
import { UserProvider } from "../lib/auth/UserProvider";
import { PermissionsProvider } from "../lib/auth/PermissionsProvider";

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
        <UserProvider>
          <PermissionsProvider>{children}</PermissionsProvider>
        </UserProvider>
      </body>
    </html>
  );
}
