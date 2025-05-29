"use client";

import React, { FC, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import SelectDataset from "./SelectDataset";
import { Categories } from "../../../types";
import { geistSans } from "../../fonts";

interface ChartBarProps {
  dataset: Categories[];
  data: unknown[];
}

export const ChartBar: FC<ChartBarProps> = ({ data, dataset }) => {
  const defaultValue = [dataset[5], dataset[8]].filter(Boolean)

  const [selectedDataset, setSelectedDataset] =
    useState<Categories[]>(defaultValue);

  return (
    <>
      <SelectDataset
        options={dataset}
        value={selectedDataset}
        onChange={(value) => setSelectedDataset(value as Categories[])}
      />
      <ResponsiveContainer
        width="100%"
        height="100%"
        className={`${geistSans.className} uppercase antialiased font-semibold`}
      >
        <BarChart width={150} height={40} data={data} barSize={30}>
          <XAxis dataKey="name" />
          <YAxis
            label={{ value: "Inventory", angle: -90, position: "insideLeft" }}
          />
          <Tooltip contentStyle={{ borderRadius: "0.5rem" }} />
          {selectedDataset.map(({ category_id, category_name }) => (
            <Bar
              key={category_id}
              dataKey={category_id}
              minPointSize={2}
              name={category_name}
              radius={[3, 3, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default ChartBar;
