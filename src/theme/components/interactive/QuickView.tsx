'use client'

import { useEffect, useRef, useState } from 'react'
import { Image, Link, Price, useStorefront, type ProductCard } from '@dripfunnel/storefront-core/theme'
import { percentOff } from '../percentOff'
import { WishlistHeart } from './WishlistHeart'
import styles from '../../styles/shop.module.css'

/**
 * A card's Quick View: the product's picture large, its price, stock and wishlist heart in a dialog, without leaving the
 * listing. A card carries no version, so choosing options and adding to the cart happen on the product's own page.
 */
export const QuickView = ({ product }: { product: ProductCard }) => {
  const { store, locale, t } = useStorefront()
  const [open, setOpen] = useState(false)
  const opener = useRef<HTMLButtonElement>(null)
  const closer = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (open) closer.current?.focus()
  }, [open])
  const close = () => {
    setOpen(false)
    opener.current?.focus()
  }
  const off = percentOff(product.price, product.compareAt)
  return (
    <>
      <button ref={opener} type="button" className={styles.quick} aria-label={t('shop.card.quickLabel', { name: product.name })} onClick={() => setOpen(true)}>
        <svg className={styles.quickIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        {t('shop.card.quick')}
      </button>
      {open ? (
        <div className={styles.dialogLayer}>
          <div className={styles.dialogScrim} aria-hidden="true" onClick={close} />
          <div
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-label={t('shop.card.quickLabel', { name: product.name })}
            onKeyDown={(e) => {
              if (e.key === 'Escape') close()
            }}
          >
            <button ref={closer} type="button" className={styles.dialogClose} aria-label={t('shop.card.close')} onClick={close}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            <div className={styles.dialogPicture}>
              {product.photo ? <Image image={product.photo} alt={product.photo.alt ?? product.name} ratio={0.8} sizes="(min-width: 768px) 420px, 90vw" className={styles.cardImage} /> : <span className={styles.noPicture}>{t('shop.card.noPicture')}</span>}
            </div>
            <div className={styles.dialogInfo}>
              {product.badges[0] ? <span className={styles.dialogBadge}>{product.badges[0].label}</span> : null}
              <h2 className={styles.dialogTitle}>{product.name}</h2>
              {product.price ? (
                <p className={styles.dialogPrice}>
                  {product.from ? <span className={styles.from}>{t('shop.card.from')}</span> : null}
                  <Price money={product.price} compareAt={product.compareAt} includesTax={store.pricesIncludeTax} locale={locale} t={t} className={styles.price} />
                  {off !== null ? <span className={styles.offPill}>{t('shop.card.off', { percent: off })}</span> : null}
                </p>
              ) : null}
              <p className={product.stock.inStock ? styles.stockOn : styles.stockOff}>{product.stock.inStock ? t('shop.card.inStock') : t('shop.card.soldOut')}</p>
              <p className={styles.dialogNote}>{t('shop.card.choose')}</p>
              <div className={styles.dialogActions}>
                <Link href={product.href} className={styles.primary}>
                  {t('shop.card.details')}
                </Link>
                <WishlistHeart productId={product.id} name={product.name} versionId={null} />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
