import React from "react";
import { motion } from "framer-motion";
import { WifiOff, RefreshCw } from "lucide-react";

/**
 * Offline & Cache Status Badge
 * Displays when network fails and showing cached data
 */
export default function OfflineBadge({ lastUpdated, onRefresh, isRefreshing }) {
  const formattedTime = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Unknown";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between gap-3 px-4 py-2 text-xs font-medium bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 rounded-xl backdrop-blur-md"
    >
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
        <span>
          <strong>Offline Mode:</strong> Viewing cached data (Last updated:{" "}
          {formattedTime})
        </span>
      </div>
      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-500/20 hover:bg-amber-500/30 transition-colors text-amber-800 dark:text-amber-200 cursor-pointer disabled:opacity-50"
      >
        <RefreshCw
          className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`}
        />
        <span>Retry</span>
      </button>
    </motion.div>
  );
}
