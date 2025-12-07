import TableLoading from "./tableLoading";

export const PackageListingLoading = () => (
  <div className="md:hidden px-1 pb-1 flex flex-col gap-3">
    {Array.from({ length: 5 }).map((_, idx) => (
      <div
        key={idx}
        className="card bg-base-100 shadow-sm border border-gray-300 dark:border-gray-600 p-3 flex gap-1"
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

export const PackageLoading = () => (
  <div className="card bg-base-100 shadow-xl pt-3 h-screen md:h-[calc(100vh-6.9rem)]">
    <div className="px-1 md:px-3 pb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2 w-full md:w-1/2">
        <div className="skeleton h-10 w-32" />
        <div className="skeleton h-10 flex-1" />
        <div className="skeleton h-10 w-10 md:hidden" />
      </div>
      <div className="grid grid-cols-2 gap-2 w-full md:w-auto md:flex md:items-center md:gap-2 md:justify-end">
        <div className="skeleton h-10 w-full md:w-auto hidden md:block md:w-10"></div>
        <div className="skeleton h-10 w-full md:w-42"></div>
        <div className="skeleton h-10 w-full md:w-42"></div>
      </div>
    </div>
    <PackageListingLoading />
    <div className="overflow-x-auto md:mx-3 hidden md:block w-full">
      <TableLoading cols={7} rows={14} />
    </div>
  </div>
);
