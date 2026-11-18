import React from "react";

export default function SkeletonLoader() {
  return (
    <div className="w-full flex flex-col gap-6 animate-pulse">
      {/* Hero Next Prayer Skeleton */}
      <div className="glass-card rounded-3xl p-7 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="flex flex-col items-center lg:items-start gap-3 w-full lg:w-1/3">
          <div className="h-5 w-28 bg-slate-300/60 dark:bg-slate-700/60 rounded-full" />
          <div className="h-10 w-44 bg-slate-300/60 dark:bg-slate-700/60 rounded-xl" />
          <div className="h-4 w-36 bg-slate-200/60 dark:bg-slate-800/60 rounded-lg" />
        </div>

        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-300/60 dark:bg-slate-700/60" />
          <div className="w-14 h-14 rounded-2xl bg-slate-300/60 dark:bg-slate-700/60" />
          <div className="w-14 h-14 rounded-2xl bg-slate-300/60 dark:bg-slate-700/60" />
        </div>

        <div className="w-32 h-32 rounded-full bg-slate-300/60 dark:bg-slate-700/60" />
      </div>

      {/* Grid: Prayer list & Weather card skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prayer List Skeleton */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 flex flex-col gap-3">
          <div className="h-6 w-40 bg-slate-300/60 dark:bg-slate-700/60 rounded-lg mb-2" />
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-14 w-full rounded-2xl bg-slate-200/50 dark:bg-slate-800/50"
            />
          ))}
        </div>

        {/* Weather Card Skeleton */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between gap-6">
          <div className="flex justify-between items-center">
            <div className="h-6 w-36 bg-slate-300/60 dark:bg-slate-700/60 rounded-lg" />
            <div className="h-5 w-20 bg-slate-200/60 dark:bg-slate-800/60 rounded-full" />
          </div>

          <div className="flex justify-between items-center py-4">
            <div className="flex flex-col gap-2">
              <div className="h-12 w-28 bg-slate-300/60 dark:bg-slate-700/60 rounded-xl" />
              <div className="h-5 w-24 bg-slate-200/60 dark:bg-slate-800/60 rounded-lg" />
            </div>
            <div className="w-16 h-16 rounded-2xl bg-slate-300/60 dark:bg-slate-700/60" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="h-16 rounded-2xl bg-slate-200/50 dark:bg-slate-800/50" />
            <div className="h-16 rounded-2xl bg-slate-200/50 dark:bg-slate-800/50" />
            <div className="h-16 rounded-2xl bg-slate-200/50 dark:bg-slate-800/50" />
          </div>

          <div className="grid grid-cols-5 gap-2 pt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-20 rounded-xl bg-slate-200/50 dark:bg-slate-800/50"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
