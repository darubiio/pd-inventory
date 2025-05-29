function Loading() {
  return (
    <div className="overflow-auto rounded-xl border border-base-100 shadow-sm ml-3">
      <table className="table table-md table-pin-cols table-zebra">
        <thead>
          <tr>
            {Array.from({ length: 12 }).map((_, i) => (
              <th key={i}>
                <div className="h-6 w-24 bg-base-300 rounded animate-pulse" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 12 }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: 12 }).map((_, colIndex) => (
                <td key={colIndex}>
                  <div className="h-4 w-full bg-base-200 rounded animate-pulse" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Loading;
