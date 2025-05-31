import { FC } from "react";
import { Warehouse } from "../../../types";
import Image from "next/image";
import {
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

const WarehouseCard: FC<Warehouse> = ({
  warehouse_name,
  attention,
  address,
  phone,
  email,
}) => {
  return (
    <div className="card card-side bg-base-100 shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer">
      <div className="w-75 p-3 flex flex-col justify-start gap-2">
        <div className="badge badge-ghost">
          <h2 className="font-bold opacity-90 uppercase">{warehouse_name}</h2>
        </div>
        {attention && (
          <div className="badge badge-ghost mb-2">
            <p className="text-xs uppercase font-semibold opacity-60">
              {attention}
            </p>
          </div>
        )}
        <ul className="list gap-2">
          {address && (
            <li className="font-semibold opacity-70 flex gap-x-2">
              <MapPinIcon height={18} /> {address}
            </li>
          )}
          {email && (
            <li className="font-semibold opacity-70 flex gap-x-2">
              <a
                className="link link-neutral flex gap-x-2"
                href={`mailto:${email}`}
              >
                <EnvelopeIcon height={18} /> {email}
              </a>
            </li>
          )}
          {phone && (
            <li className="font-semibold opacity-70 flex gap-x-2">
              <a
                className="link link-neutral flex gap-x-2"
                href={`tel:${phone}`}
              >
                <PhoneIcon height={18} /> {phone}
              </a>
            </li>
          )}
        </ul>
      </div>
      <figure>
        <Image
          className="rounded-lg w-45"
          src="/map.png"
          alt="Warehouse location"
          width={100}
          height={100}
        />
      </figure>
    </div>
  );
};

export default WarehouseCard;
