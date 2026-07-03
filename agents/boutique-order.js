// Agent: Boutique Order
// Job: Receives a completed Shopify order from Zapier and logs it to Google Sheets.
// Calculates the platform fee based on membership tier (VIP gets 2%, everyone else 3%).

const rules = require('../config/business-rules');

async function run(payload, sharedState) {
  const {
    shopifyOrderId,
    orderDate,
    customerName,
    customerEmail,
    productName,
    quantity,
    orderTotal,
    fulfillmentStatus = 'pending',
    trackingNumber = '',
    isMember = false,
    memberTier = '',
  } = payload;

  // Determine fee rate — VIP members pay 2%, everyone else pays 3%
  const isVIP = isMember && memberTier.toUpperCase() === 'VIP';
  const feeRate = isVIP ? rules.TRANSACTION_FEE.VIP : rules.TRANSACTION_FEE.STANDARD;
  const platformFee = parseFloat((orderTotal * feeRate).toFixed(2));
  const netRevenue = parseFloat((orderTotal - platformFee).toFixed(2));

  const row = {
    'Order ID':             `ORD-${Date.now()}`,
    'Order Date':           orderDate,
    'Customer Name':        customerName,
    'Customer Email':       customerEmail,
    'Is Member':            isMember,
    'Member Tier':          memberTier,
    'Product Name':         productName,
    'Quantity':             quantity,
    'Order Total':          orderTotal,
    'Fee Rate':             feeRate,
    'Platform Fee':         platformFee,
    'Net Revenue':          netRevenue,
    'Fulfillment Provider': rules.FULFILLMENT.PRINT_PROVIDER,
    'Fulfillment Status':   fulfillmentStatus,
    'Tracking Number':      trackingNumber,
    'Shopify Order Number': shopifyOrderId,
    'Source Site':          rules.SITES.PUBLIC_SITE,
  };

  sharedState.orderRow = row;
  sharedState.platformFee = platformFee;

  return { success: true, row };
}

module.exports = { run };
