import { getItemsCategoriesStock } from "../../../lib/zohoData";
import { CategoriesTable } from "../../../ui/items";

export const ItemsPage = async () => {
  const itemDetails = await getItemsCategoriesStock();

  return <CategoriesTable data={itemDetails} />;
};

export default ItemsPage;
