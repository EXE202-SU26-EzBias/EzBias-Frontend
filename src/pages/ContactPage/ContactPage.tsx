import { useState } from 'react';
import PageLayout from '../../components/layout/PageLayout';

const inputClass =
  'w-full rounded-xl border border-[#e6e6e6] bg-white px-4 py-2.5 text-sm text-[#121212] outline-none transition focus:border-[#ad93e6] focus:ring-2 focus:ring-[rgba(173,147,230,0.2)]';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    // TODO: integrate with API
    setSubmitting(false);
  };

  return (
    <PageLayout>
      <div className="mx-auto w-full max-w-[560px] px-4 py-10 md:py-16">
        <div className="mb-8 flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-[#121212] md:text-3xl">Contact Us</h1>
          <p className="text-sm text-[#737373]">Have a question? We&apos;d love to hear from you.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5" noValidate>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-name" className="text-sm font-medium text-[#121212]">
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-email" className="text-sm font-medium text-[#121212]">
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-message" className="text-sm font-medium text-[#121212]">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              placeholder="How can we help?"
              rows={5}
              value={form.message}
              onChange={handleChange}
              className={`${inputClass} resize-none`}
            />
          </div>

          {error && (
            <div className="rounded-lg border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#ef4343]">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3 text-sm text-[#166534]">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex h-11 w-full items-center justify-center rounded-full bg-[#ad93e6] text-sm font-semibold text-white transition-colors hover:bg-[#9d7ed9] disabled:opacity-60"
          >
            {submitting ? 'Sending…' : 'Send Message'}
          </button>
        </form>
      </div>
    </PageLayout>
  );
};

export default ContactPage;
