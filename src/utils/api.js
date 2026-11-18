import { CONFIG } from "../config";

/**
 * Formats a Date object to "DD-MM-YYYY" for Aladhan API
 */
function formatApiDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

/**
 * Fetches prayer times from Aladhan API for today and tomorrow
 */
export async function fetchPrayerTimes(latitude, longitude) {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayStr = formatApiDate(today);
  const tomorrowStr = formatApiDate(tomorrow);

  const base = CONFIG.prayerApi.baseUrl;
  const method = CONFIG.prayerApi.method;
  const school = CONFIG.prayerApi.school;

  const todayUrl = `${base}/${todayStr}?latitude=${latitude}&longitude=${longitude}&method=${method}&school=${school}`;
  const tomorrowUrl = `${base}/${tomorrowStr}?latitude=${latitude}&longitude=${longitude}&method=${method}&school=${school}`;

  try {
    const [todayRes, tomorrowRes] = await Promise.all([
      fetch(todayUrl),
      fetch(tomorrowUrl),
    ]);

    if (!todayRes.ok) {
      throw new Error(`Aladhan API failed with status ${todayRes.status}`);
    }

    const todayData = await todayRes.json();
    let tomorrowTimings = null;

    if (tomorrowRes.ok) {
      const tomorrowData = await tomorrowRes.json();
      tomorrowTimings = tomorrowData.data?.timings || null;
    }

    const prayerResult = {
      timings: todayData.data.timings,
      hijri: todayData.data.date.hijri,
      tomorrowTimings,
      timestamp: Date.now(),
    };

    // Cache locally
    try {
      localStorage.setItem(
        CONFIG.storageKeys.cachedPrayer,
        JSON.stringify(prayerResult)
      );
      localStorage.setItem(
        CONFIG.storageKeys.lastUpdated,
        new Date().toISOString()
      );
    } catch {
      // Ignore quota errors
    }

    return { data: prayerResult, isOffline: false };
  } catch (error) {
    console.warn("Prayer API fetch failed, attempting cached fallback:", error);
    const cached = localStorage.getItem(CONFIG.storageKeys.cachedPrayer);
    if (cached) {
      return {
        data: JSON.parse(cached),
        isOffline: true,
        lastUpdated: localStorage.getItem(CONFIG.storageKeys.lastUpdated),
      };
    }
    throw error;
  }
}

/**
 * Fetches weather forecast from Open-Meteo
 */
export async function fetchWeather(latitude, longitude) {
  const url = `${CONFIG.weatherApi.forecastUrl}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Open-Meteo API failed with status ${res.status}`);
    }

    const data = await res.json();
    const weatherResult = {
      current: data.current,
      daily: data.daily,
      timestamp: Date.now(),
    };

    // Cache locally
    try {
      localStorage.setItem(
        CONFIG.storageKeys.cachedWeather,
        JSON.stringify(weatherResult)
      );
    } catch {
      // Ignore quota errors
    }

    return { data: weatherResult, isOffline: false };
  } catch (error) {
    console.warn("Weather API fetch failed, attempting cached fallback:", error);
    const cached = localStorage.getItem(CONFIG.storageKeys.cachedWeather);
    if (cached) {
      return {
        data: JSON.parse(cached),
        isOffline: true,
        lastUpdated: localStorage.getItem(CONFIG.storageKeys.lastUpdated),
      };
    }
    throw error;
  }
}

/**
 * Searches cities using Open-Meteo Geocoding
 */
export async function searchCities(query) {
  if (!query || query.trim().length < 2) return [];

  const url = `${CONFIG.weatherApi.geocodingUrl}?name=${encodeURIComponent(
    query.trim()
  )}&count=${CONFIG.weatherApi.geocodingCount}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Geocoding search failed");
    const data = await res.json();
    return (data.results || []).map((item) => ({
      name: item.name,
      country: item.country || "",
      admin1: item.admin1 || "",
      latitude: item.latitude,
      longitude: item.longitude,
      displayLabel: [item.name, item.admin1, item.country]
        .filter(Boolean)
        .join(", "),
    }));
  } catch (err) {
    console.error("City search error:", err);
    return [];
  }
}
