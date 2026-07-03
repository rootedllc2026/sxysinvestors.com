// Agent: Upsell Email
// Job: Sends the post-booking membership upsell email via Gmail (triggered by Zapier).
// Sasha handles onboarding — this email is her first touchpoint with a new contact.

const rules = require('../config/business-rules');

function buildEmailBody(clientName, isExistingMember) {

  if (isExistingMember) {
    return `
Hi ${clientName},

Your strategy session is confirmed — we can't wait to connect with you.

As a member of SXY's Corporate Club, you already have access to powerful resources.
But if you haven't explored all your membership benefits yet, now is a great time.

See what's available at your current tier and consider upgrading before your session
so we can hit the ground running together.

View your membership: https://sxyscorporateclub.com/membership

See you soon,
Sasha
SXY's Corporate Club
    `.trim();
  }

  return `
Hi ${clientName},

Your strategy session is confirmed — we're excited to meet you.

While you're waiting for your session, we'd love to invite you into SXY's Corporate Club —
a private community built for business owners who are serious about growth.

Here's what membership looks like:

Newbie (Free) $0 
Access to Economic Bites + Club Directory (add your business page and sell your products/services) + Club Hub (read and post in the community exchange. Certain webinars are limited to paid members).

Pro Monthly $5/month or Annually $49/year 
Access to all Newbie Tier features + Club Market (bidding portal) + Apprenticeship Program Opportunities + Host webinars

VIP $29/month 
Access to all Pro features + Monthly live group coaching calls with a Club Specialist + Priority Q&A + Early access to new releases + Host private webinars

Membership is free to start — no credit card required.

Join here: https://sxyscorporateclub.com/join

See you at your session,
Sasha
SXY's Corporate Club
  `.trim();
}

async function run(payload, sharedState) {
  const clientName = payload.clientName || sharedState.clientName || 'there';
  const clientEmail = payload.clientEmail || sharedState.clientEmail;
  const isExistingMember = payload.isExistingMember || sharedState.isExistingMember || false;

  if (!clientEmail) {
    return { success: false, error: 'No client email provided.' };
  }

  const subject = isExistingMember
    ? 'Your strategy session is confirmed — see you soon'
    : "Your strategy session is confirmed — here's your invite to SXY's Corporate Club";

  const body = buildEmailBody(clientName, isExistingMember);

  return {
    success: true,
    email: {
      to:      clientEmail,
      subject: subject,
      body:    body,
    }
  };
}

module.exports = { run };
