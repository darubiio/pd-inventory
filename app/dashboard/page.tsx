import { FC } from "react";
import { getItemDetails } from "../../lib/zohoData";

const DashboardPage: FC = async () => {
  const itemDetails = await getItemDetails();
  return (
    <div></div>
  );
};

export default DashboardPage;