# 🕌 Prayer Time & Weather Dashboard

A modern, production-ready, config-driven web dashboard displaying accurate Islamic prayer times and live weather forecasts with smooth animations.

---
## Live Link

**Link:** https://prayer-weathear.netlify.app/

---

## 🚀 Tech Stack

- **React 19** + **Vite 6** (JavaScript only, clean and simple for junior developers)
- **Tailwind CSS v4** (using official `@tailwindcss/vite` plugin)
- **Framer Motion 12** (smooth countdown transitions, staggered entry, layoutId highlights, and gentle card feedback)
- **Lucide React** (modern iconography)
- **Zero backend & No API keys needed** (100% free public APIs)

---

## 🌐 Free Public APIs Used

1. **Aladhan Prayer Times API**:
   - `https://api.aladhan.com/v1/timings?latitude={lat}&longitude={lon}&method=1&school=1`
   - Configured by default for **Method 1 (Karachi)** and **School 1 (Hanafi)**, ideal for Bangladesh and South Asia.
   - Fetches today and tomorrow's timings for accurate midnight roll-over.
2. **Open-Meteo Weather API**:
   - `https://api.open-meteo.com/v1/forecast`
   - Real-time temperature, apparent ("feels-like") temperature, relative humidity, wind speed, WMO weather codes, and 5-day daily forecast.
3. **Open-Meteo Geocoding API**:
   - `https://geocoding-api.open-meteo.com/v1/search`
   - Free worldwide city search with debounced autocomplete.

---

## 🛠️ How to Customize (Junior Developer Guide)

All settings are neatly organized in [`src/config.js`](file:///d:/Projects/Prayer%20Time%20and%20Weather/src/config.js). You do not need to alter complex logic to change behavior!

### 1. Changing Default City
Open `src/config.js` and change `defaultLocation`:
```javascript
defaultLocation: {
  cityName: "Rajshahi, Bangladesh",
  latitude: 24.37,
  longitude: 88.60,
  country: "Bangladesh",
}
```

### 2. Changing Calculation Method & Juristic School
In `src/config.js`:
- `method: 1` — University of Islamic Sciences, Karachi
- `method: 2` — Islamic Society of North America (ISNA)
- `method: 3` — Muslim World League (MWL)
- `method: 4` — Umm al-Qura University, Makkah
- `method: 5` — Egyptian General Authority of Survey
- `school: 1` — Hanafi (Asr shadow ratio = 2)
- `school: 0` — Standard / Shafi'i / Maliki / Hanbali (Asr shadow ratio = 1)

### 3. Auto-Refresh Interval
Adjust `refreshIntervalMinutes: 10` in `src/config.js` to change how frequently data refreshes in the background.

---

## 📁 Project Structure

```
├── src/
│   ├── components/
│   │   ├── CitySearch.jsx      # Debounced search & suggestion dropdown
│   │   ├── ErrorMessage.jsx    # User-friendly error state with Retry
│   │   ├── Header.jsx          # App title, date/Hijri badges, theme toggle
│   │   ├── NextPrayerHero.jsx  # Hero card with circular SVG ring & countdown
│   │   ├── OfflineBadge.jsx    # Cache indicator with last updated time
│   │   ├── PrayerList.jsx      # Staggered Salah schedule + layoutId highlight
│   │   ├── SkeletonLoader.jsx  # Glassmorphism shimmer skeletons
│   │   └── WeatherCard.jsx     # Current weather stats + 5-day forecast
│   ├── utils/
│   │   ├── api.js              # Fetching & localStorage offline caching
│   │   ├── time.js             # 12h format, countdown math, active prayer logic
│   │   └── weather.js          # WMO code map & dynamic gradient calculation
│   ├── config.js               # Central settings file for the app
│   ├── index.css               # Tailwind CSS v4 setup & glass styles
│   ├── App.jsx                 # Main dashboard orchestrator
│   └── main.jsx                # React root mount
├── package.json
└── vite.config.js
```

---

## 💻 Running the App

### Start Development Server:
```bash
npm run dev
```

### Build for Production:
```bash
npm run build
```

### Preview Production Build:
```bash
npm run preview
```
