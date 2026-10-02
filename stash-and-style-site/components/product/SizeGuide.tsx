"use client";

import { useState } from "react";
import { Sheet, SheetHeader } from "@/components/ui/Sheet";
import { RulerIcon } from "@/components/icons";

/** Standard US ring size conversions (inside diameter and circumference, mm). */
const SIZES: [string, number, number][] = [
  ["4", 14.9, 46.8],
  ["4.5", 15.3, 48.0],
  ["5", 15.7, 49.3],
  ["5.5", 16.1, 50.6],
  ["6", 16.5, 51.9],
  ["6.5", 16.9, 53.1],
  ["7", 17.3, 54.4],
  ["7.5", 17.7, 55.7],
  ["8", 18.1, 57.0],
  ["8.5", 18.5, 58.3],
  ["9", 18.9, 59.5],
  ["9.5", 19.4, 60.8],
  ["10", 19.8, 62.1],
  ["10.5", 20.2, 63.4],
  ["11", 20.6, 64.6],
  ["11.5", 21.0, 65.9],
  ["12", 21.4, 67.2],
];

export function SizeGuide() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="inline-flex min-h-11 items-center gap-1.5 text-sm underline underline-offset-4"
      >
        <RulerIcon size={18} /> Ring size guide
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} side="center" labelledBy="size-guide-title">
        <div className="flex max-h-[calc(100dvh-2rem)] flex-col">
          <SheetHeader title="Ring size guide" titleId="size-guide-title" onClose={() => setOpen(false)} />
          <div className="overflow-y-auto px-5 py-5">
            <p className="text-[0.9375rem] text-muted">
              Measure the inside diameter of a ring that already fits the finger you want, or wrap a strip of paper
              around that finger and measure its length for the circumference. Between sizes? Go up half a size.
            </p>
            <table className="mt-5 w-full text-left text-[0.9375rem] tabular-nums">
              <caption className="sr-only">US ring sizes with inside diameter and circumference in millimetres</caption>
              <thead>
                <tr className="border-b border-ink">
                  <th scope="col" className="py-2 font-semibold">
                    US size
                  </th>
                  <th scope="col" className="py-2 font-semibold">
                    Diameter (mm)
                  </th>
                  <th scope="col" className="py-2 font-semibold">
                    Circumference (mm)
                  </th>
                </tr>
              </thead>
              <tbody>
                {SIZES.map(([us, d, c]) => (
                  <tr key={us} className="border-b border-line">
                    <th scope="row" className="py-2 font-medium">
                      {us}
                    </th>
                    <td className="py-2">{d.toFixed(1)}</td>
                    <td className="py-2">{c.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Sheet>
    </>
  );
}
