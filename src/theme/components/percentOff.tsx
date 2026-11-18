import type { Money } from '@dripfunnel/storefront-core/theme'

/** The whole-number discount a compare-at price shows, worked out from the store's own prices; null when there is none. */
export const percentOff = (price: Money | null, compareAt: Money | null): number | null => {
  if (!price || !compareAt || price.currency !== compareAt.currency) return null
  const now = Number(price.amount)
  const was = Number(compareAt.amount)
  if (!(was > now) || !(now >= 0)) return null
  return Math.round(((was - now) / was) * 100)
}
