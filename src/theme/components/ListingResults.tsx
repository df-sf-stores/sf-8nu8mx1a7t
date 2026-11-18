import type { Listing } from '@dripfunnel/storefront-core/theme'
import { ListingView } from './interactive/Filters'

/** A collection's or a search's products: filters, sort, the grid and its states, and more loading on scroll. */
export const ListingResults = ({ listing }: { listing: Listing }) => <ListingView listing={listing} />
