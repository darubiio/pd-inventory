import React, { Fragment } from "react";

interface ShipmentInfoProps {
  data?: {
    shipment_order?: {
      carrier?: string;
      tracking_number?: string;
      shipping_date?: string;
    };
    shipping_address?: {
      address?: string;
      city?: string;
      state?: string;
      zip?: string;
      country?: string;
    };
  };
}

export const ShipmentInfo = ({ data }: ShipmentInfoProps) => {
  return (
    <Fragment>
      {data?.shipment_order && (
        <div className="divider">Shipment Information</div>
      )}

      {data?.shipment_order && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {data.shipment_order.carrier && (
            <div>
              <p className="text-sm opacity-70">Carrier</p>
              <p>{data.shipment_order.carrier}</p>
            </div>
          )}
          {data.shipment_order.tracking_number && (
            <div>
              <p className="text-sm opacity-70">Tracking Number</p>
              <p className="font-mono">{data.shipment_order.tracking_number}</p>
            </div>
          )}
          {data.shipment_order.shipping_date && (
            <div>
              <p className="text-sm opacity-70">Shipping Date</p>
              <p>{data.shipment_order.shipping_date}</p>
            </div>
          )}
          {data.shipping_address && (
            <div>
              <p className="text-sm opacity-70">Shipping Address</p>
              <div className="text-sm">
                <p>{data.shipping_address.address}</p>
                <p>
                  {data.shipping_address.city}, {data.shipping_address.state}{" "}
                  {data.shipping_address.zip}
                </p>
                <p>{data.shipping_address.country}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </Fragment>
  );
};
