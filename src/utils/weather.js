/**
 * WMO Weather interpretation codes (WW)
 * Maps Open-Meteo weather codes to human labels and Lucide icon names
 */

export const WMO_CODE_MAP = {
  0: { label: "Clear Sky", icon: "Sun", category: "clear" },
  1: { label: "Mainly Clear", icon: "SunDim", category: "clear" },
  2: { label: "Partly Cloudy", icon: "CloudSun", category: "cloudy" },
  3: { label: "Overcast", icon: "Cloud", category: "cloudy" },
  45: { label: "Foggy", icon: "CloudFog", category: "fog" },
  48: { label: "Depositing Rime Fog", icon: "CloudFog", category: "fog" },
  51: { label: "Light Drizzle", icon: "CloudDrizzle", category: "drizzle" },
  53: { label: "Moderate Drizzle", icon: "CloudDrizzle", category: "drizzle" },
  55: { label: "Dense Drizzle", icon: "CloudDrizzle", category: "drizzle" },
  56: { label: "Light Freezing Drizzle", icon: "CloudSnow", category: "snow" },
  57: { label: "Dense Freezing Drizzle", icon: "CloudSnow", category: "snow" },
  61: { label: "Slight Rain", icon: "CloudRain", category: "rain" },
  63: { label: "Moderate Rain", icon: "CloudRain", category: "rain" },
  65: { label: "Heavy Rain", icon: "CloudRainWind", category: "rain" },
  66: { label: "Light Freezing Rain", icon: "CloudSnow", category: "snow" },
  67: { label: "Heavy Freezing Rain", icon: "CloudSnow", category: "snow" },
  71: { label: "Slight Snow Fall", icon: "Snowflake", category: "snow" },
  73: { label: "Moderate Snow Fall", icon: "Snowflake", category: "snow" },
  75: { label: "Heavy Snow Fall", icon: "Snowflake", category: "snow" },
  77: { label: "Snow Grains", icon: "Snowflake", category: "snow" },
  80: { label: "Slight Rain Showers", icon: "CloudRain", category: "rain" },
  81: { label: "Moderate Rain Showers", icon: "CloudRain", category: "rain" },
  82: { label: "Violent Rain Showers", icon: "CloudRainWind", category: "rain" },
  85: { label: "Slight Snow Showers", icon: "CloudSnow", category: "snow" },
  86: { label: "Heavy Snow Showers", icon: "CloudSnow", category: "snow" },
  95: { label: "Thunderstorm", icon: "CloudLightning", category: "thunderstorm" },
  96: { label: "Thunderstorm with Slight Hail", icon: "CloudLightning", category: "thunderstorm" },
  99: { label: "Thunderstorm with Heavy Hail", icon: "CloudLightning", category: "thunderstorm" },
};

/**
 * Returns weather info for a given WMO code
 */
export function getWeatherInfo(code) {
  return WMO_CODE_MAP[code] || {
    label: "Partly Cloudy",
    icon: "CloudSun",
    category: "cloudy",
  };
}

/**
 * Determines dynamic background theme based on time of day and weather condition
 * @param {string} timePhase - 'dawn', 'day', 'sunset', 'night'
 * @param {string} weatherCategory - 'clear', 'rain', 'thunderstorm', etc.
 * @param {boolean} isDark - Dark mode state
 */
export function getSmartBackgroundGradient(timePhase, weatherCategory, isDark) {
  // If dark mode is explicitly enabled, use deep modern night themes
  if (isDark) {
    if (weatherCategory === "rain" || weatherCategory === "thunderstorm") {
      return "from-slate-950 via-cyan-950/70 to-slate-900";
    }
    return "from-slate-950 via-slate-900 to-indigo-950";
  }

  // Light mode gradients customized by time of day & weather
  if (weatherCategory === "rain" || weatherCategory === "thunderstorm") {
    return "from-slate-200 via-sky-200 to-slate-300";
  }

  switch (timePhase) {
    case "dawn": // Fajr / Dawn
      return "from-amber-100 via-rose-100 to-indigo-200";
    case "day": // Dhuhr / Asr
      return "from-sky-100 via-emerald-50 to-amber-50";
    case "sunset": // Maghrib
      return "from-orange-100 via-rose-200 to-purple-200";
    case "night": // Isha / Late night
    default:
      return "from-slate-200 via-indigo-100 to-slate-300";
  }
}
