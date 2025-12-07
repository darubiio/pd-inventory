import { FC } from "react";

const Loading: FC = () => {
  return (
    <div className="grid grid-cols-1 m-2 gap-2 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-3">
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className="card card-side bg-base-100 shadow-sm hover:shadow-lg cursor-pointer"
        >
          <div className="w-full p-3 flex flex-col justify-start gap-2">
            <div className="badge badge-ghost h-4 w-2/3 skeleton" />
            <div className="badge badge-ghost mb-2 h-3 w-1/3 skeleton" />
            <ul className="list gap-2">
              <li className="font-semibold opacity-70 flex gap-x-2 h-4 w-3/3 skeleton" />
              <li className="font-semibold opacity-70 flex gap-x-2 h-4 w-2/3 skeleton" />
              <li className="font-semibold opacity-70 flex gap-x-2 h-4 w-2/3 skeleton" />
            </ul>
          </div>
          <div className="w-50 h-41 skeleton" />
        </div>
      ))}
    </div>
  );
};

export default Loading;
