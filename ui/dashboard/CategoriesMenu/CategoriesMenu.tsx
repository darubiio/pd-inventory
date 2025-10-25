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
    <div className="menu card border-1 rounded-sm border-gray-300 dark:border-gray-700 p-3 bg-base-100 shadow-sm font-semibold h-full">
      <h2 className="menu-title sticky top-0 z-10 bg-base-100">Categories</h2>
      <ul className="flex-1 overflow-y-auto gap-2">
        {categories.map(({ category_id, category_name }) => {
          const isActive = selectedCategory === category_id;
          return (
            <li
              key={category_id}
              onClick={() => onChangeCategory?.(category_id)}
            >
              <a
                className={`flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? "bg-primary text-primary-content"
                    : "hover:bg-base-200"
                }`}
              >
                <TagIcon width={16} />
                {category_name}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
