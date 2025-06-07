import { FC } from "react";
import { Warehouse } from "../../../types";
import Image from "next/image";
import {
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { getWarehouseGeolocation } from "../../../lib/zohoData";
import { BuildingStorefrontIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { ContactLinks } from "./ContactLinks";

const WarehouseCard: FC<Warehouse> = async ({
  warehouse_id,
  warehouse_name,
  attention,
  email,
  phone,
  address,
  city,
  state,
  country,
}) => {
  const fullAddress = [address, city, state, country];
  const { mapUrl } = await getWarehouseGeolocation(warehouse_id, fullAddress);
  return (
    <Link
      className="card card-side bg-base-100 shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer"
      href={`/dashboard/warehouse/${warehouse_id}`}
    >
      <div className="w-75 p-3 flex flex-col justify-start gap-2">
        <div className="flex gap-2 justify-start items-center">
          <BuildingStorefrontIcon width={20} />
          <div className="flex justify-start gap-1 flex-wrap">
            <div className="badge badge-ghost">
              <h2 className="font-bold opacity-90 uppercase">
                {warehouse_name}
              </h2>
            </div>
            {attention && (
              <div className="badge badge-ghost mb-2">
                <p className="text-xs uppercase font-semibold opacity-60">
                  {attention}
                </p>
              </div>
            )}
          </div>
        </div>
        <ul className="list gap-2">
          {address && (
            <li className="font-semibold opacity-70 flex gap-x-2">
              <MapPinIcon height={18} /> {address}
            </li>
          )}
          <ContactLinks email={email} phone={phone} />
        </ul>
      </div>
      <figure>
        <Image
          className="w-45 shadow-md [mask-image:linear-gradient(to_right,transparent_0%,black_20%)] [--webkit-mask-image:linear-gradient(to_right,transparent_0%,black_20%)] transition-transform duration-500 ease-in-out hover:scale-110 dark:invert dark:brightness-90"
          src={mapUrl || "/map.png"}
          alt="Warehouse location"
          width={200}
          height={200}
        />
      </figure>
    </Link>
  );
};

export default WarehouseCard;
