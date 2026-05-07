

// ============================================================
// ENUMS
// ============================================================

// Two roles only — any user can buy and sell
Enum user_role {
  user
  admin
}

Enum product_status {
  active
  sold_out
  archived
}

Enum product_condition {
  new
  like_new
  good
  fair
}

// extended added for sniping protection
Enum auction_status {
  live
  extended
  ended_no_winner
  ended_pending_payment
  winner_failed
  sold
  canceled
}

// return_requested sits between delivered and completed
Enum order_status {
  pending
  paid
  processing
  shipped
  delivered
  return_requested
  completed
  canceled
  refunded
}

// What the payment is for — boost is a feature within a subscription plan, not a separate payment
Enum payment_type {
  order
  subscription
}

Enum payment_status {
  pending
  paid
  failed
  refunded
}

// pending_payment removed — boost is activated via subscription, no separate payment step
Enum boost_status {
  active
  expired
  canceled
}

Enum sub_status {
  active
  expired
  canceled
}

Enum payout_status {
  pending
  processing
  paid
  failed
}

Enum escrow_type {
  IN
  OUT
}

Enum order_source {
  cart
  auction
}

Enum refund_status {
  pending
  processed
  failed
}

Enum dispute_status {
  open
  under_review
  resolved_buyer
  resolved_seller
  closed
}

Enum notification_type {
  outbid
  auction_won
  auction_expired
  order_placed
  order_shipped
  order_delivered
  payout_paid
  boost_expiring
  subscription_expiring
  dispute_opened
  dispute_resolved
  user_verified
}

Enum otp_channel {
  email
  sms
}

Enum otp_purpose {
  email_verification
  phone_verification
  password_reset
}

// ============================================================
// CORE
// ============================================================

Table users {
  id                  bigserial     [pk, increment]
  full_name           text          [not null, default: '']
  username            text          [not null, unique, note: 'citext — case-insensitive']
  email               text          [not null, unique, note: 'citext — case-insensitive']
  password_hash       text          [not null]
  role                user_role     [not null, default: 'user']

  phone               text          [not null, default: '']
  address             text          [not null, default: '']
  city                text          [not null, default: '']
  zip                 text          [not null, default: '']
  avatar_url          text          [not null, default: '']
  avatar_bg           text          [not null, default: '']

  // Populated when user starts listing
  bank_name           text          [not null, default: '']
  bank_account_number text          [not null, default: '']
  bank_account_name   text          [not null, default: '']

  // NULL = not yet verified via OTP
  email_verified_at   timestamptz
  phone_verified_at   timestamptz

  avg_seller_rating   decimal(3,2)  [not null, default: 0, note: 'Denorm — updated by trigger']
  total_ratings       int           [not null, default: 0, note: 'Denorm — updated by trigger']

  deleted_at          timestamptz
  created_at          timestamptz   [not null, default: `now()`]
  updated_at          timestamptz

  indexes {
    email    [unique]
    username [unique]
  }
}

// Admin-managed metadata — users pick from this list when creating a listing
Table fandoms {
  id         text        [pk, note: 'slug — e.g. bts, aespa, newjeans']
  name       text        [not null]
  is_active  boolean     [not null, default: true,     note: 'false = hidden from listing form dropdown']
  created_at timestamptz [not null, default: `now()`]
}

Table subscription_plans {
  id              text          [pk, note: "'free' | 'boost' | 'premium'"]
  name            text          [not null]
  price           decimal(18,2) [not null, default: 0]
  duration_days   int           [not null, default: 0]
  duration_hours  int           [not null, default: 0]
  features        jsonb         [not null, default: '{}', note: '{"listings": 20, "boost": true, "badge": false} — limits enforced in app layer']
  is_active       boolean       [not null, default: true]
  created_at      timestamptz   [not null, default: `now()`]
  updated_at      timestamptz
}

Table products {
  id                bigserial           [pk, increment]
  seller_id         bigint              [not null, ref: > users.id]

  // FK to fandoms — user selects from admin-managed dropdown
  fandom_id         text                [not null, ref: > fandoms.id]

  artist            text                [not null, default: '']
  name              text                [not null, default: '']
  type              text                [not null, default: '', note: 'photocard | album | poster | lightstick | other']
  condition         product_condition   [not null, default: 'good']
  price             decimal(18,2)       [not null]
  stock             int                 [not null, default: 0]
  description       text                [not null, default: '']
  primary_image_url text                [not null, default: '']
  is_auction        boolean             [not null, default: false, note: 'true while product has a live or extended auction']
  status            product_status      [not null, default: 'active', note: 'Trigger sets sold_out when stock = 0']
  version           int                 [not null, default: 0,        note: 'Optimistic lock for concurrent stock updates']

  // Denorm for seller dashboard views KPI
  view_count        bigint              [not null, default: 0]

  // Denorm boost — updated by trigger when product_boosts changes
  is_boosted        boolean             [not null, default: false]
  boost_ends_at     timestamptz         [note: 'NULL if is_boosted = false']

  deleted_at        timestamptz
  created_at        timestamptz         [not null, default: `now()`]
  updated_at        timestamptz

  indexes {
    seller_id
    fandom_id
    type
    (fandom_id, created_at) [name: 'idx_products_browse',  note: 'Partial: is_auction=false, status=active, stock>0']
    (is_boosted, boost_ends_at) [name: 'idx_products_boosted', note: 'Partial: is_boosted=true']
  }
}

Table product_images {
  id          bigserial   [pk, increment]
  product_id  bigint      [not null, ref: > products.id]
  url         text        [not null]
  sort_order  smallint    [not null, default: 0]
  created_at  timestamptz [not null, default: `now()`]

  indexes {
    (product_id, sort_order)
  }
}

// Optional K-pop specific metadata — one row per photocard product
Table photocard_details {
  product_id   bigint  [pk, ref: > products.id]
  member_name  text    [not null, default: '']
  album_series text    [not null, default: '']
  version      text    [not null, default: '', note: 'e.g. A ver. | Limited | POB']
  is_pob       boolean [not null, default: false, note: 'Purchase-on-behalf benefit card']
}

Table cart_items {
  id          bigserial   [pk, increment]
  user_id     bigint      [not null, ref: > users.id]
  product_id  bigint      [not null, ref: > products.id]
  quantity    int         [not null, default: 1]
  created_at  timestamptz [not null, default: `now()`]
  updated_at  timestamptz

  indexes {
    (user_id, product_id) [unique]
  }
}

// Save products to buy later
Table wishlists {
  user_id    bigint      [not null, ref: > users.id]
  product_id bigint      [not null, ref: > products.id]
  created_at timestamptz [not null, default: `now()`]

  indexes {
    (user_id, product_id) [pk]
    product_id
  }
}

// Follow active sellers to track their new listings
Table seller_follows {
  follower_id bigint      [not null, ref: > users.id]
  seller_id   bigint      [not null, ref: > users.id]
  created_at  timestamptz [not null, default: `now()`]

  indexes {
    (follower_id, seller_id) [pk]
    seller_id
  }
}

// ============================================================
// AUCTION
// ============================================================

Table auctions {
  id            bigserial       [pk, increment]
  product_id    bigint          [not null, ref: > products.id]
  seller_id     bigint          [not null, ref: > users.id]

  floor_price   decimal(18,2)   [not null,              note: 'Public starting bid']
  reserve_price decimal(18,2)   [                       note: 'Hidden minimum — NULL means no reserve; if not met → ended_no_winner']
  current_bid   decimal(18,2)   [not null, default: 0,  note: 'Denorm — updated on every accepted bid']
  is_urgent     boolean         [not null, default: false]
  has_proof_image boolean       [not null, default: false, note: 'Seller uploaded authentication proof photos']

  // Sniping protection — extend auction when a bid lands inside the trigger window
  extension_seconds   int       [not null, default: 300, note: 'Seconds added to ends_at on late bid']
  trigger_before_end  int       [not null, default: 60,  note: 'Bid placed within this many secs of end triggers extension']
  extension_count     int       [not null, default: 0,   note: 'Times extended — app enforces cap of 3']

  status                   auction_status [not null, default: 'live']
  winner_id                bigint         [ref: > users.id]
  final_price              decimal(18,2)
  ends_at                  timestamptz    [not null]
  ended_at                 timestamptz
  winner_payment_deadline  timestamptz
  created_at               timestamptz    [not null, default: `now()`]
  updated_at               timestamptz

  indexes {
    seller_id
    status
    product_id [name: 'uq_one_live_auction_per_product', note: 'Partial unique: status IN (live, extended)']
    winner_id  [note: 'Partial: winner_id IS NOT NULL']
    ends_at    [name: 'idx_auctions_ends_at', note: 'Partial: status IN (live, extended)']
  }
}

Table bids {
  id              bigserial     [pk, increment]
  auction_id      bigint        [not null, ref: > auctions.id]
  user_id         bigint        [not null, ref: > users.id]
  amount          decimal(18,2) [not null]
  is_winning      boolean       [not null, default: false]
  username_snap   text          [not null, default: '', note: 'Snapshot at bid time']
  avatar_snap     text          [not null, default: '']
  avatar_bg_snap  text          [not null, default: '']
  placed_at       timestamptz   [not null, default: `now()`]

  indexes {
    auction_id
    user_id
    (auction_id, amount) [name: 'idx_bids_auction_amount', note: 'DESC — find winner fast']
  }
}

// ============================================================
// ORDERS & PAYMENTS
// ============================================================

Table orders {
  id              bigserial     [pk, increment]
  user_id         bigint        [not null, ref: > users.id]
  seller_id       bigint        [not null, ref: > users.id]
  source          order_source  [not null, default: 'cart']
  auction_id      bigint        [ref: > auctions.id, note: 'NULL if source = cart']
  total           decimal(18,2) [not null]
  status          order_status  [not null, default: 'pending']
  address_snap    jsonb         [not null, default: '{}', note: '{"full_name","phone","address","city","zip"}']
  carrier         text
  tracking_number text
  shipped_at      timestamptz
  delivered_at    timestamptz
  completed_at    timestamptz
  created_at      timestamptz   [not null, default: `now()`]
  updated_at      timestamptz

  indexes {
    (user_id, created_at)
    (seller_id, created_at)
    (seller_id, status) [name: 'idx_orders_seller_status']
    (user_id, status)   [name: 'idx_orders_user_status']
    auction_id          [name: 'idx_orders_auction_id', note: 'Partial: auction_id IS NOT NULL']
  }
}

Table order_items {
  id            bigserial     [pk, increment]
  order_id      bigint        [not null, ref: > orders.id]
  product_id    bigint        [ref: > products.id,  note: 'Nullable — product may be deleted later']
  product_name  text          [not null, default: '', note: 'Snapshot']
  product_image text          [not null, default: '', note: 'Snapshot']
  quantity      int           [not null]
  unit_price    decimal(18,2) [not null]
  subtotal      decimal(18,2) [not null, note: 'GENERATED ALWAYS AS (quantity * unit_price) STORED']

  indexes {
    order_id
    product_id
  }
}

Table payments {
  id                  bigserial         [pk, increment]
  user_id             bigint            [not null, ref: > users.id]
  type                payment_type      [not null, note: 'What the payment is for']
  amount              decimal(18,2)     [not null]
  currency            char(3)           [not null, default: 'VND']
  status              payment_status    [not null, default: 'pending']
  reference           text              [not null, default: '',      note: 'plan_id | boost_id | empty for order payments']

  // SePay specific
  transfer_content    text              [note: 'Unique code user writes in bank transfer description — e.g. EZBIAS A8X3K2']
  provider_txn_id     text              [note: 'SePay transaction id from webhook']
  payload             jsonb             [not null, default: '{}',    note: 'Full SePay webhook body — audit trail']
  paid_at             timestamptz
  created_at          timestamptz       [not null, default: `now()`]
  updated_at          timestamptz

  indexes {
    user_id
    status           [name: 'idx_payments_status_pending',   note: 'Partial: status=pending']
    transfer_content [name: 'idx_payments_transfer_content', note: 'Unique partial: status=pending — webhook lookup']
    provider_txn_id  [name: 'idx_payments_provider_txn_id',  note: 'Partial: not null']
  }
}

Table payment_orders {
  payment_id  bigint  [not null, ref: > payments.id]
  order_id    bigint  [not null, ref: > orders.id]

  indexes {
    (payment_id, order_id) [pk]
    order_id
  }
}

// ============================================================
// ESCROW & PAYOUT
// ============================================================

Table escrow_transactions {
  id          bigserial     [pk, increment]
  order_id    bigint        [not null, ref: > orders.id]
  seller_id   bigint        [not null, ref: > users.id]
  type        escrow_type   [not null, note: 'IN = money enters escrow | OUT = released to seller']
  amount      decimal(18,2) [not null]
  payment_id  bigint        [ref: > payments.id]
  payout_id   bigint        [ref: > payouts.id]
  created_at  timestamptz   [not null, default: `now()`]

  note: 'PARTITION BY RANGE (created_at) — immutable audit log'

  indexes {
    order_id
    seller_id
    payment_id
  }
}

Table payouts {
  id                  bigserial     [pk, increment]
  order_id            bigint        [not null, unique, ref: > orders.id, note: 'One payout per order']
  seller_id           bigint        [not null, ref: > users.id]
  amount              decimal(18,2) [not null]
  status              payout_status [not null, default: 'pending']
  bank_transfer_ref   text
  paid_at             timestamptz
  created_at          timestamptz   [not null, default: `now()`]
  updated_at          timestamptz

  indexes {
    seller_id
    status [name: 'idx_payouts_pending', note: 'Partial: status=pending']
  }
}

// ============================================================
// SUBSCRIPTIONS & BOOSTS
// ============================================================

Table user_subscriptions {
  id          bigserial   [pk, increment]
  user_id     bigint      [not null, ref: > users.id]
  plan_id     text        [not null, ref: > subscription_plans.id]
  status      sub_status  [not null, default: 'active']
  starts_at   timestamptz [not null]
  ends_at     timestamptz [not null]
  payment_id  bigint      [ref: > payments.id]
  created_at  timestamptz [not null, default: `now()`]
  updated_at  timestamptz

  indexes {
    (user_id, ends_at) [name: 'idx_user_subs_active', note: 'Partial: status=active']
  }
}

// Tracks which products are currently boosted — activated when user applies their subscription boost feature
// No payment_id — boost is included in the subscription plan (features.boost = true), not paid separately
Table product_boosts {
  id          bigserial     [pk, increment]
  product_id  bigint        [not null, ref: > products.id]
  user_id     bigint        [not null, ref: > users.id]
  subscription_id bigint    [not null, ref: > user_subscriptions.id, note: 'The subscription that granted this boost']
  status      boost_status  [not null, default: 'active']
  starts_at   timestamptz   [not null]
  ends_at     timestamptz   [not null]
  created_at  timestamptz   [not null, default: `now()`]
  updated_at  timestamptz

  indexes {
    (product_id, ends_at) [name: 'idx_boosts_active_product', note: 'Partial: status=active']
    ends_at               [name: 'idx_boosts_expiry_scan',    note: 'Partial: status=active']
    user_id
    subscription_id
  }
}

// ============================================================
// DISPUTES & REFUNDS
// ============================================================

// Buyer opens a dispute before a refund can be issued
Table disputes {
  id           bigserial      [pk, increment]
  order_id     bigint         [not null, unique, ref: > orders.id]
  initiator_id bigint         [not null, ref: > users.id, note: 'buyer who opened the dispute']
  reason       text           [not null]
  status       dispute_status [not null, default: 'open']
  admin_note   text
  resolved_at  timestamptz
  created_at   timestamptz    [not null, default: `now()`]

  indexes {
    status [name: 'idx_disputes_open', note: 'Partial: status=open']
  }
}

Table refunds {
  id            bigserial       [pk, increment]
  payment_id    bigint          [not null, ref: > payments.id]
  order_id      bigint          [ref: > orders.id,   note: 'NULL if refund is for subscription or boost']
  dispute_id    bigint          [ref: > disputes.id, note: 'NULL if admin-initiated directly without dispute']
  amount        decimal(18,2)   [not null, note: 'Supports partial refunds']
  reason        text            [not null, default: '']
  status        refund_status   [not null, default: 'pending']
  provider_ref  text            [note: 'SePay refund reference if available']
  processed_at  timestamptz
  created_at    timestamptz     [not null, default: `now()`]

  indexes {
    payment_id
    order_id
    dispute_id
    status [note: 'Partial: status=pending']
  }
}

// ============================================================
// OTP VERIFICATION
// ============================================================

// Manages email and SMS OTP codes for account verification and password reset
Table otp_verifications {
  id          bigserial    [pk, increment]
  user_id     bigint       [not null, ref: > users.id]
  channel     otp_channel  [not null,              note: 'email | sms']
  purpose     otp_purpose  [not null,              note: 'what this OTP is for']
  code_hash   text         [not null,              note: 'SHA-256 hash — never store raw OTP code']
  is_used     boolean      [not null, default: false]
  expires_at  timestamptz  [not null,              note: 'Typically now() + 10 minutes']
  created_at  timestamptz  [not null, default: `now()`]

  indexes {
    (user_id, purpose) [name: 'idx_otp_active',   note: 'Partial: is_used=false']
    expires_at         [name: 'idx_otp_cleanup',  note: 'Partial: is_used=false — used by cleanup job']
  }
}

// ============================================================
// RATINGS
// ============================================================

Table ratings {
  id              bigserial   [pk, increment]
  order_id        bigint      [not null, unique, ref: > orders.id, note: 'One rating per order']
  buyer_id        bigint      [not null, ref: > users.id]
  seller_id       bigint      [not null, ref: > users.id]
  product_rating  smallint    [not null, note: '1–5']
  seller_rating   smallint    [not null, note: '1–5']
  tags            text[]      [not null, default: '{}', note: 'Use ANY() for queries']
  comment         text
  created_at      timestamptz [not null, default: `now()`]

  note: 'INSERT/UPDATE/DELETE trigger → updates users.avg_seller_rating + total_ratings'

  indexes {
    seller_id
    buyer_id
  }
}

// ============================================================
// NOTIFICATIONS
// ============================================================

Table notifications {
  id          bigserial           [pk, increment]
  user_id     bigint              [not null, ref: > users.id]
  type        notification_type   [not null]
  title       text                [not null]
  body        text                [not null]
  meta        jsonb               [not null, default: '{}', note: '{"auction_id":1} | {"order_id":5} | {"dispute_id":3}']
  is_read     boolean             [not null, default: false]
  created_at  timestamptz         [not null, default: `now()`]
  read_at     timestamptz

  indexes {
    (user_id, is_read, created_at) [name: 'idx_notifications_unread', note: 'Partial: is_read=false']
  }
}

// ============================================================
// AUTH
// ============================================================

Table refresh_tokens {
  id          bigserial   [pk, increment]
  user_id     bigint      [not null, ref: > users.id]
  token_hash  text        [not null, note: 'SHA-256 hash — never store raw token']
  is_revoked  boolean     [not null, default: false]
  expires_at  timestamptz [not null]
  device_info text
  created_at  timestamptz [not null, default: `now()`]
  revoked_at  timestamptz

  indexes {
    token_hash [unique, name: 'idx_refresh_tokens_hash_active', note: 'Partial: is_revoked=false']
    user_id
    expires_at [name: 'idx_refresh_tokens_expires_at', note: 'Partial: is_revoked=false — used by cleanup job']
  }
}

// ============================================================
// SUPPORT
// ============================================================

Table contact_messages {
  id          bigserial   [pk, increment]
  name        text        [not null]
  email       text        [not null]
  subject     text        [not null, default: '']
  message     text        [not null]
  is_read     boolean     [not null, default: false]
  created_at  timestamptz [not null, default: `now()`]

  indexes {
    created_at [name: 'idx_contact_messages_unread', note: 'Partial: is_read=false']
  }
}


