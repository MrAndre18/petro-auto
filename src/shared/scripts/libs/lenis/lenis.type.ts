import type Lenis from 'lenis'

export type LenisInstance = Lenis | null

export type LenisScrollToOptions = {
  offset?: number
  duration?: number
  immediate?: boolean
  lock?: boolean
  beforeScroll?: () => void
  afterScroll?: () => void
}

export type LenisApi = {
  init: () => void
  stop: () => void
  resume: () => void
  scrollTo: (target: HTMLElement | string, options?: LenisScrollToOptions) => void
  destroy: () => void
  getInstance: () => LenisInstance
  isEnabled: boolean
}
