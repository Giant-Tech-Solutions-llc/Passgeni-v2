// =============================================================
// Shared hook: "remind me next month" localStorage dismissal.
// Used by UpgradeModal and CertLimitBanners.
// Key: pg_remind_dismissed_until (ISO timestamp)
// =============================================================
import { useState } from "react";

const STORAGE_KEY = "pg_remind_dismissed_until";

function isCurrentlyDismissed() {
  if (typeof window === "undefined") return false;
  try {
    const until = localStorage.getItem(STORAGE_KEY);
    return !!until && new Date(until) > new Date();
  } catch { return false; }
}

/**
 * Returns [dismissed: boolean, dismiss: () => void]
 * dismiss() sets localStorage to the start of next month.
 */
export function useRemindDismissed() {
  const [dismissed, setDismissed] = useState(isCurrentlyDismissed);

  const dismiss = () => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1, 1);
    nextMonth.setHours(0, 0, 0, 0);
    try { localStorage.setItem(STORAGE_KEY, nextMonth.toISOString()); } catch {}
    setDismissed(true);
  };

  return [dismissed, dismiss];
}
