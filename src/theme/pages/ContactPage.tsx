import type { ReactNode } from 'react'
import { Link, ThemeImage, useStorefront } from '@dripfunnel/storefront-core/theme'
import { Enquiry } from '../components/interactive/Enquiry'
import { Layout } from '../components/Layout'
import { Ornament } from '../components/Ornament'
import styles from '../styles/about.module.css'

const Card = ({ title, lead, icon, children }: { title: string; lead: string; icon: ReactNode; children: ReactNode }) => (
  <li className={styles.contactCard}>
    <span className={styles.pillarIcon} aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        {icon}
      </svg>
    </span>
    <h2 className={styles.contactTitle}>{title}</h2>
    <p className={styles.contactLead}>{lead}</p>
    <div className={styles.contactValue}>{children}</div>
  </li>
)

export const ContactPage = () => {
  const { store, t } = useStorefront()
  const whatsapp = store.social.find((s) => s.network === 'whatsapp')
  const place = [store.address?.street, store.address?.city, store.address?.region, store.address?.postal].filter(Boolean).join(', ')
  return (
    <Layout>
      <section className={styles.contactHero}>
        <div className={styles.contactHeroPicture}>
          <ThemeImage src="col-ring.webp" alt="" ratio={1.47} sizes="100vw" className={styles.cover} />
        </div>
        <div className={styles.contactHeroInner}>
          <p className={styles.heroEyebrow}>{t('pages.contact.eyebrow')}</p>
          <h1 className={styles.heroTitle}>{t('pages.contact.title')}</h1>
          <Ornament className={styles.heroOrnament} />
          <p className={styles.heroLead}>{t('pages.contact.lead')}</p>
        </div>
      </section>

      <section className={styles.contactBody}>
        <ul className={styles.contactCards}>
          {whatsapp ? (
            <Card title={t('pages.contact.whatsapp')} lead={t('pages.contact.whatsappLead')} icon={<path d="M12 3a9 9 0 00-7.8 13.5L3 21l4.6-1.2A9 9 0 1012 3zM8.5 9.5c.3 2.6 2.4 4.8 5 5.4l1.2-1.3 2 1-.4 1.6c-4 .4-8.6-4-8.2-8.2l1.6-.4 1 2z" />}>
              <Link href={whatsapp.url} className={styles.contactLink}>
                {t('pages.contact.whatsappAction')}
              </Link>
            </Card>
          ) : null}
          {store.contactPhone ? (
            <Card title={t('pages.contact.phone')} lead={t('pages.contact.phoneLead')} icon={<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />}>
              <p className={styles.contactText}>{store.contactPhone}</p>
            </Card>
          ) : null}
          {store.contactEmail ? (
            <Card title={t('pages.contact.email')} lead={t('pages.contact.emailLead')} icon={<path d="M3 6h18v12H3zM3 7l9 6 9-6" />}>
              <p className={styles.contactText}>{store.contactEmail}</p>
            </Card>
          ) : null}
          {place ? (
            <Card title={t('pages.contact.visit')} lead={t('pages.contact.visitLead')} icon={<path d="M12 21s-7-6.2-7-11.5a7 7 0 0114 0C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />}>
              <p className={styles.contactText}>{place}</p>
            </Card>
          ) : null}
        </ul>

        {whatsapp ? (
          <div className={styles.enquiry}>
            <div className={styles.enquiryPicture}>
              <ThemeImage src="about-story.webp" alt="" ratio={1.19} sizes="(min-width: 1024px) 40vw, 100vw" className={styles.cover} />
            </div>
            <div className={styles.enquiryCopy}>
              <p className={styles.eyebrow}>{t('pages.contact.form.eyebrow')}</p>
              <h2 className={styles.heading}>{t('pages.contact.form.title')}</h2>
              <p className={styles.body}>{t('pages.contact.form.lead')}</p>
              <Enquiry whatsapp={whatsapp.url} />
            </div>
          </div>
        ) : null}
      </section>
    </Layout>
  )
}
