"use client";

import { Sparkles, Brain, Loader2 } from "lucide-react";

export default function ProgressIndicator({ progress }) {
  const { percent, message } = progress;

  return (
    <div className="max-w-lg mx-auto animate-slide-up">
      <div className="glass-card p-10 text-center">
        {/* Animated Icon */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-brand-200 dark:border-brand-900/40" />
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-500 animate-spin"
            style={{ animationDuration: "1.5s" }}
          />

          {/* Inner icon */}
          <div className="absolute inset-3 bg-brand-50 dark:bg-brand-900/30 rounded-full flex items-center justify-center">
            <Brain className="w-10 h-10 text-brand-600 dark:text-brand-400 animate-pulse" />
          </div>

          {/* Sparkle effects */}
          <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-amber-400 animate-bounce-slow" />
          <Sparkles
            className="absolute -bottom-1 -left-2 w-4 h-4 text-brand-400 animate-bounce-slow"
            style={{ animationDelay: "0.5s" }}
          />
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          AI is Processing Your Data
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          {message || "Analyzing columns and extracting CRM records..."}
        </p>

        {/* Progress Bar */}
        <div className="progress-bar-bg mb-3">
          <div
            className="progress-bar-fill"
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
          <span>{Math.round(percent)}% complete</span>
          <div className="flex items-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Processing...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
