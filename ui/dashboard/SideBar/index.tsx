import SideContent from "./SideContent";
import SideTitle from "./SideTitle";

export default function SideBar() {
  return (
    <div className="h-full flex-col p-3 hidden md:flex">
      <div className="card h-full w-70 bg-base-200 shadow-md">
        <div className="card-body">
          <SideTitle>PERDOMO DISTRIBUITOR</SideTitle>
          <SideContent />
          <div className="justify-end card-actions">
            <a role="button" href="/auth/logout" className="btn w-full">
              LogOut
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
