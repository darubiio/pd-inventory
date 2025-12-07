import { WarehouseDetail } from "../../../../../ui/dashboard/WarehouseDetail/WarehouseDetail";
import { getWarehouseById } from "../../../../../lib/api/clients/zoho/zohoData";
import { cleanWarehouseName } from "../../../../../lib/api/utils/zohoDataUtils";
import { ClientPackagesTable } from "../../../../../ui/dashboard/Packages/components/PackagesTable/ClientPackagesTable";

export default async function WarehouseItems({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ location_id: string }>;
}) {
  const { id } = await params;
  const { location_id } = await searchParams;
  const warehouse = await getWarehouseById(id);

  return (
    <div className="flex-1 overflow-auto tabs tabs-lift pt-1 relative">
      <div className="badge hidden md:inline-flex md:absolute font-bold right-13 top-2">
        {cleanWarehouseName(warehouse?.location_name)}
      </div>
      <label className="tab [--tab-border-color:#d1d5db] dark:[--tab-border-color:#374151]">
        <input type="radio" name="my_tabs_4" defaultChecked />
        <span className="font-semibold">📋 Inventory</span>
      </label>
      <div className="tab-content bg-base-100 [border-color:#d1d5db] dark:[border-color:#374151] pt-2 rounded-none">
        <div className="grid md:grid-cols-[250px_1fr] h-full">
          <WarehouseDetail warehouseId={id} warehouse={warehouse} />
        </div>
      </div>
      <label className="tab [--tab-border-color:#d1d5db] dark:[--tab-border-color:#374151]">
        <input type="radio" name="my_tabs_4" />
        <span className="font-semibold ">📦 Packages</span>
      </label>
      <div className="tab-content bg-base-100 [border-color:#d1d5db] dark:[border-color:#374151] rounded-none shadow-2xl h-full md:h-[calc(100vh-6.9rem)]">
        <ClientPackagesTable locationId={location_id} warehouse={warehouse} />
      </div>
    </div>
  );
}
