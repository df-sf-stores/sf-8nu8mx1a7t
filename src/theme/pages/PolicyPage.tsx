import { Breadcrumbs, ConsentSettingsButton, Link, useHead, useLocation, useStorefront } from '@dripfunnel/storefront-core/theme'
import { Layout } from '../components/Layout'
import { Ornament } from '../components/Ornament'
import { PolicyBody } from '../components/interactive/PolicyNav'
import styles from '../styles/policy.module.css'

const kinds = ['privacy', 'terms', 'shipping', 'returns', 'legal'] as const
type Kind = (typeof kinds)[number]
/** The policies a shopper can read, in the order the footer lists them. */
const listed = ['shipping', 'returns', 'privacy', 'terms'] as const

const numbered = /^\d+\.\s/
const linkLine = /^\[(.+)\]\(([^)]+)\)$/
/** A link in a policy's text that opens the cookie banner again instead of going anywhere. */
const cookieSettings = '#cookie-settings'

type Section = { id: string; title: string; blocks: string[] }

/** A heading's words as an address fragment: "Who we share it with" → "who-we-share-it-with". */
const idOf = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'section'

/** A policy's text from content, split into its sections: blocks split by a blank line, '## ' starting a section. */
const sectionsOf = (text: string): Section[] =>
  text
    .split('\n\n')
    .map((block) => block.trim())
    .filter(Boolean)
    .reduce<Section[]>((sections, block) => {
      if (block.startsWith('## ')) {
        const title = block.slice(3).trim()
        const taken = sections.filter((s) => s.id === idOf(title)).length
        return [...sections, { id: taken ? `${idOf(title)}-${taken + 1}` : idOf(title), title, blocks: [] }]
      }
      const last = sections.at(-1)
      return last ? [...sections.slice(0, -1), { ...last, blocks: [...last.blocks, block] }] : [{ id: 'overview', title: '', blocks: [block] }]
    }, [])

/**
 * One block of a policy: '- ' lines a list, 'n. ' lines a numbered list, '> ' a point still to be confirmed by the
 * business, a '[label](address)' line a link, and anything else a paragraph.
 */
const Block = ({ block, toConfirm }: { block: string; toConfirm: string }) => {
  const { t } = useStorefront()
  const lines = block.split('\n')
  if (lines.every((l) => l.startsWith('- '))) {
    return (
      <ul className={styles.bullets}>
        {lines.map((l) => (
          <li key={l}>{l.slice(2)}</li>
        ))}
      </ul>
    )
  }
  if (lines.every((l) => numbered.test(l))) {
    return (
      <ol className={styles.steps}>
        {lines.map((l) => (
          <li key={l}>{l.replace(numbered, '')}</li>
        ))}
      </ol>
    )
  }
  if (block.startsWith('> ')) {
    const rest = block.slice(2).replace(/^To be confirmed:\s*/i, '')
    const text = rest.charAt(0).toUpperCase() + rest.slice(1)
    return (
      <p className={styles.confirm}>
        <span className={styles.confirmTag}>{toConfirm}</span>
        {text}
      </p>
    )
  }
  const link = linkLine.exec(block)
  if (link) {
    const [, label = '', href = '/'] = link
    if (href === cookieSettings) return <ConsentSettingsButton t={t} className={styles.cookies} />
    return (
      <Link href={href} className={styles.inlineLink}>
        {label}
        <svg className={styles.arrow} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </Link>
    )
  }
  return <p className={styles.paragraph}>{block}</p>
}

const Spark = ({ className }: { className: string | undefined }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" />
  </svg>
)

/** The other policies as cards, so a shopper can move between them. */
const PolicyCards = ({ except }: { except: Kind | null }) => {
  const { t } = useStorefront()
  return (
    <section className={styles.others} aria-labelledby="other-policies">
      <h2 id="other-policies" className={styles.othersTitle}>
        {t('pages.policy.others')}
      </h2>
      <ul className={styles.cards}>
        {listed
          .filter((k) => k !== except)
          .map((k) => (
            <li key={k}>
              <Link href={`/policies/${k}/`} className={styles.card}>
                <span className={styles.cardTitle}>{t(`policies.${k}.title`)}</span>
                <span className={styles.cardLead}>{t(`policies.${k}.lead`)}</span>
                <span className={styles.cardAction}>{t('pages.policy.read')}</span>
              </Link>
            </li>
          ))}
      </ul>
    </section>
  )
}

/** Where to ask about a policy: the contact page, and WhatsApp when the store has it. */
const Support = () => {
  const { store, t } = useStorefront()
  const whatsapp = store.social.find((s) => s.network === 'whatsapp')
  return (
    <section className={styles.support} aria-labelledby="policy-support">
      <Spark className={styles.supportSpark} />
      <p className={styles.supportEyebrow}>{t('pages.policy.supportEyebrow')}</p>
      <h2 id="policy-support" className={styles.supportTitle}>
        {t('pages.policy.supportTitle')}
      </h2>
      <p className={styles.supportLead}>{t('pages.policy.supportLead')}</p>
      <div className={styles.supportActions}>
        <Link href="/contact/" className={styles.gold}>
          {t('pages.policy.supportAction')}
        </Link>
        {whatsapp ? (
          <Link href={whatsapp.url} className={styles.ghost}>
            {t('pages.policy.whatsapp')}
          </Link>
        ) : null}
      </div>
      {store.contactPhone || store.contactEmail ? (
        <p className={styles.supportContact}>{[store.contactPhone, store.contactEmail].filter(Boolean).join(' · ')}</p>
      ) : null}
    </section>
  )
}

export const PolicyPage = () => {
  const { store, t } = useStorefront()
  const { path } = useLocation()
  const kind = kinds.find((k) => path === `/policies/${k}/` || path === `/policies/${k}`) ?? null
  const pages: Record<Kind, { title: string; lead: string; body: string; draft: boolean }> = {
    privacy: { title: t('policies.privacy.title'), lead: t('policies.privacy.lead'), body: t('policies.privacy.body', { store: store.name }), draft: t('policies.privacy.status') === 'draft' },
    terms: { title: t('policies.terms.title'), lead: t('policies.terms.lead'), body: t('policies.terms.body', { store: store.name }), draft: t('policies.terms.status') === 'draft' },
    shipping: { title: t('policies.shipping.title'), lead: t('policies.shipping.lead'), body: t('policies.shipping.body', { store: store.name }), draft: t('policies.shipping.status') === 'draft' },
    returns: { title: t('policies.returns.title'), lead: t('policies.returns.lead'), body: t('policies.returns.body', { store: store.name }), draft: t('policies.returns.status') === 'draft' },
    legal: { title: t('pages.policy.legal'), lead: t('pages.policy.lead'), body: '', draft: false },
  }
  const page = kind ? pages[kind] : null
  const title = page?.title ?? t('pages.policy.title')
  const sections = sectionsOf(page?.body ?? '')
  const toConfirm = t('pages.policy.toConfirm')
  useHead({ title, description: page?.lead ?? t('pages.policy.lead') })
  return (
    <Layout>
      <header className={styles.hero}>
        <Spark className={styles.heroSparkLeft} />
        <Spark className={styles.heroSparkRight} />
        <div className={styles.heroInner}>
          <Breadcrumbs
            crumbs={[
              { label: t('pages.policy.home'), href: '/' },
              { label: title, href: kind ? `/policies/${kind}/` : '/policies/' },
            ]}
            t={t}
            className={styles.crumbs}
          />
          <p className={styles.eyebrow}>{t('pages.policy.eyebrow')}</p>
          <h1 className={styles.heroTitle}>{title}</h1>
          <Ornament className={styles.ornament} />
          <p className={styles.heroLead}>{page?.lead ?? t('pages.policy.lead')}</p>
        </div>
      </header>
      {sections.length ? (
        <PolicyBody
          label={t('pages.policy.sections')}
          notice={
            page?.draft ? (
              <div className={styles.draft} role="note">
                <p className={styles.draftTitle}>{t('pages.policy.draftTitle')}</p>
                <p className={styles.draftBody}>{t('pages.policy.draftBody', { store: store.name })}</p>
              </div>
            ) : null
          }
          sections={sections.map((s) => ({
            id: s.id,
            title: s.title,
            content: s.blocks.map((b) => <Block key={b} block={b} toConfirm={toConfirm} />),
          }))}
        />
      ) : null}
      <div className={styles.after}>
        <PolicyCards except={kind} />
        <Support />
      </div>
    </Layout>
  )
}
