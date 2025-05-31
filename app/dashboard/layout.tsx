import TopBar from "../../ui/dashboard/TopBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full bg-base-200">
      <TopBar />
      {children}
    </div>
  );
}
