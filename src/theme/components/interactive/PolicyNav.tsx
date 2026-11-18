'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useInView } from '@dripfunnel/storefront-core/theme'
import { cx } from '../cx'
import styles from '../../styles/policy.module.css'

export type PolicySection = { id: string; title: string; content: ReactNode }

/** One section of a policy; tells the page whether its heading is on screen. */
const Section = ({ section, number, onSeen }: { section: PolicySection; number: number; onSeen: (id: string, seen: boolean) => void }) => {
  const heading = useRef<HTMLHeadingElement>(null)
  const seen = useInView(heading)
  useEffect(() => onSeen(section.id, seen), [onSeen, section.id, seen])
  return (
    <section id={section.id} className={styles.section} aria-labelledby={section.title ? `${section.id}-title` : undefined}>
      {section.title ? (
        <h2 ref={heading} id={`${section.id}-title`} className={styles.sectionTitle}>
          <span className={styles.sectionNumber} aria-hidden="true">
            {String(number).padStart(2, '0')}
          </span>
          {section.title}
        </h2>
      ) : null}
      {section.content}
    </section>
  )
}

/**
 * A policy's text with its section list: a sticky list beside the text on wide screens, a row of chips above it on
 * phones. The section being read is highlighted: the first whose heading is on screen, or, between headings, the one
 * last seen; a section picked from the list is highlighted at once.
 */
export const PolicyBody = ({ sections, label, notice }: { sections: PolicySection[]; label: string; notice: ReactNode }) => {
  // The sections whose headings are on screen.
  const [seen, setSeen] = useState<readonly string[]>([])
  const [current, setCurrent] = useState(sections[0]?.id ?? '')
  const onSeen = useRef((id: string, value: boolean) => setSeen((all) => (all.includes(id) === value ? all : value ? [...all, id] : all.filter((x) => x !== id)))).current
  useEffect(() => {
    // The highlighted section stays while its heading is on screen, so one picked near the page's end, which can't
    // scroll to the top, isn't replaced by an earlier heading still in view.
    setCurrent((now) => (seen.includes(now) ? now : (sections.find((s) => seen.includes(s.id))?.id ?? now)))
  }, [seen, sections])
  return (
    <div className={styles.layout}>
      <aside className={styles.aside}>
        <nav className={styles.nav} aria-label={label}>
          <p className={styles.navTitle}>{label}</p>
          <ol className={styles.navList}>
            {sections
              .filter((s) => s.title)
              .map((s) => (
                <li key={s.id} className={styles.navItem} onClick={() => setCurrent(s.id)}>
                  <Link href={`#${s.id}`} className={cx(styles.navLink, current === s.id && styles.navLinkOn)}>
                    {s.title}
                  </Link>
                </li>
              ))}
          </ol>
        </nav>
      </aside>
      <article className={styles.body}>
        {notice}
        {sections.map((s, i) => (
          <Section key={s.id} section={s} number={i + 1} onSeen={onSeen} />
        ))}
      </article>
    </div>
  )
}
