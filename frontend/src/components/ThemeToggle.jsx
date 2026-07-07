"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check initial theme
    const html = document.documentElement;
    setIsDark(html.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.remove("dark");
    } else {
      html.classList.add("dark");
    }
    setIsDark(!isDark);
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-xl bg-gray-100 dark:bg-surface-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-surface-700/80 transition-all duration-200"
      aria-label="Toggle theme"
    >
      <Sun
        className={`w-5 h-5 absolute transition-all duration-300 ${
          isDark
            ? "opacity-0 rotate-90 scale-0"
            : "opacity-100 rotate-0 scale-100 text-amber-500"
        }`}
      />
      <Moon
        className={`w-5 h-5 absolute transition-all duration-300 ${
          isDark
            ? "opacity-100 rotate-0 scale-100 text-blue-400"
            : "opacity-0 -rotate-90 scale-0"
        }`}
      />
    </button>
  );
}
