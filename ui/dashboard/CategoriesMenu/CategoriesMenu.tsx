"use client";

import { TagIcon } from "@heroicons/react/24/outline";

export const CategoriesMenu = ({
  categories,
  selectedCategory,
  onChangeCategory,
}: {
  categories: { category_id: string; category_name: string }[];
  selectedCategory?: string;
  onChangeCategory?: (categoryId: string) => void;
}) => {
  return (
    <ul className="menu card bg-base-100 shadow-md font-semibold h-[calc(100vh-80px)] w-full flex flex-col">
      <li className="flex flex-col flex-1 min-h-0">
        <h2 className="menu-title sticky top-0 z-10 bg-base-100">Categories</h2>
        <ul className="flex-1 overflow-y-auto">
          {categories.map(({ category_id, category_name }) => (
            <li
              key={category_id}
              onClick={() => onChangeCategory?.(category_id)}
            >
              <a
                className={
                  selectedCategory === category_id ? "menu-active" : ""
                }
              >
                <TagIcon width={16} />
                {category_name}
              </a>
            </li>
          ))}
        </ul>
      </li>
    </ul>
  );
};
