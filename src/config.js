/**
 * APPLICATION CONFIGURATION
 * 
 * Edit this file to customize default settings, prayer calculation methods,
 * refresh intervals, and UI options without touching core logic.
 */

export const CONFIG = {
  // App info displayed in the header and metadata
  app: {
    title: "Prayer & Weather",
    subtitle: "Daily Salah & Forecast Companion",
  },

  // Default fallback location when geolocation is denied or unavailable
  defaultLocation: {
    cityName: "Rajshahi, Bangladesh",
    latitude: 24.37,
    longitude: 88.60,
    country: "Bangladesh",
  },

  // Prayer Calculation settings for Aladhan API
  // Method 1 = University of Islamic Sciences, Karachi (standard for Bangladesh/Pakistan/India)
  // School 1 = Hanafi juristic method (standard for Bangladesh)
  prayerApi: {
    baseUrl: "https://api.aladhan.com/v1/timings",
    method: 1, // Karachi
    school: 1, // Hanafi
    // The main 5 prayers tracked in order
    trackedPrayers: [
      { id: "Fajr", label: "Fajr", arabic: "الفجر", icon: "Sunrise" },
      { id: "Dhuhr", label: "Dhuhr", arabic: "الظهر", icon: "Sun" },
      { id: "Asr", label: "Asr", arabic: "العصر", icon: "CloudSun" },
      { id: "Maghrib", label: "Maghrib", arabic: "المغرب", icon: "Sunset" },
      { id: "Isha", label: "Isha", arabic: "العشاء", icon: "Moon" },
    ],
    // Informational prayer row (Sunrise)
    infoPrayers: [
      { id: "Sunrise", label: "Sunrise (Shuruq)", arabic: "الشروق", icon: "SunHorizon" },
    ],
  },

  // Weather settings for Open-Meteo
  weatherApi: {
    forecastUrl: "https://api.open-meteo.com/v1/forecast",
    geocodingUrl: "https://geocoding-api.open-meteo.com/v1/search",
    geocodingCount: 5,
  },

  // Background refresh interval in minutes (e.g. 10 minutes)
  refreshIntervalMinutes: 10,

  // Local storage keys for caching and user preferences
  storageKeys: {
    theme: "pw_dashboard_theme",
    location: "pw_dashboard_location",
    cachedPrayer: "pw_dashboard_cached_prayer",
    cachedWeather: "pw_dashboard_cached_weather",
    lastUpdated: "pw_dashboard_last_updated",
  },
};
