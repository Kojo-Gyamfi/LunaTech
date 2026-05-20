"use client";

import { useState } from "react";
import { CheckCircle, Mail, MessageSquare, Phone } from "lucide-react";

export default function SupportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    setSubmitted(false);
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          topic: formData.get("topic"),
          message: formData.get("message"),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Failed to send message.");
      }

      setSubmitted(true);
      form.reset();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to send message.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950">
      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-amber-200/70">
            Support
          </p>
          <h1 className="mb-5 text-3xl font-bold text-slate-100 sm:text-4xl">
            Product help, order questions, and concierge support.
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
            Send a message and the LunaTech team will follow up with order,
            return, or product guidance.
          </p>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-4">
            {[
              {
                icon: Mail,
                label: "Email",
                value: "emmanuelnanagyamfi@gmail.com",
              },
              { icon: Phone, label: "Phone", value: "+233 559 038 128" },
              {
                icon: MessageSquare,
                label: "Live Desk",
                value: "Mon-Fri, 9 AM-6 PM",
              },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="glass rounded-lg p-5">
                <Icon className="mb-3 text-amber-300" size={24} />
                <p className="text-sm font-semibold text-slate-100">{label}</p>
                <p className="text-sm text-slate-400">{value}</p>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            className="glass rounded-lg p-5 sm:p-6 lg:col-span-2"
          >
            {submitted && (
              <div className="mb-5 flex items-center gap-3 rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-300">
                <CheckCircle size={18} />
                Message sent. We will respond shortly.
              </div>
            )}

            {errorMessage && (
              <div className="mb-5 rounded-lg border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-slate-300">
                Name
                <input
                  required
                  name="name"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900/50 px-4 py-2 text-sm text-slate-100 outline-none focus:border-amber-300/50"
                  placeholder="Your name"
                />
              </label>
              <label className="text-sm font-semibold text-slate-300">
                Email
                <input
                  required
                  type="email"
                  name="email"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900/50 px-4 py-2 text-sm text-slate-100 outline-none focus:border-amber-300/50"
                  placeholder="you@example.com"
                />
              </label>
            </div>

            <label className="mt-4 block text-sm font-semibold text-slate-300">
              Topic
              <select
                name="topic"
                className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900/50 px-4 py-2 text-sm text-slate-100 outline-none focus:border-amber-300/50"
              >
                <option>Order status</option>
                <option>Returns</option>
                <option>Product recommendation</option>
                <option>Warranty</option>
              </select>
            </label>

            <label className="mt-4 block text-sm font-semibold text-slate-300">
              Message
              <textarea
                required
                name="message"
                rows={6}
                className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-slate-900/50 px-4 py-3 text-sm text-slate-100 outline-none focus:border-amber-300/50"
                placeholder="How can we help?"
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-5 rounded-lg bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-300 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
