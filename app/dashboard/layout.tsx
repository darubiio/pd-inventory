"use client";

import TopBar from "../../ui/dashboard/TopBar";
import { useTokenRefresh } from "../../lib/hooks/useTokenRefresh";

export default function Layout({ children }: { children: React.ReactNode }) {
  useTokenRefresh();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopBar />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
