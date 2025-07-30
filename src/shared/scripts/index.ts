import { accordionApi } from '@shared/ui/accordion/accordion'
import { dropdownApi } from '@shared/ui/dropdown/dropdown'
import { formApi } from '@shared/ui/form/form'
import { Marquee } from '@shared/ui/gsap/marquee/Marquee'
import { initializeInputNumberManager } from '@shared/ui/input-number/inputNumberManager'
import { inputUploadManager } from '@shared/ui/input-upload/inputUploadManager'
import { parallax } from '@shared/ui/parallax/parallax'
import { progressBarManager } from '@shared/ui/progress-bar/progressBarManager'
import rangeApi from '@shared/ui/range/range'
import { rating } from '@shared/ui/rating/rating'
import { selectApi } from '@shared/ui/select/select'
// import { StickyManager } from '@shared/ui/sticky/sticky'
import { TabsApi } from '@shared/ui/tabs/tabs-manager'
import { toastApi } from '@shared/ui/toast/toasts-manager'
import tooltipApi from '@shared/ui/tooltip/tooltip'
// import { initHeader } from '@widgets/header/header'
import inputSearchInit from '@widgets/input-search/input-search'
import { initSliderHover } from '@widgets/sliders/slider-hover/slider-hover'

import { ModalApi } from './components/modals'
import config from './config'
import { frontApi } from './frontApi'
import { fancyboxInit } from './libs/fancybox'
import { inputmaskApi } from './libs/inputmask/inputmask'
import { scrollManager } from './libs/lenis/lenis'
import { swiperApi } from './libs/swiper/swiper-manager'
import { initHorizontalScroll } from './utils/horizontal-scroll'
import { initOverlayScrollbars } from './utils/overlayScrollbars'

  ; (window as any).process = { env: {} } // Фикс для совместимости с TomSelect

export const commonFunction = (): void => {
  Marquee()

  initOverlayScrollbars()
  scrollManager.init()

  formApi.initAll()

  accordionApi.initAll()

  toastApi.initAll()

  TabsApi.initAll()

  ModalApi.initAll()

  selectApi.initAll()

  tooltipApi.initAll()

  rangeApi.initAll()

  swiperApi.initAll()

  inputmaskApi.reinitAll()

  dropdownApi.initAll()

  parallax()

  fancyboxInit()

  initHorizontalScroll()

  initSliderHover()

  // StickyManager.init()

  inputSearchInit()

  initializeInputNumberManager()
  rating()

  progressBarManager.initAll()
  inputUploadManager.initAll()
}

console.info(import.meta.env)

document.addEventListener('DOMContentLoaded', () => {
  config()
  frontApi()
  // initHeader()
  commonFunction()
})
