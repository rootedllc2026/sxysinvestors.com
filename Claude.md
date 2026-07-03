# SXY's Corporate Club Revenue Operating System

**Purpose:** Multi-agent system automating membership intake, service routing, retainer tracking, project board fee calculation, VIP qualification, and revenue analytics.

---

## Critical Business Rules

- **Club Directory fee:** 3% per COMPLETED SALE only. Never at listing. VIP rate: 2%.
- **Apprenticeship eligibility:** Pro Monthly or Annual members in good standing for 6+ consecutive months only.
- **Membership tiers:** Free ($0), Monthly ($5/mo), Annual ($49/yr), VIP ($29/mo).
- **Retainer price:** $300/month — Account Management and Strategic Programming types only.
- **AI assistants:** Janay = financial education + resource connections. Sasha = member onboarding. Do not conflate.
- **Active markets:** Georgia, Pennsylvania, New Jersey only.

---

## Tech Stack

- **Frontend/Hosting:** HTML/CSS/JS on Netlify
- **Auth/Gating:** Memberstack
- **Form Routing/Data:** Google Apps Script → Google Sheets
- **Automation:** Zapier
- **Dashboard:** Loveable (Back Office Hub)

---

## Codebase Conventions

- Agent files live in `/agents/`. Each exports a single `async run(payload, sharedState)` function.
- All business rule constants live in `/config/business-rules.js` — never hardcoded in agents.

---

## How to Work With Me

**Before we start, treat me like a beginner.**

- As you build, explain what you're doing in plain English.
- Do not assume I know developer terms.
- When you create a file, explain why it exists.
- When you create an agent, explain what job that agent does.
- When you use a command, explain what the command is doing before you run it.
- Keep the explanations short, practical, and beginner friendly.
- The goal is for me to learn while you build.

**Before you build, analyze my instructions like a strategist. Tell me:**

1. What I am clearly asking for
2. What is implied but not stated
3. What important context is missing
4. What decisions I need to make before you build
5. How you would rewrite my request to get a better result

Then give me the upgraded prompt you recommend I use.

**Before you build:**

Do not build yet. First improve the instruction. Now merge your upgraded prompt with my original intent — keep my voice and business goal. Make it clearer, more specific, and more buildable.
