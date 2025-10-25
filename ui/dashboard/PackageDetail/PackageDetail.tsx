"use client";

import useSWR from "swr";

interface PackageLineItem {
  line_item_id: string;
  so_line_item_id: string;
  item_id: string;
  name: string;
  description: string;
  sku: string;
  quantity: number;
  unit: string;
  is_invoiced: boolean;
}

interface PackageDetail {
  package_id: string;
  package_number: string;
  salesorder_id: string;
  salesorder_number: string;
  date: string;
  customer_id: string;
  customer_name: string;
  status: string;
  total_quantity: string;
  line_items: PackageLineItem[];
  shipment_order?: {
    carrier?: string;
    tracking_number?: string;
    shipping_date?: string;
    status?: string;
  };
  shipping_address?: {
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  notes?: string;
}

interface PackageDetailProps {
  packageId: string;
  onClose: () => void;
}

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch package details");
  }
  const { data } = await response.json();
  return data as PackageDetail;
};

export function PackageDetail({ packageId, onClose }: PackageDetailProps) {
  const { data, error, isLoading } = useSWR<PackageDetail>(
    packageId ? `/api/zoho/packages/${packageId}` : null,
    fetcher
  );

  const getStatusBadgeClass = (status: string) => {
    const normalizedStatus = status?.toLowerCase() || "";
    if (normalizedStatus === "not_shipped") return "badge-warning";
    if (normalizedStatus === "shipped") return "badge-primary";
    if (normalizedStatus === "delivered") return "badge-success";
    return "";
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box p-0 border-1 border-gray-300 dark:border-gray-700 max-w-4xl w-full h-[100dvh] max-h-[100dvh] m-0 rounded-none flex flex-col md:w-auto md:h-auto md:max-h-[90vh] md:m-4 md:rounded-lg">
        <div className="flex items-center justify-between px-6 py-4 bg-base-100 border-b border-base-300 shrink-0">
          <h3 className="font-bold text-lg">Package Details</h3>
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading && (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error.message}</span>
            </div>
          )}

          {!isLoading && !error && data && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm opacity-70">Package Number</p>
                  <p className="font-semibold">{data.package_number}</p>
                </div>
                <div>
                  <p className="text-sm opacity-70">Sales Order</p>
                  <p className="font-semibold">{data.salesorder_number}</p>
                </div>
                <div>
                  <p className="text-sm opacity-70">Status</p>
                  <span className={`badge ${getStatusBadgeClass(data.status)}`}>
                    {data.status.replace("_", " ").toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm opacity-70">Customer</p>
                  <p className="font-semibold">{data.customer_name}</p>
                </div>

                <div>
                  <p className="text-sm opacity-70">Date</p>
                  <p>{data.date}</p>
                </div>
                <div>
                  <p className="text-sm opacity-70">Total Quantity</p>
                  <p>{data.total_quantity}</p>
                </div>
              </div>

              {data.shipment_order && (
                <div className="divider">Shipment Information</div>
              )}

              {data.shipment_order && (
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
                      <p className="font-mono">
                        {data.shipment_order.tracking_number}
                      </p>
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
                          {data.shipping_address.city},{" "}
                          {data.shipping_address.state}{" "}
                          {data.shipping_address.zip}
                        </p>
                        <p>{data.shipping_address.country}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="divider">Line Items</div>

              {/* Mobile: cards */}
              <div className="md:hidden space-y-3">
                {data.line_items.map((item) => (
                  <div key={item.line_item_id} className="card bg-base-200">
                    <div className="card-body p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="card-title text-base">{item.name}</h4>
                          {item.sku && (
                            <p className="text-xs opacity-70">{item.sku}</p>
                          )}
                        </div>
                        <div>
                          {item.is_invoiced ? (
                            <span className="badge badge-success badge-sm">
                              Invoiced
                            </span>
                          ) : (
                            <span className="badge badge-ghost badge-sm">
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="opacity-70">Quantity</p>
                          <p className="font-semibold">{item.quantity}</p>
                        </div>
                        <div>
                          <p className="opacity-70">Unit</p>
                          <p>{item.unit}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop: table */}
              <div className="overflow-x-auto hidden md:block">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>SKU</th>
                      <th className="text-right">Quantity</th>
                      <th>Unit</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.line_items.map((item) => (
                      <tr key={item.line_item_id}>
                        <td className="font-semibold">{item.name}</td>
                        <td className="text-xs opacity-70">{item.sku}</td>
                        <td className="text-right font-semibold">
                          {item.quantity}
                        </td>
                        <td className="text-xs">{item.unit}</td>
                        <td>
                          {item.is_invoiced ? (
                            <span className="badge badge-success badge-sm">
                              Invoiced
                            </span>
                          ) : (
                            <span className="badge badge-ghost badge-sm">
                              Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {data.notes && (
                <>
                  <div className="divider">Notes</div>
                  <div className="text-sm bg-base-200 p-3 rounded">
                    {data.notes}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-base-100 border-t border-base-300 shrink-0">
          <button onClick={onClose} className="btn w-full md:w-auto">
            Close
          </button>
        </div>
      </div>
      <div className="modal-backdrop hidden md:block" onClick={onClose}></div>
    </div>
  );
}
