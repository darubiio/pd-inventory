import { FC } from "react";

const Loading: FC = () => {
  return (
    <div className="flex-row md:flex-col h-full w-full md:pl-2 gap-1">
      <TopCategoriesSkeleton />
      <ChartBarSkeleton />
    </div>
  );
};

export const TopCategoriesSkeleton: FC = () => (
  <div className="flex h-2/12 gap-4 pl-1 pt-3 md:pt-0 pb-4 min-h-35">
    {Array.from({ length: 5 }).map((_, index) => (
      <div
        key={index}
        className="card bg-base-200 shadow-md w-1/5 min-w-35 p-4"
      >
        <div className="stat-title h-5 skeleton w-8/12 mb-3" />
        <div className="stat-desc h-5 skeleton w-6/12 mb-3" />
        <div className="stat-value h-15 skeleton w-3/12 mb-3" />
      </div>
    ))}
  </div>
);

export const ChartBarSkeleton: FC = () => (
  <div className="card bg-base-200 shadow-md h-10/12 min-h-120 mb-3 ml-1">
    <div className="flex flex-col h-full gap-4 p-4">
      <div className="flex gap-4 w-full">
        <div className="h-10 skeleton w-2/12 mb-2" />
        <div className="h-10 skeleton w-2/12 mb-2" />
        <div className="h-10 skeleton w-8/12 mb-2" />
      </div>
      <div className="h-full skeleton w-full mb-2" />
    </div>
  </div>
);

export default Loading;
