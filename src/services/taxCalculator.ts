import { QuarterlyInstallment, TaxRegime, UserProfile } from '../types/tax';

/**
 * Calculates Income Tax under New Tax Regime (FY 2025-26 / Budget 2024-25 revisions)
 */
export function calculateNewRegimeTax(totalIncome: number, isSalaried: boolean = true): number {
  const stdDeduction = isSalaried ? 75000 : 0;
  const taxableIncome = Math.max(0, totalIncome - stdDeduction);

  // Section 87A Rebate: if taxable income <= 7,00,000, tax is NIL
  if (taxableIncome <= 700000) {
    return 0;
  }

  let tax = 0;

  if (taxableIncome > 1500000) {
    tax += (taxableIncome - 1500000) * 0.30;
    tax += 300000 * 0.20; // 12-15L
    tax += 200000 * 0.15; // 10-12L
    tax += 300000 * 0.10; // 7-10L
    tax += 400000 * 0.05; // 3-7L
  } else if (taxableIncome > 1200000) {
    tax += (taxableIncome - 1200000) * 0.20;
    tax += 200000 * 0.15;
    tax += 300000 * 0.10;
    tax += 400000 * 0.05;
  } else if (taxableIncome > 1000000) {
    tax += (taxableIncome - 1000000) * 0.15;
    tax += 300000 * 0.10;
    tax += 400000 * 0.05;
  } else if (taxableIncome > 700000) {
    tax += (taxableIncome - 700000) * 0.10;
    tax += 400000 * 0.05;
  } else if (taxableIncome > 300000) {
    tax += (taxableIncome - 300000) * 0.05;
  }

  // 4% Health and Education Cess
  const cess = tax * 0.04;
  return Math.round(tax + cess);
}

/**
 * Calculates Income Tax under Old Tax Regime with standard deductions (80C, 80D, 24b)
 */
export function calculateOldRegimeTax(
  totalIncome: number,
  deductions: { stdDeduction: number; sec80C: number; sec80D: number; homeLoan24b: number }
): number {
  const totalDeductions =
    deductions.stdDeduction +
    Math.min(deductions.sec80C, 150000) +
    Math.min(deductions.sec80D, 50000) +
    Math.min(deductions.homeLoan24b, 200000);

  const taxableIncome = Math.max(0, totalIncome - totalDeductions);

  if (taxableIncome <= 500000) {
    return 0; // Section 87A rebate under old regime
  }

  let tax = 0;
  if (taxableIncome > 1000000) {
    tax += (taxableIncome - 1000000) * 0.30;
    tax += 500000 * 0.20; // 5L - 10L
    tax += 250000 * 0.05; // 2.5L - 5L
  } else if (taxableIncome > 500000) {
    tax += (taxableIncome - 500000) * 0.20;
    tax += 250000 * 0.05;
  } else if (taxableIncome > 250000) {
    tax += (taxableIncome - 250000) * 0.05;
  }

  const cess = tax * 0.04;
  return Math.round(tax + cess);
}

/**
 * Computes Advance Tax Installments & Deadlines for FY 2025-26
 */
export function calculateAdvanceTaxInstallments(
  user: UserProfile
): {
  totalEstimatedTax: number;
  netAdvanceTaxDue: number;
  installments: QuarterlyInstallment[];
  penaltiesPrevented: number;
} {
  const isSalaried = user.profileType === 'salaried';
  const normalIncome = user.grossIncome + user.otherIncome;

  // Normal income tax under chosen regime (includes 4% cess)
  const normalTax =
    user.regime === 'new'
      ? calculateNewRegimeTax(normalIncome, isSalaried)
      : calculateOldRegimeTax(normalIncome, {
          stdDeduction: isSalaried ? 50000 : 0,
          sec80C: 150000,
          sec80D: 25000,
          homeLoan24b: 0,
        });

  // Special Rate Taxes under Budget 2024 (with 4% cess):
  // Section 111A: Short-Term Capital Gains taxed at flat 20%
  const stcgTax = Math.round(user.capitalGains.stcg * 0.20 * 1.04);
  // Section 112A: Long-Term Capital Gains taxed at 12.5% above ₹1,25,000 exemption
  const taxableLtcg = Math.max(0, user.capitalGains.ltcg - 125000);
  const ltcgTax = Math.round(taxableLtcg * 0.125 * 1.04);

  const totalCalculatedTax = normalTax + stcgTax + ltcgTax;

  // Net advance tax payable after employer TDS
  const netAdvanceTaxDue = Math.max(0, totalCalculatedTax - user.salaryTds);

  // If net tax < 10,000, Section 208 advance tax is not mandated
  const requiresAdvanceTax = netAdvanceTaxDue >= 10000;

  // Quarterly targets: 15%, 45%, 75%, 100%
  const q1Target = Math.round(netAdvanceTaxDue * 0.15);
  const q2Target = Math.round(netAdvanceTaxDue * 0.45);
  const q3Target = Math.round(netAdvanceTaxDue * 0.75);
  const q4Target = Math.round(netAdvanceTaxDue * 1.00);

  // Installment breakdowns
  const q1Due = requiresAdvanceTax ? q1Target : 0;
  const q2Due = requiresAdvanceTax ? Math.max(0, q2Target - q1Target) : 0;
  const q3Due = requiresAdvanceTax ? Math.max(0, q3Target - q2Target) : 0;
  const q4Due = requiresAdvanceTax ? Math.max(0, q4Target - q3Target) : 0;

  // Potential Section 234C interest saved (1% per month on shortfall)
  // If unpaid: Q1 shortfall x 3 months x 1% + Q2 x 3 months x 1% + Q3 x 3 months x 1% + Q4 x 1 month x 1%
  const potential234CPenalty = Math.round(
    q1Target * 0.03 + q2Target * 0.03 + q3Target * 0.03 + q4Target * 0.01
  );

  const installments: QuarterlyInstallment[] = [
    {
      quarter: 'Q1',
      periodLabel: 'Apr - Jun',
      deadline: '15 Jun 2026',
      targetPercentage: 15,
      cumulativeLiability: q1Target,
      installmentDue: q1Due,
      paidAmount: q1Due,
      status: 'paid',
      paidDate: '14 Jun 2026',
      crn: 'CRN-26061400892',
      challanId: 'CH-280-Q1-2026',
    },
    {
      quarter: 'Q2',
      periodLabel: 'Jul - Sep',
      deadline: '15 Sep 2026',
      targetPercentage: 45,
      cumulativeLiability: q2Target,
      installmentDue: q2Due,
      paidAmount: 0,
      status: 'scheduled',
      crn: 'CRN-26091409941',
    },
    {
      quarter: 'Q3',
      periodLabel: 'Oct - Dec',
      deadline: '15 Dec 2026',
      targetPercentage: 75,
      cumulativeLiability: q3Target,
      installmentDue: q3Due,
      paidAmount: 0,
      status: 'upcoming',
    },
    {
      quarter: 'Q4',
      periodLabel: 'Jan - Mar',
      deadline: '15 Mar 2027',
      targetPercentage: 100,
      cumulativeLiability: q4Target,
      installmentDue: q4Due,
      paidAmount: 0,
      status: 'upcoming',
    },
  ];

  return {
    totalEstimatedTax: totalCalculatedTax,
    netAdvanceTaxDue,
    installments,
    penaltiesPrevented: potential234CPenalty,
  };
}

/**
 * Format currency in Indian Rupees format (e.g. ₹1,45,000)
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
