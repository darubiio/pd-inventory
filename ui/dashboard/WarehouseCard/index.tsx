import { FC, useState } from "react";
import { WarehouseAndPosition } from "../../../types";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { BuildingStorefrontIcon } from "@heroicons/react/16/solid";
import { ContactLinks } from "./ContactLinks";

import Link from "next/link";
import Image from "next/image";

export const WarehouseCard: FC<WarehouseAndPosition> = ({
  location_name,
  location_id,
  // attention,
  // address,
  email,
  phone,
  parent_location_id,
  mapUrl,
}) => {
  const [focused, setFocused] = useState(false);
  const toggleFocus = () => setFocused(!focused);
  return (
    <Link
      className="card card-side border border-gray-300 dark:border-gray-700 bg-base-100 shadow-sm hover:shadow-lg duration-500 ease-in-out cursor-pointer transition-transform hover:scale-101"
      href={`/dashboard/warehouse/${location_id}?location_id=${parent_location_id}`}
      onMouseEnter={toggleFocus}
      onMouseLeave={toggleFocus}
    >
      <div className="w-full p-3 flex flex-col justify-start gap-2">
        <div className="flex gap-2 justify-start items-center">
          <BuildingStorefrontIcon width={20} />
          <div className="flex justify-start gap-1 flex-wrap">
            <div className="badge badge-ghost">
              <h2 className="font-bold opacity-90 uppercase">
                {location_name}
              </h2>
            </div>
            {/* {attention && (
              <div className="badge badge-ghost mb-2">
                <p className="text-xs uppercase font-semibold opacity-60">
                  {attention}
                </p>
              </div>
            )} */}
          </div>
        </div>
        <ul className="list gap-2">
          {/* {address && (
            <li className="font-semibold opacity-70 flex gap-x-2">
              <MapPinIcon height={18} /> {address}
            </li>
          )} */}
          <ContactLinks email={email} phone={phone} />
        </ul>
      </div>
      <figure className="relative">
        <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-base-100 to-transparent z-10"></div>
        <Image
          className={`w-50 shadow-md dark:invert dark:brightness-90 ${
            focused
              ? "scale-110 transition-transform duration-500 ease-in-out"
              : ""
          }`}
          src={mapUrl || "/map.png"}
          alt="Warehouse location"
          width={200}
          height={200}
        />
      </figure>
    </Link>
  );
};
