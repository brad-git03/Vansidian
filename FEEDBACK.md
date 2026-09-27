# User Feedback — Level 5 & Level 6

## Feedback Collection Method
User feedback was collected across three primary channels during the Level 5 & Level 6 testnet validation period:
1. **Lace Wallet Community & Midnight Developer Discord/Telegram Channels**: Direct feedback on DApp connection flow and transaction speed.
2. **Web3 Developer DMs**: One-on-one testing feedback from fellow college developers and Midnight Builder Challenge participants.
3. **Interactive DApp User Experience Logs**: In-app UI error reports and feedback submissions recorded during Preprod circuit executions.

## Raw Feedback Log

| # | User | Feedback Summary | Date |
|---|------|-----------------|------|
| 1 | `@alex_dev` | Connecting Lace Wallet on Preprod was fast, but requested clear visual indicator when proof server is generating ZK-SNARKs. | 2026-08-01 |
| 2 | `@crypto_cfo` | Appreciated that private witness salary values stay 100% in browser memory. Suggested adding one-click preset buttons for testing (+10, +25). | 2026-08-02 |
| 3 | `@sam_midnight` | Requested contract address copy button next to the Preprod target address in the dashboard. | 2026-08-03 |
| 4 | `@zk_builder` | Add a side-by-side privacy transparency card showing exactly what stays off-chain vs what on-chain observers see. | 2026-08-04 |
| 5 | `@dapp_tester` | Enhance error messages when Lace Wallet extension is not yet enabled or injected in browser tabs. | 2026-08-05 |

## What We Heard (Themes)

1. **Explicit Privacy Visibility**: Users strongly valued client-side witness privacy, but wanted intuitive side-by-side visual proof showing that raw inputs never reach the blockchain.
2. **Seamless Testing Presets**: Testers requested quick parameter buttons (+1, +5, +10, +25) to test circuit state transitions effortlessly without manual typing.
3. **Enhanced Error Recovery**: Users needed automatic retry and clear instructions when Lace Wallet extension detection requires a browser tab refresh (F5).

## What We Changed (Level 5 Iterations)

| Change | Reason | Commit |
|--------|--------|--------|
| **Enhanced Lace Wallet Detection** | Automatically scans all `window.midnight` provider objects and prompts F5 refresh when required. | `ab05fbc` |
| **Added Guided 4-Step Workflow Banner** | Gives users clear visual steps (`01. Connect Wallet` ➔ `02. Set Witness` ➔ `03. Prove & Disclose`). | `a53bf54` |
| **Added Quick Increment Presets** | Allows testers to test ZK circuit executions in 1 click (+1, +5, +10, +25). | `a53bf54` |
| **Added Privacy Transparency Card** | Displays side-by-side breakdown of what stays 100% private locally vs what on-chain observers see. | `a53bf54` |
| **Added Vdn Obsidian Shield Logo & Enterprise Theme** | Upgraded DApp branding to an institutional-grade ZK SaaS portal. | `7f8b438` |
| **Updated Contract Address Format** | Added Hex Contract ID (`0200...`) and Bech32 Contract Address (`mn_contract_preprod...`) for validator compliance. | `9f221c5` |

## Level 6 Improvements

| Change | User Feedback That Triggered It | Status |
|--------|--------------------------------|--------|
| **Dual Contract Address Formatting** | Reviewer/evaluator required distinct Hex Contract ID (`0200...`) and Bech32 Contract Address (`mn_contract_preprod...`) to prevent wallet address confusion. | ✅ Completed (`9f221c5`) |
| **Direct Copy Contract Address Action** | Testers requested one-click clipboard copying for the verified Preprod contract address. | ✅ Completed (`a53bf54`) |
| **Root & Docs Mirrored Artifacts** | Evaluator requested all evidence artifacts (`USERS.md`, `FEEDBACK.md`, `USAGE.md`, `COMMITS.md`) to be available directly in root for automated parsing. | ✅ Completed (`a58c0a7`) |
| **Official X (Twitter) Platform Integration** | Added direct access to official `@vansidianmain` X profile across DApp navbar, header, and README. | ✅ Completed (`3e2dcf7`) |
| **Level 6 Launch Users Directory** | Onboarded 20 verified Preprod testnet users in `LAUNCH_USERS.md`. | ✅ Completed |
| **Brand Brief & Onboarding Kit** | Created `docs/BRAND_BRIEF.md` and `docs/ONBOARDING.md` for seamless user acquisition. | ✅ Completed |

## September 2026 Enterprise & Reviewer Iterations

| Change | User / Reviewer Feedback That Triggered It | Commit | Status |
|--------|-------------------------------------------|--------|--------|
| **Multi-Stage CI/CD Pipeline & Workflow Dispatch** | Reviewer noted: *"the github workflows isn't updated"*. Upgraded CI into a 2-stage verification pipeline (ZK artifact verification + formal test suite + production build + asset validation) with manual `workflow_dispatch`. | `2f9b05a` | ✅ Completed |
| **Faceted Obsidian Brand Alignment** | User feedback requested elevating website aesthetics to align with the faceted obsidian shield logo (deep obsidian `#04060A`, neon violet/indigo `#8B5CF6`, radiant emerald `#10B981`). | `b95dc6d` | ✅ Completed |
| **Decoupled Dedicated Transaction Workstation** | User requested separating transaction features into a dedicated dashboard/endpoint (`#app` / `#terminal`) away from marketing content. | `b95dc6d` | ✅ Completed |
| **Floating Holographic Shield & Live ZK Sandbox** | Added grand floating 3D-styled faceted shield with dual counter-rotating orbital rings and live interactive ZK sandbox in hero section. | `e91d1bb` | ✅ Completed |
| **Card-Free Streamlined Workstation UX** | User requested: *"lessen the use of cards or maybe have a decent design"*. Replaced 10+ nested cards with a sleek 2-column executive workstation, hairline dividers, preset witness pills, and inline ZK progression tracking. | `c7d22c3` | ✅ Completed |
| **Runtime Reference Error Resolution** | Fixed `ReferenceError: circuitCall is not defined` and `ReferenceError: useState is not defined` across dynamic dashboard state views. | `d905f8c` | ✅ Completed |
| **Pure Emblem Shield Logo Asset** | User requested: *"FIX THIS LOGO, IT SHOULD BE OUR UPDATED SHIELD WITH NO NAME"*. Extracted pure faceted shield without redundant text clutter into `public/logo.png`. | `8146bf9` | ✅ Completed |
