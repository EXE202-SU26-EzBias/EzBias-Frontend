interface PlaceOrderButtonProps {
  isReady: boolean;
  isSubmitting: boolean;
}

const PlaceOrderButton = ({ isReady, isSubmitting }: PlaceOrderButtonProps) => (
  <div className="flex flex-col items-center gap-2">
    <button
      type="submit"
      disabled={!isReady || isSubmitting}
      className="w-full rounded-xl bg-[#9b84ec] py-3 text-[14px] font-semibold text-white transition-all hover:bg-[#8a72db] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isSubmitting ? (
        <span className="flex items-center justify-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          Placing Order…
        </span>
      ) : (
        'Place Order'
      )}
    </button>
    {!isReady && (
      <p className="text-center text-[11px] text-[#737373]">
        Fill in shipping details and select a payment method to continue.
      </p>
    )}
  </div>
);

export default PlaceOrderButton;
