/** Maps a human bank name to its VietQR bank code. Defaults to VCB. */
export function getBankCode(bankName: string | null): string {
  if (!bankName) return '';
  const name = bankName.toLowerCase();

  // Check specific bank names first before checking abbreviations to avoid false matches
  if (name.includes('vietcombank') || name.includes('vcb')) return 'VCB';
  if (name.includes('techcombank') || name.includes('tcb')) return 'TCB';
  if (name.includes('vietinbank') || name.includes('ctg')) return 'CTG';
  if (name.includes('agribank')) return 'AGR';
  if (name.includes('sacombank') || name.includes('stb')) return 'STB';
  if (name.includes('mbbank') || name.includes('mb')) return 'MB';
  if (name.includes('vpbank') || name.includes('vpb')) return 'VPB';
  if (name.includes('tpbank') || name.includes('tpb')) return 'TPB';
  if (name.includes('hdbank') || name.includes('hdb')) return 'HDB';
  if (name.includes('seabank') || name.includes('seab')) return 'SEAB';
  if (name.includes('bidv')) return 'BIDV';
  if (name.includes('acb')) return 'ACB';
  if (name.includes('vib')) return 'VIB';
  if (name.includes('ocb')) return 'OCB';
  if (name.includes('shb')) return 'SHB';

  return 'VCB';
}

interface VietQrParams {
  bankName: string | null;
  accountNumber: string | null;
  amount: number;
  addInfo: string;
}

/** Builds a VietQR image URL for a bank transfer to the given account. */
export function buildVietQrUrl({ bankName, accountNumber, amount, addInfo }: VietQrParams): string {
  const bankCode = getBankCode(bankName);
  const acc = accountNumber || '';
  return `https://img.vietqr.io/image/${bankCode}-${acc}-compact2.jpg?amount=${amount}&addInfo=${encodeURIComponent(addInfo)}`;
}
