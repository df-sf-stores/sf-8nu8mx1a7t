import { Link, SearchField, useSearch, useStorefront } from '@dripfunnel/storefront-core/theme'
import { isCategoryProduct, useCategories } from '../components/categories'
import { Layout } from '../components/Layout'
import { ListingBanner } from '../components/ListingBanner'
import { ListingResults } from '../components/ListingResults'
import { Notice } from '../components/Notice'
import styles from '../styles/shop.module.css'

/**
 * Search, which also serves a jewellery category until the store has a collection for it: a search for a category's
 * words shows that category's banner and name, and only the products whose own name is of that category.
 */
export const SearchPage = () => {
  const { t } = useStorefront()
  const search = useSearch()
  const categories = useCategories()
  const category = categories.find((c) => c.query.toLowerCase() === search.query.trim().toLowerCase())
  // A category's search keeps only its own products; the next page may still hold some, so it is empty only at the end.
  const listing = category ? { ...search, items: search.items.filter((p) => isCategoryProduct(category, p.name)) } : search
  const none = search.status === 'ready' && listing.items.length === 0 && search.selected.length === 0 && (!category || !search.hasMore)
  const title = category ? t('shop.search.category', { name: category.label }) : search.query ? t('shop.search.results', { query: search.query }) : t('shop.search.title')
  return (
    <Layout>
      <ListingBanner
        eyebrow={category ? t('shop.collection.eyebrow') : t('shop.search.eyebrow')}
        title={title}
        lead={category ? t('shop.search.categoryLead', { name: category.label }) : search.query ? null : t('shop.search.lead')}
        crumbs={[
          { label: t('shop.crumbs.home'), href: '/' },
          { label: category ? category.label : t('shop.search.title'), href: category ? category.href : '/search/' },
        ]}
        photo={null}
        fallback={category?.banner ?? 'hero-model.webp'}
      />
      <section className={styles.page}>
        {category ? null : <SearchField label={t('shop.search.label')} placeholder={t('shop.search.placeholder')} button={t('shop.search.button')} value={search.query} onSearch={search.setQuery} className={styles.search} />}
        {none && category ? (
          <Notice title={t('shop.search.categoryEmpty', { name: category.label })} lead={t('shop.search.categoryEmptyLead', { name: category.label })}>
            <Link href="/collections/all/" className={styles.primary}>
              {t('shop.collection.browse')}
            </Link>
            {categories
              .filter((c) => c.key !== category.key)
              .map((c) => (
                <Link key={c.key} href={c.href} className={styles.chipLink}>
                  {c.label}
                </Link>
              ))}
          </Notice>
        ) : none ? (
          <Notice title={t('shop.search.none', { query: search.query })} lead={t('shop.search.noneLead')}>
            {categories.map((c) => (
              <Link key={c.key} href={c.href} className={styles.chipLink}>
                {c.label}
              </Link>
            ))}
          </Notice>
        ) : search.status === 'idle' ? null : (
          <ListingResults listing={listing} />
        )}
      </section>
    </Layout>
  )
}
