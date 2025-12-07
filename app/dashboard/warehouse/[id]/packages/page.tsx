import { getWarehouseById } from "../../../../../lib/api/clients/zoho/zohoData";
import { ClientPackagesTable } from "../../../../../ui/dashboard/Packages/components/PackagesTable/ClientPackagesTable";

type WarehousePackagesProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ location_id: string }>;
};

const WarehousePackages = async ({
  params,
  searchParams,
}: WarehousePackagesProps) => {
  const { location_id } = await searchParams;
  const { id } = await params;
  const warehouse = await getWarehouseById(id);
  return <ClientPackagesTable locationId={location_id} warehouse={warehouse} />;
};

export default WarehousePackages;
