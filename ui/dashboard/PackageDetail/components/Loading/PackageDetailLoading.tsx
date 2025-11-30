import { clsx } from "clsx";

export function PackageDetailLoadingContent() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i}>
            <div className="skeleton h-3 w-24 mb-2"></div>
            <div className="skeleton h-5 w-32"></div>
          </div>
        ))}
      </div>

      <div className="divider">Line Items</div>

      {/* Mobile: cards skeleton */}
      <div className="md:hidden space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card bg-base-200">
            <div className="card-body p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="skeleton h-5 w-40 mb-2"></div>
                  <div className="skeleton h-3 w-24 mb-1"></div>
                  <div className="skeleton h-3 w-28"></div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="skeleton h-5 w-16 rounded-full"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                <div>
                  <p className="opacity-70 text-sm mb-1">Quantity</p>
                  <div className="skeleton h-4 w-8"></div>
                </div>
                <div>
                  <p className="opacity-70 text-sm mb-1">Unit</p>
                  <div className="skeleton h-4 w-12"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table skeleton */}
      <div className="overflow-x-auto hidden md:block">
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Item</th>
              <th>SKU</th>
              <th>Part Number</th>
              <th className="text-right">Quantity</th>
              <th>Unit</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(4)].map((_, i) => (
              <tr key={i}>
                <td>
                  <div className="skeleton h-4 w-32"></div>
                </td>
                <td>
                  <div className="skeleton h-3 w-16"></div>
                </td>
                <td>
                  <div className="skeleton h-3 w-20"></div>
                </td>
                <td className="text-right">
                  <div className="skeleton h-4 w-12 ml-auto"></div>
                </td>
                <td>
                  <div className="skeleton h-3 w-12"></div>
                </td>
                <td>
                  <div className="skeleton h-5 w-16 rounded-full"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function PackageDetailLoading() {
  return (
    <div className="modal modal-open">
      <div
        className={clsx(
          "modal-box p-0 border-1 w-full h-[100dvh] max-h-[100dvh] m-0 rounded-none flex flex-col",
          "md:min-w-[50rem] md:h-auto md:max-h-[90vh] md:m-4 md:rounded-lg",
          "border-gray-300 dark:border-gray-700"
        )}
      >
        <div
          className={clsx(
            "flex items-center justify-between px-6 py-4 border-b shrink-0",
            "bg-base-100 border-base-300"
          )}
        >
          <div className="skeleton h-6 w-24"></div>
          <div className="flex items-center gap-2">
            <div className="skeleton h-8 w-8 rounded-full"></div>
            <div className="skeleton h-8 w-8 rounded-full"></div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <PackageDetailLoadingContent />
        </div>

        <div
          className={clsx(
            "px-6 py-4 border-t shrink-0",
            "bg-base-100 border-base-300"
          )}
        >
          <div className="flex flex-col md:flex-row gap-2 md:justify-between">
            <div className="skeleton h-10 w-32 md:w-40"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
