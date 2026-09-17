import { TaxDueItem, UserProfile } from '../types/tax';
import { formatINR } from './taxCalculator';

/**
 * Clean phone number to 10-digit standard Indian format
 */
export function sanitizeIndianPhone(input: string): string {
  const digits = (input || '').replace(/\D/g, '');
  if (digits.length > 10 && digits.startsWith('91')) {
    return digits.slice(2, 12);
  }
  return digits.slice(-10);
}

/**
 * Display formatted phone number: +91 98765 43210
 */
export function formatDisplayPhone(phone: string): string {
  const clean = sanitizeIndianPhone(phone);
  if (clean.length === 10) {
    return `+91 ${clean.slice(0, 5)} ${clean.slice(5)}`;
  }
  return phone ? `+91 ${phone}` : '+91 98765 43210';
}

/**
 * Official WhatsApp Pre-Debit Notice Template (CBDT & RBI compliant)
 */
export function generateWhatsAppNoticeText(user: UserProfile, taxItem: TaxDueItem): string {
  const isBBPS = taxItem.category === 'property_tax';
  const isGST = taxItem.category === 'gst';
  const railName = isBBPS ? 'NPCI BBPS Municipal Rail' : isGST ? 'GSTN PMT-06' : 'TIN 2.0 ITNS 280';
  const department = isBBPS ? 'Municipal Corporation' : isGST ? 'Goods & Services Tax Network' : 'Income Tax Department';
  const bankMasked = `${user.linkedBank.bankName} (••••${user.linkedBank.accountNoMasked.slice(-4)})`;
  const savingsText = isBBPS ? '5% Early-Bird Municipal Rebate' : 'Saves ₹1,750 Sec 234C Fine';

  return `🏛️ *KARSETU SOVEREIGN TAX AUTOPILOT*
━━━━━━━━━━━━━━━━━━━━
Namaste *${user.name}*,

⚠️ *Mandatory 72-Hour Pre-Debit Notice*
Under RBI e-Mandate Circular 2023, this notice is issued prior to funds transfer.

📋 *Challan & Tax Head:*
• *Tax Category:* ${taxItem.title}
• *Deposit Amount:* *${formatINR(taxItem.amount)}*
• *Scheduled Date:* *${taxItem.dueDate}*
• *Beneficiary:* Government of India (${department})
• *Settlement Rail:* ${railName}
• *Debited Bank:* ${bankMasked}
• *Benefit Shield:* ${savingsText}

🔒 *Zero-Float Sovereign Assurance:*
100% of your funds are routed directly into the Consolidated Fund of India (Article 266). KarSetu never holds or escrows your money.

👇 *Review, Pause or Adjust anytime:*
https://athuls-engineer.github.io/karsetu-tax-autopay/

_Reply PAUSE or click above to pause this auto-deposit anytime before ${taxItem.dueDate}._
━━━━━━━━━━━━━━━━━━━━
_Verified Bot: KarSetu Technologies Pvt Ltd (CBDT & NPCI Partner)_`;
}

/**
 * Official TRAI DLT Compliant SMS Template
 */
export function generateSmsNoticeText(user: UserProfile, taxItem: TaxDueItem): string {
  return `[KARSETU] Alert: AutoPay scheduled for ${taxItem.title} of ${formatINR(taxItem.amount)} on ${taxItem.dueDate} via ${user.linkedBank.bankName}. Zero penalty guaranteed. To review or pause debit, click https://athuls-engineer.github.io/karsetu-tax-autopay/ - GOVT OF INDIA`;
}

/**
 * Open official WhatsApp link to send real message to user's phone
 */
export function dispatchWhatsAppMessage(phone: string, user: UserProfile, taxItem: TaxDueItem): void {
  const clean = sanitizeIndianPhone(phone || user.phone);
  const message = generateWhatsAppNoticeText(user, taxItem);
  const waUrl = `https://wa.me/91${clean}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank', 'noopener,noreferrer');
}

/**
 * Open native SMS app on smartphone
 */
export function dispatchSmsMessage(phone: string, user: UserProfile, taxItem: TaxDueItem): void {
  const clean = sanitizeIndianPhone(phone || user.phone);
  const message = generateSmsNoticeText(user, taxItem);
  const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const separator = isIOS ? '&' : '?';
  const smsUrl = `sms:+91${clean}${separator}body=${encodeURIComponent(message)}`;
  window.location.href = smsUrl;
}
