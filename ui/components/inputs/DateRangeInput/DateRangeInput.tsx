"use client";

import { useMemo, useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import "./DateRangeInput.css";

function toISO(date?: Date) {
  return date ? date.toISOString().split("T")[0] : "";
}

function fromISO(s?: string) {
  if (!s) return undefined;
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export const DateRangeInput = ({
  defaultStart,
  defaultEnd,
  onChange,
  label = "Date range",
  loading = false,
}: {
  defaultStart?: string;
  defaultEnd?: string;
  onChange?: (start?: string, end?: string) => void;
  label?: string;
  loading?: boolean;
  className?: string;
  buttonClassName?: string;
}) => {
  const initialRange: DateRange | undefined = useMemo(
    () => ({ from: fromISO(defaultStart), to: fromISO(defaultEnd) }),
    [defaultStart, defaultEnd]
  );

  const [range, setRange] = useState<DateRange | undefined>(initialRange);
  const start = toISO(range?.from);
  const end = toISO(range?.to);

  const display = start && end ? `${start} → ${end}` : "Select dates";

  return (
    <>
      <button
        popoverTarget="rdp-popover"
        className="input input-border"
        style={{ anchorName: "--rdp" } as React.CSSProperties}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-4.5 text-gray-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
          />
        </svg>
        <span className="hidden md:block">{display}</span>
        <span className="md:hidden">Range</span>
      </button>
      <div
        popover="auto"
        id="rdp-popover"
        className="dropdown bg-base-100 dark:bg-base-200 shadow rounded-box p-3"
        style={{ positionAnchor: "--rdp" } as React.CSSProperties}
      >
        <DayPicker
          mode="range"
          selected={range}
          onSelect={(r) => {
            setRange(r);
            const s = toISO(r?.from);
            const e = toISO(r?.to);
            if (r?.from && r?.to) {
              onChange?.(s, e);
            }
          }}
          weekStartsOn={1}
          numberOfMonths={1}
          captionLayout="dropdown"
        />
      </div>
    </>
  );
};
