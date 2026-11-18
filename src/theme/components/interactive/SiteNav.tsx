'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, ThemeImage, useLocation, useMenu, useStorefront } from '@dripfunnel/storefront-core/theme'
import { isCategoryActive, useCategories, type Category } from '../categories'
import { cx } from '../cx'
import styles from '../../styles/layout.module.css'

const Chevron = () => (
  <svg className={styles.chevron} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M6 9l6 6 6-6" />
  </svg>
)

/** Which top-level link the address belongs to, for the menu's active state. */
const useActive = (categories: Category[]) => {
  const { path, query } = useLocation()
  const category = categories.find((c) => isCategoryActive(c, path, query))
  return {
    home: path === '/',
    shop: !category && (path.startsWith('/collections/') || path.startsWith('/products/')),
    about: path.startsWith('/about'),
    contact: path.startsWith('/contact'),
    category: category?.key ?? null,
  }
}

/** The mega menu's panel: the six categories with their pictures, the merchant's own menu, and the bridal edit. */
const MegaPanel = ({ categories, open }: { categories: Category[]; open: boolean }) => {
  const { t } = useStorefront()
  const menu = useMenu()
  const bridal = categories.find((c) => c.key === 'necklace')
  return (
    <div id="mega-menu" className={cx(styles.mega, open && styles.megaOpen)}>
      <div className={styles.megaInner}>
        <div className={styles.megaMain}>
          <p className={styles.megaEyebrow}>{t('common.nav.mega.eyebrow')}</p>
          <ul className={styles.megaGrid}>
            <li>
              <Link href="/collections/all/" className={styles.megaTile}>
                <span className={styles.megaThumb}>
                  <ThemeImage src="col-necklace.webp" alt="" ratio={1} sizes="72px" className={styles.cover} />
                </span>
                <span className={styles.megaText}>
                  <span className={styles.megaName}>{t('common.nav.mega.allProducts')}</span>
                  <span className={styles.megaBlurb}>{t('common.nav.mega.allBlurb')}</span>
                </span>
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.key}>
                <Link href={c.href} className={styles.megaTile}>
                  <span className={styles.megaThumb}>
                    <ThemeImage src={c.image} alt="" ratio={1} sizes="72px" className={styles.cover} />
                  </span>
                  <span className={styles.megaText}>
                    <span className={styles.megaName}>{c.label}</span>
                    <span className={styles.megaBlurb}>{c.blurb}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {menu.items.length ? (
            <ul className={styles.megaExtra}>
              {menu.items.map((item) => (
                <li key={item.id}>
                  <Link href={item.href} className={styles.megaExtraLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
          <Link href="/collections/all/" className={styles.megaAll}>
            {t('common.nav.mega.all')}
            <svg className={styles.arrow} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
        <Link href={bridal?.href ?? '/collections/all/'} className={styles.megaFeature}>
          <ThemeImage src="promo-bridal.webp" alt="" ratio={0.9} sizes="320px" className={styles.cover} />
          <span className={styles.megaFeatureShade} />
          <span className={styles.megaFeatureText}>
            <span className={styles.megaFeatureEyebrow}>{t('common.nav.mega.featureEyebrow')}</span>
            <span className={styles.megaFeatureTitle}>{t('common.nav.mega.featureTitle')}</span>
            <span className={styles.megaFeatureAction}>{t('common.nav.mega.featureAction')}</span>
          </span>
        </Link>
      </div>
    </div>
  )
}

/** The desktop menu row: Home, Shop All with its mega menu, the six categories, About Us and Contact. */
export const DesktopNav = () => {
  const { t } = useStorefront()
  const categories = useCategories()
  const active = useActive(categories)
  const [open, setOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  const leaving = useRef<ReturnType<typeof setTimeout>>(undefined)
  const show = (value: boolean) => {
    clearTimeout(leaving.current)
    setOpen(value)
  }
  const item = (href: string, label: string, on: boolean, key: string) => (
    <li key={key}>
      <Link href={href} className={cx(styles.navLink, on && styles.navLinkOn)}>
        {label}
      </Link>
    </li>
  )
  return (
    <nav className={styles.desktopNav} aria-label={t('common.nav.label')}>
      <ul className={styles.navList}>
        {item('/', t('common.nav.home'), active.home, 'home')}
        <li
          className={styles.navMega}
          onPointerEnter={(e) => {
            if (e.pointerType === 'mouse') show(true)
          }}
          onPointerLeave={(e) => {
            if (e.pointerType !== 'mouse') return
            clearTimeout(leaving.current)
            leaving.current = setTimeout(() => setOpen(false), 120)
          }}
          onKeyDown={(e) => {
            if (e.key !== 'Escape' || !open) return
            show(false)
            toggle.current?.focus()
          }}
          onBlur={() => {
            leaving.current = setTimeout(() => setOpen(false), 0)
          }}
          onFocus={() => clearTimeout(leaving.current)}
        >
          <Link href="/collections/all/" className={cx(styles.navLink, active.shop && styles.navLinkOn)}>
            {t('common.nav.shopAll')}
          </Link>
          <button ref={toggle} type="button" className={styles.megaToggle} aria-expanded={open} aria-controls="mega-menu" aria-label={t('common.nav.submenu', { item: t('common.nav.shopAll') })} onClick={() => show(!open)}>
            <Chevron />
          </button>
          <MegaPanel categories={categories} open={open} />
        </li>
        {categories.map((c) => item(c.href, c.label, active.category === c.key, c.key))}
        {item('/about/', t('common.nav.about'), active.about, 'about')}
        {item('/contact/', t('common.nav.contact'), active.contact, 'contact')}
      </ul>
    </nav>
  )
}

/** The phone menu: a hamburger that opens a drawer with every link and the categories as pictures. */
export const MobileNav = ({ footer }: { footer?: ReactNode }) => {
  const { t } = useStorefront()
  const categories = useCategories()
  const active = useActive(categories)
  const { path, query } = useLocation()
  const [open, setOpen] = useState(false)
  const opener = useRef<HTMLButtonElement>(null)
  const closer = useRef<HTMLButtonElement>(null)
  // A link that changes the address closes the drawer.
  const where = `${path}?${query.toString()}`
  useEffect(() => setOpen(false), [where])
  useEffect(() => {
    if (open) closer.current?.focus()
  }, [open])
  const close = () => {
    setOpen(false)
    opener.current?.focus()
  }
  const row = (href: string, label: string, on: boolean) => (
    <Link href={href} className={cx(styles.drawerLink, on && styles.drawerLinkOn)}>
      {label}
    </Link>
  )
  return (
    <div className={styles.mobileNav}>
      <button ref={opener} type="button" className={styles.burger} aria-expanded={open} aria-controls="site-drawer" onClick={() => setOpen(true)}>
        <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M4 7h16M4 12h16M4 17h10" />
        </svg>
        <span className={styles.hidden}>{t('common.nav.menu')}</span>
      </button>
      <div className={cx(styles.scrim, open && styles.scrimOpen)} aria-hidden="true" onClick={close} />
      <div
        id="site-drawer"
        className={cx(styles.drawer, open && styles.drawerOpen)}
        role="dialog"
        aria-modal={open}
        aria-label={t('common.nav.menu')}
        hidden={!open}
        onKeyDown={(e) => {
          if (e.key === 'Escape') close()
        }}
      >
        <div className={styles.drawerHead}>
          <p className={styles.drawerTitle}>{t('common.nav.menu')}</p>
          <button ref={closer} type="button" className={styles.drawerClose} aria-label={t('common.nav.close')} onClick={close}>
            <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <nav className={styles.drawerNav} aria-label={t('common.nav.label')}>
          {row('/', t('common.nav.home'), active.home)}
          {row('/collections/all/', t('common.nav.shopAll'), active.shop)}
          <p className={styles.drawerEyebrow}>{t('common.nav.jewellery')}</p>
          <ul className={styles.drawerGrid}>
            {categories.map((c) => (
              <li key={c.key}>
                <Link href={c.href} className={cx(styles.drawerTile, active.category === c.key && styles.drawerTileOn)}>
                  <span className={styles.drawerThumb}>
                    <ThemeImage src={c.image} alt="" ratio={1} sizes="96px" className={styles.cover} />
                  </span>
                  <span className={styles.drawerTileName}>{c.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          {row('/about/', t('common.nav.about'), active.about)}
          {row('/contact/', t('common.nav.contact'), active.contact)}
        </nav>
        {footer}
      </div>
    </div>
  )
}
