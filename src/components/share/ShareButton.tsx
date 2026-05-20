"use client";

import { Share2 } from "lucide-react";

interface ShareButtonProps {
  onClick: () => void;
}

export default function ShareButton({ onClick }: ShareButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-300 active:scale-95 bg-slate-900/50 text-slate-200 hover:bg-slate-800 border border-white/10 hover:border-amber-400/50"
      title="Share this product"
    >
      <Share2 size={20} />
      <span>Share Product</span>
    </button>
  );
}
