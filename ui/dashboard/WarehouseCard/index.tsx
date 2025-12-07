import { FC, useState } from "react";
import { WarehouseAndPosition } from "../../../types";
import { CubeIcon, ArchiveBoxIcon } from "@heroicons/react/24/outline";
import { BuildingStorefrontIcon } from "@heroicons/react/16/solid";
import { ContactLinks } from "./ContactLinks";
import { cleanWarehouseName } from "../../../lib/api/utils/zohoDataUtils";

import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

export const WarehouseCard: FC<WarehouseAndPosition> = ({
  location_name,
  location_id,
  email,
  phone,
  parent_location_id,
  mapUrl,
}) => {
  const [focused, setFocused] = useState(false);
  const toggleFocus = () => setFocused(!focused);
  return (
    <div
      className="card card-side border border-gray-300 dark:border-gray-700 bg-base-100 shadow-sm hover:shadow-lg duration-500 ease-in-out transition-transform hover:scale-101"
      onMouseEnter={toggleFocus}
      onMouseLeave={toggleFocus}
    >
      <div className="w-full p-3 flex flex-col justify-between gap-2">
        <div className="flex gap-2 justify-start items-center">
          <BuildingStorefrontIcon width={20} className="flex-shrink-0" />
          <Link
            href={`/dashboard/warehouse/${location_id}/details?location_id=${parent_location_id}`}
            className="cursor-pointer"
          >
            <h2 className="font-bold opacity-90 uppercase bg-base-200 hover:bg-base-300 px-3 py-1.5 rounded-lg transition-colors inline-block">
              {cleanWarehouseName(location_name)}
            </h2>
          </Link>
        </div>
        <ul className="list gap-2 mt-2">
          <ContactLinks email={email} phone={phone} />
        </ul>
        <div className="join join-horizontal w-full">
          <Link
            href={`/dashboard/warehouse/${location_id}/inventory?location_id=${parent_location_id}`}
            className="btn btn-sm join-item flex-1 border border-gray-300 dark:border-gray-700 bg-base-100 hover:border-2 hover:border-gray-400 dark:hover:border-gray-600 transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <CubeIcon className="h-4 w-4" />
            Inventory
          </Link>
          <Link
            href={`/dashboard/warehouse/${location_id}/packages?location_id=${parent_location_id}`}
            className="btn btn-sm join-item flex-1 border border-gray-300 dark:border-gray-700 bg-base-100 hover:border-2 hover:border-gray-400 dark:hover:border-gray-600 transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <ArchiveBoxIcon className="h-4 w-4" />
            Packages
          </Link>
        </div>
      </div>
      <figure className="relative">
        <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-base-100 to-transparent z-10"></div>
        <Image
          className={clsx(
            "w-50 shadow-md dark:invert dark:brightness-90",
            focused && "scale-110 transition-transform duration-500 ease-in-out"
          )}
          src={mapUrl || "/map.png"}
          alt="Warehouse location"
          width={200}
          height={200}
        />
      </figure>
    </div>
  );
};
