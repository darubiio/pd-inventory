import React from "react";

export const ItemsTable = ({
  categoryId,
  warehouseId,
}: {
  warehouseId: string;
  categoryId?: string;
}) => {
  return <div>{categoryId}</div>;
};
