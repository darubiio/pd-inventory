import SideBar from "../../ui/dashboard/SideBar";
import TopBar from "../../ui/dashboard/TopBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden md:p-2">
      <SideBar>
        <TopBar>{children}</TopBar>
      </SideBar>
    </div>
  );
}
