import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUiStore } from '../../stores/ui.store';

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

const NewsletterCTA = () => {
  const showToast = useUiStore((s) => s.showToast);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterFormData>({ resolver: zodResolver(newsletterSchema) });

  const onSubmit = handleSubmit((data) => {
    showToast(`Subscribed ${data.email} — see you in the inbox`);
    reset();
  });

  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-20 pt-8">
      <div className="newsletter-bg relative overflow-hidden rounded-2xl border border-[rgba(230,230,230,0.5)] shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
        {/* Blur orbs */}
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[rgba(173,147,230,0.25)] blur-[60px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-28 -left-24 h-[360px] w-[360px] rounded-full bg-[rgba(147,183,230,0.22)] blur-[60px]"
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative mx-auto flex max-w-[720px] flex-col items-center gap-3 px-6 py-16 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.6px] text-[#ad93e6]">
            Join the Stan Squad
          </span>
          <h2 className="mt-1 text-[clamp(28px,3vw+8px,42px)] font-extrabold leading-[1.08] tracking-[-1.2px] text-[#121212] [text-wrap:balance]">
            Be First on Drops, Restocks &amp; Auctions
          </h2>
          <p className="max-w-[540px] text-[15px] leading-[1.6] text-[#737373]">
            A weekly newsletter for everything K-pop merch — early access, member-only listings,
            and bias picks. No spam, ever.
          </p>
          <form
            onSubmit={onSubmit}
            className="mt-4 flex w-full max-w-[480px] flex-col gap-2"
            aria-label="Newsletter signup"
          >
            <div className="flex w-full gap-2 max-sm:flex-col">
              <input
                type="email"
                placeholder="your@email.com"
                {...register('email')}
                className="h-11 flex-1 rounded-full border border-[#e6e6e6] bg-white px-[18px] text-sm text-[#121212] outline-none placeholder:text-[#b3b3b3] transition-all focus:border-[#ad93e6] focus:shadow-[0_0_0_3px_rgba(173,147,230,0.20)]"
              />
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center rounded-full bg-[#ad93e6] px-8 text-sm font-semibold text-white transition-colors hover:bg-[#9d7ed9] max-sm:w-full"
              >
                Join Free
              </button>
            </div>
            {errors.email && (
              <p className="text-center text-[12px] text-red-500">{errors.email.message}</p>
            )}
          </form>
          <p className="mt-3 text-[12px] text-[#737373]">
            Already 14,200+ fans · Unsubscribe anytime
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsletterCTA;
