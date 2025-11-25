import { getItemsCategoriesStock } from "../../../lib/api/clients/zoho/items";
import { CategoriesTable } from "../../../ui/items/CategoryItemsTable";

const ItemsPage = async () => {
  const itemDetails = await getItemsCategoriesStock();
  return <CategoriesTable data={itemDetails} />;
};

export default ItemsPage;
