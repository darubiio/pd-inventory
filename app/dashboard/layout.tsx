import TopBar from "../../ui/dashboard/TopBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      {children}
    </div>
  );
}
