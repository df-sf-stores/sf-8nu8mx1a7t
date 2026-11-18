import type { ReactNode } from 'react'
import { Link, ThemeImage, useStorefront } from '@dripfunnel/storefront-core/theme'
import { Layout } from '../components/Layout'
import { Ornament } from '../components/Ornament'
import styles from '../styles/about.module.css'

const Pillar = ({ title, body, children }: { title: string; body: string; children: ReactNode }) => (
  <li className={styles.pillar}>
    <span className={styles.pillarIcon} aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        {children}
      </svg>
    </span>
    <h3 className={styles.pillarTitle}>{title}</h3>
    <p className={styles.pillarBody}>{body}</p>
  </li>
)

export const AboutPage = () => {
  const { store, t } = useStorefront()
  const whatsapp = store.social.find((s) => s.network === 'whatsapp')
  return (
    <Layout>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.heroEyebrow}>{t('pages.about.eyebrow')}</p>
            <h1 className={styles.heroTitle}>
              {t('pages.about.title')} <em className={styles.accent}>{t('pages.about.accent')}</em>
            </h1>
            <Ornament className={styles.heroOrnament} />
            <p className={styles.heroLead}>{t('pages.about.lead', { store: store.name })}</p>
          </div>
          <div className={styles.heroPicture}>
            <ThemeImage src="about-craft.webp" alt={t('pages.about.imageAlt')} ratio={1.19} sizes="(min-width: 1024px) 46vw, 100vw" className={styles.cover} />
          </div>
        </div>
      </section>

      <section className={styles.story}>
        <div className={styles.storyPicture}>
          <ThemeImage src="about-story.webp" alt={t('pages.about.story.imageAlt')} ratio={1.19} sizes="(min-width: 1024px) 40vw, 100vw" className={styles.cover} />
        </div>
        <div className={styles.storyCopy}>
          <p className={styles.eyebrow}>{t('pages.about.story.eyebrow')}</p>
          <h2 className={styles.heading}>
            {t('pages.about.story.title')} <em className={styles.accentDark}>{t('pages.about.story.accent')}</em>
          </h2>
          <p className={styles.lead}>{t('pages.about.story.first', { store: store.name })}</p>
          <p className={styles.body}>{t('pages.about.story.second')}</p>
        </div>
      </section>

      <section className={styles.philosophy}>
        <div className={styles.philosophyInner}>
          <p className={styles.eyebrowLight}>{t('pages.about.philosophy.eyebrow')}</p>
          <h2 className={styles.philosophyTitle}>{t('pages.about.philosophy.title')}</h2>
          <Ornament className={styles.heroOrnament} />
          <p className={styles.philosophyBody}>{t('pages.about.philosophy.body')}</p>
        </div>
      </section>

      <section className={styles.pillars}>
        <div className={styles.pillarsHead}>
          <p className={styles.eyebrow}>{t('pages.about.pillars.eyebrow')}</p>
          <h2 className={styles.heading}>{t('pages.about.pillars.title')}</h2>
          <Ornament className={styles.ornament} />
        </div>
        <div className={styles.pillarsGrid}>
          <div className={styles.pillarsPicture}>
            <ThemeImage src="col-bracelet.webp" alt={t('pages.about.craftImageAlt')} ratio={1.19} sizes="(min-width: 1024px) 40vw, 100vw" className={styles.cover} />
          </div>
          <ul className={styles.pillarList}>
            <Pillar title={t('pages.about.pillars.quality.title')} body={t('pages.about.pillars.quality.body')}>
              <path d="M6 3h12l4 6-10 12L2 9zM2 9h20M12 21L8 9l4-6 4 6z" />
            </Pillar>
            <Pillar title={t('pages.about.pillars.craft.title')} body={t('pages.about.pillars.craft.body')}>
              <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 3v4M21 5h-4M5 17v4M7 19H3" />
            </Pillar>
            <Pillar title={t('pages.about.pillars.promise.title')} body={t('pages.about.pillars.promise.body')}>
              <path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10zM8.5 11.5l2 2 3.5-3.5" />
            </Pillar>
          </ul>
        </div>
      </section>

      <section className={styles.closing}>
        <div className={styles.closingPicture}>
          <ThemeImage src="brand-box.webp" alt="" ratio={2.64} sizes="100vw" className={styles.cover} />
        </div>
        <div className={styles.closingInner}>
          <h2 className={styles.closingTitle}>{t('pages.about.visit.title')}</h2>
          <p className={styles.closingLead}>{t('pages.about.visit.lead')}</p>
          <div className={styles.actions}>
            <Link href="/collections/all/" className={styles.goldButton}>
              {t('pages.about.shop')}
            </Link>
            {whatsapp ? (
              <Link href={whatsapp.url} className={styles.ghostButton}>
                {t('pages.about.visit.whatsapp')}
              </Link>
            ) : (
              <Link href="/contact/" className={styles.ghostButton}>
                {t('pages.about.visit.contact')}
              </Link>
            )}
          </div>
          <p className={styles.closingText}>{t('pages.about.closing', { store: store.name })}</p>
        </div>
      </section>
    </Layout>
  )
}
