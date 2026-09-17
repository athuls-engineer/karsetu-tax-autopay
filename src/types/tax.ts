export type ProfileType = 'salaried' | 'freelancer' | 'investor' | 'business';
export type TaxRegime = 'new' | 'old';
export type AutopayMode = 'direct_sweep' | 'tax_stash';

export type LanguageMode =
  | 'en'       // English (Easy)
  | 'hi'       // हिन्दी (Hindi)
  | 'hinglish' // Hinglish (देसी)
  | 'ta'       // தமிழ் (Tamil)
  | 'te'       // తెలుగు (Telugu)
  | 'kn'       // ಕನ್ನಡ (Kannada)
  | 'bn'       // বাংলা (Bengali)
  | 'mr'       // मराठी (Marathi)
  | 'gu'       // ગુજરાતી (Gujarati)
  | 'ml';      // മലയാളം (Malayalam)

export interface UpiAccount {
  id: string;
  vpa: string;
  bankName: string;
  accountMasked: string;
  accountHolderName: string;
  psp: 'gpay' | 'phonepe' | 'paytm' | 'bhim' | 'cred' | 'bank';
  isPrimary: boolean;
  mandateStatus: 'active' | 'standby' | 'attention_needed';
  mandateLimit: number;      // e.g. 100000 (RBI mandate limit)
  mandateUsed: number;       // amount utilized this cycle
  availableBalance: number;  // simulated AA balance
  lastSync: string;
  successRate: number;       // e.g. 100%
  umn: string;               // Unique Mandate Number
}

export interface QuarterlyInstallment {
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  periodLabel: string;
  deadline: string; // e.g. "15 Jun 2026"
  targetPercentage: number; // 15, 45, 75, 100
  cumulativeLiability: number;
  installmentDue: number;
  paidAmount: number;
  status: 'paid' | 'scheduled' | 'upcoming';
  crn?: string;
  paidDate?: string;
  challanId?: string;
}

export interface TaxDueItem {
  id: string;
  title: string;
  category: 'advance_tax' | 'property_tax' | 'capital_gains' | 'gst' | 'tds';
  dueDate: string;
  daysRemaining: number;
  amount: number;
  status: 'autopay_ready' | 'paid' | 'review_needed';
  tag: string;
  easyDesc: {
    en: string;
    hinglish: string;
  };
  bureaucraticTerm: string;
  savings?: {
    label: string;
    amount: number;
  };
  challanId?: string;
}

export interface ChallanReceipt {
  id: string;
  crn: string;
  bsrCode: string;
  challanNo: string;
  panMasked: string;
  taxpayerName: string;
  assessmentYear: string;
  financialYear: string;
  majorHead: string;
  minorHead: string;
  taxType: string;
  amount: number;
  paymentMode: string;
  bankRef: string;
  paidOn: string;
  cin: string;
  bbpsRef?: string;
}

export interface NotificationSettings {
  whatsappEnabled: boolean;
  smsEnabled: boolean;
  emailEnabled: boolean;
  preNoticeHours: number; // 24 | 48 | 72
  verified: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  profileType: ProfileType;
  pan: string;
  phone: string;
  notifications?: NotificationSettings;
  linkedBank: {
    bankName: string;
    accountNoMasked: string;
    ifsc: string;
    upiId: string;
  };
  regime: TaxRegime;
  grossIncome: number;
  salaryTds: number;
  capitalGains: {
    stcg: number;
    ltcg: number;
  };
  otherIncome: number;
  propertyDetails?: {
    propertyId: string;
    municipality: string;
    ward: string;
    annualTax: number;
    earlyBirdDiscount: number;
  };
  gstin?: string;
  mandate: {
    isActive: boolean;
    mode: AutopayMode;
    maxSingleLimit: number;
    linkedUpi: string;
    preNoticeHours: number;
    stashBalance: number;
    interestYieldPct: number;
  };
  stats: {
    penaltiesSaved234: number;
    earlyBirdSaved: number;
    taxesAutopaidCount: number;
    totalAutopaidAmount: number;
  };
}
