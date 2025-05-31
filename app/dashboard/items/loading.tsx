function Loading() {
  return (
    <div className="rounded-xl border border-base-100 mt-3 shadow-sm ml-3">
      <table className="table table-zebra">
        <thead>
          <tr>
            {Array.from({ length: 10 }).map((_, i) => (
              <th key={i}>
                <div className="h-6 w-24 bg-base-300 rounded animate-pulse" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 17 }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: 10 }).map((_, colIndex) => (
                <td key={colIndex}>
                  <div className="h-4 bg-base-100 rounded animate-pulse" />
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
