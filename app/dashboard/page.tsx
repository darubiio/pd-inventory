import { FC } from "react";
import { getOrganizationDetails } from "../../lib/zohoData";

const DashboardPage: FC = async () => {
  const organization = await getOrganizationDetails();
  return (
    <div className="rounded-2xl p-4 shadow-md bg-white border border-gray-200 max-w-md">
      <h2 className="text-xl font-semibold text-gray-800">🏢 {organization.name}</h2>
      <p className="text-gray-600 mt-1">📧 {organization.email}</p>
    </div>
  );
};

export default DashboardPage;
