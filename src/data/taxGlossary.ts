export interface GlossaryItem {
  term: string;
  bureaucraticName: string;
  simpleMeaning: {
    en: string;
    hinglish: string;
  };
  whyItMatters: string;
  autoSolution: string;
}

export const taxGlossary: GlossaryItem[] = [
  {
    term: 'Advance Tax',
    bureaucraticName: 'Section 208 of Income Tax Act 1961 (Pay As You Earn)',
    simpleMeaning: {
      en: 'Paying small chunks of your income tax quarterly instead of waiting till March, whenever you earn from stocks, freelancing, or bonuses.',
      hinglish: 'Saal bhar ki thodi thodi kamai par har 3 mahine me tax dena, taaki aakhri me ek saath mota bojh aur fine na lage.',
    },
    whyItMatters: 'If you delay, the government slaps a 1% compound monthly penalty (Section 234B & 234C).',
    autoSolution: 'KarSetu tracks your income silently via Account Aggregator and autopays before the 15th deadline.',
  },
  {
    term: 'Section 234C Penalty',
    bureaucraticName: 'Interest for deferment of advance tax payment',
    simpleMeaning: {
      en: 'Late fee interest of 1% per month charged if you miss any of the 4 quarterly tax milestones (15%, 45%, 75%, 100%).',
      hinglish: 'Quarterly tax date miss karne par sarkar dwara lagaya gaya 1% mahine ka byaaj.',
    },
    whyItMatters: 'Can cost between ₹5,000 to ₹50,000+ every year in pure dead loss interest!',
    autoSolution: 'KarSetu maintains an active "Penalty Shield" that automatically clears installments on time.',
  },
  {
    term: 'Challan 280 & CRN',
    bureaucraticName: 'TIN 2.0 ITNS 280 Challan Reference Number',
    simpleMeaning: {
      en: 'The official digital receipt voucher number issued by the Income Tax Department confirming your tax deposit.',
      hinglish: 'Sarkar ki taraf se pakka digital bill aur receipt jo confirm karta hai ki aapka tax jama ho gaya.',
    },
    whyItMatters: 'Proof needed for your annual tax return (ITR).',
    autoSolution: 'KarSetu generates the CRN directly and stores official BSR receipts in your Tax Vault forever.',
  },
  {
    term: 'BBPS Property Tax',
    bureaucraticName: 'Bharat Bill Payment System Municipal Assessment',
    simpleMeaning: {
      en: 'The yearly civic tax paid to your local municipal body (like BBMP, BMC, MCD, GHMC) for your house or flat.',
      hinglish: 'Ghar ya flat ka nagar nigam ko diya jane wala saalana tax.',
    },
    whyItMatters: 'Most cities give 5% early rebate if paid early, but charge 2% penalty per month for delays.',
    autoSolution: 'KarSetu links your Property ID once, fetches the bill on day 1, and grabs the 5% discount automatically.',
  },
  {
    term: 'Account Aggregator (AA)',
    bureaucraticName: 'RBI Regulated Non-Banking Financial Company - Account Aggregator',
    simpleMeaning: {
      en: 'A 100% RBI-safe digital pipe that lets you share your bank statement & stock profits without sharing passwords or net banking logins.',
      hinglish: 'RBI dwara approved ek safe connection jisse bina password diye aapki kamai calculate ho sake.',
    },
    whyItMatters: 'Bank statements cannot be tampered with, meaning zero calculation errors.',
    autoSolution: 'KarSetu uses AA consent to auto-detect dividend, interest, and consulting income in seconds.',
  },
];
