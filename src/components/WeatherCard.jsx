import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Sun,
  SunDim,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  Snowflake,
  CloudLightning,
  Thermometer,
  Droplets,
  Wind,
  Calendar,
} from "lucide-react";
import { getWeatherInfo } from "../utils/weather";

// Icon components dictionary
const ICON_COMPONENTS = {
  Sun,
  SunDim,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  Snowflake,
  CloudLightning,
};

function formatDayName(dateStr, index) {
  if (index === 0) return "Today";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

export default function WeatherCard({ weatherData }) {
  const shouldReduceMotion = useReducedMotion();

  if (!weatherData || !weatherData.current) return null;

  const { current, daily } = weatherData;
  const weatherInfo = getWeatherInfo(current.weather_code);
  const CurrentIcon = ICON_COMPONENTS[weatherInfo.icon] || CloudSun;

  // 5-day mini forecast (skip today or show up to 5 days)
  const forecastDays = (daily?.time || []).slice(0, 5).map((dateStr, idx) => ({
    date: dateStr,
    dayName: formatDayName(dateStr, idx),
    maxTemp: Math.round(daily.temperature_2m_max?.[idx] ?? 0),
    minTemp: Math.round(daily.temperature_2m_min?.[idx] ?? 0),
    code: daily.weather_code?.[idx] ?? 0,
  }));

  return (
    <motion.div
      whileHover={shouldReduceMotion ? {} : { y: -4 }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.995 }}
      transition={{ duration: 0.2 }}
      className="glass-card rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col justify-between gap-6"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CurrentIcon className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            Current Weather
          </h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300">
          Open-Meteo
        </span>
      </div>

      {/* Hero Temperature & Floating Icon */}
      <div className="flex items-center justify-between gap-4 py-2">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-5xl sm:text-6xl font-black tracking-tighter text-slate-800 dark:text-white">
              {Math.round(current.temperature_2m)}
            </span>
            <span className="text-2xl sm:text-3xl font-semibold text-emerald-600 dark:text-emerald-400">
              °C
            </span>
          </div>
          <p className="text-base font-semibold text-slate-700 dark:text-slate-200 mt-1">
            {weatherInfo.label}
          </p>
        </div>

        {/* Soft floating loop animated icon */}
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  y: [-5, 5, -5],
                  rotate: [0, 2, -2, 0],
                }
          }
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="p-4 rounded-3xl bg-gradient-to-tr from-amber-400/20 to-emerald-400/20 dark:from-amber-400/10 dark:to-emerald-400/10 border border-white/40 dark:border-white/10 shadow-lg text-amber-500 dark:text-amber-400"
        >
          <CurrentIcon className="w-14 h-14 sm:w-16 sm:h-16" />
        </motion.div>
      </div>

      {/* Atmospheric Metrics: Feels Like, Humidity, Wind */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/30 dark:border-white/5 text-center">
          <Thermometer className="w-4 h-4 text-rose-500 mb-1" />
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
            Feels Like
          </span>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
            {Math.round(current.apparent_temperature)}°C
          </span>
        </div>

        <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/30 dark:border-white/5 text-center">
          <Droplets className="w-4 h-4 text-sky-500 mb-1" />
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
            Humidity
          </span>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
            {current.relative_humidity_2m}%
          </span>
        </div>

        <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/30 dark:border-white/5 text-center">
          <Wind className="w-4 h-4 text-teal-500 mb-1" />
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
            Wind Speed
          </span>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
            {Math.round(current.wind_speed_10m)} km/h
          </span>
        </div>
      </div>

      {/* 5-Day Mini Forecast */}
      {forecastDays.length > 0 && (
        <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/80">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>5-Day Forecast</span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {forecastDays.map((day, idx) => {
              const dayWeather = getWeatherInfo(day.code);
              const DayIcon = ICON_COMPONENTS[dayWeather.icon] || CloudSun;

              return (
                <div
                  key={day.date}
                  className="flex flex-col items-center p-2 rounded-xl bg-white/30 dark:bg-slate-800/30 border border-white/20 dark:border-white/5 text-center"
                >
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                    {day.dayName}
                  </span>
                  <div className="my-1.5 text-slate-700 dark:text-slate-200">
                    <DayIcon className="w-5 h-5 text-amber-500/90" />
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold">
                    <span className="text-slate-800 dark:text-slate-100">
                      {day.maxTemp}°
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 text-[10px]">
                      {day.minTemp}°
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
