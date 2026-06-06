import { useState } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import { useAuthStore } from '../../stores/auth.store';
import { toast } from 'react-hot-toast';

const AccountDeletionPage = () => {
  const { user } = useAuthStore();
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Vui lòng nhập email');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate delay để giống API call thật
    setTimeout(() => {
      setShowSuccessModal(true);
      setEmail('');
      setReason('');
      setIsSubmitting(false);
    }, 800);

    // TODO: Uncomment this when backend API is ready
    /*
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/request-deletion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, reason }),
      });

      if (response.ok) {
        setShowSuccessModal(true);
        setEmail('');
        setReason('');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      toast.error('Không thể gửi yêu cầu. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
    */
  };

  const closeModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <PageLayout>
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative mx-4 w-full max-w-md animate-[scale-in_0.3s_ease-out] rounded-2xl bg-white p-8 shadow-2xl">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 text-gray-400 transition hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Success Icon with Animation */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-green-400 opacity-20"></div>
                <svg
                  className="relative h-20 w-20 animate-[bounce_1s_ease-in-out] text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="text-center">
              <h3 className="mb-3 text-2xl font-bold text-gray-900">
                Yêu Cầu Đã Được Gửi! ✓
              </h3>
              <p className="mb-2 text-base text-gray-600">
                Chúng tôi đã nhận được yêu cầu xóa tài khoản của bạn.
              </p>
              <p className="mb-6 text-sm text-gray-500">
                Bạn sẽ nhận được email xác nhận trong vòng <span className="font-semibold text-[#ad93e6]">24 giờ</span>. 
                Tài khoản sẽ bị xóa vĩnh viễn trong vòng <span className="font-semibold text-[#ad93e6]">7 ngày làm việc</span>.
              </p>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 rounded-lg bg-[#ad93e6] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#9b7fd4]"
                >
                  Đóng
                </button>
                <a
                  href="/"
                  className="flex-1 rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Về Trang Chủ
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto w-full max-w-[800px] px-4 py-16">
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#121212] md:text-4xl">
              Yêu Cầu Xóa Tài Khoản
            </h1>
            <p className="mt-2 text-sm text-[#737373] md:text-base">
              EZBias - Marketplace for K-pop Merchandise
            </p>
          </div>

          <div className="rounded-lg border border-[#e6e6e6] bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold text-[#121212]">
              Thông Tin Quan Trọng
            </h2>
            <div className="space-y-3 text-sm text-[#737373]">
              <p>
                Khi bạn yêu cầu xóa tài khoản EZBias, các dữ liệu sau sẽ bị xóa vĩnh viễn:
              </p>
              <ul className="list-inside list-disc space-y-2 pl-4">
                <li>Thông tin cá nhân (tên, email, số điện thoại, địa chỉ)</li>
                <li>Lịch sử đặt hàng và giao dịch</li>
                <li>Sản phẩm đã lưu và giỏ hàng</li>
                <li>Đánh giá và nhận xét</li>
                <li>Tin nhắn và thông báo</li>
              </ul>
              <p className="mt-4 font-medium text-[#121212]">
                Dữ liệu được giữ lại (tuân theo quy định pháp luật):
              </p>
              <ul className="list-inside list-disc space-y-2 pl-4">
                <li>Thông tin giao dịch tài chính (lưu trữ 5 năm theo quy định)</li>
                <li>Dữ liệu liên quan đến tranh chấp chưa giải quyết</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-[#e6e6e6] bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold text-[#121212]">
              Các Bước Xóa Tài Khoản
            </h2>
            <ol className="list-inside list-decimal space-y-3 text-sm text-[#737373]">
              <li>Điền email tài khoản của bạn vào form bên dưới</li>
              <li>Nêu lý do xóa tài khoản (không bắt buộc)</li>
              <li>Nhấn nút "Gửi Yêu Cầu"</li>
              <li>Bạn sẽ nhận email xác nhận trong vòng 24 giờ</li>
              <li>Tài khoản sẽ bị xóa vĩnh viễn trong vòng 7 ngày làm việc</li>
            </ol>
          </div>

          <form onSubmit={handleSubmit} className="rounded-lg border border-[#e6e6e6] bg-white p-6">
              <h2 className="mb-4 text-xl font-semibold text-[#121212]">
                Form Yêu Cầu Xóa Tài Khoản
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="mb-1 block text-sm font-medium text-[#121212]">
                    Email Tài Khoản <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={user?.email || 'your-email@example.com'}
                    className="w-full rounded-lg border border-[#e6e6e6] px-4 py-2 text-sm focus:border-[#ad93e6] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="reason" className="mb-1 block text-sm font-medium text-[#121212]">
                    Lý Do (Không bắt buộc)
                  </label>
                  <textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Vui lòng cho chúng tôi biết lý do bạn muốn xóa tài khoản..."
                    rows={4}
                    className="w-full rounded-lg border border-[#e6e6e6] px-4 py-2 text-sm focus:border-[#ad93e6] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-red-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? 'Đang Gửi...' : 'Gửi Yêu Cầu Xóa Tài Khoản'}
                </button>
              </div>
            </form>

          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
            <h3 className="mb-2 text-sm font-semibold text-yellow-900">
              ⚠️ Lưu Ý Quan Trọng
            </h3>
            <p className="text-sm text-yellow-800">
              Sau khi tài khoản bị xóa, bạn sẽ không thể khôi phục dữ liệu. Nếu bạn muốn tạm dừng sử dụng, 
              hãy cân nhắc tắt thông báo thay vì xóa tài khoản.
            </p>
          </div>

          <div className="text-center text-sm text-[#737373]">
            <p>
              Cần trợ giúp?{' '}
              <a href="/contact" className="text-[#ad93e6] hover:underline">
                Liên hệ với chúng tôi
              </a>
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AccountDeletionPage;
