import { getPackagesByLocationIdRange } from "../../../lib/api/clients/zoho/zohoData";
import ClientPackagesTable from "./ClientPackagesTable";

export const Packages = async ({ locationId }: { locationId: string }) => {
  const end = new Date();
  const start = new Date();

  start.setDate(start.getDate() - 30);
  const defaultStart = start.toISOString().split("T")[0];
  const defaultEnd = end.toISOString().split("T")[0];

  const data = await getPackagesByLocationIdRange(
    locationId,
    defaultStart,
    defaultEnd
  );

  return (
    <ClientPackagesTable
      locationId={locationId}
      initialData={data as any}
      defaultStart={defaultStart}
      defaultEnd={defaultEnd}
    />
  );
};
