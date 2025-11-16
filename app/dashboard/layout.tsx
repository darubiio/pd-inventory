"use client";

import TopBar from "../../ui/dashboard/TopBar";
import { useTokenRefresh } from "../../lib/hooks/useTokenRefresh";

export default function Layout({ children }: { children: React.ReactNode }) {
  useTokenRefresh();

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      {children}
    </div>
  );
}
