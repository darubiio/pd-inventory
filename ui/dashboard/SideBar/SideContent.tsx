"use client";

import { FC } from "react";
import { orbitron } from "../../fonts";
import { usePathname } from "next/navigation";
import {
  ChartBarIcon,
  CircleStackIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

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
  {
    name: "Warehouses",
    href: "/dashboard/warehouses",
    Icon: CircleStackIcon,
  },
];

const SideContent: FC = () => {
  const pathname = usePathname();
  return (
    <ul className="menu bg-base-200 w-50 h-full">
      <li>
        <h2 className={`menu-title ${orbitron.className}`}>Inventory</h2>
        <ul>
          {navItems.map(({ name, href, Icon }) => (
            <li key={name} className="text-sm font-semibold">
              <Link href={href} className={pathname === href ? "menu-active" : ""}>
                <Icon />
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </li>
    </ul>
  );
};

export default SideContent;
