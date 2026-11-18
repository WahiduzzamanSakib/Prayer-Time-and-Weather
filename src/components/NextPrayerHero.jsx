import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Clock, Sparkles } from "lucide-react";
import { format12Hour } from "../utils/time";

/**
 * Animated individual digit / unit container for smooth countdown tick
 */
function DigitBlock({ value, label, shouldReduceMotion }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-14 sm:w-16 h-14 sm:h-16 flex items-center justify-center rounded-2xl bg-white/70 dark:bg-slate-800/80 border border-white/40 dark:border-white/10 shadow-md backdrop-blur-md overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={shouldReduceMotion ? { opacity: 0 } : { y: 16, opacity: 0 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { y: -16, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 font-mono tracking-tight"
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-500 mt-1.5">
        {label}
      </span>
    </div>
  );
}

export default function NextPrayerHero({
  prayerStatus,
  countdown,
}) {
  const shouldReduceMotion = useReducedMotion();

  if (!prayerStatus || !prayerStatus.nextPrayer) {
    return null;
  }

  const { nextPrayer, prevPrayer, progress } = prayerStatus;
  const isTomorrow = nextPrayer.isTomorrow;
  const formattedTargetTime = format12Hour(nextPrayer.timeStr);

  // Circular progress SVG setup
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  // Progress is 0 to 100
  const clampedProgress = Math.min(100, Math.max(0, progress || 0));
  const strokeOffset = circumference - (circumference * clampedProgress) / 100;

  return (
    <motion.div
      whileHover={shouldReduceMotion ? {} : { y: -4 }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.995 }}
      transition={{ duration: 0.2 }}
      className="glass-card rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden"
    >
      {/* Decorative ambient background blur */}
      <div className="absolute -right-16 -top-16 w-56 h-56 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-56 h-56 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Side: Next Prayer Identity */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-2 max-w-sm">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              {isTomorrow ? "Tomorrow's Next Salah" : "Upcoming Salah"}
            </span>

            {isTomorrow && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/25">
                Tomorrow
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-3 mt-1">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-800 dark:text-white">
              {nextPrayer.label}
            </h2>
            <span className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {formattedTargetTime}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {prevPrayer ? (
              <>
                Current cycle: <strong className="text-slate-700 dark:text-slate-200">{prevPrayer.label}</strong> →{" "}
                <strong className="text-emerald-600 dark:text-emerald-400">{nextPrayer.label}</strong>
              </>
            ) : (
              "Counting down to Salah time"
            )}
          </p>
        </div>

        {/* Center: Live Countdown Digits */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" /> Time Remaining
          </span>

          <div className="flex items-center gap-2 sm:gap-3">
            <DigitBlock
              value={countdown.hours}
              label="Hours"
              shouldReduceMotion={shouldReduceMotion}
            />
            <span className="text-2xl font-bold text-slate-400 dark:text-slate-500 mb-6">:</span>
            <DigitBlock
              value={countdown.minutes}
              label="Minutes"
              shouldReduceMotion={shouldReduceMotion}
            />
            <span className="text-2xl font-bold text-slate-400 dark:text-slate-500 mb-6">:</span>
            <DigitBlock
              value={countdown.seconds}
              label="Seconds"
              shouldReduceMotion={shouldReduceMotion}
            />
          </div>
        </div>

        {/* Right Side: Circular Progress Ring */}
        <div className="relative flex flex-col items-center justify-center shrink-0">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 144 144"
            >
              {/* Background Track */}
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-slate-200/60 dark:stroke-slate-800/80 fill-none"
                strokeWidth="10"
              />
              {/* Animated Progress Arc */}
              <motion.circle
                cx="72"
                cy="72"
                r={radius}
                className="fill-none stroke-emerald-500"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeLinecap="round"
                initial={shouldReduceMotion ? { strokeDashoffset: strokeOffset } : { strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: strokeOffset }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </svg>

            {/* Inner Ring Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
                {Math.round(clampedProgress)}%
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Elapsed
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
