"use client";

import { useToastStore } from "@/store/toastStore";

export function ToastContainer() {
  const { toasts, remove } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => remove(t.id)}
          className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold animate-fade-in-up cursor-pointer select-none ${
            t.type === "success"
              ? "bg-green-700 text-white"
              : t.type === "error"
              ? "bg-red-500 text-white"
              : "bg-green-800 text-white"
          }`}
        >
          {t.type === "success" && (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          )}
          {t.message}
        </div>
      ))}
    </div>
  );
}
