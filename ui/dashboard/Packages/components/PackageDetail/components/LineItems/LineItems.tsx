import React, { Fragment } from "react";
import { LineItemsCards } from "./LineItemsCards/LineItemsCards";
import { LineItemsTable } from "./LineItemsTable/LineItemsTable";
import { PackageDetail } from "../../../../../../../types";

interface LineItemsProps {
  data?: PackageDetail;
  state: {
    scanMode: boolean;
    scannedItems: Map<string, number>;
  };
}

export const LineItems = ({ data, state }: LineItemsProps) => {
  return (
    <Fragment>
      <div className="divider">Line Items</div>
      <LineItemsCards items={data?.line_items} state={state} />
      <LineItemsTable items={data?.line_items} state={state} />
    </Fragment>
  );
};
