import type { ReactNode } from 'react'
import { ConsentBanner, Link, navigate, PoweredBy, PreviewBanner, SearchField, StoreLogo, ThemeImage, useCart, useStorefront, useWishlist } from '@dripfunnel/storefront-core/theme'
import { useCategories } from './categories'
import { DesktopNav, MobileNav } from './interactive/SiteNav'
import styles from '../styles/layout.module.css'

// The theme rules allow no URL encoding, so the characters that would break the query are dropped instead.
const searchFor = (words: string) => navigate(`/search/?q=${words.replace(/[&+%#]/g, ' ').trim()}`)

const Spark = () => (
  <svg className={styles.spark} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" />
  </svg>
)

const WhatsAppIcon = ({ className }: { className: string | undefined }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M12 3a9 9 0 00-7.8 13.5L3 21l4.6-1.2A9 9 0 1012 3zm4.4 12.4c-.2.5-1.1 1-1.6 1-.4.1-.9.1-1.5-.1a13 13 0 01-1.4-.5 10.6 10.6 0 01-4-3.6 4.6 4.6 0 01-1-2.4c0-1.2.6-1.7.8-2 .2-.2.5-.3.6-.3h.5c.1 0 .4 0 .6.4l.8 1.9c.1.1.1.3 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.7 1.2 1.6 1.9 1 .9 1.9 1.2 2.2 1.3.3.1.4.1.6-.1l.8-1c.2-.3.4-.2.6-.1l1.8.9c.3.1.4.2.5.3.1.2.1.7-.1 1.3z" />
  </svg>
)

export const Layout = ({ children }: { children: ReactNode }) => {
  const { store, t, mode, poweredBy } = useStorefront()
  const categories = useCategories()
  const { count } = useCart()
  const { count: wished } = useWishlist()
  const whatsapp = store.social.find((s) => s.network === 'whatsapp')
  const others = store.social.filter((s) => s.network !== 'whatsapp')
  const address = store.address ? [store.address.street, store.address.city, store.address.region, store.address.postal].filter(Boolean).join(', ') : ''
  return (
    <div className={styles.shell}>
      {mode === 'live' ? null : <PreviewBanner t={t} className={styles.preview} />}
      <div className={styles.announce}>
        <ul className={styles.announceList} aria-label={t('common.announce.label')}>
          <li className={styles.announceItem}>
            <Spark />
            {t('common.announce.exclusive')}
          </li>
          <li className={styles.announceItem}>
            <Spark />
            {t('common.announce.secure')}
          </li>
          <li className={styles.announceItem}>
            <Spark />
            {t('common.announce.quality')}
          </li>
          <li className={styles.announceItem}>
            <Spark />
            {t('common.announce.support')}
          </li>
        </ul>
      </div>
      <header className={styles.header}>
        <div className={styles.bar}>
          <MobileNav
            footer={
              whatsapp ? (
                <Link href={whatsapp.url} className={styles.drawerWhatsapp}>
                  <WhatsAppIcon className={styles.drawerWhatsappIcon} />
                  {t('common.footer.whatsapp')}
                </Link>
              ) : null
            }
          />
          <Link href="/" className={styles.brand}>
            <StoreLogo className={styles.logo} />
          </Link>
          <SearchField label={t('common.tools.search')} placeholder={t('common.tools.searchPrompt')} button={t('common.tools.search')} value="" onSearch={searchFor} suggest={4} className={styles.search} />
          <div className={styles.tools}>
            <Link href="/account/" className={styles.tool}>
              <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <circle cx="12" cy="8.5" r="3.8" />
                <path d="M4.5 20c1.2-3.6 4-5.4 7.5-5.4s6.3 1.8 7.5 5.4" />
              </svg>
              <span className={styles.toolLabel}>{t('common.tools.account')}</span>
            </Link>
            <Link href="/account/wishlist/" className={styles.tool}>
              <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0112 7.3a4.3 4.3 0 017.5 2.5C19.5 15.4 12 20 12 20z" />
              </svg>
              <span className={styles.toolLabel}>{t('common.tools.wishlist')}</span>
              <span className={styles.hidden}>{wished > 0 ? t('common.tools.wishlistCount', { count: wished }) : null}</span>
              {wished > 0 ? (
                <span className={styles.count} aria-hidden="true">
                  {wished}
                </span>
              ) : null}
            </Link>
            <Link href="/cart/" className={styles.tool}>
              <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M5.5 8h13l-1 12h-11z" />
                <path d="M9 8V6.5a3 3 0 016 0V8" />
              </svg>
              <span className={styles.toolLabel}>{t('common.tools.cart')}</span>
              <span className={styles.hidden}>{count > 0 ? t('common.tools.cartCount', { count }) : null}</span>
              {count > 0 ? (
                <span className={styles.count} aria-hidden="true">
                  {count}
                </span>
              ) : null}
            </Link>
          </div>
        </div>
        <DesktopNav />
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <div className={styles.footerOrnament} aria-hidden="true">
          <Spark />
        </div>
        <div className={styles.columns}>
          <div className={styles.about}>
            <Link href="/" className={styles.footerBrand}>
              <StoreLogo className={styles.footerLogo} />
              <span className={styles.footerName}>{store.name}</span>
            </Link>
            <p className={styles.note}>{store.description || t('common.footer.note')}</p>
            {address ? <p className={styles.contact}>{address}</p> : null}
          </div>
          <nav className={styles.links} aria-label={t('common.footer.shop')}>
            <h2 className={styles.heading}>{t('common.footer.shop')}</h2>
            <Link href="/collections/all/" className={styles.footerLink}>
              {t('common.footer.all')}
            </Link>
            {categories.slice(0, 4).map((c) => (
              <Link key={c.key} href={c.href} className={styles.footerLink}>
                {c.label}
              </Link>
            ))}
          </nav>
          <nav className={styles.links} aria-label={t('common.footer.service')}>
            <h2 className={styles.heading}>{t('common.footer.service')}</h2>
            <Link href="/contact/" className={styles.footerLink}>
              {t('common.nav.contact')}
            </Link>
            <Link href="/help/" className={styles.footerLink}>
              {t('common.footer.faq')}
            </Link>
            <Link href="/policies/shipping/" className={styles.footerLink}>
              {t('common.footer.shipping')}
            </Link>
            <Link href="/policies/returns/" className={styles.footerLink}>
              {t('common.footer.returns')}
            </Link>
            <Link href="/account/orders/" className={styles.footerLink}>
              {t('common.footer.orders')}
            </Link>
          </nav>
          <nav className={styles.links} aria-label={t('common.footer.company')}>
            <h2 className={styles.heading}>{t('common.footer.company')}</h2>
            <Link href="/about/" className={styles.footerLink}>
              {t('common.nav.about')}
            </Link>
            <Link href="/policies/privacy/" className={styles.footerLink}>
              {t('common.footer.privacy')}
            </Link>
            <Link href="/policies/terms/" className={styles.footerLink}>
              {t('common.footer.terms')}
            </Link>
          </nav>
          <div className={styles.links}>
            <h2 className={styles.heading}>{t('common.footer.follow')}</h2>
            <p className={styles.followLead}>{t('common.footer.followLead')}</p>
            <div className={styles.social}>
              {whatsapp ? (
                <Link href={whatsapp.url} className={styles.socialLink}>
                  <WhatsAppIcon className={styles.socialIcon} />
                  {t('common.footer.whatsappShort')}
                </Link>
              ) : null}
              {others.map((s) => (
                <Link key={s.network} href={s.url} className={styles.socialLink}>
                  {s.network}
                </Link>
              ))}
            </div>
            {store.contactPhone ? <p className={styles.contact}>{store.contactPhone}</p> : null}
            {store.contactEmail ? <p className={styles.contact}>{store.contactEmail}</p> : null}
          </div>
        </div>
        <div className={styles.base}>
          <p className={styles.copyright}>{t('common.footer.rights', { store: store.name })}</p>
          <div className={styles.poweredRow}>
            {/* The platform's own line when it names a brand for the store, which a published page must keep. */}
            {poweredBy ? <PoweredBy brand={poweredBy} t={t} className={styles.powered} /> : <span className={styles.poweredBy}>{t('common.footer.poweredBy')}</span>}
            <Link href={t('common.footer.dripfunnelUrl')} className={styles.dripfunnel}>
              <ThemeImage src="dripfunnel-logo.png" alt={t('common.footer.dripfunnel')} ratio={845 / 143} sizes="120px" className={styles.dripfunnelLogo} />
            </Link>
          </div>
        </div>
      </footer>
      {whatsapp ? (
        <Link href={whatsapp.url} className={styles.whatsapp}>
          <WhatsAppIcon className={styles.whatsappIcon} />
          <span className={styles.hidden}>{t('common.footer.whatsapp')}</span>
        </Link>
      ) : null}
      <ConsentBanner t={t} className={styles.consent} />
    </div>
  )
}
