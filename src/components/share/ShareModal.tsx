"use client";

import { useState } from "react";
import { X, Send, MessageCircle, Share2, Copy } from "lucide-react";
import { Product } from "@/types";
import { shareProduct, copyToClipboard } from "@/lib/shareUtils";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export default function ShareModal({
  isOpen,
  onClose,
  product,
}: ShareModalProps) {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async (
    platform: "twitter" | "facebook" | "whatsapp" | "instagram",
  ) => {
    setIsSharing(true);
    try {
      await shareProduct(platform, product);
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyLink = async () => {
    const productUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/products/${product.id}`;
    const success = await copyToClipboard(productUrl);
    if (success) {
      const { toast } = await import("sonner");
      toast.success("Link copied to clipboard!");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-200"
        onClick={onClose}
        role="presentation"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        onClick={onClose}
        role="presentation"
      >
        <div
          className="glass w-full max-w-sm rounded-2xl shadow-2xl border border-white/10 p-8 animate-in fade-in zoom-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-amber-400/20 rounded-lg p-2.5">
                <Share2 size={20} className="text-amber-300" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-100">
                  Share Product
                </h2>
                <p className="text-xs text-slate-500">
                  Choose a platform to share
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition-colors duration-200 p-2 hover:bg-white/5 rounded-lg pointer-events-auto"
            >
              <X size={20} />
            </button>
          </div>

          {/* Product Preview */}
          <div className="mb-6 p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="text-sm font-semibold text-slate-200 line-clamp-2 mb-1">
              {product.name}
            </p>
            <p className="text-amber-300 font-bold">
              ${product.price.toLocaleString()}
            </p>
          </div>

          {/* Share Buttons */}
          <div className="space-y-3">
            {/* Twitter */}
            <button
              onClick={() => handleShare("twitter")}
              disabled={isSharing}
              className="w-full flex items-center space-x-3 p-4 rounded-lg bg-slate-900/50 border border-white/10 hover:border-sky-500/50 hover:bg-sky-500/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group pointer-events-auto"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-sky-500/20 rounded-lg flex items-center justify-center group-hover:bg-sky-500/30">
                <Send size={18} className="text-sky-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-200">Twitter</p>
                <p className="text-xs text-slate-500">Share on X (Twitter)</p>
              </div>
            </button>

            {/* Facebook */}
            <button
              onClick={() => handleShare("facebook")}
              disabled={isSharing}
              className="w-full flex items-center space-x-3 p-4 rounded-lg bg-slate-900/50 border border-white/10 hover:border-blue-600/50 hover:bg-blue-600/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group pointer-events-auto"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center group-hover:bg-blue-600/30">
                <Send size={18} className="text-blue-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-200">Facebook</p>
                <p className="text-xs text-slate-500">Share on Facebook</p>
              </div>
            </button>

            {/* WhatsApp */}
            <button
              onClick={() => handleShare("whatsapp")}
              disabled={isSharing}
              className="w-full flex items-center space-x-3 p-4 rounded-lg bg-slate-900/50 border border-white/10 hover:border-green-500/50 hover:bg-green-500/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group pointer-events-auto"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30">
                <MessageCircle size={18} className="text-green-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-200">WhatsApp</p>
                <p className="text-xs text-slate-500">Share via WhatsApp</p>
              </div>
            </button>

            {/* Instagram */}
            <button
              onClick={() => handleShare("instagram")}
              disabled={isSharing}
              className="w-full flex items-center space-x-3 p-4 rounded-lg bg-slate-900/50 border border-white/10 hover:border-pink-500/50 hover:bg-pink-500/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 opacity-20 group-hover:opacity-30 rounded-lg flex items-center justify-center transition-opacity">
                <Send size={18} className="text-pink-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-200">
                  Instagram
                </p>
                <p className="text-xs text-slate-500">
                  Copy & share on Instagram
                </p>
              </div>
            </button>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              disabled={isSharing}
              className="w-full flex items-center space-x-3 p-4 rounded-lg bg-slate-900/50 border border-white/10 hover:border-amber-400/50 hover:bg-amber-400/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-amber-400/20 rounded-lg flex items-center justify-center group-hover:bg-amber-400/30">
                <Copy size={18} className="text-amber-300" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-200">
                  Copy Link
                </p>
                <p className="text-xs text-slate-500">
                  Copy product link to clipboard
                </p>
              </div>
            </button>
          </div>

          {/* Footer */}
          <p className="text-xs text-slate-500 text-center mt-6">
            Sharing helps spread the word! 💙
          </p>
        </div>
      </div>
    </>
  );
}
