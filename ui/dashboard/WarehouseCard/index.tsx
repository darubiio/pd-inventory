import { FC } from "react";
import { Warehouse } from "../../../types";
import Image from "next/image";

const WarehouseCard: FC<Warehouse> = ({
  warehouse_name,
  attention,
  address,
  phone,
}) => {
  return (
    <div className="card card-side bg-base-200 shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out">
      <div className="card-body w-70">
        <h2 className="card-title font-bold opacity-85 uppercase">{warehouse_name}</h2>
        <ul className="list gap-1">
          <li className="text-xs uppercase font-semibold opacity-60">
            {attention}
          </li>
          <li className="font-semibold opacity-70">{address}</li>
          <li className="font-semibold opacity-70">
            <a className="link link-neutral" href={`tel:${phone}`}>
              {phone}
            </a>
          </li>
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
