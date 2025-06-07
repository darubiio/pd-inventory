"use client";

import { Suspense, useEffect, useState } from "react";
import { ItemsTable } from "../ItemsTable/ItemsTable";
import { CategoriesMenu } from "../CategoriesMenu/CategoriesMenu";

function WarehouseDetail({
  warehouseId,
  categories,
}: {
  warehouseId: string;
  categories: { category_id: string; category_name: string }[];
}) {
  const [selectedCategory, setSelectedCategory] = useState(
    categories.length ? categories[0].category_id : ""
  );

  return (
    <div className="flex max-h-[calc(100vh-65px)] gap-2 p-2">
      <div className="w-1/5 ">
        <CategoriesMenu
          categories={categories}
          selectedCategory={selectedCategory}
          onChangeCategory={setSelectedCategory}
        />
      </div>
      <div className="w-4/5">
        <ItemsTable warehouseId={warehouseId} categoryId={selectedCategory} />
      </div>
    </div>
  );
}

export default WarehouseDetail;
