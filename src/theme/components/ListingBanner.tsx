import { Breadcrumbs, Image, ThemeImage, useStorefront, type Crumb, type Photo } from '@dripfunnel/storefront-core/theme'
import type { BannerImage } from './categories'
import styles from '../styles/shop.module.css'

/**
 * A listing's banner: breadcrumbs, an eyebrow, the page's title and line on burgundy, and a picture beside them: the
 * collection's own picture when the merchant gave it one, else the theme's picture for the category.
 */
export const ListingBanner = ({ eyebrow, title, lead, crumbs, photo, fallback }: { eyebrow: string; title: string; lead: string | null; crumbs: Crumb[]; photo: Photo | null; fallback: BannerImage }) => {
  const { t } = useStorefront()
  return (
    <section className={styles.banner}>
      <div className={styles.bannerCopy}>
        <Breadcrumbs crumbs={crumbs} t={t} className={styles.bannerCrumbs} />
        <p className={styles.bannerEyebrow}>{eyebrow}</p>
        <h1 className={styles.bannerTitle}>{title}</h1>
        {lead ? <p className={styles.bannerLead}>{lead}</p> : null}
      </div>
      <div className={styles.bannerPicture}>
        {photo ? <Image image={photo} alt="" ratio={1.5} sizes="(min-width: 900px) 55vw, 100vw" className={styles.bannerImage} /> : <ThemeImage src={fallback} alt="" ratio={1.5} sizes="(min-width: 900px) 55vw, 100vw" className={styles.bannerImage} />}
        <span className={styles.bannerFade} />
      </div>
    </section>
  )
}
