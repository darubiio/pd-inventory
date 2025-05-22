import { FC } from "react";
import SideTitle from "../SideBar/SideTitle";
import SideContent from "../SideBar/SideContent";

interface TopBarProps {
  children: React.ReactNode;
}

const TopBar: FC<TopBarProps> = ({ children }) => {
  return (
    <div className="drawer md:hidden p-3">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="navbar bg-base-200 w-full rounded-box">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-3"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <SideTitle>PERDOMO DISTRIBUITOR</SideTitle>
          <div className="hidden flex-none lg:block">
            <ul className="menu menu-horizontal">
              {/* Navbar menu content here */}
              <li>
                <a>Navbar Item 1</a>
              </li>
              <li>
                <a>Navbar Item 2</a>
              </li>
            </ul>
          </div>
        </div>
        {children}
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        />
        <ul className="menu bg-base-200 min-h-full w-85 p-4">
          <SideTitle>PERDOMO DISTRIBUITOR</SideTitle>
          <SideContent />
          <div className="justify-end card-actions">
            <a role="button" href="/auth/logout" className="btn w-full">
              LogOut
            </a>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default TopBar;
