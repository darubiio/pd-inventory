import { getItemsCategoriesStock } from "../../../lib/zohoData";
import { CategoriesTable } from "../../../ui/categories";

export const ItemsPage = async () => {
  const itemDetails = await getItemsCategoriesStock();

  return (
    <div className="overflow-x-auto w-full md:ml-3">
      <CategoriesTable data={itemDetails} />
    </div>
  );
};

export default ItemsPage;
