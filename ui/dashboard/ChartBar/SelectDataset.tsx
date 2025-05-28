"use client";

import { FC } from "react";
import Select, { ActionMeta, MultiValue } from "react-select";
import makeAnimated from "react-select/animated";
import { Categories } from "../../../types";

const animatedComponents = makeAnimated();

interface SelectDatasetProps {
  options: Categories[];
  value: Categories[];
  onChange?: (
    newValue: MultiValue<Categories>,
    actionMeta: ActionMeta<Categories>
  ) => void;
}

const SelectDataset: FC<SelectDatasetProps> = ({
  value,
  options,
  onChange,
}) => {
  return (
    <Select
      isMulti
      id="select-dataset"
      className="uppercase mb-4"
      getOptionValue={(o) => o.category_id}
      getOptionLabel={(o) => o.category_name}
      value={value}
      components={animatedComponents}
      options={options}
      onChange={onChange}
    />
  );
};

export default SelectDataset;
