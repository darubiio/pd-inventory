"use client";

import { Suspense, useEffect, useState } from "react";
import { ItemsTable } from "../ItemsTable/ItemsTable";
import { CategoriesMenu } from "../CategoriesMenu/CategoriesMenu";

export const WarehouseDetail = ({
  warehouseId,
  categories,
}: {
  warehouseId: string;
  categories: { category_id: string; category_name: string }[];
}) => {
  const [selectedCategory, setSelectedCategory] = useState(
    categories.length ? categories[0].category_id : ""
  );

  return (
    <div className="flex-row lg:flex max-h-[calc(100vh-65px)] gap-2 p-2">
      <div className="w-5/5 lg:w-1/5 drawer lg:drawer-open flex flex-col">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <label
          htmlFor="my-drawer-2"
          className="btn btn-primary drawer-button lg:hidden w-full mb-2"
        >
          Categories
        </label>
        <div className="drawer-side z-10 border-l-0">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
            style={{ background: "transparent" }}
          />
          <CategoriesMenu
            categories={categories}
            selectedCategory={selectedCategory}
            onChangeCategory={(id) => {
              setSelectedCategory(id);
              if (typeof window !== "undefined" && window.innerWidth < 1024) {
                const drawer = document.getElementById(
                  "my-drawer-2"
                ) as HTMLInputElement;
                if (drawer) drawer.checked = false;
              }
            }}
          />
        </div>
      </div>
      <div className="w-full lg:w-4/5">
        <ItemsTable warehouseId={warehouseId} categoryId={selectedCategory} />
      </div>
    </div>
  );
};
