import type { ReactNode } from 'react'
import { Ornament } from './Ornament'
import { cx } from './cx'
import styles from '../styles/home.module.css'

/** A section's gold eyebrow, serif title, ornament and optional line; centred, or to the start with an action beside it. */
export const SectionHeading = ({ eyebrow, title, lead, action, start = false }: { eyebrow: string; title: string; lead?: string; action?: ReactNode; start?: boolean }) => (
  <div className={cx(styles.sectionHead, start && styles.sectionHeadStart)}>
    <div className={styles.sectionHeadText}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 className={styles.heading}>{title}</h2>
      <Ornament className={styles.ornament} />
      {lead ? <p className={styles.sectionLead}>{lead}</p> : null}
    </div>
    {action}
  </div>
)
