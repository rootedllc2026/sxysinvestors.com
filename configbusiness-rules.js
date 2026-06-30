// SXY's Corporate Club — Central Business Rules
// All pricing, fees, and eligibility constants live here.
// Never hardcode these values in agents or other files — always import from here.

module.exports = {

  // ── SITES ────────────────────────────────────────────────────────────────
  SITES: {
    MEMBER_PORTAL: 'sxyscorporateclub.com',
    PUBLIC_SITE:   'sxysinvestors.com',
  },

  // ── ACTIVE MARKETS ───────────────────────────────────────────────────────
  ACTIVE_MARKETS: ['Georgia', 'Pennsylvania', 'New Jersey'],

  // ── MEMBERSHIP TIERS ─────────────────────────────────────────────────────
  MEMBERSHIP: {
    FREE:    { name: 'Free',    price: 0,  interval: null    },
    MONTHLY: { name: 'Monthly', price: 5,  interval: 'month' },
    ANNUAL:  { name: 'Annual',  price: 49, interval: 'year'  },
    VIP:     { name: 'VIP',     price: 29, interval: 'month' },
  },

  // ── PLATFORM TRANSACTION FEE ─────────────────────────────────────────────
  // Applied to every completed sale on either site. Never at listing.
  TRANSACTION_FEE: {
    STANDARD: 0.03, // 3% — all members and non-members
    VIP:      0.02, // 2% — VIP members only
  },

  // ── RETAINERS ────────────────────────────────────────────────────────────
  RETAINER: {
    PRICE:          300, // per month
    ELIGIBLE_TYPES: ['Account Management', 'Strategic Programming'],
  },

  // ── APPRENTICESHIP ───────────────────────────────────────────────────────
  APPRENTICESHIP: {
    REQUIRED_TIER:           'VIP',
    MIN_CONSECUTIVE_MONTHS:  6,
    REQUIRED_STATUS:         'good_standing',
  },

  // ── AI ASSISTANTS ────────────────────────────────────────────────────────
  // Do not conflate these two roles.
  AI_ASSISTANTS: {
    JANAY: 'Financial education and resource connections',
    SASHA: 'Member onboarding',
  },

  // ── BOOKING ──────────────────────────────────────────────────────────────
  BOOKING: {
    TOOL: 'Calendly',
    POST_BOOKING_ACTIONS: ['upsell_email', 'membership_redirect'],
  },

  // ── FULFILLMENT ──────────────────────────────────────────────────────────
  FULFILLMENT: {
    BOUTIQUE_PLATFORM: 'Shopify',
    PRINT_PROVIDER:    'Gelato',
  },

};
