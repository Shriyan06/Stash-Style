"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { site } from "@/config/site";
import { cn } from "@/lib/cn";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Email capture. Honest by design:
 * - with `site.newsletterAction` set, it posts to that endpoint
 * - without it, it says sign-ups aren't open yet rather than pretending to subscribe
 */
export function NewsletterForm({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "invalid" | "sending" | "done" | "error" | "unconnected">("idle");
  const dark = tone === "dark";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    // honeypot
    if ((form.elements.namedItem("company") as HTMLInputElement | null)?.value) return;
    if (!EMAIL_RE.test(email.trim())) {
      setState("invalid");
      return;
    }
    if (!site.newsletterAction) {
      setState("unconnected");
      return;
    }
    setState("sending");
    try {
      await fetch(site.newsletterAction, {
        method: "POST",
        mode: "no-cors",
        body: new FormData(form),
      });
      setState("done");
    } catch {
      setState("error");
    }
  }

  const msgId = `${id}-msg`;
  const message = {
    idle: null,
    sending: null,
    invalid: "Enter an email address like name@example.com.",
    done: "You're on the list. Watch your inbox for new collections.",
    error: "That didn't go through. Check your connection and try again.",
    unconnected: `Sign-ups open when the store launches. Until then, follow ${site.socialHandle} for new pieces.`,
  }[state];

  return (
    <form onSubmit={onSubmit} noValidate className={cn("w-full", className)}>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor={id} className="sr-only">
          Email address
        </label>
        <input
          id={id}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          placeholder="Your email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "invalid") setState("idle");
          }}
          aria-invalid={state === "invalid" || undefined}
          aria-describedby={msgId}
          className={cn(
            "field flex-1 rounded-full! px-5",
            dark && "border-bg/40 bg-transparent text-bg placeholder:text-bg/70 hover:border-bg",
          )}
        />
        {/* Honeypot: hidden from people, tempting to bots */}
        <div aria-hidden="true" className="absolute -left-[9999px]">
          <label>
            Company
            <input type="text" name="company" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <Button type="submit" variant={dark ? "light" : "primary"} loading={state === "sending"}>
          Sign up
        </Button>
      </div>
      <p
        id={msgId}
        role={state === "invalid" || state === "error" ? "alert" : "status"}
        className={cn(
          "mt-2 min-h-[1.5em] text-sm",
          state === "invalid" || state === "error"
            ? dark
              ? "text-[#FFB4AB]"
              : "text-danger"
            : dark
              ? "text-bg/80"
              : "text-muted",
        )}
      >
        {message ?? "No spam. Unsubscribe anytime."}
      </p>
    </form>
  );
}
