"use client";

import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChartBarIcon, TableCellsIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    Icon: ChartBarIcon,
  },
  {
    name: "Items",
    href: "/dashboard/items",
    Icon: TableCellsIcon,
  },
];

const TopBar: FC = () => {
  const pathname = usePathname();
  return (
    <div className="navbar sticky top-0 z-10 bg-base-100 shadow-sm">
      <div className="navbar-start">
        <a className="btn btn-ghost text-xl hidden md:flex">
          Perdomo Distribuitor
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
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />{" "}
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
        <a className="btn btn-ghost text-xl flex md:hidden">
          Perdomo Distribuitor
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
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <Image
                alt="pd-logo"
                src="/pd-logo.jpeg"
                width={560}
                height={620}
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
