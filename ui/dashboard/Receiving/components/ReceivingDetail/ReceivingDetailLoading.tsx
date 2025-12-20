export function ReceivingDetailLoadingContent() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i}>
            <div className="skeleton h-3 w-24 mb-2"></div>
            <div className="skeleton h-5 w-32"></div>
          </div>
        ))}
      </div>

      <div>
        <div className="skeleton h-3 w-16 mb-2"></div>
        <div className="skeleton h-4 w-full"></div>
      </div>

      <div className="divider">Items Received</div>

      <div className="md:hidden space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card bg-base-200">
            <div className="card-body p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="skeleton h-5 w-40 mb-2"></div>
                  <div className="skeleton h-3 w-24 mb-1"></div>
                  <div className="skeleton h-3 w-32"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                <div>
                  <p className="opacity-70 text-sm mb-1">Quantity Received</p>
                  <div className="skeleton h-4 w-16"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Item</th>
              <th>SKU</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(4)].map((_, i) => (
              <tr key={i}>
                <td>
                  <div>
                    <div className="skeleton h-4 w-32 mb-1"></div>
                    <div className="skeleton h-3 w-24"></div>
                  </div>
                </td>
                <td>
                  <div className="skeleton h-3 w-16"></div>
                </td>
                <td>
                  <div className="skeleton h-4 w-16"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
