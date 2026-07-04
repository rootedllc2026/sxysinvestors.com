// Agent: Weekly Summary
// Job: Compiles a weekly financial summary from both sites and posts it to the
// Back Office Hub (Loveable) so you can see everything in one place every week.
// Triggered by a Zapier scheduled trigger every Monday morning.
// Requires LOVEABLE_AGENT_TOKEN environment variable (your AGENT_UPDATES_TOKEN from Loveable).

const rules = require('../config/business-rules');

const LOVEABLE_ENDPOINT = 'https://preview--hubble-blossom-connect.lovable.app/api/public/agent-updates';

async function run(payload, sharedState) {
  const {
    periodStart,
    periodEnd,
    transactions   = [],
    bookings       = [],
    boutiqueOrders = [],
    members        = [],
    retainers      = [],
    agentToken,
  } = payload;

  const completedTxns = transactions.filter(t =>
    (t['Payment Status'] || '').toLowerCase() === 'completed'
  );

  const clubRevenue = completedTxns
    .filter(t => t['Source Site'] === rules.SITES.MEMBER_PORTAL)
    .reduce((sum, t) => sum + parseFloat(t['Sale Amount'] || 0), 0);

  const publicRevenue = completedTxns
    .filter(t => t['Source Site'] === rules.SITES.PUBLIC_SITE)
    .reduce((sum, t) => sum + parseFloat(t['Sale Amount'] || 0), 0);

  const totalRevenue = clubRevenue + publicRevenue;

  const totalFees = completedTxns
    .reduce((sum, t) => sum + parseFloat(t['Platform Fee'] || 0), 0);

  const boutiqueRevenue = boutiqueOrders
    .reduce((sum, o) => sum + parseFloat(o['Order Total'] || 0), 0);

  const activeRetainers = retainers.filter(r =>
    (r['Status'] || '').toLowerCase() === 'active'
  );
  const mrr = activeRetainers.length * rules.RETAINER.PRICE;

  const activeMembers = members.filter(m =>
    (m['Status'] || '').toLowerCase() === 'active'
  ).length;

  const vipMembers = members.filter(m =>
    (m['Membership Tier'] || '').toUpperCase() === 'VIP' &&
    (m['Status'] || '').toLowerCase() === 'active'
  ).length;

  const newMembers = members.filter(m =>
    m['Join Date'] >= periodStart && m['Join Date'] <= periodEnd
  ).length;

  const totalBookings = bookings.length;
  const convertedBookings = bookings.filter(b =>
    (b['Converted to Member'] || '').toString().toUpperCase() === 'TRUE'
  ).length;

  const fmt = n => `$${parseFloat(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

  const summary = [
    `WEEKLY FINANCIAL SUMMARY — ${periodStart} to ${periodEnd}`,
    ``,
    `REVENUE`,
    `  Total: ${fmt(totalRevenue)}`,
    `  ${rules.SITES.MEMBER_PORTAL}: ${fmt(clubRevenue)}`,
    `  ${rules.SITES.PUBLIC_SITE}: ${fmt(publicRevenue)}`,
    `  Platform fees collected: ${fmt(totalFees)}`,
    ``,
    `BOUTIQUE`,
    `  Orders: ${boutiqueOrders.length}`,
    `  Revenue: ${fmt(boutiqueRevenue)}`,
    ``,
    `STRATEGY SESSIONS`,
    `  Booked: ${totalBookings}`,
    `  Converted to members: ${convertedBookings}`,
    ``,
    `MEMBERS`,
    `  Active: ${activeMembers}`,
    `  New this week: ${newMembers}`,
    `  VIP: ${vipMembers}`,
    ``,
    `RETAINERS`,
    `  Active: ${activeRetainers.length}`,
    `  MRR: ${fmt(mrr)}`,
  ].join('\n');

  const token = agentToken || process.env.LOVEABLE_AGENT_TOKEN;

  if (!token) {
    return { success: false, error: 'Missing LOVEABLE_AGENT_TOKEN.' };
  }

  const body = {
    title:        `Week of ${periodStart} — Financial Summary`,
    summary:      summary,
    period_start: periodStart,
    period_end:   periodEnd,
    metrics: {
      revenue:          parseFloat(totalRevenue.toFixed(2)),
      boutique_revenue: parseFloat(boutiqueRevenue.toFixed(2)),
      platform_fees:    parseFloat(totalFees.toFixed(2)),
      mrr:              mrr,
      active_members:   activeMembers,
      new_members:      newMembers,
      vip_members:      vipMembers,
      bookings:         totalBookings,
      conversions:      convertedBookings,
      active_retainers: activeRetainers.length,
    },
    source: 'claude-agent',
  };

  const response = await fetch(LOVEABLE_ENDPOINT, {
    method:  'POST',
    headers: {
      'Authorization': `Bearer ${S7LUvYpHyXSG6EKZgN3xnvpvXuGkz6V2sX5xPR3v}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    return { success: false, error: `Loveable API error ${response.status}: ${text}` };
  }

  return { success: true, summary, metrics: body.metrics };
}

module.exports = { run };
