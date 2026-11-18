import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="glass-card rounded-3xl p-8 sm:p-12 text-center max-w-lg mx-auto shadow-2xl flex flex-col items-center gap-4 my-8">
      <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-500 flex items-center justify-center">
        <AlertCircle className="w-7 h-7" />
      </div>

      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
        Unable to Load Data
      </h3>

      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
        {message || "Could not retrieve prayer times or weather information. Please check your internet connection and try again."}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
}
