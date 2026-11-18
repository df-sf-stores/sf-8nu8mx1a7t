import type { ReactNode } from 'react'
import { Link, ThemeImage, useProducts, useStorefront, type ProductCard as Card } from '@dripfunnel/storefront-core/theme'
import { useCategories } from '../components/categories'
import { Layout } from '../components/Layout'
import { ProductCard } from '../components/ProductCard'
import { SectionHeading } from '../components/SectionHeading'
import { cx } from '../components/cx'
import shop from '../styles/shop.module.css'
import styles from '../styles/home.module.css'

const ArrowIcon = () => (
  <svg className={styles.arrowIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

const Pledge = ({ title, body, children }: { title: string; body: string; children: ReactNode }) => (
  <li className={styles.promise}>
    <span className={styles.promiseIcon} aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        {children}
      </svg>
    </span>
    <h3 className={styles.promiseTitle}>{title}</h3>
    <p className={styles.promiseBody}>{body}</p>
  </li>
)

/**
 * A row of product cards that scrolls sideways when there are more than fit. While loading it keeps its shape; with
 * no products it says so, or leaves no gap when `empty` isn't given.
 */
const ProductRail = ({ products, label, empty }: { products: { status: string; items: Card[] }; label: string; empty?: string }) => {
  const none = products.status !== 'loading' && !products.items.length
  if (none) return empty ? <p className={styles.railEmpty}>{empty}</p> : null
  return products.status === 'loading' ? (
    <ul className={styles.rail} aria-busy="true" aria-label={label}>
      {[0, 1, 2, 3].map((i) => (
        <li key={i} className={styles.railItem}>
          <div className={shop.skeletonPicture} />
          <div className={shop.skeletonLine} />
        </li>
      ))}
    </ul>
  ) : (
    <ul className={styles.rail}>
      {products.items.map((product) => (
        <li key={product.id} className={styles.railItem}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  )
}

export const HomePage = () => {
  const { store, t } = useStorefront()
  const categories = useCategories()
  const newest = useProducts({ sort: 'newest', first: 8 })
  const favourites = useProducts({ sort: 'best-selling', first: 8 })
  const whatsapp = store.social.find((s) => s.network === 'whatsapp')
  const byKey = (key: string) => categories.find((c) => c.key === key)?.href ?? '/collections/all/'
  const viewAll = (
    <Link href="/collections/all/" className={styles.textLink}>
      {t('home.viewAll')}
      <ArrowIcon />
    </Link>
  )
  return (
    <Layout>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.heroEyebrow}>{t('home.hero.eyebrow')}</p>
            <h1 className={styles.heroTitle}>
              {t('home.hero.title')} <em className={styles.heroAccent}>{t('home.hero.accent')}</em>
            </h1>
            <p className={styles.heroLead}>{t('home.hero.lead')}</p>
            <div className={styles.heroActions}>
              <Link href="/collections/all/" className={styles.goldButton}>
                {t('home.hero.explore')}
                <ArrowIcon />
              </Link>
              <Link href="#favourites" className={styles.ghostButton}>
                {t('home.hero.favourites')}
              </Link>
            </div>
            <ul className={styles.heroPoints}>
              <li>{t('home.hero.pointOne')}</li>
              <li>{t('home.hero.pointTwo')}</li>
              <li>{t('home.hero.pointThree')}</li>
            </ul>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.heroArch}>
              <ThemeImage src="hero-model.webp" alt={t('home.hero.imageAlt')} ratio={1.19} sizes="(min-width: 1024px) 560px, 92vw" className={styles.cover} />
            </div>
            <Link href={byKey('jhumka')} className={styles.heroBadge}>
              <span className={styles.heroBadgeThumb}>
                <ThemeImage src="cat-jhumka.webp" alt="" ratio={1} sizes="72px" className={styles.cover} />
              </span>
              <span className={styles.heroBadgeText}>
                <span className={styles.heroBadgeName}>{categories[5]?.label}</span>
                <span className={styles.heroBadgeMore}>{t('home.categories.explore')}</span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <SectionHeading eyebrow={t('home.categories.eyebrow')} title={t('home.categories.title')} />
        <ul className={styles.categories}>
          {categories.map((c) => (
            <li key={c.key}>
              <Link href={c.href} className={styles.category}>
                <span className={styles.categoryPicture}>
                  <ThemeImage src={c.image} alt="" ratio={0.8} sizes="(min-width: 1024px) 200px, 33vw" className={styles.cover} />
                </span>
                <span className={styles.categoryName}>{c.label}</span>
                <span className={styles.categoryMore}>
                  {t('home.categories.explore')}
                  <ArrowIcon />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={cx(styles.section, styles.sectionTint)}>
        <div className={styles.sectionInner}>
          <SectionHeading eyebrow={t('home.newest.eyebrow')} title={t('home.newest.title')} action={viewAll} start />
          <ProductRail products={{ status: newest.status, items: newest.products }} label={t('shop.listing.loading')} empty={t('home.newest.empty')} />
        </div>
      </section>

      <section className={styles.section}>
        <SectionHeading eyebrow={t('home.campaigns.eyebrow')} title={t('home.campaigns.title')} />
        <div className={styles.campaigns}>
          <Link href={byKey('necklace')} className={cx(styles.campaign, styles.campaignTall)}>
            <ThemeImage src="promo-bridal.webp" alt={t('home.campaigns.bridal.alt')} ratio={1.15} sizes="(min-width: 1024px) 45vw, 100vw" className={styles.cover} />
            <span className={styles.campaignShade} />
            <span className={styles.campaignText}>
              <span className={styles.campaignTag}>{t('home.campaigns.bridal.tag')}</span>
              <span className={styles.campaignTitle}>{t('home.campaigns.bridal.title')}</span>
              <span className={styles.campaignAction}>
                {t('home.campaigns.shop')}
                <ArrowIcon />
              </span>
            </span>
          </Link>
          <Link href={byKey('jhumka')} className={cx(styles.campaign, styles.campaignWide)}>
            <ThemeImage src="promo-festive.webp" alt={t('home.campaigns.festive.alt')} ratio={1.47} sizes="(min-width: 1024px) 50vw, 100vw" className={styles.cover} />
            <span className={styles.campaignShade} />
            <span className={styles.campaignText}>
              <span className={styles.campaignTag}>{t('home.campaigns.festive.tag')}</span>
              <span className={styles.campaignTitle}>{t('home.campaigns.festive.title')}</span>
              <span className={styles.campaignAction}>
                {t('home.campaigns.shop')}
                <ArrowIcon />
              </span>
            </span>
          </Link>
          <Link href={byKey('bracelets')} className={styles.campaign}>
            <ThemeImage src="promo-everyday.webp" alt={t('home.campaigns.everyday.alt')} ratio={1.47} sizes="(min-width: 1024px) 25vw, 100vw" className={styles.cover} />
            <span className={styles.campaignShade} />
            <span className={styles.campaignText}>
              <span className={styles.campaignTag}>{t('home.campaigns.everyday.tag')}</span>
              <span className={styles.campaignTitle}>{t('home.campaigns.everyday.title')}</span>
            </span>
          </Link>
          <Link href={byKey('bangles')} className={styles.campaign}>
            <ThemeImage src="promo-traditional.webp" alt={t('home.campaigns.traditional.alt')} ratio={1.47} sizes="(min-width: 1024px) 25vw, 100vw" className={styles.cover} />
            <span className={styles.campaignShade} />
            <span className={styles.campaignText}>
              <span className={styles.campaignTag}>{t('home.campaigns.traditional.tag')}</span>
              <span className={styles.campaignTitle}>{t('home.campaigns.traditional.title')}</span>
            </span>
          </Link>
        </div>
      </section>

      {favourites.status === 'loading' || favourites.products.length ? (
        <section id="favourites" className={cx(styles.section, styles.favourites)}>
          <div className={styles.favouritesInner}>
            <div className={styles.favouritesPoster}>
              <ThemeImage src="col-ring-model.webp" alt="" ratio={0.8} sizes="(min-width: 1024px) 380px, 100vw" className={styles.cover} />
              <span className={styles.campaignShade} />
              <div className={styles.favouritesPosterText}>
                <p className={styles.favouritesEyebrow}>{t('home.favourites.eyebrow')}</p>
                <h2 className={styles.favouritesTitle}>{t('home.favourites.title')}</h2>
                <p className={styles.favouritesLead}>{t('home.favourites.lead')}</p>
                <Link href="/collections/all/" className={styles.goldButton}>
                  {t('home.viewAll')}
                  <ArrowIcon />
                </Link>
              </div>
            </div>
            <ProductRail products={{ status: favourites.status, items: favourites.products }} label={t('shop.listing.loading')} />
          </div>
        </section>
      ) : null}

      <section className={styles.section}>
        <SectionHeading eyebrow={t('home.collections.eyebrow')} title={t('home.collections.title')} lead={t('home.collections.lead')} />
        <ul className={styles.collections}>
          <li>
            <Link href={byKey('necklace')} className={styles.collection}>
              <span className={styles.collectionPicture}>
                <ThemeImage src="col-necklace.webp" alt={t('home.collections.necklace.alt')} ratio={1.47} sizes="(min-width: 1024px) 33vw, 100vw" className={styles.cover} />
              </span>
              <span className={styles.collectionText}>
                <span className={styles.collectionTitle}>{t('home.collections.necklace.title')}</span>
                <span className={styles.collectionBody}>{t('home.collections.necklace.body')}</span>
                <span className={styles.collectionAction}>
                  {t('home.collections.action')}
                  <ArrowIcon />
                </span>
              </span>
            </Link>
          </li>
          <li>
            <Link href={byKey('rings')} className={styles.collection}>
              <span className={styles.collectionPicture}>
                <ThemeImage src="col-ring.webp" alt={t('home.collections.rings.alt')} ratio={1.47} sizes="(min-width: 1024px) 33vw, 100vw" className={styles.cover} />
              </span>
              <span className={styles.collectionText}>
                <span className={styles.collectionTitle}>{t('home.collections.rings.title')}</span>
                <span className={styles.collectionBody}>{t('home.collections.rings.body')}</span>
                <span className={styles.collectionAction}>
                  {t('home.collections.action')}
                  <ArrowIcon />
                </span>
              </span>
            </Link>
          </li>
          <li>
            <Link href={byKey('bracelets')} className={styles.collection}>
              <span className={styles.collectionPicture}>
                <ThemeImage src="col-bracelet.webp" alt={t('home.collections.bracelets.alt')} ratio={1.19} sizes="(min-width: 1024px) 33vw, 100vw" className={styles.cover} />
              </span>
              <span className={styles.collectionText}>
                <span className={styles.collectionTitle}>{t('home.collections.bracelets.title')}</span>
                <span className={styles.collectionBody}>{t('home.collections.bracelets.body')}</span>
                <span className={styles.collectionAction}>
                  {t('home.collections.action')}
                  <ArrowIcon />
                </span>
              </span>
            </Link>
          </li>
        </ul>
      </section>

      <section className={styles.story}>
        <div className={styles.storyPicture}>
          <ThemeImage src="about-promise.webp" alt="" ratio={1.19} sizes="(min-width: 1024px) 50vw, 100vw" className={styles.cover} />
        </div>
        <div className={styles.storyCopy}>
          <p className={styles.eyebrowLight}>{t('home.story.eyebrow')}</p>
          <h2 className={styles.storyTitle}>
            {t('home.story.title')} <em className={styles.heroAccent}>{t('home.story.accent')}</em>
          </h2>
          <p className={styles.storyLead}>{t('home.story.lead')}</p>
          <Link href="/about/" className={styles.ghostButton}>
            {t('home.story.more')}
          </Link>
        </div>
      </section>

      <section className={styles.section}>
        <SectionHeading eyebrow={t('home.promises.eyebrow')} title={t('home.promises.title')} />
        <ul className={styles.promiseList}>
          <Pledge title={t('home.promises.quality.title')} body={t('home.promises.quality.body')}>
            <path d="M6 3h12l4 6-10 12L2 9zM2 9h20M12 21L8 9l4-6 4 6z" />
          </Pledge>
          <Pledge title={t('home.promises.secure.title')} body={t('home.promises.secure.body')}>
            <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4" />
          </Pledge>
          <Pledge title={t('home.promises.easy.title')} body={t('home.promises.easy.body')}>
            <path d="M5.5 8h13l-1 12h-11zM9 8V6.5a3 3 0 016 0V8M9.5 14l2 2 3.5-3.5" />
          </Pledge>
          <Pledge title={t('home.promises.support.title')} body={t('home.promises.support.body')}>
            <path d="M4 14v-2a8 8 0 0116 0v2M4 14a2 2 0 002 2h1v-5H6a2 2 0 00-2 2zM20 14a2 2 0 01-2 2h-1v-5h1a2 2 0 012 2zM17 16v1a3 3 0 01-3 3h-2" />
          </Pledge>
          <Pledge title={t('home.promises.trusted.title')} body={t('home.promises.trusted.body')}>
            <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 3v4M21 5h-4M5 17v4M7 19H3" />
          </Pledge>
        </ul>
      </section>

      <section className={styles.newsletter}>
        <div className={styles.newsletterPicture}>
          <ThemeImage src="brand-box.webp" alt={t('home.newsletter.imageAlt')} ratio={2.64} sizes="100vw" className={styles.cover} />
        </div>
        <div className={styles.newsletterInner}>
          <p className={styles.eyebrowLight}>{t('home.newsletter.eyebrow')}</p>
          <h2 className={styles.newsletterTitle}>{t('home.newsletter.title')}</h2>
          <p className={styles.newsletterBody}>{t('home.newsletter.body')}</p>
          <div className={styles.heroActions}>
            <Link href="/register/" className={styles.goldButton}>
              {t('home.newsletter.action')}
              <ArrowIcon />
            </Link>
            {whatsapp ? (
              <Link href={whatsapp.url} className={styles.ghostButton}>
                {t('home.newsletter.whatsapp')}
              </Link>
            ) : null}
          </div>
        </div>
      </section>
    </Layout>
  )
}
