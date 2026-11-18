
import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";

import {
  Search,
  MapPin,
  X,
  Loader2,
  Navigation,
  Clock,
  CalendarDays,
} from "lucide-react";

import { searchCities } from "../utils/api";

export default function CitySearch({
  onSelectCity,
  onUseCurrentLocation,
  currentCityName,
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [selectedTimezone, setSelectedTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const [currentTime, setCurrentTime] = useState(new Date());

  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format local time
  const formatTime = () => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone: selectedTimezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(currentTime);
    } catch {
      return currentTime.toLocaleTimeString();
    }
  };

  // Format local date
  const formatDate = () => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone: selectedTimezone,
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(currentTime);
    } catch {
      return currentTime.toDateString();
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced city search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(false);

    const timer = setTimeout(async () => {
      try {
        const data = await searchCities(query);

        setResults(data);
        setIsOpen(true);
      } catch (err) {
        console.error("Search failed:", err);
        setResults([]);
      } finally {
        setIsLoading(false);
        setHasSearched(true);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  // Select city
  const handleSelect = (city) => {
    // Set selected city timezone
    // Expected API field: timezone (IANA timezone)
    if (city.timezone) {
      setSelectedTimezone(city.timezone);
    }

    onSelectCity({
      cityName: city.displayLabel,
      latitude: city.latitude,
      longitude: city.longitude,
      country: city.country,
      timezone: city.timezone || null,
    });

    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  // Clear search
  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  // Use current location
  const handleCurrentLocation = () => {
    setSelectedTimezone(
      Intl.DateTimeFormat().resolvedOptions().timeZone
    );

    onUseCurrentLocation();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-md mx-auto"
    >
      {/* Search Input */}
      <div className="relative flex items-center">

        <Search className="absolute left-3.5 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder="Search city (e.g. Dhaka, London, Makkah)..."
          className="w-full pl-10 pr-20 py-2.5 text-sm rounded-xl glass-card text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-all"
        />

        <div className="absolute right-2 flex items-center gap-1">

          {query && (
            <button
              onClick={handleClear}
              aria-label="Clear search"
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleCurrentLocation}
            title="Use my current location"
            aria-label="Use my current location"
            className="p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/15 transition-all cursor-pointer flex items-center justify-center"
          >
            <Navigation className="w-4 h-4" />
          </button>

        </div>
      </div>

      {/* Live Local Time Card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
        className="mt-3 glass-card rounded-xl px-4 py-3 border border-white/40 dark:border-white/10 shadow-sm"
      >
        <div className="flex items-center justify-between mb-2">

          {/* <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-500" />

            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {currentCityName || "Local"} Time
            </span>
          </div> */}



        </div>

        <div className="flex items-center justify-between gap-3">

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums">
              {formatTime()}
            </h2>
          </div>

          <div className="hidden sm:flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-500/10">
            <Clock className="w-5 h-5 text-emerald-500" />
          </div>

        </div>
      </motion.div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -8, scale: 0.98 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -8, scale: 0.98 }
            }
            transition={{ duration: 0.2 }}
            className="absolute z-50 left-0 right-0 mt-2 glass-card rounded-xl overflow-hidden shadow-2xl border border-white/40 dark:border-white/10 divide-y divide-slate-100 dark:divide-slate-800"
          >

            {isLoading && (
              <div className="flex items-center justify-center gap-2 py-4 text-xs text-slate-500 dark:text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                <span>Searching cities worldwide...</span>
              </div>
            )}

            {!isLoading && results.length > 0 && (
              <ul className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">

                {results.map((city, idx) => (
                  <motion.li
                    key={`${city.latitude}-${city.longitude}-${idx}`}
                    whileHover={{
                      backgroundColor: "rgba(16, 185, 129, 0.1)",
                    }}
                    onClick={() => handleSelect(city)}
                    className="flex items-center gap-2.5 px-4 py-3 text-left cursor-pointer transition-colors"
                  >

                    <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />

                    <div className="flex flex-col min-w-0">

                      <span className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                        {city.displayLabel || city.name}
                      </span>

                      <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {[city.admin1, city.country]
                          .filter(Boolean)
                          .join(", ")}
                      </span>

                    </div>
                  </motion.li>
                ))}

              </ul>
            )}

            {!isLoading && hasSearched && results.length === 0 && (
              <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400">
                No cities found matching "{query}".
                Try a different spelling.
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
