"use client";

import { useState } from "react";
import { CategoriesMenu } from "../CategoriesMenu/CategoriesMenu";
import { ItemsTable } from "../ItemsTable/ItemsTable";

interface Category {
  category_id: string;
  category_name: string;
}

interface CategoriesProps {
  categories: Category[];
  warehouse?: { warehouse_id: string; warehouse_name: string };
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
            warehouseId={warehouse.warehouse_id}
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
  warehouse: { warehouse_id: string; warehouse_name: string };
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (id: string) => void;
}) => {
  return (
    <div className="drawer flex md:hidden">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="flex justify-between items-center w-full pt-1 px-1 h-10">
        <div className="badge badge-lg font-extrabold">
          {warehouse.warehouse_name}
        </div>
        <label
          htmlFor="my-drawer-2"
          className="btn btn-sm mt-2 btn-primary btn-outline drawer-button lg:hidden mb-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 6h.008v.008H6V6Z"
            />
          </svg>
          Categories
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
