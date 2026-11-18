import { useCollections, useStorefront, type CollectionCard } from '@dripfunnel/storefront-core/theme'

/** The pictures the theme holds for each jewellery category (src/theme/media/). */
export type CategoryImage = 'cat-necklace.webp' | 'cat-earrings.webp' | 'cat-ring.webp' | 'cat-bangle.webp' | 'cat-bracelet.webp' | 'cat-jhumka.webp'

/** The wide pictures behind each category's listing banner. */
export type BannerImage = 'col-necklace.webp' | 'about-craft.webp' | 'col-ring.webp' | 'promo-traditional.webp' | 'promo-everyday.webp' | 'promo-festive.webp' | 'hero-model.webp'

export type CategoryKey = 'necklace' | 'earrings' | 'rings' | 'bangles' | 'bracelets' | 'jhumka'

export type Category = {
  key: CategoryKey
  label: string
  blurb: string
  /** The words a search for this category uses, until the store has a collection for it. */
  query: string
  image: CategoryImage
  banner: BannerImage
  /** The store's own collection when one matches the category, else a search for it. */
  href: string
  collection: CollectionCard | null
}

/**
 * The collection names and slugs each category answers to, compared whole (lower case, spaces and hyphens ignored), so
 * "Rings" never picks up an "Earrings" collection. The merchant's collection slug, as Storefront › Collections makes it.
 */
const aliases: Record<CategoryKey, readonly string[]> = {
  necklace: ['necklace', 'necklaces', 'necklaceset', 'necklacesets'],
  earrings: ['earring', 'earrings'],
  rings: ['ring', 'rings'],
  bangles: ['bangle', 'bangles', 'kada', 'kadas'],
  bracelets: ['bracelet', 'bracelets', 'braclet', 'braclets'],
  jhumka: ['jhumka', 'jhumkas', 'jhumki', 'jhumkis', 'jimmiki', 'jhimmiki', 'jimikki'],
}

const plain = (words: string) => words.toLowerCase().replace(/[\s_-]+/g, '')

const matches = (collection: CollectionCard, key: CategoryKey) => {
  const names = aliases[key]
  const slug = plain(collection.href.split('/').filter(Boolean).pop() ?? '')
  return names.includes(plain(collection.name)) || names.includes(slug)
}

/**
 * Whether a product belongs in this category by its own name: any word of it is one of the category's names. A
 * category without a collection is a search, and search also matches descriptions ("a bell-shaped hanging earring"
 * finds the Jimmiki under Earrings), so its results are narrowed to the products this says are the category's own.
 */
export const isCategoryProduct = (category: Category, productName: string) => {
  const names = aliases[category.key]
  return names.includes(plain(productName)) || productName.split(/[\s_-]+/).some((word) => names.includes(plain(word)))
}

/**
 * The six jewellery categories the shop is organised by. Each links to the store's collection of that name once the
 * merchant creates one in Storefront › Collections, and to a search of the catalogue until then, so every link works.
 */
export const useCategories = (): Category[] => {
  const { t } = useStorefront()
  // `first: 20` matches the layout's and the home page's request, so all share one answer.
  const { collections } = useCollections({ first: 20 })
  const make = (key: CategoryKey, label: string, query: string, blurb: string, image: CategoryImage, banner: BannerImage): Category => {
    const collection = collections.find((c) => matches(c, key)) ?? null
    return { key, label, blurb, query, image, banner, collection, href: collection?.href ?? `/search/?q=${query}` }
  }
  return [
    make('necklace', t('common.categories.necklace.label'), t('common.categories.necklace.query'), t('common.categories.necklace.blurb'), 'cat-necklace.webp', 'col-necklace.webp'),
    make('earrings', t('common.categories.earrings.label'), t('common.categories.earrings.query'), t('common.categories.earrings.blurb'), 'cat-earrings.webp', 'about-craft.webp'),
    make('rings', t('common.categories.rings.label'), t('common.categories.rings.query'), t('common.categories.rings.blurb'), 'cat-ring.webp', 'col-ring.webp'),
    make('bangles', t('common.categories.bangles.label'), t('common.categories.bangles.query'), t('common.categories.bangles.blurb'), 'cat-bangle.webp', 'promo-traditional.webp'),
    make('bracelets', t('common.categories.bracelets.label'), t('common.categories.bracelets.query'), t('common.categories.bracelets.blurb'), 'cat-bracelet.webp', 'promo-everyday.webp'),
    make('jhumka', t('common.categories.jhumka.label'), t('common.categories.jhumka.query'), t('common.categories.jhumka.blurb'), 'cat-jhumka.webp', 'promo-festive.webp'),
  ]
}

/** Whether the shopper is on this category's page: its collection, or its search. */
export const isCategoryActive = (category: Category, path: string, query: URLSearchParams) =>
  category.collection ? path === category.collection.href : path.startsWith('/search') && (query.get('q') ?? '').toLowerCase() === category.query.toLowerCase()
