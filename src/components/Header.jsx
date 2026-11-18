import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Sun, Moon, MapPin, Calendar, Clock, RefreshCw } from "lucide-react";
import CitySearch from "./CitySearch";
import { CONFIG } from "../config";

export default function Header({
  cityName,
  englishDate,
  hijriDate,
  isDark,
  onToggleTheme,
  onSelectCity,
  onUseCurrentLocation,
  onManualRefresh,
  isRefreshing,
}) {
  const shouldReduceMotion = useReducedMotion();

  // Format Hijri string e.g. "6 Rabi' al-Awwal 1448 AH"
  const hijriFormatted = hijriDate
    ? `${hijriDate.day} ${hijriDate.month?.en || ""} ${hijriDate.year} AH`
    : null;

  return (
    <header className="w-full flex flex-col gap-5 pt-2 pb-1">
      {/* Top Bar: Title & Theme Toggle */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-cyan-300 bg-clip-text text-transparent">
            {CONFIG.app.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            {CONFIG.app.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Manual refresh button */}
          <button
            onClick={onManualRefresh}
            disabled={isRefreshing}
            title="Refresh prayer and weather data"
            aria-label="Refresh data"
            className="p-2.5 rounded-xl glass-card text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all cursor-pointer shadow-sm disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="p-2.5 rounded-xl glass-card text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all cursor-pointer shadow-sm relative overflow-hidden"
          >
            <motion.div
              key={isDark ? "dark" : "light"}
              initial={shouldReduceMotion ? { opacity: 0 } : { rotate: -90, scale: 0.5, opacity: 0 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { rotate: 0, scale: 1, opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { rotate: 90, scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </motion.div>
          </button>
        </div>
      </div>

      {/* Middle row: City search & Active location display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* City Search Bar */}
        <CitySearch
          onSelectCity={onSelectCity}
          onUseCurrentLocation={onUseCurrentLocation}
          currentCityName={cityName}
        />

        {/* Location & Dates Pill */}
        <div className="flex flex-wrap items-center justify-start md:justify-end gap-2 text-xs">
          {/* Active City Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-card text-slate-700 dark:text-slate-200 font-semibold shadow-xs">
            <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="truncate max-w-[200px]" title={cityName}>
              {cityName}
            </span>
          </div>

          {/* English Date */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-card text-slate-600 dark:text-slate-300 font-medium shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span>{englishDate}</span>
          </div>

          {/* Hijri Date */}
          {hijriFormatted && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-card text-slate-600 dark:text-slate-300 font-medium shadow-xs">
              <Clock className="w-3.5 h-3.5 text-purple-500 shrink-0" />
              <span>{hijriFormatted}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
