'use client'

import { useState } from 'react'
import { Link, Select, TextField, useStorefront } from '@dripfunnel/storefront-core/theme'
import styles from '../../styles/about.module.css'

type Topic = 'product' | 'order' | 'custom' | 'other'

// The theme rules allow no URL encoding: characters that would break the query are dropped, and spaces become '+'.
const queryWords = (words: string) =>
  words
    .replace(/[&#%?+=]/g, ' ')
    .trim()
    .replace(/\s+/g, '+')

/**
 * The contact page's enquiry: the shopper's name, number, topic and message, sent as a ready-written WhatsApp
 * message to the store's own WhatsApp number from Site settings. The store has no enquiry inbox, so nothing is posted.
 */
export const Enquiry = ({ whatsapp }: { whatsapp: string }) => {
  const { t } = useStorefront()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [topic, setTopic] = useState<Topic>('product')
  const [message, setMessage] = useState('')
  const topics: Record<Topic, string> = {
    product: t('pages.contact.form.topics.product'),
    order: t('pages.contact.form.topics.order'),
    custom: t('pages.contact.form.topics.custom'),
    other: t('pages.contact.form.topics.other'),
  }
  const ready = name.trim() !== '' && message.trim() !== ''
  const text = [
    t('pages.contact.form.intro', { name: name.trim() }),
    phone.trim() ? t('pages.contact.form.phoneLine', { phone: phone.trim() }) : '',
    t('pages.contact.form.topicLine', { topic: topics[topic] }),
    message.trim(),
  ]
    .filter(Boolean)
    .join(' ')
  return (
    <div className={styles.form}>
      <div className={styles.formRow}>
        <TextField label={t('pages.contact.form.name')} value={name} onChange={setName} autoComplete="name" maxLength={80} className={styles.field} />
        <TextField label={t('pages.contact.form.phone')} type="tel" inputMode="tel" value={phone} onChange={setPhone} autoComplete="tel" note={t('pages.contact.form.optional')} maxLength={20} className={styles.field} />
      </div>
      <Select label={t('pages.contact.form.topic')} value={topic} options={(Object.keys(topics) as Topic[]).map((value) => ({ value, label: topics[value] }))} onChange={setTopic} className={styles.field} />
      <TextField label={t('pages.contact.form.message')} value={message} onChange={setMessage} maxLength={500} className={styles.field} />
      {ready ? (
        <Link href={`${whatsapp}?text=${queryWords(text)}`} className={styles.send}>
          {t('pages.contact.form.send')}
        </Link>
      ) : (
        <>
          <button type="button" className={styles.send} disabled aria-describedby="enquiry-needed">
            {t('pages.contact.form.send')}
          </button>
          <p id="enquiry-needed" className={styles.formNote}>
            {t('pages.contact.form.needed')}
          </p>
        </>
      )}
    </div>
  )
}
