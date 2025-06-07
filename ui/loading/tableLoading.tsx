import React from "react";

export default function TableLoading({
  cols = 10,
  rows = 17,
}: {
  cols?: number;
  rows?: number;
}) {
  return (
    <table className="table table-zebra">
      <thead>
        <tr>
          {Array.from({ length: cols }).map((_, i) => (
            <th key={i}>
              <div className="h-6 w-24 bg-base-300 rounded animate-pulse" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: cols }).map((_, colIndex) => (
              <td key={colIndex}>
                <div className="h-4 bg-base-100 rounded animate-pulse" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
