import { Image, Link, Price, useStorefront, type ProductCard as Card } from '@dripfunnel/storefront-core/theme'
import { QuickView } from './interactive/QuickView'
import { WishlistHeart } from './interactive/WishlistHeart'
import { percentOff } from './percentOff'
import styles from '../styles/shop.module.css'

/**
 * A product as listings show it: the picture large with its badges, discount and heart, Quick View on the picture,
 * then the name, MRP and selling price, and Add to Cart, which opens the product to choose its options.
 */
export const ProductCard = ({ product }: { product: Card }) => {
  const { store, locale, t } = useStorefront()
  const off = percentOff(product.price, product.compareAt)
  return (
    <article className={styles.card}>
      <div className={styles.cardMedia}>
        <Link href={product.href} className={styles.cardPicture}>
          {product.photo ? <Image image={product.photo} alt={product.photo.alt ?? product.name} ratio={0.8} sizes="(min-width: 1024px) 22vw, (min-width: 640px) 33vw, 50vw" className={styles.cardImage} /> : <span className={styles.noPicture}>{t('shop.card.noPicture')}</span>}
        </Link>
        <div className={styles.cardBadges}>
          {product.badges[0] ? <span className={styles.badge}>{product.badges[0].label}</span> : null}
          {off !== null ? <span className={styles.offBadge}>{t('shop.card.off', { percent: off })}</span> : null}
        </div>
        {product.stock.inStock ? null : <span className={styles.soldOut}>{t('shop.card.soldOut')}</span>}
        <div className={styles.cardHeartSpot}>
          <WishlistHeart productId={product.id} name={product.name} versionId={null} compact />
        </div>
        <div className={styles.cardQuick}>
          <QuickView product={product} />
        </div>
      </div>
      <div className={styles.cardBody}>
        <Link href={product.href} className={styles.cardLink}>
          <h3 className={styles.cardName}>{product.name}</h3>
        </Link>
        {product.price ? (
          <p className={styles.cardPrice}>
            {product.from ? <span className={styles.from}>{t('shop.card.from')}</span> : null}
            <Price money={product.price} compareAt={product.compareAt} includesTax={store.pricesIncludeTax} locale={locale} t={t} className={styles.price} />
          </p>
        ) : null}
        <Link href={product.href} className={styles.cardAdd}>
          <svg className={styles.cardAddIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M5.5 8h13l-1 12h-11z" />
            <path d="M9 8V6.5a3 3 0 016 0V8" />
          </svg>
          {product.stock.inStock ? t('shop.card.add') : t('shop.card.view')}
        </Link>
      </div>
    </article>
  )
}

export const ProductGrid = ({ products, wide = false }: { products: readonly Card[]; wide?: boolean }) => (
  <ul className={wide ? styles.gridWide : styles.grid}>
    {products.map((p) => (
      <li key={p.id} className={styles.cell}>
        <ProductCard product={p} />
      </li>
    ))}
  </ul>
)

/** The grid's shape while its products load, so nothing moves when they arrive. */
export const GridPlaceholder = ({ label, count }: { label: string; count: number }) => (
  <ul className={styles.grid} aria-busy="true" aria-label={label}>
    {[...Array(count).keys()].map((i) => (
      <li key={i} className={styles.cell}>
        <div className={styles.skeletonPicture} />
        <div className={styles.skeletonLine} />
      </li>
    ))}
  </ul>
)
