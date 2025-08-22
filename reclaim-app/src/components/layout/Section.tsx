"use client";

import React, { useEffect, useMemo } from "react";
import { ChevronDown } from "lucide-react";

type SectionProps = {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: (id: string, open: boolean) => void;
  showChevron?: boolean;
  nextId?: string;
  onNext?: (nextId: string) => void;
};

export default function Section({
  id,
  title,
  description,
  children,
  isOpen,
  onToggle,
  showChevron = true,
  nextId,
  onNext,
}: SectionProps) {
  const chevronClass = useMemo(
    () => (isOpen ? "rotate-180" : "rotate-0"),
    [isOpen]
  );

  return (
    <section id={id} className="mb-4 md:mb-6">
      <button
        type="button"
        className="w-full flex items-center justify-between gap-3 px-3 py-3 md:px-4 md:py-3 rounded-lg border bg-white shadow-sm"
        aria-expanded={isOpen}
        aria-controls={`${id}-panel`}
        onClick={() => onToggle(id, !isOpen)}
      >
        <div className="text-left">
          <div className="text-base md:text-lg font-semibold text-gray-900">{title}</div>
          {description && (
            <div className="text-xs md:text-sm text-gray-600 mt-0.5">{description}</div>
          )}
        </div>
        {showChevron && (
          <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${chevronClass}`} />)
        }
      </button>

      <div
        id={`${id}-panel`}
        className={`${isOpen ? "block" : "hidden"} mt-3`}
      >
        {children}
        {nextId && onNext && (
          <div className="mt-4 flex">
            <button
              type="button"
              onClick={() => onNext(nextId)}
              className="w-full sm:w-auto px-4 py-3 h-11 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
