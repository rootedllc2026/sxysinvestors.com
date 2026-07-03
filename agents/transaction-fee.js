// Agent: Transaction Fee
// Job: Calculates and logs the platform fee for any completed sale on either site.
// This is the single source of truth for all fee logic across the operating system.

const rules = require('../config/business-rules');

const SALE_TYPES = [
  'Club Directory',
  'Boutique',
  'Retainer',
  'Strategy Session',
  'Service',
];

async function run(payload, sharedState) {
  const {
    transactionId,
    date,
    clientName,
    clientEmail,
    memberId = '',
    memberTier = '',
    saleType,
    itemDescription,
    saleAmount,
    paymentStatus = 'completed',
    sourceSite,
    zapierTrigger = '',
    notes = '',
  } = payload;

  // Only charge fee on completed sales — never on pending or listing
  if (paymentStatus !== 'completed') {
    return {
      success: false,
      reason: `Fee not applied — payment status is "${paymentStatus}", not "completed".`,
    };
  }

  // Validate sale type
  if (!SALE_TYPES.includes(saleType)) {
    return {
      success: false,
      reason: `Unknown sale type "${saleType}". Must be one of: ${SALE_TYPES.join(', ')}.`,
    };
  }

  // Determine fee rate based on membership tier
  const isVIP = memberTier.toUpperCase() === 'VIP';
  const feeRate = isVIP ? rules.TRANSACTION_FEE.VIP : rules.TRANSACTION_FEE.STANDARD;
  const platformFee = parseFloat((saleAmount * feeRate).toFixed(2));
  const netToClient = parseFloat((saleAmount - platformFee).toFixed(2));

  const row = {
    'Transaction ID':   transactionId || `TXN-${Date.now()}`,
    'Date':             date,
    'Client Name':      clientName,
    'Client Email':     clientEmail,
    'Member ID':        memberId,
    'Membership Tier':  memberTier,
    'Sale Type':        saleType,
    'Item Description': itemDescription,
    'Sale Amount':      saleAmount,
    'Fee Rate':         feeRate,
    'Platform Fee':     platformFee,
    'Net to Client':    netToClient,
    'Payment Status':   paymentStatus,
    'Source Site':      sourceSite,
    'Zapier Trigger':   zapierTrigger,
    'Notes':            notes,
  };

  sharedState.transactionRow = row;

  return { success: true, row, platformFee, feeRate };
}

module.exports = { run };
