"use client";

import React, { FC, useState } from "react";
import { Bar, BarChart, Tooltip, XAxis, YAxis } from "recharts";
import SelectDataset from "./SelectDataset";
import { Categories } from "../../../types";

interface ChartBarProps {
  dataset: Categories[];
  data: unknown[];
}

export const ChartBar: FC<ChartBarProps> = ({ data, dataset }) => {
  const defaultValue = [dataset[5], dataset[8]].filter(Boolean);
  const [selectedDataset, setSelectedDataset] =
    useState<Categories[]>(defaultValue);

  return (
    <>
      <SelectDataset
        options={dataset}
        value={selectedDataset}
        onChange={(value) => setSelectedDataset(value as Categories[])}
      />
      <div className="overflow-x-auto">
        <div style={{ width: data.length * selectedDataset.length * 40 }}>
          <BarChart
            width={data.length * selectedDataset.length * 40}
            height={400}
            data={data}
            barSize={20}
            barGap={4}
            barCategoryGap="20%"
          >
            <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" />
            <YAxis
              label={{
                value: "Inventory",
                angle: -90,
                position: "insideLeft",
              }}
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
        </div>
      </div>
    </>
  );
};

export default ChartBar;
