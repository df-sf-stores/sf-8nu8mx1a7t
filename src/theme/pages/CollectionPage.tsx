import { Link, useCollection, useStorefront } from '@dripfunnel/storefront-core/theme'
import { useCategories } from '../components/categories'
import { Layout } from '../components/Layout'
import { ListingBanner } from '../components/ListingBanner'
import { ListingResults } from '../components/ListingResults'
import { Notice } from '../components/Notice'
import { Retry } from '../components/interactive/Retry'
import styles from '../styles/shop.module.css'

export const CollectionPage = () => {
  const { t } = useStorefront()
  const page = useCollection()
  const categories = useCategories()
  const name = page.collection?.name ?? (page.all ? t('shop.collection.all') : null)
  const lead = page.collection ? page.collection.description : page.all ? t('shop.collection.allLead') : null
  const category = page.collection ? categories.find((c) => c.collection?.id === page.collection?.id) : undefined
  return (
    <Layout>
      {page.found === 'missing' ? (
        <section className={styles.page}>
          <Notice main title={t('shop.collection.missing')} lead={t('shop.collection.missingLead')}>
            <Link href="/collections/all/" className={styles.primary}>
              {t('shop.collection.browse')}
            </Link>
          </Notice>
        </section>
      ) : page.found === 'error' ? (
        <section className={styles.page}>
          <Notice main title={t('shop.listing.failed')} lead={t('shop.listing.failedLead')}>
            <Retry label={t('shop.listing.retry')} onRetry={page.retry} />
          </Notice>
        </section>
      ) : (
        <>
          <ListingBanner
            eyebrow={t('shop.collection.eyebrow')}
            title={name ?? t('shop.collection.loading')}
            lead={lead || (category ? t('shop.search.categoryLead', { name: category.label }) : null)}
            crumbs={name ? [{ label: t('shop.crumbs.home'), href: '/' }, { label: name, href: page.collection?.href ?? '/collections/all/' }] : []}
            photo={page.collection?.image ?? null}
            fallback={category?.banner ?? 'col-necklace.webp'}
          />
          <section className={styles.page}>
            <ListingResults listing={page} />
          </section>
        </>
      )}
    </Layout>
  )
}
