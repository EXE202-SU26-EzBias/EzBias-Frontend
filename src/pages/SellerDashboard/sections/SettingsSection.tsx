import React from 'react';
import { useUserProfileForm } from '../../../features/seller/useUserProfileForm';
import SellerTopbar from '../SellerTopbar';

const inputCls =
  'h-10 w-full rounded-lg border border-[#e6e6e6] bg-white px-3 text-[13px] text-[#121212] outline-none transition focus:border-[#ad93e6] focus:ring-1 focus:ring-[rgba(173,147,230,0.20)]';

const readOnlyCls =
  'flex h-10 items-center rounded-lg border border-[#e6e6e6] bg-[#fafafa] px-3 text-[13px] text-[#737373] truncate';

const labelCls = 'text-[11px] font-bold uppercase tracking-[0.5px] text-[#737373]';

const cardCls =
  'bg-white border border-[rgba(230,230,230,0.5)] rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] mb-6';

const cardHeaderCls =
  'px-5 py-[18px] border-b border-[rgba(230,230,230,0.5)]';

const SettingsSection = React.memo(function SettingsSection() {
  const { register, onSubmit, errors, isPending, isLoading, isError, profile } = useUserProfileForm();

  if (isLoading) {
    return (
      <div>
        <SellerTopbar title="User profile" sub="Manage your account details" />
        <p className="text-[14px] text-[#737373]">Loading…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <SellerTopbar title="User profile" sub="Manage your account details" />
        <p className="text-[14px] text-[#ef4343]">Failed to load profile. Please try again.</p>
      </div>
    );
  }

  return (
    <div>
      <SellerTopbar title="User profile" sub="Manage your account details" />

      <form onSubmit={onSubmit} noValidate>
        {/* Personal info */}
        <div className={cardCls}>
          <div className={cardHeaderCls}>
            <h2 className="text-[16px] font-bold text-[#121212] m-0">Personal information</h2>
            <p className="text-[12px] text-[#737373] mt-0.5 mb-0">Your name, contact, and address</p>
          </div>

          <div className="p-5 flex flex-col gap-4">
            {/* Avatar row */}
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full grid place-items-center text-white text-[16px] font-bold flex-shrink-0"
                style={{ backgroundColor: profile?.avatarBg ?? '#ad93e6' }}
              >
                {profile?.avatarUrl
                  ? <img src={profile.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
                  : (profile?.fullName?.[0] ?? profile?.username?.[0] ?? '?').toUpperCase()
                }
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#121212] m-0">{profile?.fullName || profile?.username}</p>
                <p className="text-[12px] text-[#737373] m-0">{profile?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 max-[700px]:grid-cols-1">
              <label className="flex flex-col gap-1.5">
                <span className={labelCls}>Full name</span>
                <input type="text" className={inputCls} {...register('fullName')} />
                {errors.fullName && <span className="text-[11px] text-[#ef4343]">{errors.fullName.message}</span>}
              </label>

              <label className="flex flex-col gap-1.5">
                <span className={labelCls}>Username</span>
                <span className={readOnlyCls}>{profile?.username}</span>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className={labelCls}>Email</span>
                <span className={readOnlyCls}>{profile?.email}</span>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className={labelCls}>Phone</span>
                <input type="tel" className={inputCls} {...register('phone')} />
              </label>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className={labelCls}>Address</span>
              <input type="text" className={inputCls} {...register('address')} />
            </label>

            <div className="grid grid-cols-2 gap-4 max-[700px]:grid-cols-1">
              <label className="flex flex-col gap-1.5">
                <span className={labelCls}>City</span>
                <input type="text" className={inputCls} {...register('city')} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={labelCls}>ZIP code</span>
                <input type="text" className={inputCls} {...register('zip')} />
              </label>
            </div>
          </div>
        </div>

        {/* Bank details */}
        <div className={cardCls}>
          <div className={cardHeaderCls}>
            <h2 className="text-[16px] font-bold text-[#121212] m-0">Bank details</h2>
            <p className="text-[12px] text-[#737373] mt-0.5 mb-0">Used for payout transfers</p>
          </div>

          <div className="p-5 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className={labelCls}>Bank name</span>
              <input type="text" className={inputCls} {...register('bankName')} />
            </label>

            <div className="grid grid-cols-2 gap-4 max-[700px]:grid-cols-1">
              <label className="flex flex-col gap-1.5">
                <span className={labelCls}>Account number</span>
                <input type="text" className={inputCls} {...register('bankAccountNumber')} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={labelCls}>Account name</span>
                <input type="text" className={inputCls} {...register('bankAccountName')} />
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="h-9 px-5 rounded-lg bg-[#ad93e6] text-white text-[13px] font-semibold hover:bg-[#9d7ed9] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
});

export default SettingsSection;
