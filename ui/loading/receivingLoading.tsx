export const ReceivingListingLoading = () => (
  <div className="md:hidden px-1 pb-1 flex flex-col gap-3">
    {Array.from({ length: 4 }).map((_, idx) => (
      <div
        key={idx}
        className="card bg-base-100 shadow-sm border border-gray-300 dark:border-gray-600 p-3 flex gap-1"
      >
        <div className="flex items-center justify-between">
          <div className="skeleton h-3 w-15" />
          <div className="skeleton h-5 w-20" />
        </div>
        <div className="skeleton h-3 w-25" />
        <div className="skeleton h-3 w-15" />
        <div className="skeleton h-3 w-20" />
        <div className="skeleton h-3 w-25" />
      </div>
    ))}
  </div>
);
