"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type Field = "name" | "email" | "order" | "message";
type Errors = Partial<Record<Field, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v: Record<Field, string>): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = "Enter your name.";
  if (!EMAIL_RE.test(v.email.trim())) e.email = "Enter an email address like name@example.com.";
  if (v.message.trim().length < 10) e.message = "Write a message of at least 10 characters.";
  return e;
}

/**
 * No backend: on submit it opens the visitor's email app with the message filled in,
 * addressed to config.supportEmail.
 */
export function ContactForm({ to }: { to: string }) {
  const [values, setValues] = useState<Record<Field, string>>({ name: "", email: "", order: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "opened" | "error">("idle");

  const set = (k: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if ((e.currentTarget.elements.namedItem("website") as HTMLInputElement | null)?.value) return; // honeypot
    const errs = validate(values);
    setErrors(errs);
    const first = (Object.keys(errs) as Field[])[0];
    if (first) {
      document.getElementById(`contact-${first}`)?.focus();
      return;
    }
    const subject = `Message from ${values.name.trim()}${values.order.trim() ? ` (order ${values.order.trim()})` : ""}`;
    const body = `${values.message.trim()}\n\n${values.name.trim()}\n${values.email.trim()}${values.order.trim() ? `\nOrder: ${values.order.trim()}` : ""}`;
    try {
      window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus("opened");
    } catch {
      setStatus("error");
    }
  }

  const input = (
    k: Field,
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement> = {},
    optional = false,
  ) => (
    <div>
      <label htmlFor={`contact-${k}`} className="text-[0.9375rem] font-medium">
        {label} {optional && <span className="font-normal text-muted">(optional)</span>}
      </label>
      <input
        id={`contact-${k}`}
        name={k}
        value={values[k]}
        onChange={set(k)}
        aria-invalid={errors[k] ? true : undefined}
        aria-describedby={errors[k] ? `contact-${k}-err` : undefined}
        className="field mt-2"
        {...props}
      />
      {errors[k] && (
        <p id={`contact-${k}-err`} className="mt-1.5 text-sm text-danger">
          {errors[k]}
        </p>
      )}
    </div>
  );

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {input("name", "Name", { autoComplete: "name", required: true })}
        {input("email", "Email", { type: "email", autoComplete: "email", inputMode: "email", required: true })}
      </div>
      {input("order", "Order number", { autoComplete: "off" }, true)}
      <div>
        <label htmlFor="contact-message" className="text-[0.9375rem] font-medium">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          value={values.message}
          onChange={set("message")}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "contact-message-err" : undefined}
          className="field mt-2 resize-y"
          required
        />
        {errors.message && (
          <p id="contact-message-err" className="mt-1.5 text-sm text-danger">
            {errors.message}
          </p>
        )}
      </div>
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <Button type="submit">Send message</Button>
      <p role="status" className={cn("text-sm", status === "error" ? "text-danger" : "text-muted")}>
        {status === "opened" &&
          `Your email app should open with your message ready to send. If nothing happened, email us directly at ${to}.`}
        {status === "error" && `Your email app didn't open. Email us directly at ${to}.`}
      </p>
    </form>
  );
}
