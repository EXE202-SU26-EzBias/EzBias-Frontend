export interface ParsedAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
}

export function parseAddressSnap(raw: string): ParsedAddress {
  let snap: Record<string, string> = {};
  try {
    snap = JSON.parse(raw);
  } catch {
    /* malformed — fall through to defaults */
  }
  return {
    name: snap.Fullname ?? snap.fullname ?? '—',
    phone: snap.Phone ?? snap.phone ?? '—',
    address: snap.Address ?? snap.address ?? '—',
    city: snap.City ?? snap.city ?? '—',
    zip: snap.Zip ?? snap.zip ?? '—',
  };
}
