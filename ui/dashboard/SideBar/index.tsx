import SideContent from "./SideContent";
import SideTitle from "./SideTitle";

export default function SideBar({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="card w-1/5 h-full min-w-42 flex-col hidden md:flex bg-base-200 shadow-md">
        <SideTitle>PERDOMO DISTRIBUITOR</SideTitle>
        <SideContent />
        <div className="justify-end card-actions p-3">
          <a role="button" href="/auth/logout" className="btn w-full p-3">
            LogOut
          </a>
        </div>
      </div>
      <div className="h-full w-full overflow-y-auto overflow-x-hidden">
        {children}
      </div>
    </>
  );
}
