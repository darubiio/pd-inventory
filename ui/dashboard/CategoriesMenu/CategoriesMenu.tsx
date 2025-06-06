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
    <ul className="menu card bg-base-100 shadow-md font-semibold max-h-full">
      <li>
        <h2 className="menu-title sticky top-0 z-10 bg-base-100">Categories</h2>
        <ul className="overflow-y-auto max-h-[calc(100vh-120px)]">
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
