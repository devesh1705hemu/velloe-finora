# FINORA

## Financial Intelligence for Your Future

### Your money has a future. See it.

Finora is a financial intelligence and decision-support platform for
young earners. It goes beyond traditional expense tracking by analyzing
financial activity, identifying potential savings opportunities,
simulating future scenarios, and connecting spending decisions with
financial goals.

# 🚀 The Problem

## Most people can see their bank or UPI transactions, but transaction
history alone does not answer:

## Where am I spending the most?

## Which recurring expenses could be reduced?

## Where are my potential savings opportunities?

What happens if I change my spending?

How will today's decisions affect my financial goals?

Traditional expense trackers mainly answer:

"Where did my money go?"

Finora aims to answer:

"Where could my money take me?"

# 💡 The Finora Approach

TRACK
  ↓
UNDERSTAND
  ↓
IDENTIFY OPPORTUNITIES
  ↓
SIMULATE
  ↓
PLAN
  ↓
ACT
  ↓
MEASURE
  ↓
REPEAT

Finora converts financial activity into actionable decision support.

# 🏗️ System Architecture

                                  ┌───────────────────────┐
                                  │        USER           │
                                  │  Web / Mobile Browser │
                                  └───────────┬───────────┘
                                              │
                                              ▼
                              ┌─────────────────────────────┐
                              │       FINORA FRONTEND       │
                              │        Next.js + TS         │
                              │                             │
                              │ Dashboard                   │
                              │ Transactions                │
                              │ Insights                    │
                              │ Leakage                     │
                              │ Goals                       │
                              │ Future Simulator            │
                              │ Finora AI                   │
                              └──────────────┬──────────────┘
                                             │
                                      HTTPS / REST API
                                             │
                                             ▼
                              ┌─────────────────────────────┐
                              │       API / BACKEND         │
                              │    Node.js / Express        │
                              │                             │
                              │ Authentication              │
                              │ Transaction Service         │
                              │ Analytics Service           │
                              │ Goal Service                │
                              │ Scenario Service            │
                              │ AI Service                  │
                              └──────────────┬──────────────┘
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    │                        │                        │
                    ▼                        ▼                        ▼
          ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
          │   PostgreSQL    │      │  Redis / Cache  │      │ Object Storage  │
          │                 │      │                 │      │                 │
          │ Users           │      │ Sessions        │      │ CSV / Reports   │
          │ Transactions    │      │ Cached Insights │      │ Future files    │
          │ Goals           │      │ Rate Limits     │      │                 │
          │ Scenarios       │      │                 │      │                 │
          └─────────────────┘      └─────────────────┘      └─────────────────┘
                                             │
                                             ▼
                              ┌─────────────────────────────┐
                              │    FINANCIAL ENGINE         │
                              │                             │
                              │ Income / Expense            │
                              │ Savings                     │
                              │ Category Analysis           │
                              │ Leakage Detection           │
                              │ Financial Health             │
                              │ Goal Projection             │
                              │ What-if Scenarios           │
                              └──────────────┬──────────────┘
                                             │
                                             ▼
                              ┌─────────────────────────────┐
                              │       FINORA AI LAYER       │
                              │                             │
                              │ Financial Context Layer     │
                              │        ↓                    │
                              │ AI Provider                 │
                              │        ↓                    │
                              │ Validated Response          │
                              └─────────────────────────────┘

# 🔄 Core Data Flow

Transaction Data
      │
      ▼
Import / Manual Entry
      │
      ▼
Validation & Normalization
      │
      ▼
Transaction Database
      │
      ├──────────────► Dashboard
      │
      ├──────────────► Spending Analytics
      │
      ├──────────────► Leakage Detection
      │
      ├──────────────► Financial Health
      │
      ├──────────────► Goal Progress
      │
      └──────────────► Future Simulator
                              │
                              ▼
                       Scenario Engine
                              │
                              ▼
                    Projected Financial Impact
                              │
                              ▼
                         Finora AI
                              │
                              ▼
                    Natural Language Insight

# 🎯 Core Modules

1. Dashboard

Provides a financial overview including:

Total income

Total expenses

Current savings

Potential savings opportunities

Financial Health Score

Spending by category

Income vs expenses

Savings trends

AI-generated insights

2. Transactions

Users can:

Add transactions manually

Edit transactions

Delete transactions

Search transactions

Filter by category

Filter by income/expense

Filter by date

Import CSV transaction data

View transaction details

Example

Date        Description        Category       Amount
------------------------------------------------------
02 Sep      Swiggy             Food           ₹780
04 Sep      Uber               Transport      ₹420
06 Sep      Netflix            Subscription   ₹649
08 Sep      Amazon             Shopping       ₹2,200

3. Financial Insights

Finora analyzes:

Spending categories

Monthly spending

Savings rate

Income vs expenses

Spending trends

Behavioral patterns

Recurring expenses

The goal is to turn raw transactions into understandable financial
information.

🔎 4. Potential Financial Leakage

Finora identifies potential financial savings opportunities rather
than automatically labeling expenses as waste.

Examples:

Food Delivery
10 transactions
₹3,200 total
Potential reduction opportunity

Subscriptions
3 recurring payments
₹1,067/month
Potential recurring savings opportunity

Shopping
₹5,000 this month
18% higher than previous period

Each insight should explain:

Why it was detected

Supporting transactions

Time period

Comparison baseline

Potential impact

🎯 5. Goals

Users can create financial goals such as:

Laptop
Target: ₹60,000
Current: ₹20,000
Progress: 33%

Emergency Fund
Target: ₹1,00,000
Current: ₹35,000

Travel
Target: ₹30,000
Current: ₹12,000

Finora connects spending behavior with goal progress.

🔮 6. Future Simulator

The Future Simulator is one of Finora's key differentiators.

Users can change variables such as:

Food spending

Shopping

Entertainment

Monthly savings

Goal contribution

Example

CURRENT SCENARIO

Income             ₹50,000
Expenses           ₹42,000
Monthly Savings     ₹8,000


WHAT-IF SCENARIO

Reduce Food       -₹1,500
Reduce Shopping   -₹1,000
Reduce Subscriptions -₹500

Projected Savings  ₹11,000/month

The system then estimates how the scenario could affect a financial
goal.

Important: Scenario results are projections, not guaranteed
outcomes.

Actual financial data is never modified simply by changing a scenario.

# 🤖 7. Finora AI

Finora AI acts as a financial intelligence assistant.

Example questions:

Where am I spending the most?

Where are my biggest savings opportunities?

Analyze my month.

How is my laptop goal progressing?

Compare this month with last month.

What happens if I save ₹3,000 more every month?

# AI Architecture

User Question
     │
     ▼
Finora AI API
     │
     ▼
Financial Context Layer
     │
     ▼
Verified Backend Calculations
     │
     ▼
AI Provider
     │
     ▼
Validated Response
     │
     ▼
User

The financial engine is responsible for calculations.

The AI is responsible for explaining verified results.

This reduces the risk of the AI inventing financial numbers.

# 👤 Real-World Example

Imagine a 25-year-old professional earns:

Monthly Income: ₹50,000

At the end of the month:

Expenses: ₹42,000
Savings:  ₹8,000

The user feels that ₹8,000 savings is low but doesn't know why.

Finora analyzes the transactions and finds:

Food                  ₹7,200
Shopping              ₹5,000
Transport             ₹2,800
Subscriptions         ₹1,200
Bills                 ₹7,000
Other                 ₹18,800

Finora detects repeated discretionary spending.

Instead of saying:

"You are wasting money."

It provides a neutral insight:

"You have several recurring and discretionary spending patterns that
may represent savings opportunities."

The user opens Future Simulator.

They test:

Food reduction:          ₹1,500
Shopping reduction:      ₹1,000
Subscription reduction:    ₹500

Potential additional savings:

₹3,000/month
₹36,000/year

If the user has a ₹60,000 laptop goal, Finora can show how the scenario
could change the projected completion timeline.

This is the core Finora experience:

Real Spending
     ↓
Financial Insight
     ↓
Potential Opportunity
     ↓
What-if Scenario
     ↓
Future Goal Impact
     ↓
Better Decision

## 🧠 Financial Intelligence Engine

Finora should keep deterministic financial calculations separate from
AI-generated explanations.

                 TRANSACTIONS
                      │
                      ▼
              DATA NORMALIZATION
                      │
                      ▼
             FINANCIAL CALCULATIONS
                      │
       ┌──────────────┼──────────────┐
       ▼              ▼              ▼
    Savings        Analytics       Goals
       │              │              │
       └──────────────┼──────────────┘
                      ▼
              INSIGHT GENERATION
                      │
                      ▼
                FINORA AI

Example deterministic calculations:

Savings = Income - Expenses

Savings Rate =
Savings / Income × 100

Goal Progress =
Current Amount / Target Amount × 100

Annual Potential Savings =
Monthly Potential Savings × 12

🛡️ Security & Privacy

Finora is designed with financial data sensitivity in mind.

Key principles:

Never expose API keys in the frontend

Secure authentication

Server-side authorization

Input validation

Zod schema validation

HTTPS in production

No sensitive data in logs

User-level data isolation

Secure session management

Data export

Account deletion

Audit-friendly architecture

For the prototype, synthetic transaction data can be used for
demonstrations.

🏦 Bank / UPI Data

The prototype does not require direct bank or UPI integration.

Supported input methods:

Manual Transaction Entry
          │
          ├─────────────┐
          ▼             ▼
       CSV Import    Future Aggregation API

A future production architecture can integrate an authorized
financial-data aggregation layer rather than attempting to directly
access users' UPI apps or bank credentials.

🧩 Production Architecture

For a production deployment, Finora can evolve into:

                         FINORA
                           │
             ┌─────────────┴─────────────┐
             │                           │
       Web Application              Mobile App
             │                           │
             └─────────────┬─────────────┘
                           │
                           ▼
                       API Gateway
                           │
       ┌───────────────────┼────────────────────┐
       │                   │                    │
       ▼                   ▼                    ▼
 Auth Service       Finance Service       AI Service
       │                   │                    │
       │                   ▼                    │
       │             Analytics Engine          │
       │                   │                    │
       └───────────────┬───┴────────────────────┘
                       │
                       ▼
                 Data Platform
             ┌─────────┼─────────┐
             ▼         ▼         ▼
         PostgreSQL   Redis    Object Storage

This architecture is designed to support future requirements such as:

Multi-user systems

Role-based access

Multi-tenancy

Financial-data aggregation

Advanced analytics

AI services

Notifications

Audit logs

Enterprise financial wellness products

🛠️ Tech Stack

Frontend

Next.js

TypeScript

Tailwind CSS

shadcn/ui

TanStack Query

React Hook Form

Zod

Recharts

Framer Motion

Backend

Node.js

Express / Next.js API

TypeScript

REST APIs

Zod validation

Database

PostgreSQL

Redis

Object Storage

AI

OpenAI API

Financial Context Layer

Deterministic calculation engine

DevOps / Deployment

Git

GitHub

Docker

CI/CD

Vercel

Cloud infrastructure

# 📁 Suggested Project Structure

finora/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── features/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── transactions/
│   │   ├── insights/
│   │   ├── leakage/
│   │   ├── goals/
│   │   ├── future/
│   │   └── ai/
│   ├── hooks/
│   ├── services/
│   ├── schemas/
│   ├── types/
│   └── utils/
│
├── backend/
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── validators/
│   └── utils/
│
├── tests/
│   └── fixtures/
│
├── docs/
│
├── .env.example
├── .gitignore
└── README.md

# 🚀 Getting Started

1. Clone the repository

git clone https://github.com/YOUR_USERNAME/finora.git
cd finora

2. Install dependencies

npm install

If frontend and backend are separate:

cd frontend
npm install

cd ../backend
npm install

3. Configure environment variables

Create:

.env.local

Example:

DATABASE_URL=
OPENAI_API_KEY=
JWT_SECRET=
NEXT_PUBLIC_API_URL=

Never commit .env or .env.local.

4. Run the application

npm run dev

🧪 Testing Finora

Use synthetic transaction datasets to test:

CSV import

Transaction validation

Dashboard calculations

Category analytics

Leakage detection

Monthly trends

Goal calculations

Future simulations

AI responses

Recommended test flow:

Import CSV
    ↓
Verify Transactions
    ↓
Verify Dashboard
    ↓
Check Insights
    ↓
Check Leakage
    ↓
Create Goal
    ↓
Open Future Simulator
    ↓
Change Spending
    ↓
Verify Projection
    ↓
Ask Finora AI



The key demo moment

Show the mentor:

Current Savings
₹8,000/month

        ↓

Change Food + Shopping Spending

        ↓

Projected Savings
₹11,000/month

        ↓

Goal Timeline Changes

Then explain:

"Finora doesn't just tell the user what happened to their money. It
lets them explore what could happen next."

🎯 Target Users

Primary target:

Indian first-job professionals aged approximately 21--28 who earn
regularly, use UPI frequently, and have concrete financial goals but
lack a structured personal-finance system.

Secondary users:

Students with income

Interns

Young professionals

Goal-oriented young earners

🔮 Future Roadmap

Phase 1

Transaction tracking

CSV import

Dashboard

Financial insights

Potential leakage detection

Goals

Future Simulator

Finora AI

Phase 2

Authorized financial-data aggregation

Automated transaction categorization

Notifications

Advanced reports

Mobile application

Phase 3

Advanced financial forecasting

Personalized financial planning

Enterprise financial wellness

Multi-tenant architecture

Organization dashboards

Advanced AI financial intelligence

📌 Product Philosophy

Finora should not tell users what they must do with their money.

It should provide understandable data, explain patterns, show potential
scenarios, and help users make informed financial decisions.

DATA
 ↓
INTELLIGENCE
 ↓
SCENARIOS
 ↓
GOALS
 ↓
DECISIONS

🌟 Vision

Finora aims to move personal finance from:

Transaction History
        ↓
Expense Tracking

towards:

Financial Data
      ↓
Understanding
      ↓
Intelligence
      ↓
Future Simulation
      ↓
Goal Planning
      ↓
Better Decisions

FINORA --- Your money has a future. See it.
