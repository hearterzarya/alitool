/**
 * Single source of truth for billing cycle labels.
 * Labels are driven by the selected duration: monthly price → "monthly"/"per month", yearly → "yearly"/"/year".
 */

import type { ToolPriceFields } from './price-utils';
import { isDurationEnabled } from './price-utils';

export type PlanType = 'shared' | 'private';
export type BillingCycle = 'monthly' | 'yearly';

export type Duration = '1month' | '3months' | '6months' | '1year';

/**
 * Human-readable billing label from the selected duration.
 * Monthly price → "per month"; 1 year → "yearly"; 3/6 months → "for X months".
 */
export function getBillingLabel(duration: Duration): string {
  switch (duration) {
    case '1month':
      return 'per month';
    case '3months':
      return 'for 3 months';
    case '6months':
      return 'for 6 months';
    case '1year':
      return 'yearly';
    default:
      return 'per month';
  }
}

/**
 * Price suffix from the selected duration: "/month" or "/year".
 */
export function getBillingPriceSuffix(duration: Duration): '/month' | '/year' {
  return duration === '1year' ? '/year' : '/month';
}

/**
 * For tool cards: show "per month" when any plan has a monthly price enabled, else "yearly".
 */
export function getCardBillingSuffix(tool: ToolPriceFields): 'per month' | 'yearly' {
  const hasMonthly =
    isDurationEnabled(tool, 'shared', '1month') || isDurationEnabled(tool, 'private', '1month');
  return hasMonthly ? 'per month' : 'yearly';
}
