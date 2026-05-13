"use client";

import { Toaster } from "sonner";

interface ToastProviderProps {
  children: React.ReactNode;
}

export default function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      <Toaster
        richColors
        position="top-right"
        closeButton
        toastOptions={{
          classNames: {
            toast:
              "border border-white/10 bg-slate-900 text-slate-100 shadow-2xl shadow-black/30",
            title: "text-slate-100",
            description: "text-slate-400",
            actionButton: "bg-amber-400 text-slate-950",
            cancelButton: "bg-slate-800 text-slate-200",
          },
        }}
      />
      {children}
    </>
  );
}
