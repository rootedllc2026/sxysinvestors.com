// Agent: Booking Intake
// Job: Receives a new Calendly booking from Zapier and logs it to Google Sheets.

const rules = require('../config/business-rules');

async function run(payload, sharedState) {
  const {
    bookingId,
    bookingDate,
    sessionDate,
    sessionTime,
    clientName,
    clientEmail,
    phone,
    state,
    sessionType,
    calendlyEventName,
    isExistingMember = false,
    memberTier = '',
  } = payload;

  const marketAllowed = rules.ACTIVE_MARKETS.some(
    market => state && state.toLowerCase().includes(market.toLowerCase())
  );

  const row = {
    'Booking ID':                bookingId || `BK-${Date.now()}`,
    'Booking Date':              bookingDate,
    'Session Date':              sessionDate,
    'Session Time':              sessionTime,
    'Client Name':               clientName,
    'Client Email':              clientEmail,
    'Phone':                     phone || '',
    'State':                     state || '',
    'Is Existing Member':        isExistingMember,
    'Member Tier':               memberTier,
    'Session Type':              sessionType || '',
    'Calendly Event Name':       calendlyEventName || '',
    'Upsell Email Sent':         false,
    'Upsell Email Sent At':      '',
    'Membership Page Redirect':  false,
    'Converted to Member':       false,
    'New Tier After Booking':    '',
    'Source Site':               rules.SITES.PUBLIC_SITE,
  };

  sharedState.bookingRow = row;
  sharedState.marketAllowed = marketAllowed;
  sharedState.clientEmail = clientEmail;
  sharedState.clientName = clientName;
  sharedState.isExistingMember = isExistingMember;

  return { success: true, row, marketAllowed };
}

module.exports = { run };
