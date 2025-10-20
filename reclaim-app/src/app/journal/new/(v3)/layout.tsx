"use client";

import { JournalEntryProvider } from "./JournalEntryContext";

export default function V3Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <JournalEntryProvider>
      {children}
    </JournalEntryProvider>
  );
}