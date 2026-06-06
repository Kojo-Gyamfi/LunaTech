"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useCartStore } from "@/lib/store";
import { usePressHandlers } from "@/lib/usePressHandlers";
import { CustomerInfo, ShippingAddress, Order } from "@/types";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

type Step = 1 | 2 | 3;

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: {
        key: string;
        email: string;
        amount: number;
        currency: string;
        ref: string;
        metadata?: Record<string, unknown>;
        callback: (response: { reference: string; status?: string }) => void;
        onClose: () => void;
      }) => {
        openIframe: () => void;
      };
    };
  }
}

const createLocalOrderId = () => {
  return `LUNA-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 7)
    .toUpperCase()}`;
};

export default function CheckoutPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaystackReady, setIsPaystackReady] = useState(
    () => typeof window !== "undefined" && Boolean(window.PaystackPop),
  );

  // Load Paystack script on mount
  useEffect(() => {
    const markPaystackReady = () => setIsPaystackReady(true);

    if (window.PaystackPop) {
      queueMicrotask(markPaystackReady);
      return;
    }

    const existingScript = document.getElementById("paystack-inline-js");
    if (existingScript) {
      existingScript.addEventListener("load", markPaystackReady);
      return () => {
        existingScript.removeEventListener("load", markPaystackReady);
      };
    }

    const script = document.createElement("script");
    script.id = "paystack-inline-js";
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = markPaystackReady;
    script.onerror = () => {
      toast.error("Payment system could not load. Please refresh and try again.");
    };
    document.body.appendChild(script);
  }, []);

  // Checkout state
  const items = useCartStore((state) => state.items);
  const setCustomerInfo = useCartStore((state) => state.setCustomerInfo);
  const setShippingAddress = useCartStore((state) => state.setShippingAddress);
  const setLastOrder = useCartStore((state) => state.setLastOrder);
  const clearCart = useCartStore((state) => state.clearCart);
  const resetCheckout = useCartStore((state) => state.resetCheckout);
  const subtotal = useCartStore((state) => state.getSubtotal());
  const shipping = useCartStore((state) => state.getShipping());
  const tax = useCartStore((state) => state.getTax());
  const total = useCartStore((state) => state.getCartTotal());

  // Form states
  const [customerInfo, setLocalCustomerInfo] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [shippingAddress, setLocalShippingAddress] = useState<ShippingAddress>({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
  });

  // Validation functions
  const validateStep1 = () => {
    return (
      customerInfo.firstName.trim() !== "" &&
      customerInfo.lastName.trim() !== "" &&
      customerInfo.email.trim() !== "" &&
      customerInfo.phone.trim() !== ""
    );
  };

  const validateStep2 = () => {
    return (
      shippingAddress.street.trim() !== "" &&
      shippingAddress.city.trim() !== "" &&
      shippingAddress.state.trim() !== "" &&
      shippingAddress.zip.trim() !== ""
    );
  };

  // Step navigation
  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) {
      toast.error("Please fill in all customer information fields.");
      return;
    }
    if (currentStep === 2 && !validateStep2()) {
      toast.error("Please fill in all shipping address fields.");
      return;
    }

    if (currentStep < 3) {
      if (currentStep === 1) setCustomerInfo(customerInfo);
      if (currentStep === 2) setShippingAddress(shippingAddress);

      setCurrentStep((currentStep + 1) as Step);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const handleSubmitOrder = async () => {
    setIsSubmitting(true);

    try {
      const paystackPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

      if (!paystackPublicKey) {
        toast.error("Paystack public key is not configured.");
        setIsSubmitting(false);
        return;
      }

      // Store checkout data in Zustand store first
      setCustomerInfo(customerInfo);
      setShippingAddress(shippingAddress);

      // Create order data
      const orderData: Order = {
        id: createLocalOrderId(),
        items,
        customerInfo,
        shippingAddress,
        subtotal,
        shipping,
        tax,
        total,
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(
          Date.now() + 6 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      };
      setLastOrder(orderData);

      // Call Paystack initialize endpoint
      const response = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: customerInfo.email,
          amount: total,
          reference: orderData.id,
          customerInfo,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        toast.error(result.message || "Failed to initialize payment");
        setIsSubmitting(false);
        return;
      }

      // Check if Paystack is loaded
      if (!window.PaystackPop) {
        toast.error("Payment popup is still loading. Please try again in a moment.");
        setIsSubmitting(false);
        return;
      }

      const verifyPaystackPayment = async (reference: string) => {
        try {
          const verifyResponse = await fetch(
            `/api/payments/verify?reference=${reference}`,
          );
          const verifyResult = await verifyResponse.json();

          if (!verifyResult.success || verifyResult.status !== "success") {
            toast.error(
              verifyResult.message || "Payment could not be verified.",
            );
            setIsSubmitting(false);
            return;
          }

          toast.success("Payment successful!");
          clearCart();
          resetCheckout();
          router.push(
            `/order-confirmation?reference=${reference}&orderId=${orderData.id}&status=success`,
          );
        } catch (error) {
          console.error("Error verifying payment:", error);
          toast.error("Payment verification failed. Please contact support.");
          setIsSubmitting(false);
        }
      };

      // Initialize Paystack Pop modal
      const handler = window.PaystackPop.setup({
        key: paystackPublicKey,
        email: customerInfo.email,
        amount: result.amount,
        currency: "GHS",
        ref: result.reference,
        metadata: {
          orderId: orderData.id,
          customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
          customerPhone: customerInfo.phone,
        },
        onClose: () => {
          toast.error("Payment cancelled.");
          setIsSubmitting(false);
        },
        callback: function (response) {
          const reference = response.reference || result.reference;
          void verifyPaystackPayment(reference);
        },
      });

      handler.openIframe();
    } catch (error) {
      console.error("Error initializing payment:", error);
      toast.error("Failed to initialize payment. Please try again.");
      setIsSubmitting(false);
    }
  };
  const previousPressHandlers = usePressHandlers<HTMLButtonElement>(
    handlePrevious,
    {
      disabled: currentStep === 1,
    },
  );
  const nextPressHandlers = usePressHandlers<HTMLButtonElement>(handleNext);
  const submitOrderPressHandlers = usePressHandlers<HTMLButtonElement>(
    handleSubmitOrder,
    {
      disabled: isSubmitting || !isPaystackReady,
    },
  );

  // If cart is empty, redirect
  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-4">
            Cart is Empty
          </h1>
          <p className="text-slate-400 mb-6">
            You need to add items to your cart before checking out.
          </p>
          <Link
            href="/"
            className="inline-flex px-6 py-3 bg-amber-400 text-slate-950 font-semibold rounded-lg hover:bg-amber-300 transition-all duration-200"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Steps */}
          <div className="lg:col-span-2">
            {/* Step Indicator */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-8">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-200 ${
                        step < currentStep
                          ? "bg-emerald-500 text-white"
                          : step === currentStep
                            ? "bg-amber-400 text-slate-950"
                            : "bg-slate-800 text-slate-500"
                      }`}
                    >
                      {step < currentStep ? <Check size={20} /> : step}
                    </div>
                    <p className="text-xs text-slate-400 mt-2 text-center">
                      {step === 1 && "Information"}
                      {step === 2 && "Shipping"}
                      {step === 3 && "Payment"}
                    </p>
                  </div>
                ))}
              </div>

              {/* Step Line */}
              <div className="flex gap-2">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 h-1 rounded-full transition-all duration-200 ${
                      i < currentStep ? "bg-emerald-500" : "bg-slate-800"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="glass rounded-xl p-5 sm:p-8">
              {/* Step 1: Customer Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
                    Contact Information
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={customerInfo.firstName}
                        onChange={(e) =>
                          setLocalCustomerInfo({
                            ...customerInfo,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-slate-100 focus:outline-none focus:border-amber-400/50 transition-colors duration-200"
                        placeholder="John"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={customerInfo.lastName}
                        onChange={(e) =>
                          setLocalCustomerInfo({
                            ...customerInfo,
                            lastName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-slate-100 focus:outline-none focus:border-amber-400/50 transition-colors duration-200"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) =>
                        setLocalCustomerInfo({
                          ...customerInfo,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-slate-100 focus:outline-none focus:border-amber-400/50 transition-colors duration-200"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) =>
                        setLocalCustomerInfo({
                          ...customerInfo,
                          phone: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-slate-100 focus:outline-none focus:border-amber-400/50 transition-colors duration-200"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Shipping Address */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
                    Shipping Address
                  </h2>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.street}
                      onChange={(e) =>
                        setLocalShippingAddress({
                          ...shippingAddress,
                          street: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-slate-100 focus:outline-none focus:border-amber-400/50 transition-colors duration-200"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.city}
                        onChange={(e) =>
                          setLocalShippingAddress({
                            ...shippingAddress,
                            city: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-slate-100 focus:outline-none focus:border-amber-400/50 transition-colors duration-200"
                        placeholder="New York"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        State/Province
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.state}
                        onChange={(e) =>
                          setLocalShippingAddress({
                            ...shippingAddress,
                            state: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-slate-100 focus:outline-none focus:border-amber-400/50 transition-colors duration-200"
                        placeholder="NY"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        ZIP/Postal Code
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.zip}
                        onChange={(e) =>
                          setLocalShippingAddress({
                            ...shippingAddress,
                            zip: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-slate-100 focus:outline-none focus:border-amber-400/50 transition-colors duration-200"
                        placeholder="10001"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Country
                      </label>
                      <select
                        value={shippingAddress.country}
                        onChange={(e) =>
                          setLocalShippingAddress({
                            ...shippingAddress,
                            country: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-slate-100 focus:outline-none focus:border-amber-400/50 transition-colors duration-200"
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="Japan">Japan</option>
                        <option value="Mexico">Mexico</option>
                        <option value="Brazil">Brazil</option>
                        <option value="India">India</option>
                        <option value="China">China</option>
                        <option value="Singapore">Singapore</option>
                        <option value="New Zealand">New Zealand</option>
                        <option value="South Korea">South Korea</option>
                        <option value="Ghana">Ghana</option>
                        <option value="Nigeria">Nigeria</option>
                        <option value="Senegal">Senegal</option>
                        <option value="Cote d'Ivoire">
                          Cote d&apos;Ivoire
                        </option>
                        <option value="Kenya">Kenya</option>
                        <option value="Egypt">Egypt</option>
                        <option value="South Africa">South Africa</option>
                        <option value="Spain">Spain</option>
                        <option value="Italy">Italy</option>
                        <option value="Netherlands">Netherlands</option>
                        <option value="Sweden">Sweden</option>
                        <option value="Switzerland">Switzerland</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
                    Payment Method
                  </h2>

                  {/* Payment Method Selection */}
                  <div className="border border-amber-400/30 rounded-lg p-4 bg-amber-400/5">
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">
                        <input
                          type="radio"
                          id="paystack"
                          name="payment-method"
                          defaultChecked
                          disabled
                          className="w-4 h-4 cursor-not-allowed"
                        />
                      </div>
                      <div className="flex-1">
                        <label
                          htmlFor="paystack"
                          className="block text-sm font-semibold text-slate-100 cursor-not-allowed"
                        >
                          Paystack Payment
                        </label>
                        <p className="text-xs text-slate-400 mt-1">
                          Secure payment processing powered by Paystack. A
                          payment popup will open on this checkout page.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Review */}
                  <div className="space-y-4 border-t border-white/10 pt-6">
                    <h3 className="font-semibold text-slate-100">
                      Order Review
                    </h3>

                    <div className="space-y-3">
                      {items.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex justify-between text-sm text-slate-400"
                        >
                          <span>
                            {item.product.name} x {item.quantity}
                          </span>
                          <span>
                            GHS{" "}
                            {(
                              item.product.price * item.quantity
                            ).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-white/10 pt-3 space-y-2">
                      <div className="flex justify-between text-sm text-slate-400">
                        <span>Subtotal</span>
                        <span>GHS {subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm text-slate-400">
                        <span>Shipping</span>
                        <span>GHS {shipping.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm text-slate-400">
                        <span>Tax</span>
                        <span>GHS {tax.toLocaleString()}</span>
                      </div>
                      <div className="border-t border-white/10 pt-2 flex justify-between font-semibold text-slate-100">
                        <span>Total</span>
                        <span className="text-amber-300">
                          GHS {total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 p-3 bg-slate-900/50 rounded border border-white/5">
                    Your payment information is secure. Paystack will collect
                    your details in an inline popup without leaving checkout.
                  </p>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-white/10">
                <button
                  {...previousPressHandlers}
                  disabled={currentStep === 1}
                  className="flex-1 py-3 border border-white/10 text-slate-300 font-semibold rounded-lg hover:bg-slate-800/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 text-sm"
                >
                  <ChevronLeft size={18} />
                  <span>Previous</span>
                </button>

                {currentStep < 3 ? (
                  <button
                    {...nextPressHandlers}
                    className="flex-1 py-3 bg-amber-400 text-slate-950 font-semibold rounded-lg hover:bg-amber-300 transition-all duration-200 flex items-center justify-center space-x-2 text-sm"
                  >
                    <span>Next</span>
                    <ChevronRight size={18} />
                  </button>
                ) : (
                  <button
                    {...submitOrderPressHandlers}
                    disabled={isSubmitting || !isPaystackReady}
                    className="flex-1 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 text-sm"
                  >
                    <Check size={18} />
                    <span>
                      {isSubmitting
                        ? "Processing..."
                        : isPaystackReady
                          ? "Pay with Paystack"
                          : "Loading Paystack..."}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="glass rounded-xl p-6 h-fit sticky top-28">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">
              Order Summary
            </h3>

            <div className="space-y-3 mb-6 pb-6 border-b border-white/10 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex justify-between text-sm text-slate-400"
                >
                  <div>
                    <p className="text-slate-200 font-medium">
                      {item.product.name}
                    </p>
                    <p className="text-xs">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-slate-200 font-medium">
                    GHS{" "}
                    {(item.product.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>GHS {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping</span>
                <span>GHS {shipping.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tax</span>
                <span>GHS {tax.toLocaleString()}</span>
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between font-semibold text-slate-100">
                <span>Total</span>
                <span className="text-amber-300">
                  GHS {total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
