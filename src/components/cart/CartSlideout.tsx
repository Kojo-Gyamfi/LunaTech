"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useCartStore } from "@/lib/store";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import ProductImage from "@/components/product/ProductImage";

interface CartSlideoutProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSlideout({ isOpen, onClose }: CartSlideoutProps) {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const subtotal = useCartStore((state) => state.getSubtotal());
  const shipping = useCartStore((state) => state.getShipping());
  const tax = useCartStore((state) => state.getTax());
  const total = useCartStore((state) => state.getCartTotal());

  const handleRemoveItem = (productId: string, productName: string) => {
    removeItem(productId);
    toast.success(`${productName} removed from cart.`);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Slideout Panel */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-slate-900 border-l border-white/10 z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">
            Shopping Cart
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-300 transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Items */}
        <div className="divide-y divide-white/5 p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 mb-4">Your cart is empty</p>
              <button
                onClick={onClose}
                className="inline-flex px-4 py-2 bg-amber-400 text-slate-950 font-semibold rounded-lg hover:bg-amber-300 transition-all duration-200"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <div key={item.product.id} className="py-4 space-y-3">
                  <div className="flex gap-4 items-start">
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-20 h-20 bg-slate-800 rounded-lg overflow-hidden">
                      <ProductImage
                        src={item.product.image}
                        alt={item.product.name}
                        category={item.product.category}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-slate-100 line-clamp-2 break-words">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-slate-500 mb-1 truncate">
                        {item.product.category}
                      </p>
                      <p className="text-sm font-semibold text-amber-300">
                        ${(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() =>
                        handleRemoveItem(item.product.id, item.product.name)
                      }
                      className="flex-shrink-0 p-1 text-slate-400 hover:text-red-400 transition-colors duration-200"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2 bg-slate-800/50 rounded-lg w-fit px-2 py-1">
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                      className="p-1 text-slate-400 hover:text-slate-200 transition-colors duration-200"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-sm font-semibold text-slate-200 w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      disabled={item.quantity >= item.product.stock}
                      className="p-1 text-slate-400 hover:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer with Totals and Checkout */}
        {items.length > 0 && (
          <div className="sticky bottom-0 z-10 bg-slate-900/95 backdrop-blur-sm border-t border-white/10 p-6 space-y-4">
            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping</span>
                <span>${shipping.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tax</span>
                <span>${tax.toLocaleString()}</span>
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between font-semibold text-slate-100">
                <span>Total</span>
                <span className="text-amber-300">
                  ${total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full py-3 bg-amber-400 text-slate-950 font-semibold rounded-lg hover:bg-amber-300 transition-all duration-200 text-center"
            >
              Proceed to Checkout
            </Link>

            {/* Continue Shopping */}
            <button
              onClick={onClose}
              className="w-full py-3 border border-white/10 text-slate-300 font-semibold rounded-lg hover:bg-slate-800/50 transition-all duration-200 text-sm"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
