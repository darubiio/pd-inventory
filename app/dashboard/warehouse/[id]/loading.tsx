import React from "react";
import TableLoading from "../../../../ui/loading/tableLoading";

function Loading() {
  return (
    <div className="flex-1 overflow-auto tabs tabs-lift pt-1 relative">
      <div className="hidden md:inline-flex md:absolute font-bold right-10 top-2">
        <div className="skeleton h-6 w-25"></div>
      </div>
      <label className="tab">
        <input type="radio" name="my_tabs_4" defaultChecked />
        <span className="font-semibold">📋 Inventory</span>
      </label>
      <div className="tab-content bg-base-100 border-base-300">
        <WarehouseDetailLoading />
      </div>
      <label className="tab">
        <input type="radio" name="my_tabs_4" />
        <span className="font-semibold">📦 Packages</span>
      </label>
      <div className="tab-content bg-base-100 border-base-300 h-full md:h-[calc(100vh-6.9rem)]">
        <PackageLoading />
      </div>
    </div>
  );
}

export const WarehouseDetailLoading = () => (
  <div className="grid md:grid-cols-[250px_1fr] h-[calc(100vh-6.9rem)]">
    <MobileMenuLoading />
    <MenuLoading />
    <div className="overflow-y-auto h-[calc(100vh-9.5rem)]">
      <TableLoading cols={6} />
    </div>
  </div>
);

const MobileMenuLoading = () => (
  <div className="drawer flex md:hidden">
    <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
    <div className="flex justify-between items-center w-full pt-1 px-1 h-10">
      <div className="skeleton h-6 w-25 ml-3"></div>
      <div className="skeleton h-6 w-25 ml-3"></div>
    </div>
  </div>
);

const MenuLoading = () => (
  <div className="hidden md:block md:overflow-auto w-full">
    <ul className="menu card bg-base-100 shadow-none font-semibold flex flex-col h-full">
      <li className="flex flex-col flex-1 min-h-0">
        <h2 className="menu-title sticky top-0 z-10 bg-base-100">Categories</h2>
        <ul className="flex-1 overflow-y-auto grid grid-rows-1fr gap-2 w-full">
          {Array.from({ length: 20 }).map((_, idx) => (
            <li key={idx}>
              <div className="skeleton h-8 w-50" />
            </li>
          ))}
        </ul>
      </li>
    </ul>
  </div>
);

export const PackageListingLoading = () => (
  <div className="md:hidden pb-4 flex flex-col gap-3 px-4">
    {Array.from({ length: 5 }).map((_, idx) => (
      <div
        key={idx}
        className="card bg-base-100 shadow-sm border border-gray-100 p-3 flex gap-1"
      >
        <div className="flex items-center justify-between">
          <div className="skeleton h-4 w-15"></div>
          <div className="skeleton h-5 w-15"></div>
        </div>
        <div className="skeleton h-4 w-25"></div>
        <div className="skeleton h-4 w-10"></div>
        <div className="skeleton h-4 w-15"></div>
        <div className="skeleton h-4 w-25"></div>
        <div className="skeleton h-4 w-15"></div>
      </div>
    ))}
  </div>
);

export const PackageLoading = () => {
  return (
    <div className="card bg-base-100 shadow-xl pt-3 h-screen md:h-[calc(100vh-6.9rem)]">
      <div className="px-4 pb-3 flex flex-col gap-3 md:items-center md:justify-between">
        <div className="flex flex-col md:flex-row md:justify-between gap-2 w-full">
          <div className="skeleton h-10 w-full md:w-90" />
          <div className="grid grid-cols-2 gap-2 w-full md:w-auto md:flex md:items-center md:gap-2 md:justify-end">
            <div className="skeleton h-10 w-full md:w-42"></div>
            <div className="skeleton h-10 w-full md:w-42"></div>
          </div>
        </div>
        <PackageListingLoading />
        <div className="overflow-x-auto md:mx-3 hidden md:block w-full">
          <TableLoading cols={7} rows={14} />
        </div>
      </div>
    </div>
  );
};

export default Loading;
