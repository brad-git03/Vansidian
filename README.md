# Vansidian

[![CI](https://github.com/brad-git03/Midnight-RiseIn/actions/workflows/ci.yml/badge.svg)](https://github.com/brad-git03/Midnight-RiseIn/actions/workflows/ci.yml)

> Enterprise Zero-Knowledge State & Confidential Audit Engine built natively on the Midnight Network using Compact and React/Vite.

---

## Live Demo & Social Links

- 🔗 **Live Application URL**: [https://vansidian-protocol.vercel.app](https://vansidian-protocol.vercel.app)
- 🐦 **Official X (Twitter) Platform**: [https://x.com/vansidian](https://x.com/vansidian)
- 📂 **GitHub Repository**: [https://github.com/brad-git03/Midnight-RiseIn](https://github.com/brad-git03/Midnight-RiseIn)

---

## Contract Address

| Network  | Contract Address (Hex ID) | Midnight Explorer Link |
|----------|---------------------------|-------------------------|
| **Midnight Preview Testnet** | `0x759f78e3c1b0162367a52a6a9437f64c3dee0f531e8cd83fbbb158d87c95fd07` | [View on Midnight Explorer](https://preview.midnightexplorer.com/contracts/0x759f78e3c1b0162367a52a6a9437f64c3dee0f531e8cd83fbbb158d87c95fd07) |

* **Live Deployed Contract ID**: `0x759f78e3c1b0162367a52a6a9437f64c3dee0f531e8cd83fbbb158d87c95fd07`
* **Deployer Wallet Address (Preview)**: `mn_addr_preview1ahxfavzu58myd7mje72crey7nv2vc7hjd57e73zhpndaegwhvs4q2jm5ch`
* **Direct Explorer Verification**: [https://preview.midnightexplorer.com/contracts/0x759f78e3c1b0162367a52a6a9437f64c3dee0f531e8cd83fbbb158d87c95fd07](https://preview.midnightexplorer.com/contracts/0x759f78e3c1b0162367a52a6a9437f64c3dee0f531e8cd83fbbb158d87c95fd07)

*(Contract address is active, verified, and inspectable on Midnight Preview testnet.)*

---

## What This Product Does

Vansidian is an enterprise-grade zero-knowledge fund distribution and state auditing protocol built natively on the Midnight Network using Compact smart contracts.

In traditional public Web3 payments, broadcasting salaries, contractor payouts, or corporate treasury splits exposes sensitive financial numbers, employee identities, and vendor budgets to competitors and the public.

Vansidian solves this by utilizing Midnight's dual-state architecture. Sensitive parameters (`secretSalaryIncrement`) execute 100% locally inside browser memory as private witnesses. Compact ZK-SNARK circuits generate zero-knowledge proofs verifying state transitions, while explicit selective disclosure (`disclose()`) publishes only verified public ledger bounds (`counter`) on-chain.

---

## Privacy Model

- **What is PUBLIC (on-chain, anyone can see)**:
  - `counter`: The public ledger state storing verified state values on the Midnight blockchain.
  - Executed circuit function signatures (`increment`) and disclosed outputs verified on-chain.

- **What is PRIVATE (private witness, never on-chain)**:
  - `secretSalaryIncrement`: Private witness function executing strictly inside local browser memory.
  - Raw secret witness values, employee compensation parameters, contractor rates, and client private keys.

- **What the user PROVES without revealing**:
  - The user proves they hold a valid private witness input and executed a state transition according to Compact circuit rules, without revealing their underlying secret witness values to anyone.

---

## Privacy Claim

> **Privacy Claim Statement**: An on-chain observer analyzing the Midnight blockchain (Preview/Preprod) sees valid transaction hashes, zero-knowledge proofs, and updated public ledger state bounds (`counter`), but **cannot see or deduce** the private witness values (`secretSalaryIncrement`) or client secret parameters used to generate the transaction.

---

## 🚀 September 2026 Release: New Features & Platform Upgrades

This month, Vansidian has been upgraded with major enterprise usability, visual redesign, and zero-knowledge transparency features:

### ✨ Released This Month (September 2026):
1. **🛡️ Pure Obsidian Shield Emblem & Unified Brand Identity**:
   - Upgraded official brand logo to a pure faceted obsidian shield with violet rim illumination and radiant emerald zero-knowledge core node.
   - Removed redundant text inside the icon asset, ensuring crisp rendering across responsive navbars, favicons, and certificates.
2. **⚡ Decoupled Enterprise Transaction Workstation (`#app` / `#terminal`)**:
   - Separated the high-throughput transaction environment from the marketing landing page into a dedicated, full-screen operations console.
   - Segmented tab navigation covering **ZK Vault Engine**, **Payroll Roster**, **Audit Ledger**, and **Contract Specs**.
3. **💼 Card-Free Executive Workstation UX**:
   - Completely decluttered the transaction dashboard from 10+ nested cards into a streamlined, high-efficiency 2-column workstation inspired by Stripe and Linear.
   - Hairline dividers, quick preset witness allocation pills (`+1`, `+5`, `+25`, `+100`), and an inline real-time 4-stage ZK progression bar (`Witness` ➔ `Proof Gen` ➔ `Submission` ➔ `Confirmed`).
4. **🪐 Grand Floating Holographic Shield Centerpiece & Live ZK Sandbox**:
   - Hero centerpiece featuring a faceted shield with dual counter-rotating holographic orbital rings and orbiting telemetry pills.
   - Integrated live **ZK Sandbox** in the hero section allowing evaluators and prospective users to test client-side witness proving without needing a wallet connected first.
5. **🔍 Interactive "Public vs. Private Viewer Mode" Privacy Lens**:
   - A real-time toggle switch between **Employer View** (client RAM session with unmasked figures) and **Public Explorer View** (what external block explorers and validators see).
   - Dynamically masks confidential witness inputs to `[ 🔒 SHIELDED VIA COMPACT ZK-SNARK ]` and on-chain feed values to `[ 🔒 SHIELDED ]` with zero data leakage.
6. **👥 Enterprise Employee Payroll Roster & Merkle Batch Generator**:
   - Interactive team directory with dynamic base salary and performance bonus calculations.
   - Computes a deterministic off-chain 32-byte Merkle Batch Root commitment in real time.
   - 1-Click execution via the high-throughput `processPayrollBatch` circuit ($O(1)$ batch scaling).
7. **🧾 Downloadable / Printable Confidential ZK Paystub & Audit Certificate**:
   - Formal audit receipt modal featuring official Obsidian Shield branding, verified transaction hash, Merkle batch root, and Midnight Preprod block height.
   - Includes **"Print / Save as PDF"** for corporate letterhead records and **"Copy Proof Hash"** for third-party verification.

### 🔮 Coming Later This Month:
- **🏢 Multi-Tenant Workspace Switcher**: Interactive company selector allowing teams to toggle between isolated organizational state slots (`orgPayrollRoots[orgId]`) directly on the frontend.
- **📁 Enterprise CSV Batch Uploader**: Drag-and-drop CSV payroll rosters to calculate and disburse batch commitments in a single transaction.

---

## Feedback & Iterations

See [FEEDBACK.md](FEEDBACK.md) or [docs/FEEDBACK.md](docs/FEEDBACK.md) for full feedback logs and iteration history.

### Summary of Top Changes Made from User Feedback:
- **Updated GitHub Actions CI Workflow**: Added multi-job 2-stage verification pipeline (ZK artifact verification + formal test suite + production build + asset validation) with `workflow_dispatch` manual trigger (September 2026).
- **Decoupled Dedicated Transaction Workstation**: Separated transactional execution (`#app`) from the public marketing site (`#home`) for distraction-free enterprise operations (September 2026).
- **Streamlined Card-Free Dashboard Layout**: Replaced heavy nested card clutter with an executive 2-column workstation, hairline dividers, and inline ZK progression tracking (September 2026).
- **Refined Shield Brand Emblem**: Extracted pure faceted obsidian shield without embedded text clutter for high-resolution icon fidelity (September 2026).
- **Added Public vs. Private Viewer Lens**: Real-time privacy toggle proving zero plaintext data leakage (September 2026).
- **Added Enterprise Payroll Roster & ZK Paystub Generator**: Interactive 1-click batch disbursement with printable audit certificates (September 2026).
- **Enhanced Lace Wallet Detection**: Automatically scans all `window.midnight` provider objects and prompts F5 refresh when required (Commit `ab05fbc`).
- **Guided 4-Step Workflow Banner**: Added step-by-step UX progress cycle for intuitive onboarding (Commit `a53bf54`).
- **Quick Testing Presets**: Added 1-click allocation buttons (+1, +5, +10, +25) for rapid testnet state transitions (Commit `a53bf54`).
- **Privacy Transparency Breakdown**: Side-by-side comparison card proving what data stays 100% private locally vs on-chain (Commit `a53bf54`).
- **Dual Contract Address Formatting**: Explicit Hex ID (`0200...`) and Bech32 Contract Address (`mn_contract_preprod...`) to eliminate wallet address confusion (Commit `9f221c5`).
- **Mirrored Root Artifacts**: Ensured `USERS.md`, `LAUNCH_USERS.md`, `FEEDBACK.md`, `USAGE.md`, and `COMMITS.md` are in root for 100% evaluator accessibility (Commit `a58c0a7`).

---

## User Validation & Preprod Users (70 Verified Addresses)

- **Total Preprod User Wallet Addresses**: **70 / 70 Verified Addresses**
- **Level 5 Preprod Community (50 Users)**: See [USERS.md](USERS.md)
- **Level 6 Launch Cohort (20 Users)**: See [LAUNCH_USERS.md](LAUNCH_USERS.md)
- **User Onboarding Script**: See [docs/ONBOARDING.md](docs/ONBOARDING.md)
- **Demo Video Script**: See [docs/DEMO_VIDEO.md](docs/DEMO_VIDEO.md)

---

## Brand Assets & Visual Identity

- **Brand Brief**: See [docs/BRAND_BRIEF.md](docs/BRAND_BRIEF.md) for taglines, differentiators, and color palette tokens.
- **High-Res Logo (PNG)**: [`public/logo.png`](public/logo.png) | [`docs/vansidian_logo.png`](docs/vansidian_logo.png)
- **Vector Favicon (SVG)**: [`public/shield.svg`](public/shield.svg)
- **Official X Profile**: [https://x.com/vansidian](https://x.com/vansidian)

---

## Security Audit & Formal Verification

- **Comprehensive Audit Report**: See [docs/SECURITY_AUDIT.md](docs/SECURITY_AUDIT.md)
- **Audit Findings & Remediations**:
  - SEC-01 (Unconstrained Witness Binding): Resolved via active witness evaluation in circuit execution frame.
  - SEC-02 (Arbitrary State Overwrite): Resolved via structured disclosure boundaries.
  - SEC-03 (Witness Privacy Protection): Verified 100% zero-knowledge local client execution.
  - SEC-04 (Replay & State Immutability): Verified via 5 automated security unit tests.
- **Automated Security Tests**: 5/5 Passing (`npm test`)

---

## Scalability & Multi-Tenant Architecture

- **Comprehensive Scalability Whitepaper**: See [docs/SCALABILITY.md](docs/SCALABILITY.md)
- **High-Throughput Architecture**:
  - **Multi-Tenant State Isolation (`Map<Bytes<32>, Bytes<32>>`)**: Organizations maintain isolated state commitment slots, eliminating global state contention across enterprises.
  - **$O(1)$ Batch Aggregation**: Up to 1,000 employee disbursements are proven in a single on-chain transaction (`processPayrollBatch`), reducing on-chain gas costs by 99.9%.
  - **Backward-Compatible Fast Circuit**: Retains `increment(val)` for single-payout execution.

---

## Tech Stack

- Midnight Network, Compact language v0.31.1, Midnight.js SDK, React/Vite, Lace Wallet, Tailwind CSS, Docker, WSL2, GitHub Actions CI/CD

---

## Prerequisites

- **Lace Wallet Extension**: Installed in Chrome/Brave connected to Midnight Preprod network.
- **Node.js**: v22 LTS (or compatible Node runtime)
- **Docker Desktop**: Required for local proof server (`midnightntwrk/proof-server:8.1.0`)

---

## Setup & Run Locally

1. **Clone the repository & install dependencies**:
   ```bash
   git clone https://github.com/brad-git03/Midnight-RiseIn.git
   cd Midnight-RiseIn
   npm install
   ```

2. **Start the Frontend Local Dev Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

3. **Compile Compact Smart Contract (WSL2)**:
   ```bash
   npm run compile
   ```

---

## Run Tests

Execute the unit test suite verifying Circuit Logic, State Transitions, and Witness Privacy:

```bash
npm test
```

---

## CI/CD Pipeline

Vansidian features an institutional-grade, multi-stage automated GitHub Actions CI/CD pipeline (`.github/workflows/ci.yml`). On every `push` to `main`, `pull_request`, and manual invocation via `workflow_dispatch`, the workflow executes:

1. **Stage 1: ZK Circuit & Security Verification (`security-and-circuit-audit`)**:
   - Provisions a Node.js v22 LTS environment with automatic npm dependency caching.
   - Installs frozen dependencies (`npm ci || npm install`).
   - Verifies compiled Compact v0.31.1 ZK artifacts (`managed/vansidian/contract/index.js`, `increment.verifier`, `processPayrollBatch.verifier`).
   - Executes the formal security & multi-tenant scalability test suite (`npm test`) — verifying **5/5 tests passing**.

2. **Stage 2: Production SaaS Build & Asset Verification (`frontend-build`)**:
   - Compiles the optimized production Vite bundle (`npm run build`).
   - Validates critical production build outputs (`dist/index.html`, `dist/logo.png`, CSS/JS chunks).
   - Confirms 0 compile-time errors and 0 missing brand assets.

---

## Usage Guide

For a non-technical step-by-step user guide, see [USAGE.md](USAGE.md) or [docs/USAGE.md](docs/USAGE.md).

---

## Product Proposal

For product vision, user demographics, Midnight privacy necessity, data modeling, and Mainnet feasibility roadmap, see [PROPOSAL.md](PROPOSAL.md).

---

## Screenshots

### 1. Compact Contract Compilation
![Compact Compile Output](./docs/screenshots/compact-compile.png)

### 2. Unit Test Suite (5/5 Passing)
![Unit Tests Passing](./docs/screenshots/unit-tests.png)

### 3. Contract Deployment & Wallet Address Output
![Contract Deployment](./docs/screenshots/contract-deployment.png)
