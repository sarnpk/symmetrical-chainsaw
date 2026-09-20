"use client";

import React, { useEffect, useMemo } from "react";
import { ChevronDown, Check } from "lucide-react";

type SectionProps = {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: (id: string, open: boolean) => void;
  showChevron?: boolean;
  completed?: boolean;
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
  completed = false,
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
        <div className="flex items-center gap-2 text-left min-w-0">
          {completed && (
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-3 w-3 text-green-600" />
            </span>
          )}
          <div className="min-w-0">
            <div className="text-base md:text-lg font-semibold text-gray-900 truncate">{title}</div>
            {description && (
              <div className="text-xs md:text-sm text-gray-600 mt-0.5 truncate">{description}</div>
            )}
          </div>
        </div>
        {showChevron && (
          <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform flex-shrink-0 ${chevronClass}`} />)
        }
      </button>

      <div
        id={`${id}-panel`}
        className={`${isOpen ? "block" : "hidden"} mt-3`}
      >
        {children}
        {nextId && onNext && (
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNext(nextId)}
              className="px-4 py-2.5 h-10 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Next
            </button>
            <button
              type="button"
              onClick={() => onNext(nextId)}
              className="px-4 py-2.5 h-10 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Skip for now
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
