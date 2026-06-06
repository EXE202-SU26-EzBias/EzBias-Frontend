import { useEffect, useState, type ReactNode } from 'react';
import PageLayout from '../../components/layout/PageLayout';

const LAST_UPDATED = 'June 2026';

interface PrivacySectionData {
  id: string;
  number: number;
  title: string;
  content: ReactNode;
}

function P({ children }: { children: ReactNode }) {
  return <p className="mt-3 text-sm leading-7 text-[#737373] md:text-base">{children}</p>;
}

function UL({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 flex list-disc flex-col gap-1 pl-5 text-sm leading-7 text-[#737373] md:text-base">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function EmailLink({ email }: { email: string }) {
  return (
    <a
      href={`mailto:${email}`}
      className="text-[#ad93e6] underline underline-offset-2 transition-colors hover:text-[#9d7ed9]"
    >
      {email}
    </a>
  );
}

const SECTIONS: PrivacySectionData[] = [
  {
    id: 'intro',
    number: 1,
    title: 'Introduction',
    content: (
      <>
        <P>
          EzBias ("we," "our," or "us") operates a K-pop merchandise marketplace and auction platform available as a
          mobile application and web application (collectively, the "Service"). This Privacy Policy explains how we
          collect, use, store, and share information about you when you use our Service.
        </P>
        <P>
          By creating an account or using EzBias, you acknowledge that you have read and understood this Privacy Policy.
          If you do not agree with these practices, please discontinue use of the Service.
        </P>
        <P>
          This policy applies to all users of EzBias, including buyers, sellers, and visitors. Any authenticated user
          may both buy and sell on the platform.
        </P>
      </>
    ),
  },
  {
    id: 'info',
    number: 2,
    title: 'Information We Collect',
    content: (
      <>
        <P>
          We collect information you provide directly and information generated automatically through your use of the
          Service.
        </P>
        <p className="mt-4 text-sm font-semibold text-[#121212] md:text-base">Information you provide:</p>
        <UL
          items={[
            'Full name and display name',
            'Email address',
            'Phone number (optional, if provided)',
            'Profile photo or avatar',
            'Product listing images and descriptions',
            'Images and files shared in chat messages',
            'Chat message content',
            'Shipping address and order details entered at checkout',
          ]}
        />
        <p className="mt-4 text-sm font-semibold text-[#121212] md:text-base">Information collected automatically:</p>
        <UL
          items={[
            'An authenticated WebSocket connection identifier used to deliver real-time in-app notifications while you are actively using the Service',
            'Device model, operating system, and app version',
            'IP address and general location (country/region)',
            'App usage logs, crash reports, and technical diagnostics',
            'Session identifiers and authentication tokens',
          ]}
        />
      </>
    ),
  },
  {
    id: 'use',
    number: 3,
    title: 'How We Use Information',
    content: (
      <>
        <P>We use the information we collect for the following purposes:</P>
        <UL
          items={[
            'To create and manage your account',
            'To process transactions, orders, and auction bids',
            'To facilitate communication between buyers and sellers via in-app chat',
            'To send transactional notifications (order updates, bid confirmations, payment status)',
            'To send promotional or feature update notifications (only with your consent)',
            'To improve, maintain, and debug the platform',
            'To detect and prevent fraud, abuse, and policy violations',
            'To respond to your support requests',
            'To comply with applicable laws and legal obligations',
          ]}
        />
        <P>
          We do not use your personal information for automated profiling or decision-making that produces legal or
          similarly significant effects without your knowledge.
        </P>
      </>
    ),
  },
  {
    id: 'ugc',
    number: 4,
    title: 'User-Generated Content',
    content: (
      <>
        <P>
          EzBias allows users to upload images for product listings and to share images and messages within in-app chat.
          By uploading content, you grant EzBias a non-exclusive, worldwide license to store, display, and transmit that
          content as necessary to operate the Service.
        </P>
        <P>
          Uploaded images and chat messages are stored on our secure servers. We do not sell user-generated content to
          third parties. Content may be reviewed by our moderation team to enforce our Community Guidelines.
        </P>
        <P>
          You are responsible for ensuring that any content you upload does not violate the privacy rights of others. Do
          not upload images that include identifiable personal information about third parties without their consent.
        </P>
        <P>
          When you delete a listing or message, we will remove the content from public display. Residual copies may
          persist in backups for a limited period before being permanently purged.
        </P>
      </>
    ),
  },
  {
    id: 'payments',
    number: 5,
    title: 'Payments',
    content: (
      <>
        <P>
          EzBias processes payments via bank transfer using SePay, a third-party payment processor. When you complete a
          purchase or deposit, your transaction is handled through SePay's infrastructure.
        </P>
        <P>
          <strong className="text-[#121212]">
            EzBias does not store, transmit, or have access to your bank account credentials, card numbers, or other
            sensitive financial credentials.
          </strong>{' '}
          Payment authentication is performed directly by your bank or by SePay.
        </P>
        <P>
          SePay may collect and process payment information in accordance with their own privacy policy. We recommend
          reviewing SePay's privacy documentation to understand how your financial data is handled on their platform.
        </P>
        <P>
          We retain records of completed transaction amounts, order identifiers, and payment status for accounting,
          dispute resolution, and legal compliance purposes.
        </P>
      </>
    ),
  },
  {
    id: 'push',
    number: 6,
    title: 'Real-Time Notifications',
    content: (
      <>
        <P>
          EzBias delivers real-time notifications to you while you are actively using the app through a secure WebSocket
          connection powered by SignalR, a protocol running on EzBias's own backend servers.
        </P>
        <P>
          Notifications are sent for the following events: you have been outbid on an auction, an auction you are
          participating in is ending soon, a deposit has been confirmed or a refund initiated, and a payout has been
          processed.
        </P>
        <P>
          Because notifications are delivered over your existing authenticated session connection, no separate push
          notification token or device identifier is collected. Notifications are only received while the app is open
          and connected — they are not delivered as OS-level background push notifications when the app is closed.
        </P>
        <P>
          To stop receiving real-time notifications, you may log out of your account or close the app. No additional
          opt-out configuration is required.
        </P>
      </>
    ),
  },
  {
    id: 'sharing',
    number: 7,
    title: 'Data Sharing',
    content: (
      <>
        <P>
          We do not sell your personal information. We share data only in the limited circumstances described below:
        </P>
        <p className="mt-4 text-sm font-semibold text-[#121212] md:text-base">Third-party service providers:</p>
        <UL items={['SePay — payment processing and transaction webhooks']} />
        <P>
          SePay processes payment data only as necessary to complete your transactions and is bound by applicable
          financial data protection obligations.
        </P>
        <p className="mt-4 text-sm font-semibold text-[#121212] md:text-base">Legal and safety disclosures:</p>
        <P>
          We may disclose your information if required by law, court order, or governmental authority, or when we
          believe disclosure is necessary to protect the rights, property, or safety of EzBias, our users, or the
          public.
        </P>
        <p className="mt-4 text-sm font-semibold text-[#121212] md:text-base">Business transfers:</p>
        <P>
          In the event of a merger, acquisition, or sale of assets, user data may be transferred as part of that
          transaction. We will notify affected users before their data is subject to a materially different privacy
          policy.
        </P>
      </>
    ),
  },
  {
    id: 'retention',
    number: 8,
    title: 'Data Retention',
    content: (
      <>
        <P>
          We retain your personal information for as long as your account remains active or as needed to provide the
          Service. Specifically:
        </P>
        <UL
          items={[
            'Account data (name, email, profile) is retained while your account is active',
            'Order and transaction records are retained for up to 5 years for accounting and legal compliance',
            'Chat messages and uploaded images are retained until you delete them or delete your account',
            'Technical logs and crash reports are retained for up to 90 days',
            'Push notification tokens are removed when you disable notifications or delete your account',
          ]}
        />
        <P>
          When you request account deletion, we will delete or anonymize your personal data within 90 days, except where
          retention is required by applicable law or for legitimate business purposes such as fraud prevention or
          dispute resolution.
        </P>
      </>
    ),
  },
  {
    id: 'security',
    number: 9,
    title: 'Data Security',
    content: (
      <>
        <P>
          We implement industry-standard technical and organizational measures to protect your personal information,
          including:
        </P>
        <UL
          items={[
            'HTTPS/TLS encryption for all data in transit between the app and our servers',
            'Token-based authentication (Bearer tokens) for all authenticated API requests',
            'Automatic session termination and token invalidation on logout',
            'Server-side access controls limiting which team members can access user data',
            'Regular security reviews of our backend infrastructure',
          ]}
        />
        <P>
          While we take reasonable steps to protect your data, no security system is completely impenetrable. We cannot
          guarantee the absolute security of your information. In the event of a data breach that affects your rights
          and freedoms, we will notify you and relevant authorities as required by applicable law.
        </P>
        <P>
          You are responsible for keeping your account credentials confidential. Do not share your password with anyone,
          and contact us immediately at <EmailLink email="ezbiasvietnam@gmail.com" /> if you believe your account has
          been compromised.
        </P>
      </>
    ),
  },
  {
    id: 'children',
    number: 10,
    title: "Children's Privacy",
    content: (
      <>
        <P>
          EzBias is not directed at children under the age of 13. We do not knowingly collect personal information from
          children under 13. If you are under 13, please do not use our Service or provide any personal information to
          us.
        </P>
        <P>
          If we become aware that we have inadvertently collected personal information from a child under 13, we will
          take prompt steps to delete such information from our records and deactivate the associated account.
        </P>
        <P>
          If you are a parent or guardian and believe your child has provided personal information to us without your
          consent, please contact us at <EmailLink email="ezbiasvietnam@gmail.com" /> so we can take appropriate action.
        </P>
      </>
    ),
  },
  {
    id: 'rights',
    number: 11,
    title: 'User Rights and Data Deletion',
    content: (
      <>
        <P>Depending on your location, you may have the following rights regarding your personal information:</P>
        <UL
          items={[
            'Right to access — request a copy of the personal data we hold about you',
            'Right to correction — request that inaccurate or incomplete data be corrected',
            'Right to deletion — request that we delete your personal data ("right to be forgotten")',
            'Right to portability — request your data in a portable, machine-readable format',
            'Right to object — object to certain types of processing such as direct marketing',
            'Right to withdraw consent — withdraw consent for processing where consent is the legal basis',
          ]}
        />
        <P>
          To exercise any of these rights, please email us at <EmailLink email="ezbiasvietnam@gmail.com" /> with the
          subject line "Data Request" and describe your request clearly. We will respond within 30 days.
        </P>
        <P>
          To delete your account, you may use the account deletion option within the app settings, or send a deletion
          request to the email address above. Account deletion will remove your profile, listings, and personal data as
          described in the Data Retention section.
        </P>
        <P>
          Note that certain data (e.g., transaction records) may be retained after account deletion as required by law
          or for legitimate business purposes such as resolving open disputes.
        </P>
      </>
    ),
  },
  {
    id: 'contact',
    number: 12,
    title: 'Contact Us',
    content: (
      <>
        <P>
          If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your personal
          data, please contact us:
        </P>
        <div className="mt-4 rounded-2xl border border-[#e6e6e6] bg-white px-6 py-5">
          <p className="text-sm font-semibold text-[#121212]">EzBias Support</p>
          <p className="mt-1 text-sm text-[#737373]">
            Email: <EmailLink email="ezbiasvietnam@gmail.com" />
          </p>
          <p className="mt-1 text-sm text-[#737373]">
            We aim to respond to all privacy-related inquiries within 30 business days.
          </p>
        </div>
        <P>
          This Privacy Policy was last updated on <span className="font-medium text-[#121212]">{LAST_UPDATED}</span>. We
          may update this policy from time to time. When we make material changes, we will notify you via in-app
          notification or email. Continued use of the Service after such changes constitutes acceptance of the updated
          policy.
        </P>
      </>
    ),
  },
];

function PrivacySection({ id, number, title, content }: PrivacySectionData) {
  return (
    <section id={id} className="scroll-mt-[85px]">
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[rgba(173,147,230,0.12)] text-sm font-bold text-[#ad93e6]">
          {number}
        </span>
        <h2 className="text-xl font-bold text-[#121212] md:text-2xl">{title}</h2>
      </div>
      <div className="mt-3">{content}</div>
    </section>
  );
}

export default function PrivacyPolicyPage() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <PageLayout>
      <div className="mx-auto w-full max-w-[1400px] px-4 py-16">
        {/* Page heading */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[#121212] md:text-4xl">Privacy Policy</h1>
          <p className="mt-1.5 text-sm text-[#737373]">Last Updated: {LAST_UPDATED}</p>
        </div>

        {/* Mobile inline TOC */}
        <details className="mb-8 rounded-2xl border border-[#e6e6e6] bg-white px-4 py-3 lg:hidden">
          <summary className="cursor-pointer select-none text-sm font-semibold text-[#121212]">
            Table of Contents
          </summary>
          <ol className="mt-3 flex list-none flex-col gap-1.5 pl-2">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-sm text-[#737373] transition-colors hover:text-[#ad93e6]">
                  {s.number}. {s.title}
                </a>
              </li>
            ))}
          </ol>
        </details>

        {/* Body: sidebar + article */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
          {/* Desktop sticky TOC */}
          <aside className="hidden shrink-0 lg:block lg:w-56 xl:w-64">
            <div className="sticky top-[85px] max-h-[calc(100vh-105px)] overflow-y-auto">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#737373]">Contents</p>
              <nav aria-label="Privacy policy sections">
                <ol className="flex list-none flex-col gap-0.5">
                  {SECTIONS.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="block border-l-2 border-transparent py-1.5 pl-3 text-sm text-[#737373] transition-colors hover:border-[#ad93e6] hover:text-[#121212]"
                      >
                        {s.number}. {s.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
          </aside>

          {/* Article */}
          <article className="min-w-0 max-w-3xl flex-1">
            <div className="flex flex-col divide-y divide-[#e6e6e6]">
              {SECTIONS.map((s) => (
                <div key={s.id} className="py-10 first:pt-0">
                  <PrivacySection {...s} />
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-[#ad93e6] text-white shadow-md transition-all hover:bg-[#9d7ed9] ${
          showTop ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>
    </PageLayout>
  );
}
