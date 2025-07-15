import React from "react";
import TableLoading from "../../../../ui/loading/tableLoading";

function Loading() {
  return (
    <div className="flex-row lg:flex max-h-[calc(100vh-65px)] gap-2 p-2">
      <div className="h-8 m-2 skeleton lg:hidden" />
      <div className="hidden lg:block lg:w-1/5">
        <ul className="menu card bg-base-100 shadow-md font-semibold h-[calc(100vh-80px)] w-full flex flex-col">
          <li className="flex flex-col flex-1 min-h-0">
            <h2 className="menu-title sticky top-0 z-10 bg-base-100">
              Categories
            </h2>
            <ul className="flex-1 overflow-y-auto">
              {Array.from({ length: 20 }).map((_, idx) => (
                <li key={idx}>
                  <a>
                    <div className="skeleton h-6 w-57"></div>
                  </a>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
      <div className="w-5/5 lg:w-4/5">
        <div className="card bg-base-100 shadow-xl pt-3 h-[calc(100vh-80px)]">
          <div className="overflow-x-auto md:mx-3">
            <TableLoading cols={6} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loading;
