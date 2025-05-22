import SideBar from "../../ui/dashboard/SideBar";
import TopBar from "../../ui/dashboard/TopBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideBar />
      </div>
      <TopBar>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
          {children}
        </div>
      </TopBar>
    </div>
  );
}
