import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CONFIG } from "./config";
import { fetchPrayerTimes, fetchWeather } from "./utils/api";
import {
  formatEnglishDate,
  calculatePrayerStatus,
  getCountdown,
} from "./utils/time";
import { getWeatherInfo, getSmartBackgroundGradient } from "./utils/weather";

import Header from "./components/Header";
import NextPrayerHero from "./components/NextPrayerHero";
import PrayerList from "./components/PrayerList";
import WeatherCard from "./components/WeatherCard";
import OfflineBadge from "./components/OfflineBadge";
import SkeletonLoader from "./components/SkeletonLoader";
import ErrorMessage from "./components/ErrorMessage";

export default function App() {
  const shouldReduceMotion = useReducedMotion();

  // 1. Dark / Light theme state (persisted in localStorage, default to system preference)
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem(CONFIG.storageKeys.theme);
    if (saved !== null) {
      return saved === "dark";
    }
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Apply dark class to document root
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem(CONFIG.storageKeys.theme, "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem(CONFIG.storageKeys.theme, "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // 2. Location state (persisted or defaults to config)
  const [location, setLocation] = useState(() => {
    const saved = localStorage.getItem(CONFIG.storageKeys.location);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fall back to default
      }
    }
    return CONFIG.defaultLocation;
  });

  // 3. Data & Loading States
  const [prayerData, setPrayerData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // 4. Live clock ticker (every second)
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 5. Fetch prayer & weather data
  const loadData = useCallback(
    async (loc = location, isSilent = false) => {
      if (!isSilent) setIsLoading(true);
      else setIsRefreshing(true);
      setErrorMessage(null);

      try {
        const [prayerRes, weatherRes] = await Promise.all([
          fetchPrayerTimes(loc.latitude, loc.longitude),
          fetchWeather(loc.latitude, loc.longitude),
        ]);

        setPrayerData(prayerRes.data);
        setWeatherData(weatherRes.data);

        const offlineState = prayerRes.isOffline || weatherRes.isOffline;
        setIsOffline(offlineState);

        if (offlineState) {
          setLastUpdated(prayerRes.lastUpdated || weatherRes.lastUpdated);
        } else {
          setLastUpdated(new Date().toISOString());
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setErrorMessage(
          err.message || "Failed to load prayer times or weather data. Please try again."
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [location]
  );

  // Initial load: Attempt Geolocation, otherwise use stored or default location
  useEffect(() => {
    const savedLocation = localStorage.getItem(CONFIG.storageKeys.location);

    if (!savedLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userLoc = {
            cityName: "Your Location",
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            country: "",
          };
          setLocation(userLoc);
          localStorage.setItem(
            CONFIG.storageKeys.location,
            JSON.stringify(userLoc)
          );
          loadData(userLoc);
        },
        (err) => {
          console.warn("Geolocation denied or error, using default fallback:", err);
          loadData(CONFIG.defaultLocation);
        },
        { timeout: 8000 }
      );
    } else {
      loadData(location);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Manual trigger for "Use my location" button
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLoc = {
          cityName: "Your Location",
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          country: "",
        };
        setLocation(userLoc);
        localStorage.setItem(CONFIG.storageKeys.location, JSON.stringify(userLoc));
        loadData(userLoc);
      },
      (err) => {
        alert("Could not access your location. Please check browser permissions.");
      }
    );
  };

  // Change city from search box
  const handleSelectCity = (newLoc) => {
    setLocation(newLoc);
    localStorage.setItem(CONFIG.storageKeys.location, JSON.stringify(newLoc));
    loadData(newLoc);
  };

  // Auto refresh every 10 minutes and on midnight date change
  const lastDayRef = useRef(now.getDate());
  useEffect(() => {
    const refreshIntervalMs = CONFIG.refreshIntervalMinutes * 60 * 1000;
    const interval = setInterval(() => {
      loadData(location, true);
    }, refreshIntervalMs);

    return () => clearInterval(interval);
  }, [location, loadData]);

  // Check midnight date change
  useEffect(() => {
    const currentDay = now.getDate();
    if (currentDay !== lastDayRef.current) {
      lastDayRef.current = currentDay;
      loadData(location, true);
    }
  }, [now, location, loadData]);

  // 6. Calculate prayer status and countdown
  const prayerStatus = prayerData?.timings
    ? calculatePrayerStatus(prayerData.timings, prayerData.tomorrowTimings, now)
    : null;

  const countdown = prayerStatus?.nextPrayer
    ? getCountdown(prayerStatus.nextPrayer.date, now)
    : { hours: "00", minutes: "00", seconds: "00" };

  // 7. Dynamic smart gradient background
  const weatherCategory = weatherData?.current
    ? getWeatherInfo(weatherData.current.weather_code).category
    : "clear";
  const timePhase = prayerStatus?.timePhase || "day";
  const gradientClasses = getSmartBackgroundGradient(timePhase, weatherCategory, isDark);

  // Framer Motion staggered page load animation variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: 0.05,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: "easeOut" },
    },
  };

  return (
    <div
      className={`min-h-screen w-full bg-gradient-to-br ${gradientClasses} transition-all duration-1000 text-slate-800 dark:text-slate-100 font-sans selection:bg-emerald-500 selection:text-white`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex flex-col gap-6">
        {/* Header */}
        <Header
          cityName={location.cityName}
          englishDate={formatEnglishDate(now)}
          hijriDate={prayerData?.hijri}
          isDark={isDark}
          onToggleTheme={toggleTheme}
          onSelectCity={handleSelectCity}
          onUseCurrentLocation={handleUseCurrentLocation}
          onManualRefresh={() => loadData(location, true)}
          isRefreshing={isRefreshing}
        />

        {/* Offline & Cache Notice */}
        {isOffline && (
          <OfflineBadge
            lastUpdated={lastUpdated}
            onRefresh={() => loadData(location, true)}
            isRefreshing={isRefreshing}
          />
        )}

        {/* Main Content Area */}
        {isLoading ? (
          <SkeletonLoader />
        ) : errorMessage ? (
          <ErrorMessage
            message={errorMessage}
            onRetry={() => loadData(location)}
          />
        ) : (
          <motion.main
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6"
          >
            {/* Hero Card: Next Prayer & Circular Countdown Ring */}
            <motion.section variants={cardVariants}>
              <NextPrayerHero
                prayerStatus={prayerStatus}
                countdown={countdown}
              />
            </motion.section>

            {/* Grid: Prayer Schedule & Weather Card */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              {/* Prayer Schedule List */}
              <motion.section variants={cardVariants} className="h-full">
                <PrayerList
                  timings={prayerData?.timings}
                  nextPrayerId={prayerStatus?.nextPrayer?.id}
                  passedPrayerIds={prayerStatus?.passedPrayerIds}
                />
              </motion.section>

              {/* Weather Forecast Card */}
              <motion.section variants={cardVariants} className="h-full">
                <WeatherCard weatherData={weatherData} />
              </motion.section>
            </div>
          </motion.main>
        )}

        {/* Footer */}
        <footer className="text-center py-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <p>
            Prayer times via <span className="font-semibold">Aladhan API</span> (Karachi/Hanafi) • Weather via{" "}
            <span className="font-semibold">Open-Meteo</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
