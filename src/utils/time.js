/**
 * TIME AND PRAYER CALCULATION UTILITIES
 */

/**
 * Cleans Aladhan time strings like "04:58 (BST)" or "18:20" to "HH:MM"
 */
export function cleanTimeString(timeStr) {
  if (!timeStr) return "00:00";
  return timeStr.split(" ")[0].trim();
}

/**
 * Formats 24h time ("17:45" or "17:45 (BST)") to 12-hour format ("5:45 PM")
 */
export function format12Hour(timeStr) {
  if (!timeStr) return "--:--";
  const clean = cleanTimeString(timeStr);
  const [hoursStr, minutesStr] = clean.split(":");
  let hours = parseInt(hoursStr, 10);
  const minutes = minutesStr || "00";
  
  if (isNaN(hours)) return timeStr;

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 hour should be 12

  return `${hours}:${minutes} ${ampm}`;
}

/**
 * Converts a "HH:MM" string and reference date into a Date object
 */
export function parsePrayerDate(timeStr, referenceDate = new Date()) {
  const clean = cleanTimeString(timeStr);
  const [hours, minutes] = clean.split(":").map(Number);
  const date = new Date(referenceDate);
  date.setHours(hours || 0, minutes || 0, 0, 0);
  return date;
}

/**
 * Formats a Date object into human-readable English date
 * e.g. "Sunday, 18 October 2026"
 */
export function formatEnglishDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/**
 * Calculates countdown hours, minutes, seconds between now and targetDate
 */
export function getCountdown(targetDate, now = new Date()) {
  const diffMs = targetDate.getTime() - now.getTime();
  if (diffMs <= 0) {
    return { hours: "00", minutes: "00", seconds: "00", totalSeconds: 0 };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
    totalSeconds,
  };
}

/**
 * Determines current prayer state:
 * - nextPrayer: { id, label, date, timeStr, isTomorrow }
 * - prevPrayer: { id, label, date, timeStr }
 * - progress: 0 to 100 representing elapsed progress between previous & next prayer
 * - passedPrayerIds: Array of IDs (e.g. ['Fajr', 'Dhuhr'])
 * - timePhase: 'dawn' | 'day' | 'sunset' | 'night'
 */
export function calculatePrayerStatus(todayTimings, tomorrowTimings, now = new Date()) {
  if (!todayTimings) {
    return null;
  }

  const PRAYER_ORDER = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

  // Create Date objects for today's prayers
  const todayDates = PRAYER_ORDER.map((id) => ({
    id,
    label: id,
    timeStr: todayTimings[id],
    date: parsePrayerDate(todayTimings[id], now),
    isTomorrow: false,
  }));

  const passedPrayerIds = [];
  let nextPrayer = null;
  let prevPrayer = null;

  for (let i = 0; i < todayDates.length; i++) {
    const item = todayDates[i];
    if (now < item.date) {
      nextPrayer = item;
      prevPrayer = i > 0 ? todayDates[i - 1] : null;
      break;
    } else {
      passedPrayerIds.push(item.id);
    }
  }

  // If all today's prayers passed, next is tomorrow's Fajr
  if (!nextPrayer) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tomorrowFajrTime = tomorrowTimings?.Fajr || todayTimings.Fajr;
    const tomorrowFajrDate = parsePrayerDate(tomorrowFajrTime, tomorrow);

    nextPrayer = {
      id: "Fajr",
      label: "Fajr",
      timeStr: tomorrowFajrTime,
      date: tomorrowFajrDate,
      isTomorrow: true,
    };
    prevPrayer = todayDates[todayDates.length - 1]; // Today's Isha
  }

  // If before Fajr today, previous prayer was yesterday's Isha
  if (!prevPrayer) {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayIshaDate = parsePrayerDate(todayTimings.Isha, yesterday);
    prevPrayer = {
      id: "Isha",
      label: "Isha",
      timeStr: todayTimings.Isha,
      date: yesterdayIshaDate,
    };
  }

  // Calculate circular progress: 0% to 100%
  const totalSpan = nextPrayer.date.getTime() - prevPrayer.date.getTime();
  const elapsed = now.getTime() - prevPrayer.date.getTime();
  let progress = 0;
  if (totalSpan > 0) {
    progress = Math.min(100, Math.max(0, (elapsed / totalSpan) * 100));
  }

  // Determine time phase for smart gradients
  const fajrDate = todayDates[0].date;
  const maghribDate = todayDates[3].date;
  const ishaDate = todayDates[4].date;
  
  let timePhase = "night";
  if (now >= fajrDate && now < todayDates[1].date) {
    timePhase = "dawn";
  } else if (now >= todayDates[1].date && now < maghribDate) {
    timePhase = "day";
  } else if (now >= maghribDate && now < ishaDate) {
    timePhase = "sunset";
  } else {
    timePhase = "night";
  }

  return {
    nextPrayer,
    prevPrayer,
    progress,
    passedPrayerIds,
    timePhase,
  };
}
