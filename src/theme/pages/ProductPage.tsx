import { Breadcrumbs, LegalNotices, Link, Price, ProductStory, RichText, SizeChart, useProduct, useStorefront } from '@dripfunnel/storefront-core/theme'
import { BuyButtons } from '../components/interactive/BuyButtons'
import { Gallery } from '../components/interactive/Gallery'
import { Options } from '../components/interactive/Options'
import { Retry } from '../components/interactive/Retry'
import { Layout } from '../components/Layout'
import { Notice } from '../components/Notice'
import { Ornament } from '../components/Ornament'
import { percentOff } from '../components/percentOff'
import { ProductGrid } from '../components/ProductCard'
import shop from '../styles/shop.module.css'
import story from '../styles/aplus.module.css'
import styles from '../styles/product.module.css'

export const ProductPage = () => {
  const { store, locale, t } = useStorefront()
  const page = useProduct()
  const product = page.product
  if (page.status === 'missing' || page.status === 'error' || !product) {
    return (
      <Layout>
        <section className={shop.page}>
          {page.status === 'missing' ? (
            <Notice main title={t('shop.product.missing')} lead={t('shop.product.missingLead')}>
              <Link href="/collections/all/" className={shop.primary}>
                {t('shop.collection.browse')}
              </Link>
            </Notice>
          ) : page.status === 'error' ? (
            <Notice main title={t('shop.product.failed')} lead={t('shop.listing.failedLead')}>
              <Retry label={t('shop.listing.retry')} onRetry={page.retry} />
            </Notice>
          ) : (
            <div className={styles.product} aria-busy="true">
              <div className={styles.noPicture} />
              <div className={styles.info}>
                <h1 className={styles.loadingTitle}>{t('shop.product.loading')}</h1>
              </div>
            </div>
          )}
        </section>
      </Layout>
    )
  }
  const firstMissing = page.missing[0]
  const specs = product.specs.filter((s) => s.versionId === null || s.versionId === page.version?.id)
  const whatsapp = store.social.find((s) => s.network === 'whatsapp')
  const off = percentOff(page.price, page.compareAt)
  return (
    <Layout>
      <section className={shop.page}>
        <Breadcrumbs
          crumbs={[
            { label: t('shop.crumbs.home'), href: '/' },
            { label: t('shop.collection.all'), href: '/collections/all/' },
            { label: product.name, href: product.href },
          ]}
          t={t}
          className={shop.crumbs}
        />
        <div className={styles.product}>
          <Gallery photos={page.photos} video={product.video} name={product.name} />
          <div className={styles.info}>
            {product.badges.length ? (
              <div className={styles.badges}>
                {product.badges.map((b) => (
                  <span key={b.label} className={styles.badge}>
                    {b.label}
                  </span>
                ))}
              </div>
            ) : null}
            <h1 className={styles.title}>{product.name}</h1>
            <Ornament className={styles.ornament} />
            {page.price ? (
              <div className={styles.price}>
                {page.from ? <span className={styles.from}>{t('shop.card.from')}</span> : null}
                <Price money={page.price} compareAt={page.compareAt} includesTax={store.pricesIncludeTax} locale={locale} t={t} className={styles.priceTag} />
                {off !== null ? <span className={styles.off}>{t('shop.card.off', { percent: off })}</span> : null}
              </div>
            ) : null}
            <p className={page.stock?.inStock && !firstMissing ? styles.stock : styles.stockMuted} role="status">
              {firstMissing ? t('shop.product.choose', { option: firstMissing.name }) : page.stock?.inStock ? t('shop.product.inStock') : t('shop.product.outOfStock')}
            </p>
            {product.highlights.length ? (
              <ul className={styles.highlights}>
                {product.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            ) : null}
            <Options page={page} />
            <SizeChart chart={product.sizeChart} className={styles.sizeLink} />
            <BuyButtons page={page} />
            <ul className={styles.trust}>
              <li className={styles.trustItem}>
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4" />
                </svg>
                {t('shop.product.secure')}
              </li>
              <li className={styles.trustItem}>
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M6 3h12l4 6-10 12L2 9zM2 9h20M12 21L8 9l4-6 4 6z" />
                </svg>
                {t('shop.product.quality')}
              </li>
              <li className={styles.trustItem}>
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M4 14v-2a8 8 0 0116 0v2M4 14a2 2 0 002 2h1v-5H6a2 2 0 00-2 2zM20 14a2 2 0 01-2 2h-1v-5h1a2 2 0 012 2z" />
                </svg>
                {t('shop.product.support')}
              </li>
            </ul>
            <div className={styles.shipping}>
              <p className={styles.shippingTitle}>{t('shop.product.shippingTitle')}</p>
              <p className={styles.body}>{product.returns ?? t('shop.product.shippingBody')}</p>
              <p className={styles.shippingLinks}>
                <Link href="/policies/shipping/" className={styles.inlineLink}>
                  {t('shop.product.shippingLink')}
                </Link>
                <Link href="/policies/returns/" className={styles.inlineLink}>
                  {t('shop.product.returnsLink')}
                </Link>
              </p>
            </div>
            {whatsapp ? (
              <Link href={whatsapp.url} className={styles.ask}>
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M12 3a9 9 0 00-7.8 13.5L3 21l4.6-1.2A9 9 0 1012 3z" />
                </svg>
                {t('shop.product.ask')}
              </Link>
            ) : null}
            <LegalNotices notices={product.legal} t={t} className={styles.legal} />
          </div>
        </div>

        <div className={styles.sections}>
          <h2 className={styles.sectionsTitle}>{t('shop.product.details')}</h2>
          {product.description ? (
            <details className={styles.section} open>
              <summary className={styles.summary}>{t('shop.product.description')}</summary>
              <RichText html={product.description} className={styles.description} />
            </details>
          ) : null}
          {specs.length ? (
            <details className={styles.section} open>
              <summary className={styles.summary}>{t('shop.product.specs')}</summary>
              <dl className={styles.specs}>
                {specs.map((s) => (
                  <div key={`${s.name}-${s.versionId ?? ''}`} className={styles.spec}>
                    <dt>{s.name}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
              </dl>
            </details>
          ) : null}
          <details className={styles.section}>
            <summary className={styles.summary}>{t('shop.product.shippingTitle')}</summary>
            <p className={styles.body}>{product.returns ?? t('shop.product.shippingBody')}</p>
            {product.warranty ? (
              <p className={styles.body}>
                <strong>{t('shop.product.warranty')}</strong> {product.warranty}
              </p>
            ) : null}
            <p className={styles.shippingLinks}>
              <Link href="/policies/shipping/" className={styles.inlineLink}>
                {t('shop.product.shippingLink')}
              </Link>
              <Link href="/policies/returns/" className={styles.inlineLink}>
                {t('shop.product.returnsLink')}
              </Link>
            </p>
          </details>
          {product.faqs.length ? (
            <details className={styles.section}>
              <summary className={styles.summary}>{t('shop.product.questions')}</summary>
              <dl className={styles.specs}>
                {product.faqs.map((f) => (
                  <div key={f.question} className={styles.faq}>
                    <dt>{f.question}</dt>
                    <dd>{f.answer}</dd>
                  </div>
                ))}
              </dl>
            </details>
          ) : null}
        </div>

        <ProductStory product={product} versionId={page.version?.id ?? null} className={story.aplus} classes={story} />
        {product.related.length ? (
          <section className={styles.related}>
            <div className={styles.relatedHead}>
              <h2 className={shop.heading}>{t('shop.product.related')}</h2>
              <Ornament className={styles.ornament} />
            </div>
            <ProductGrid products={product.related.slice(0, 4)} wide />
          </section>
        ) : null}
      </section>
    </Layout>
  )
}
