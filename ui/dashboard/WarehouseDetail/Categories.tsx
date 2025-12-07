"use client";

import { useState } from "react";
import { CategoriesMenu } from "../CategoriesMenu/CategoriesMenu";
import { ItemsTable } from "../ItemsTable/ItemsTable";
import { Location } from "../../../types";
import { cleanWarehouseName } from "../../../lib/api/utils/zohoDataUtils";
import { TagIcon } from "@heroicons/react/24/outline";

interface Category {
  category_id: string;
  category_name: string;
}

interface CategoriesProps {
  categories: Category[];
  warehouse?: Location;
}

export const Categories = ({ categories, warehouse }: CategoriesProps) => {
  const defaultCategory = categories.length ? categories[0].category_id : "";
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);

  if (!warehouse) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg font-semibold text-error">
            Error: Warehouse not found
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <DrawerMenu
        warehouse={warehouse}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <div className="hidden md:block md:overflow-auto p-3">
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
      <div className="pt-2 md:p-3 md:pl-0 overflow-hidden">
        <div className="menu card w-full border-t-1 border-b-1 md:border-1 rounded-none md:rounded-sm border-gray-300 dark:border-gray-700 p-0 bg-base-100 shadow-sm overflow-y-auto h-[calc(100vh-8.4rem)]">
          <ItemsTable
            warehouseId={warehouse.location_id}
            categoryId={selectedCategory}
          />
        </div>
      </div>
    </>
  );
};

const DrawerMenu = ({
  warehouse,
  categories,
  selectedCategory,
  setSelectedCategory,
}: {
  warehouse: { location_id: string; location_name: string };
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (id: string) => void;
}) => {
  return (
    <div className="drawer flex md:hidden">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="flex justify-between items-center w-full pt-1 px-1 h-10">
        <div className="bg-base-100 border border-gray-300 dark:border-gray-600 shadow-sm rounded-md px-3 py-2 font-extrabold h-10 flex items-center">
          {cleanWarehouseName(warehouse?.location_name)}
        </div>
        <label
          htmlFor="my-drawer-2"
          className="btn h-10 btn-sm mt-2 btn-primary btn-outline drawer-button lg:hidden mb-2"
        >
          <span className="mr-2 text-sm font-semibold">Categories</span>
          <TagIcon width={25} height={25} />
        </label>
      </div>
      <div className="drawer-side z-100 md:z-0 border-l-0">
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
  );
};
