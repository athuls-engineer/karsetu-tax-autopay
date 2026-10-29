# KarSetu (करसेतु) — Indian Tax Calculator & UPI AutoPay Simulator

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An interactive, open-source Indian tax calculator and UPI AutoPay workflow prototype built with **React 19, TypeScript, and Tailwind CSS**.

KarSetu models modern Indian income tax calculations (New vs. Old tax regimes, Budget 2024 capital gains revisions, Section 234C advance tax installment schedules) and provides an interactive simulation of recurring UPI AutoPay mandates and municipal tax payment workflows.

---

## 💡 Overview & Features

* **New vs. Old Regime Comparator**: Side-by-side computation factoring the Section 87A rebate, standard deduction (₹75,000), and Budget 2024 capital gains rates (20% STCG, 12.5% LTCG above ₹1.25L).
* **Advance Tax Installment Schedule**: Computes quarterly liability checkpoints (15%, 45%, 75%, 100%) to demonstrate statutory compliance under Section 234C.
* **UPI AutoPay Mandate Simulation**: Interactive UI demonstrating recurring mandate setups based on RBI e-mandate guidelines.
* **Municipal Tax Portal Demo**: Simulates biller lookups and payment flows across major Indian municipal corporations.
* **Offline Calculation Engine**: Fast in-browser computations verified with stress test suites covering edge-case income brackets.

---

## 🛠️ Tech Stack

* **Frontend**: React 19, TypeScript, Vite
* **Styling**: Tailwind CSS
* **Icons & UI**: Lucide React, Canvas Confetti, QR code generator

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/athuls-engineer/karsetu-tax-autopay.git

# Navigate and install dependencies
cd karsetu-tax-autopay
npm install

# Run development server
npm run dev

# Run test suite
npm test

# Build for production
npm run build
```

---

## 🤝 Authors & Contributors

* **Athul S** ([@athuls-engineer](https://github.com/athuls-engineer)) — Project Creator & Frontend Developer
* **Google Gemini** (AI Pair Programmer) — Co-developer assisting with codebase scaffolding, tax rule logic, benchmark suite implementation, and UI components.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
