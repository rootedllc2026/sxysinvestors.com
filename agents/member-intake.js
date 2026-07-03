// Agent: Member Intake
// Job: Logs new members to Google Sheets and checks qualification for apprenticeships.
// Sasha handles the onboarding experience — this agent handles the data behind it.

const rules = require('../config/business-rules');

async function onNewMember(payload, sharedState) {
  const {
    memberId,
    fullName,
    email,
    phone = '',
    state = '',
    memberstackId,
    membershipTier,
    joinDate,
    sourceSite,
  } = payload;

  const marketAllowed = rules.ACTIVE_MARKETS.some(
    market => state && state.toLowerCase().includes(market.toLowerCase())
  );

  const tier = membershipTier.toUpperCase();
  const billingInterval = rules.MEMBERSHIP[tier]
    ? rules.MEMBERSHIP[tier].interval
    : null;

  const row = {
    'Member ID':               memberId || `MEM-${Date.now()}`,
    'Full Name':               fullName,
    'Email':                   email,
    'Phone':                   phone,
    'State':                   state,
    'Memberstack ID':          memberstackId || '',
    'Membership Tier':         membershipTier,
    'Join Date':               joinDate,
    'Billing Interval':        billingInterval,
    'Status':                  'active',
    'VIP Start Date':          '',
    'Consecutive VIP Months':  rules.APPRENTICESHIP.ELIGIBLE_TIERS.includes(tier) ? 0 : '',
    'Apprenticeship Eligible': false,
    'Source Site':             sourceSite || rules.SITES.MEMBER_PORTAL,
    'Notes':                   marketAllowed ? '' : 'Outside active markets — review required.',
  };

  sharedState.memberRow = row;
  sharedState.marketAllowed = marketAllowed;

  return { success: true, row, marketAllowed };
}

async function checkVIPQualification(payload, sharedState) {
  const { members = [] } = payload;

  const results = members.map(member => {
    const tier = (member['Membership Tier'] || '').toUpperCase();
    const status = (member['Status'] || '').toLowerCase();
    const consecutiveMonths = parseInt(member['Consecutive VIP Months'] || '0', 10);

    if (!rules.APPRENTICESHIP.ELIGIBLE_TIERS.includes(tier)) {
      return { ...member, checked: false, reason: 'Not on an eligible tier (Monthly or Annual).' };
    }

    if (status !== rules.APPRENTICESHIP.REQUIRED_STATUS) {
      return { ...member, checked: true, 'Apprenticeship Eligible': false, reason: 'Not in good standing.' };
    }

    const updatedMonths = consecutiveMonths + 1;
    const isEligible = updatedMonths >= rules.APPRENTICESHIP.MIN_CONSECUTIVE_MONTHS;

    return {
      ...member,
      checked: true,
      'Consecutive VIP Months':  updatedMonths,
      'Apprenticeship Eligible': isEligible,
      reason: isEligible
        ? `Eligible — ${updatedMonths} consecutive months as Monthly or Annual member in good standing.`
        : `Not yet eligible — ${updatedMonths} of ${rules.APPRENTICESHIP.MIN_CONSECUTIVE_MONTHS} months completed.`,
    };
  });

  const newlyEligible = results.filter(m => m['Apprenticeship Eligible'] === true);

  sharedState.vipResults = results;
  sharedState.newlyEligible = newlyEligible;

  return {
    success: true,
    totalChecked: results.length,
    newlyEligible: newlyEligible.length,
    results,
  };
}

module.exports = { run: onNewMember, checkVIPQualification };
