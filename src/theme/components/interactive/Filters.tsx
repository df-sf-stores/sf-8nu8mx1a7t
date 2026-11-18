'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Checkbox, Link, PriceRange, Select, useLoadOnScroll, useLocation, useStorefront, type Listing, type SortKey } from '@dripfunnel/storefront-core/theme'
import { isCategoryActive, useCategories } from '../categories'
import { cx } from '../cx'
import { percentOff } from '../percentOff'
import { Notice } from '../Notice'
import { GridPlaceholder, ProductGrid } from '../ProductCard'
import { Retry } from './Retry'
import styles from '../../styles/shop.module.css'

/** Refinements the engine doesn't filter on, applied to the products loaded so far. */
type Refine = { inStock: boolean; onOffer: boolean }

const FilterGroup = ({ title, children }: { title: string; children: ReactNode }) => (
  <details className={styles.facet} open>
    <summary className={styles.facetName}>
      {title}
      <svg className={styles.facetChevron} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </summary>
    <div className={styles.facetBody}>{children}</div>
  </details>
)

/** The sidebar on wide screens, a drawer the Filters button opens on narrow ones. */
const FilterPanel = ({ listing, refine, setRefine, open, onClose, shown }: { listing: Listing; refine: Refine; setRefine: (r: Refine) => void; open: boolean; onClose: () => void; shown: number }) => {
  const { t } = useStorefront()
  const categories = useCategories()
  const { path, query } = useLocation()
  const closer = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (open) closer.current?.focus()
  }, [open])
  const allActive = path.startsWith('/collections/all')
  return (
    <>
      <div className={cx(styles.filterScrim, open && styles.filterScrimOpen)} aria-hidden="true" onClick={onClose} />
      <aside
        id="listing-filters"
        className={cx(styles.filters, open && styles.filtersOpen)}
        aria-label={t('shop.listing.filters')}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && open) onClose()
        }}
      >
        <div className={styles.filterHead}>
          <p className={styles.filterTitle}>{t('shop.listing.filters')}</p>
          <button ref={closer} type="button" className={styles.filterClose} aria-label={t('shop.listing.close')} onClick={onClose}>
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div className={styles.filterBody}>
          <FilterGroup title={t('shop.listing.category')}>
            <ul className={styles.catList}>
              <li>
                <Link href="/collections/all/" className={cx(styles.catLink, allActive && styles.catLinkOn)}>
                  {t('shop.listing.allCategories')}
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.key}>
                  <Link href={c.href} className={cx(styles.catLink, isCategoryActive(c, path, query) && styles.catLinkOn)}>
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FilterGroup>
          {listing.priceBounds ? (
            <FilterGroup title={t('shop.listing.price')}>
              <PriceRange
                bounds={listing.priceBounds}
                value={listing.priceRange}
                onChange={listing.setPriceRange}
                label={t('shop.listing.price')}
                className={styles.priceRange}
                parts={{ track: styles.priceTrack, rail: styles.priceRail, fill: styles.priceFill, tick: styles.priceTick, thumb: styles.priceThumb, ends: styles.priceEnds, select: styles.priceSelect, to: styles.priceTo }}
              />
            </FilterGroup>
          ) : null}
          {listing.facets.map((facet) => (
            <FilterGroup key={facet.id} title={facet.name}>
              <div role="group" aria-label={facet.name} className={styles.checks}>
                {facet.values.map((value) => (
                  <Checkbox key={value.id} checked={value.selected} onChange={() => listing.toggle(value.id)} className={styles.check}>
                    {value.name} <span className={styles.muted}>({value.count})</span>
                  </Checkbox>
                ))}
              </div>
            </FilterGroup>
          ))}
          <FilterGroup title={t('shop.listing.availability')}>
            <Checkbox checked={refine.inStock} onChange={() => setRefine({ ...refine, inStock: !refine.inStock })} className={styles.check}>
              {t('shop.listing.inStockOnly')}
            </Checkbox>
          </FilterGroup>
          <FilterGroup title={t('shop.listing.discount')}>
            <Checkbox checked={refine.onOffer} onChange={() => setRefine({ ...refine, onOffer: !refine.onOffer })} className={styles.check}>
              {t('shop.listing.onOffer')}
            </Checkbox>
            {listing.hasMore ? <p className={styles.refineNote}>{t('shop.listing.refineNote')}</p> : null}
          </FilterGroup>
        </div>
        <div className={styles.filterFoot}>
          <button type="button" className={styles.primary} onClick={onClose}>
            {t('shop.listing.apply')} ({shown})
          </button>
        </div>
      </aside>
    </>
  )
}

/** A collection's or a search's products: filters, sort, the count, the grid and its states, and more loading on scroll. */
export const ListingView = ({ listing }: { listing: Listing }) => {
  const { t } = useStorefront()
  const [refine, setRefine] = useState<Refine>({ inStock: false, onOffer: false })
  const [open, setOpen] = useState(false)
  const opener = useRef<HTMLButtonElement>(null)
  const items = listing.items.filter((p) => (!refine.inStock || p.stock.inStock) && (!refine.onOffer || percentOff(p.price, p.compareAt) !== null))
  const priced = listing.priceRange.min !== null || listing.priceRange.max !== null
  const chosen = listing.selected.length + Number(priced) + Number(refine.inStock) + Number(refine.onOffer)
  const clearAll = () => {
    setRefine({ inStock: false, onOffer: false })
    listing.clear()
  }
  const labels: Record<SortKey, string> = {
    featured: t('shop.listing.sorts.featured'),
    newest: t('shop.listing.sorts.newest'),
    'price-low': t('shop.listing.sorts.priceLow'),
    'price-high': t('shop.listing.sorts.priceHigh'),
    name: t('shop.listing.sorts.name'),
  }
  return (
    <div className={styles.listingFiltered}>
      <FilterPanel
        listing={listing}
        refine={refine}
        setRefine={setRefine}
        open={open}
        shown={items.length}
        onClose={() => {
          setOpen(false)
          opener.current?.focus()
        }}
      />
      <div className={styles.results}>
        <h2 className={styles.hiddenHeading}>{t('shop.listing.heading')}</h2>
        <div className={styles.toolbar}>
          <button ref={opener} type="button" className={styles.filterToggle} aria-expanded={open} aria-controls="listing-filters" onClick={() => setOpen(true)}>
            <svg className={styles.filterIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M4 6h16M7 12h10M10 18h4" />
            </svg>
            {t('shop.listing.filters')}
            {chosen ? <span className={styles.count}>{chosen}</span> : null}
          </button>
          <p className={styles.resultCount} role="status">
            {listing.status === 'ready' ? t('shop.listing.showing', { count: items.length }) : null}
          </p>
          <Select label={t('shop.listing.sort')} value={listing.sort} options={listing.sorts.map((s) => ({ value: s, label: labels[s] }))} onChange={listing.setSort} className={styles.sort} />
          {chosen ? (
            <div className={styles.chips}>
              {listing.selected.map((s) => (
                <button key={s.id} type="button" className={styles.chip} aria-label={t('shop.listing.remove', { name: s.name })} onClick={() => listing.toggle(s.id)}>
                  {s.name}
                  <svg className={styles.chipIcon} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                    <path d="M4 4l8 8M12 4l-8 8" />
                  </svg>
                </button>
              ))}
              {refine.inStock ? (
                <button type="button" className={styles.chip} aria-label={t('shop.listing.remove', { name: t('shop.listing.inStockOnly') })} onClick={() => setRefine({ ...refine, inStock: false })}>
                  {t('shop.listing.inStockOnly')}
                  <svg className={styles.chipIcon} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                    <path d="M4 4l8 8M12 4l-8 8" />
                  </svg>
                </button>
              ) : null}
              {refine.onOffer ? (
                <button type="button" className={styles.chip} aria-label={t('shop.listing.remove', { name: t('shop.listing.onOffer') })} onClick={() => setRefine({ ...refine, onOffer: false })}>
                  {t('shop.listing.onOffer')}
                  <svg className={styles.chipIcon} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                    <path d="M4 4l8 8M12 4l-8 8" />
                  </svg>
                </button>
              ) : null}
              <button type="button" className={styles.clear} onClick={clearAll}>
                {t('shop.listing.clear')}
              </button>
            </div>
          ) : null}
        </div>
        {listing.status === 'loading' ? <GridPlaceholder label={t('shop.listing.loading')} count={8} /> : null}
        {listing.status === 'error' ? (
          <Notice title={t('shop.listing.failed')} lead={t('shop.listing.failedLead')}>
            <Retry label={t('shop.listing.retry')} onRetry={listing.retry} />
          </Notice>
        ) : null}
        {listing.status === 'ready' && items.length === 0 ? (
          chosen ? (
            <Notice title={t('shop.listing.empty')} lead={t('shop.listing.emptyLead')}>
              <Retry label={t('shop.listing.clear')} onRetry={clearAll} />
            </Notice>
          ) : (
            <Notice title={t('shop.collection.empty')} lead={t('shop.collection.emptyLead')}>
              <Link href="/collections/all/" className={styles.secondary}>
                {t('shop.collection.browse')}
              </Link>
            </Notice>
          )
        ) : null}
        {listing.status === 'ready' ? <ProductGrid products={items} /> : null}
        <MoreOnScroll listing={listing} />
      </div>
    </div>
  )
}

/** Infinite scroll: the next page loads as the end of the grid nears the screen, and a page that didn't load offers a retry. */
export const MoreOnScroll = ({ listing }: { listing: Listing }) => {
  const { t } = useStorefront()
  const end = useLoadOnScroll(listing)
  return (
    <div ref={end} className={styles.more}>
      {listing.loadingMore ? (
        <p className={styles.muted} role="status">
          {t('shop.listing.loadingMore')}
        </p>
      ) : null}
      {listing.moreFailed ? (
        <>
          <p className={styles.muted} role="alert">
            {t('shop.listing.moreFailed')}
          </p>
          <button type="button" className={styles.secondary} onClick={listing.fetchMore}>
            {t('shop.listing.retry')}
          </button>
        </>
      ) : null}
    </div>
  )
}
