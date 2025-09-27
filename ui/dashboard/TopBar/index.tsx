"use client";

import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightEndOnRectangleIcon,
  InboxStackIcon,
  TableCellsIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { useUser } from "../../../lib/hooks/useUser";

const navItems = [
  {
    name: "Warehouses",
    href: "/dashboard",
    Icon: InboxStackIcon,
  },
  {
    name: "Inventory",
    href: "/dashboard/items",
    Icon: TableCellsIcon,
  },
];

const TopBar: FC = () => {
  const pathname = usePathname();
  const { user, loading, error } = useUser();

  return (
    <div className="navbar sticky top-0 z-10 bg-base-100 shadow-sm">
      <div className="navbar-start">
        <a className="btn btn-ghost text-xl hidden md:flex p-0 pl-2 min-h-0 h-auto">
          <span className="flex flex-col items-end leading-tight font-bold">
            Perdomo Distribuitor
            <span className="font-bold text-[10px] text-right text-base-content/60">
              inventory
            </span>
          </span>
        </a>
        <div className="dropdown md:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-md dropdown-content bg-base-100 rounded-box z-1 mt-5 w-62 p-2 shadow font-semibold"
          >
            {navItems.map(({ name, href, Icon }) => (
              <li key={name}>
                <Link
                  href={href}
                  className={pathname === href ? "menu-active" : ""}
                  onClick={() => {
                    const dropdown = document.activeElement as HTMLElement;
                    if (dropdown && dropdown.blur) dropdown.blur();
                  }}
                >
                  <Icon width={18} />
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <a className="btn btn-ghost text-xl flex md:hidden p-0 min-h-0 h-auto">
          <span className="flex flex-col items-end leading-tight font-bold">
            Perdomo Distribuitor
            <span className="text-[10px] text-right text-base-content/60 mt-1 font-bold">
              inventory
            </span>
          </span>
        </a>
        <ul className="menu hidden md:flex menu-horizontal font-semibold gap-2 bg-base-200 rounded-box">
          {navItems.map(({ name, href, Icon }) => (
            <li key={name}>
              <Link
                href={href}
                className={pathname === href ? "shadow bg-base-100" : ""}
              >
                <Icon width={18} />
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="navbar-end">
        {user && !loading && (
          <div className="hidden lg:flex flex-col items-end mr-3">
            <span className="font-semibold text-sm text-base-content">
              {user.name}
            </span>
            <span className="text-xs text-base-content/60">{user.email}</span>
          </div>
        )}
        {loading && (
          <div className="hidden lg:flex flex-col items-end mr-3 gap-1">
            <div className="skeleton h-4 w-24"></div>
            <div className="skeleton h-3 w-32"></div>
          </div>
        )}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              {user?.photo_url ? (
                <Image
                  alt={user.name || "User avatar"}
                  className="rounded-full"
                  src={user.photo_url}
                  width={40}
                  height={40}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center">
                  <UserCircleIcon className="w-6 h-6 text-base-content/60" />
                </div>
              )}
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-64 p-2 shadow"
          >
            {user && !loading && (
              <>
                <li className="menu-title px-3 py-2 lg:hidden">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-base-content">
                      {user.name}
                    </span>
                    <span className="text-xs text-base-content/60">
                      {user.email}
                    </span>
                    <span className="text-xs text-base-content/50 capitalize">
                      {user.user_role}
                    </span>
                  </div>
                </li>
                <div className="divider my-1 lg:hidden"></div>
              </>
            )}
            {loading && (
              <li className="menu-title px-3 py-2 lg:hidden">
                <div className="flex flex-col gap-1">
                  <div className="skeleton h-4 w-24"></div>
                  <div className="skeleton h-3 w-32"></div>
                </div>
              </li>
            )}
            {error && (
              <li className="menu-title px-3 py-2 lg:hidden">
                <span className="text-xs text-error">
                  Error loading user info
                </span>
              </li>
            )}
            <li>
              <a href="/auth/logout" className="justify-between font-bold">
                Logout
                <ArrowRightEndOnRectangleIcon width={18} />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
