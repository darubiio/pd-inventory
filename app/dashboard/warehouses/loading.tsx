import { FC } from "react";

const Loading: FC = () => {
  return (
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 11 }).map((_, index) => (
        <div
          key={index}
          className="card card-side bg-base-100 shadow-sm animate-pulse"
        >
          <div className="card-body w-70">
            <h2 className="card-title bg-gray-200 h-6 w-2/3 skeleton"></h2>
            <p className="bg-gray-200 h-3 w-1/3 skeleton"></p>
            <ul className="list gap-2">              
              <p className="bg-gray-200 h-4 w-2/3 skeleton"></p>
              <p className="bg-gray-200 h-4 w-1/3 skeleton"></p>
            </ul>
          </div>
          <div className="bg-gray-200 w-45 h-40 skeleton"></div>
        </div>
      ))}
    </div>
  );
};

export default Loading;
