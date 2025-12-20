import { getWarehouseById } from "../../../../../lib/api/clients/zoho/zohoData";
import { ClientReceivingTable } from "../../../../../ui/dashboard/Receiving/components/ReceivingTable/ClientReceivingTable";

type WarehouseReceivingProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ location_id: string }>;
};

const WarehouseReceiving = async ({
  params,
  searchParams,
}: WarehouseReceivingProps) => {
  const { location_id } = await searchParams;
  const { id } = await params;
  const warehouse = await getWarehouseById(id);
  return (
    <ClientReceivingTable locationId={location_id} warehouse={warehouse} />
  );
};

export default WarehouseReceiving;
