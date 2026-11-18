import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Sunrise,
  Sun,
  CloudSun,
  Sunset,
  Moon,
  SunMedium,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { format12Hour } from "../utils/time";

// Icon mapping for prayers
const PRAYER_ICONS = {
  Fajr: Sunrise,
  Sunrise: SunMedium,
  Dhuhr: Sun,
  Asr: CloudSun,
  Maghrib: Sunset,
  Isha: Moon,
};

export default function PrayerList({
  timings,
  nextPrayerId,
  passedPrayerIds = [],
}) {
  const shouldReduceMotion = useReducedMotion();

  if (!timings) return null;

  const prayers = [
    { id: "Fajr", name: "Fajr", arabic: "الفجر", isInfo: false },
    { id: "Sunrise", name: "Sunrise (Shuruq)", arabic: "الشروق", isInfo: true },
    { id: "Dhuhr", name: "Dhuhr", arabic: "الظهر", isInfo: false },
    { id: "Asr", name: "Asr", arabic: "العصر", isInfo: false },
    { id: "Maghrib", name: "Maghrib", arabic: "المغرب", isInfo: false },
    { id: "Isha", name: "Isha", arabic: "العشاء", isInfo: false },
  ];

  // Framer Motion variants for staggered child list
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Clock className="w-5 h-5 text-emerald-500" />
          Today&apos;s Prayer Times
        </h3>
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
          Hanafi (Karachi)
        </span>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-2.5"
      >
        {prayers.map((prayer) => {
          const Icon = PRAYER_ICONS[prayer.id] || Sun;
          const isNext = nextPrayerId === prayer.id;
          const isPassed = !isNext && passedPrayerIds.includes(prayer.id);
          const rawTime = timings[prayer.id];
          const formattedTime = format12Hour(rawTime);

          if (prayer.isInfo) {
            // Smaller informational row (Sunrise)
            return (
              <motion.div
                key={prayer.id}
                variants={itemVariants}
                className="flex items-center justify-between px-4 py-2 rounded-xl bg-slate-100/50 dark:bg-slate-800/30 text-xs text-slate-500 dark:text-slate-400 border border-slate-200/40 dark:border-slate-800/60"
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-amber-500/80" />
                  <span className="font-medium">{prayer.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">
                    {formattedTime}
                  </span>
                  <span className="text-[10px] text-slate-400 font-arabic">
                    {prayer.arabic}
                  </span>
                </div>
              </motion.div>
            );
          }

          return (
            <motion.div
              key={prayer.id}
              variants={itemVariants}
              whileHover={shouldReduceMotion ? {} : { y: -2 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.99 }}
              className={`relative flex items-center justify-between px-4 sm:px-5 py-3.5 rounded-2xl transition-all cursor-default overflow-hidden ${
                isNext
                  ? "border border-emerald-500/40 shadow-lg text-emerald-950 dark:text-emerald-100"
                  : isPassed
                  ? "bg-slate-100/40 dark:bg-slate-900/40 border border-transparent text-slate-400 dark:text-slate-500"
                  : "bg-white/40 dark:bg-slate-800/40 hover:bg-white/70 dark:hover:bg-slate-800/70 border border-white/40 dark:border-white/5 text-slate-700 dark:text-slate-200"
              }`}
            >
              {/* LayoutId animated highlight for the next prayer */}
              {isNext && (
                <motion.div
                  layoutId="activePrayerHighlight"
                  className="absolute inset-0 bg-gradient-to-r from-emerald-500/15 via-teal-500/20 to-emerald-500/10 dark:from-emerald-500/25 dark:via-teal-500/30 dark:to-emerald-500/20 pointer-events-none rounded-2xl"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}

              {/* Left Side: Icon & Prayer Name */}
              <div className="relative z-10 flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isNext
                      ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                      : isPassed
                      ? "bg-slate-200/50 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm sm:text-base font-bold ${
                        isNext
                          ? "text-emerald-700 dark:text-emerald-300"
                          : isPassed
                          ? "line-through opacity-75"
                          : ""
                      }`}
                    >
                      {prayer.name}
                    </span>
                    {isNext && (
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-xs">
                        <Sparkles className="w-2.5 h-2.5" /> Next
                      </span>
                    )}
                    {isPassed && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-arabic">
                    {prayer.arabic}
                  </span>
                </div>
              </div>

              {/* Right Side: 12h Time */}
              <div className="relative z-10 flex items-baseline gap-1.5">
                <span
                  className={`text-base sm:text-lg font-extrabold tracking-tight ${
                    isNext
                      ? "text-emerald-700 dark:text-emerald-300"
                      : isPassed
                      ? "text-slate-400 dark:text-slate-600"
                      : "text-slate-800 dark:text-slate-100"
                  }`}
                >
                  {formattedTime}
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
