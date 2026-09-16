export interface IndianBank {
  id: string;
  name: string;
  shortName: string;
  category: 'popular' | 'psu' | 'private' | 'small_finance' | 'payments' | 'cooperative' | 'foreign' | 'other';
  upiHandles?: string[];
  isPopular?: boolean;
}

export const indianBanks: IndianBank[] = [
  // Top / Most Popular Banks
  { id: 'sbi', name: 'State Bank of India', shortName: 'SBI', category: 'popular', isPopular: true, upiHandles: ['oksbi', 'sbi'] },
  { id: 'hdfc', name: 'HDFC Bank', shortName: 'HDFC', category: 'popular', isPopular: true, upiHandles: ['okhdfcbank', 'hdfcbank', 'hdfc'] },
  { id: 'icici', name: 'ICICI Bank', shortName: 'ICICI', category: 'popular', isPopular: true, upiHandles: ['okicici', 'icici', 'ibl'] },
  { id: 'axis', name: 'Axis Bank', shortName: 'Axis', category: 'popular', isPopular: true, upiHandles: ['okaxis', 'axisbank', 'axis', 'apl'] },
  { id: 'pnb', name: 'Punjab National Bank', shortName: 'PNB', category: 'popular', isPopular: true, upiHandles: ['pnb'] },
  { id: 'bob', name: 'Bank of Baroda', shortName: 'BoB', category: 'popular', isPopular: true, upiHandles: ['barodampay', 'bob'] },
  { id: 'canara', name: 'Canara Bank', shortName: 'Canara', category: 'popular', isPopular: true, upiHandles: ['cnrb', 'canarabank'] },
  { id: 'union', name: 'Union Bank of India', shortName: 'Union', category: 'popular', isPopular: true, upiHandles: ['uboi', 'unionbank'] },
  { id: 'kotak', name: 'Kotak Mahindra Bank', shortName: 'Kotak', category: 'popular', isPopular: true, upiHandles: ['kotak', 'kmbl'] },
  { id: 'federal', name: 'Federal Bank', shortName: 'Federal', category: 'popular', isPopular: true, upiHandles: ['federal', 'fed'] },
  { id: 'idfc', name: 'IDFC FIRST Bank', shortName: 'IDFC FIRST', category: 'popular', isPopular: true, upiHandles: ['idfcbank', 'idfc'] },
  { id: 'indusind', name: 'IndusInd Bank', shortName: 'IndusInd', category: 'popular', isPopular: true, upiHandles: ['indus'] },
  { id: 'boi', name: 'Bank of India', shortName: 'BoI', category: 'popular', isPopular: true, upiHandles: ['boi'] },
  { id: 'indian', name: 'Indian Bank', shortName: 'Indian Bank', category: 'popular', isPopular: true, upiHandles: ['indianbank', 'indbank'] },

  // Public Sector (PSU) Banks
  { id: 'cboi', name: 'Central Bank of India', shortName: 'Central Bank', category: 'psu', upiHandles: ['cboi'] },
  { id: 'iob', name: 'Indian Overseas Bank', shortName: 'IOB', category: 'psu', upiHandles: ['iob'] },
  { id: 'uco', name: 'UCO Bank', shortName: 'UCO', category: 'psu', upiHandles: ['uco'] },
  { id: 'bom', name: 'Bank of Maharashtra', shortName: 'BoM', category: 'psu', upiHandles: ['mahb'] },
  { id: 'psb', name: 'Punjab & Sind Bank', shortName: 'PSB', category: 'psu', upiHandles: ['psb'] },

  // Private Sector Banks
  { id: 'yes', name: 'Yes Bank', shortName: 'Yes Bank', category: 'private', upiHandles: ['ybl', 'yesbank'] },
  { id: 'sib', name: 'South Indian Bank', shortName: 'SIB', category: 'private', upiHandles: ['sib'] },
  { id: 'kbl', name: 'Karnataka Bank', shortName: 'KBL', category: 'private', upiHandles: ['kbl', 'karnatakabank'] },
  { id: 'cub', name: 'City Union Bank', shortName: 'CUB', category: 'private', upiHandles: ['cub'] },
  { id: 'kvb', name: 'Karur Vysya Bank', shortName: 'KVB', category: 'private', upiHandles: ['kvb'] },
  { id: 'rbl', name: 'RBL Bank', shortName: 'RBL', category: 'private', upiHandles: ['rbl'] },
  { id: 'bandhan', name: 'Bandhan Bank', shortName: 'Bandhan', category: 'private', upiHandles: ['bandhan'] },
  { id: 'tmb', name: 'Tamilnad Mercantile Bank', shortName: 'TMB', category: 'private', upiHandles: ['tmb'] },
  { id: 'csb', name: 'CSB Bank', shortName: 'CSB', category: 'private', upiHandles: ['csb'] },
  { id: 'dhanlaxmi', name: 'Dhanlaxmi Bank', shortName: 'Dhanlaxmi', category: 'private', upiHandles: ['dlxb'] },
  { id: 'jk', name: 'Jammu & Kashmir Bank', shortName: 'J&K Bank', category: 'private', upiHandles: ['jkb'] },
  { id: 'nainital', name: 'Nainital Bank', shortName: 'Nainital', category: 'private' },

  // Small Finance Banks
  { id: 'aubank', name: 'AU Small Finance Bank', shortName: 'AU Bank', category: 'small_finance', upiHandles: ['aubank'] },
  { id: 'equitas', name: 'Equitas Small Finance Bank', shortName: 'Equitas', category: 'small_finance', upiHandles: ['equitas'] },
  { id: 'ujjivan', name: 'Ujjivan Small Finance Bank', shortName: 'Ujjivan', category: 'small_finance', upiHandles: ['ujjivan'] },
  { id: 'jana', name: 'Jana Small Finance Bank', shortName: 'Jana', category: 'small_finance', upiHandles: ['jana'] },
  { id: 'esaf', name: 'ESAF Small Finance Bank', shortName: 'ESAF', category: 'small_finance', upiHandles: ['esaf'] },
  { id: 'utkarsh', name: 'Utkarsh Small Finance Bank', shortName: 'Utkarsh', category: 'small_finance', upiHandles: ['utkarsh'] },
  { id: 'fincare', name: 'Fincare Small Finance Bank', shortName: 'Fincare', category: 'small_finance' },
  { id: 'suryoday', name: 'Suryoday Small Finance Bank', shortName: 'Suryoday', category: 'small_finance' },
  { id: 'capital', name: 'Capital Small Finance Bank', shortName: 'Capital SFB', category: 'small_finance' },
  { id: 'shivalik', name: 'Shivalik Small Finance Bank', shortName: 'Shivalik', category: 'small_finance' },
  { id: 'unity', name: 'Unity Small Finance Bank', shortName: 'Unity', category: 'small_finance' },
  { id: 'northeast', name: 'North East Small Finance Bank', shortName: 'North East SFB', category: 'small_finance' },

  // Payments Banks
  { id: 'paytm', name: 'Paytm Payments Bank', shortName: 'Paytm Bank', category: 'payments', upiHandles: ['paytm'] },
  { id: 'airtel', name: 'Airtel Payments Bank', shortName: 'Airtel Bank', category: 'payments', upiHandles: ['airtel'] },
  { id: 'ippb', name: 'India Post Payments Bank', shortName: 'IPPB', category: 'payments', upiHandles: ['postbank', 'ippb'] },
  { id: 'fino', name: 'Fino Payments Bank', shortName: 'Fino Bank', category: 'payments', upiHandles: ['fino'] },
  { id: 'jio', name: 'Jio Payments Bank', shortName: 'Jio Bank', category: 'payments', upiHandles: ['jio'] },

  // Leading Co-operative & Rural Regional Banks (RRB)
  { id: 'saraswat', name: 'Saraswat Co-operative Bank', shortName: 'Saraswat', category: 'cooperative' },
  { id: 'cosmos', name: 'Cosmos Co-operative Bank', shortName: 'Cosmos', category: 'cooperative' },
  { id: 'svc', name: 'SVC Co-operative Bank', shortName: 'SVC Bank', category: 'cooperative' },
  { id: 'nkgsb', name: 'NKGSB Co-operative Bank', shortName: 'NKGSB', category: 'cooperative' },
  { id: 'abhyudaya', name: 'Abhyudaya Co-operative Bank', shortName: 'Abhyudaya', category: 'cooperative' },
  { id: 'tjsb', name: 'TJSB Sahakari Bank', shortName: 'TJSB', category: 'cooperative' },
  { id: 'bharat', name: 'Bharat Co-operative Bank', shortName: 'Bharat Bank', category: 'cooperative' },
  { id: 'keralagramin', name: 'Kerala Gramin Bank', shortName: 'Kerala Gramin', category: 'cooperative' },
  { id: 'karnatakagramin', name: 'Karnataka Gramin Bank', shortName: 'Karnataka Gramin', category: 'cooperative' },
  { id: 'barodaup', name: 'Baroda UP Bank', shortName: 'Baroda UP', category: 'cooperative' },
  { id: 'aryavart', name: 'Aryavart Bank', shortName: 'Aryavart', category: 'cooperative' },
  { id: 'prathama', name: 'Prathama UP Gramin Bank', shortName: 'Prathama', category: 'cooperative' },
  { id: 'maharashtragramin', name: 'Maharashtra Gramin Bank', shortName: 'Maharashtra Gramin', category: 'cooperative' },

  // Foreign Banks Operating in India
  { id: 'stanc', name: 'Standard Chartered Bank', shortName: 'StanChart', category: 'foreign', upiHandles: ['scb'] },
  { id: 'hsbc', name: 'HSBC Bank India', shortName: 'HSBC', category: 'foreign', upiHandles: ['hsbc'] },
  { id: 'citi', name: 'Citibank India', shortName: 'Citi', category: 'foreign' },
  { id: 'dbs', name: 'DBS Bank India', shortName: 'DBS', category: 'foreign', upiHandles: ['dbs'] },
  { id: 'db', name: 'Deutsche Bank India', shortName: 'Deutsche', category: 'foreign' },
];

/**
 * Intelligent helper to detect the bank from a UPI handle suffix.
 * e.g. "rahul@oksbi" -> "State Bank of India"
 * e.g. "ananya@federal" -> "Federal Bank"
 * e.g. "priya@barodampay" -> "Bank of Baroda"
 */
export function detectBankFromVpa(vpa: string): IndianBank | undefined {
  if (!vpa || !vpa.includes('@')) return undefined;
  const suffix = vpa.split('@')[1]?.toLowerCase().trim();
  if (!suffix) return undefined;

  // Direct match on upiHandles
  for (const bank of indianBanks) {
    if (bank.upiHandles && bank.upiHandles.some((h) => suffix === h || suffix.endsWith(h))) {
      return bank;
    }
  }

  // Fallback fuzzy search on bank name or shortName
  for (const bank of indianBanks) {
    const cleanShort = bank.shortName.toLowerCase().replace(/\s+/g, '');
    if (suffix.includes(cleanShort)) {
      return bank;
    }
  }

  return undefined;
}
