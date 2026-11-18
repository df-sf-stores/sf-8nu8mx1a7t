'use client'

import { useEffect, useRef, useState } from 'react'
import { Image, useStorefront, Video, type Photo, type VideoFile } from '@dripfunnel/storefront-core/theme'
import { cx } from '../cx'
import styles from '../../styles/product.module.css'

/**
 * The product's pictures: the chosen one large with arrows and a counter, the rest as thumbnails, the video last.
 * Hovering with a mouse zooms into the picture where the pointer is; a tap or a click toggles the zoom.
 */
export const Gallery = ({ photos, video, name }: { photos: readonly Photo[]; video: VideoFile | null; name: string }) => {
  const { t } = useStorefront()
  const [shown, setShown] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  const stage = useRef<HTMLDivElement>(null)
  const count = photos.length + (video ? 1 : 0)
  // A new version's photos start the gallery again at its first picture.
  const firstUrl = photos[0]?.url ?? ''
  useEffect(() => setShown(0), [firstUrl])
  const first = photos[0]
  // Core's <Video> needs a poster (storefront ARCHITECTURE §2.1), so a product with no photo shows no video either.
  if (!first) return <div className={styles.noPicture} />
  const playing = video !== null && shown === photos.length
  const photo = photos[Math.min(shown, photos.length - 1)] ?? first
  const go = (index: number) => {
    setZoomed(false)
    setShown((index + count) % count)
  }
  const aim = (x: number, y: number) => {
    const box = stage.current?.getBoundingClientRect()
    if (!box) return
    stage.current?.style.setProperty('--zoom-x', `${((x - box.left) / box.width) * 100}%`)
    stage.current?.style.setProperty('--zoom-y', `${((y - box.top) / box.height) * 100}%`)
  }
  return (
    <div className={styles.gallery}>
      <div className={styles.stageWrap}>
        <div
          ref={stage}
          className={cx(styles.stage, zoomed && !playing && styles.stageZoomed)}
          onPointerEnter={(e) => {
            if (e.pointerType === 'mouse' && !playing) setZoomed(true)
          }}
          onPointerLeave={(e) => {
            if (e.pointerType === 'mouse') setZoomed(false)
          }}
          onPointerMove={(e) => aim(e.clientX, e.clientY)}
          onClick={(e) => {
            if (playing) return
            aim(e.clientX, e.clientY)
            setZoomed(!zoomed)
          }}
        >
          {playing && video ? <Video video={video} poster={first} label={name} ratio={0.8} className={styles.media} /> : <Image image={photo} alt={photo.alt ?? name} ratio={0.8} sizes="(min-width: 1024px) 48vw, 100vw" className={styles.media} />}
        </div>
        {count > 1 ? (
          <>
            <button type="button" className={cx(styles.stageArrow, styles.stagePrev)} aria-label={t('shop.product.previous')} onClick={() => go(shown - 1)}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            <button type="button" className={cx(styles.stageArrow, styles.stageNext)} aria-label={t('shop.product.next')} onClick={() => go(shown + 1)}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
            <span className={styles.stageDots} aria-hidden="true">
              {[...Array(count).keys()].map((i) => (
                <span key={i} className={i === shown ? styles.stageDotOn : styles.stageDot} />
              ))}
            </span>
          </>
        ) : null}
        {playing ? null : (
          <span className={styles.zoomHint} aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <circle cx="11" cy="11" r="6.5" />
              <path d="M16 16l4.5 4.5M11 8.5v5M8.5 11h5" />
            </svg>
          </span>
        )}
      </div>
      {count > 1 ? (
        <div className={styles.thumbs}>
          {photos.map((p, i) => (
            <button key={p.url} type="button" className={i === shown ? styles.thumbOn : styles.thumb} aria-label={p.alt ?? name} aria-pressed={i === shown} onClick={() => go(i)}>
              <Image image={p} alt="" ratio={1} sizes="88px" className={styles.thumbImage} />
            </button>
          ))}
          {video ? (
            <button type="button" className={playing ? styles.thumbOn : styles.thumb} aria-label={t('shop.product.video')} aria-pressed={playing} onClick={() => go(photos.length)}>
              <svg className={styles.play} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M9 7l8 5-8 5z" />
              </svg>
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
