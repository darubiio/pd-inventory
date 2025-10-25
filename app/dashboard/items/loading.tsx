function Loading() {
  return (
    <div className="card border-1 border-gray-300 dark:border-gray-700 bg-base-100 shadow-xl h-[calc(100vh-5.5rem)] m-2">
      <div className="overflow-x-auto md:mx-3">
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
    </div>
  );
}

export default Loading;
