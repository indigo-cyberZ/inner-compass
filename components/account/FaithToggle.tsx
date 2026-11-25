"use client";

import { useState, useTransition } from "react";
import { setFaithEnabled } from "@/app/(app)/account/actions";

export function FaithToggle({ initial }: { initial: boolean }) {
  const [on, setOn] = useState(initial);
  const [pending, start] = useTransition();

  function toggle() {
    const next = !on;
    setOn(next); // optimistic
    start(async () => {
      const res = await setFaithEnabled(next);
      if (!res.ok) setOn(!next); // revert on failure
    });
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="font-medium text-ink">Faith &amp; spiritual growth</p>
        <p className="text-sm text-ink-soft">
          Adds optional Latter-day Saint faith-centered reflections. Off by
          default and private to your account.
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label="Faith features"
        onClick={toggle}
        disabled={pending}
        className={`relative h-7 w-12 shrink-0 rounded-full transition disabled:opacity-60 ${
          on ? "bg-clay" : "bg-line"
        }`}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${
            on ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}
