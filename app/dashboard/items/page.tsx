import { getItemsCategoriesStock } from "../../../lib/api/clients/zoho/zohoData";
import { CategoriesTable } from "../../../ui/items/CategoryItemsTable";

// Force dynamic rendering since this requires authentication and real-time data
export const dynamic = "force-dynamic";

const ItemsPage = async () => {
  const itemDetails = await getItemsCategoriesStock();
  return <CategoriesTable data={itemDetails} />;
};

export default ItemsPage;
