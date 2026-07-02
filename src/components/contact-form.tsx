"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";

type FormState = "idle" | "submitting" | "success" | "error" | "missing-key";

export function ContactForm({ fallbackEmail }: { fallbackEmail: string }) {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);

    if (formData.get("botcheck")) {
      return;
    }

    if (!accessKey) {
      setState("missing-key");
      setMessage(`This form is ready for delivery. For now, please email ${fallbackEmail}.`);
      return;
    }

    setState("submitting");
    setMessage("");

    try {
      const payload = Object.fromEntries(formData.entries());
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...payload,
          access_key: accessKey,
          subject: "New inquiry from Climate Assets Exchange website",
          from_name: "Climate Assets Exchange Website",
        }),
      });

      const result = (await response.json()) as { success?: boolean; message?: string };

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Submission failed");
      }

      form.reset();
      setState("success");
      setMessage("Thank you. Your inquiry has been sent successfully.");
    } catch {
      setState("error");
      setMessage(`The form could not send right now. Please email ${fallbackEmail}.`);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-6 rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm md:p-8"
    >
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />
      
      <div className="grid gap-6 md:grid-cols-2">
        <label className="grid gap-2 text-xs font-bold uppercase tracking-wider text-[color:var(--forest)]/70">
          Name
          <input
            required
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Jane Doe"
            className="h-12 w-full rounded-xl border border-[var(--line)] bg-[var(--background)]/30 px-4 text-base font-medium outline-none transition focus:border-[var(--mint-2)] focus:ring-1 focus:ring-[var(--mint-2)] focus:bg-white"
          />
        </label>
        <label className="grid gap-2 text-xs font-bold uppercase tracking-wider text-[color:var(--forest)]/70">
          Company
          <input
            type="text"
            name="company"
            autoComplete="organization"
            placeholder="Enterprise Carbon Corp"
            className="h-12 w-full rounded-xl border border-[var(--line)] bg-[var(--background)]/30 px-4 text-base font-medium outline-none transition focus:border-[var(--mint-2)] focus:ring-1 focus:ring-[var(--mint-2)] focus:bg-white"
          />
        </label>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <label className="grid gap-2 text-xs font-bold uppercase tracking-wider text-[color:var(--forest)]/70">
          Email
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            placeholder="jane@company.com"
            className="h-12 w-full rounded-xl border border-[var(--line)] bg-[var(--background)]/30 px-4 text-base font-medium outline-none transition focus:border-[var(--mint-2)] focus:ring-1 focus:ring-[var(--mint-2)] focus:bg-white"
          />
        </label>
        <label className="grid gap-2 text-xs font-bold uppercase tracking-wider text-[color:var(--forest)]/70">
          Phone Number
          <input
            type="tel"
            name="phone"
            autoComplete="tel"
            placeholder="+1 (555) 019-2834"
            className="h-12 w-full rounded-xl border border-[var(--line)] bg-[var(--background)]/30 px-4 text-base font-medium outline-none transition focus:border-[var(--mint-2)] focus:ring-1 focus:ring-[var(--mint-2)] focus:bg-white"
          />
        </label>
      </div>

      <label className="grid gap-2 text-xs font-bold uppercase tracking-wider text-[color:var(--forest)]/70">
        Message
        <textarea
          required
          name="message"
          rows={5}
          placeholder="Describe your origination or procurement needs..."
          className="w-full resize-none rounded-xl border border-[var(--line)] bg-[var(--background)]/30 px-4 py-3 text-base font-medium outline-none transition focus:border-[var(--mint-2)] focus:ring-1 focus:ring-[var(--mint-2)] focus:bg-white"
        />
      </label>

      <button
        type="submit"
        disabled={state === "submitting"}
        className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[var(--forest)] px-7 py-4 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[var(--forest-2)] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state === "submitting" ? "Sending..." : "Send Inquiry"}
        <Send size={14} />
      </button>

      {message ? (
        <div
          className={`rounded-xl border p-4 text-xs font-semibold leading-relaxed ${
            state === "success"
              ? "border-[var(--mint-2)] bg-[var(--mint)] text-[color:var(--forest)]"
              : state === "missing-key"
              ? "border-[var(--gold)]/20 bg-[var(--gold)]/10 text-[color:var(--gold)]"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
          role="status"
        >
          {message}
        </div>
      ) : null}
    </form>
  );
}
