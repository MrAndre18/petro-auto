import type Swiper from 'swiper'

type TMouseMoveSlidesChange = (slider: Swiper, e: MouseEvent) => void

interface HTMLElementWithSwiper extends HTMLElement {
  swiper?: Swiper
}

interface HandlerPair {
  onMouseMove: (e: MouseEvent) => void
  onMouseLeave: () => void
}

const handlerMap = new WeakMap<HTMLElement, HandlerPair>()

const mouseMoveSlidesChange: TMouseMoveSlidesChange = (slider, e) => {
  const slidesCount = slider.slides?.length ?? 0
  if (slidesCount <= 1) return

  const target = e.currentTarget as HTMLElement
  const width = target.clientWidth
  const segment = Math.round(width / slidesCount)

  const mouseX = e.clientX - target.getBoundingClientRect().left
  let index = Math.floor(mouseX / segment)
  slider.slideTo(Math.min(index, slidesCount - 1))
}

function findHoverTarget(sliderEl: HTMLElement, selector?: string): HTMLElement {
  if (!selector) return sliderEl

  // Ищем элемент по селектору относительно слайдера
  const target = sliderEl.closest(selector) || document.querySelector(selector)
  return target as HTMLElement || sliderEl
}

export function initSliderHover(): void {
  const isMobile = /Mobi|Android/i.test(navigator.userAgent)
  const sliders = document.querySelectorAll<HTMLElementWithSwiper>('[data-slider-hover]')

  if (!sliders.length) return

  sliders.forEach(sliderEl => {
    const slider = sliderEl.swiper
    if (!slider) return

    const hoverTargetSelector = sliderEl.dataset.hoverTargetSelector
    const hoverTarget = findHoverTarget(sliderEl, hoverTargetSelector)

    // Очищаем старые обработчики с hover target
    const old = handlerMap.get(hoverTarget)
    if (old) {
      hoverTarget.removeEventListener('mousemove', old.onMouseMove)
      hoverTarget.removeEventListener('mouseleave', old.onMouseLeave)
      handlerMap.delete(hoverTarget)
    }

    // Десктоп: hover логика
    if (!isMobile) {
      const onMouseMove = (e: MouseEvent) => mouseMoveSlidesChange(slider, e)
      const onMouseLeave = () => slider.slideTo(0)

      hoverTarget.addEventListener('mousemove', onMouseMove)
      hoverTarget.addEventListener('mouseleave', onMouseLeave)
      handlerMap.set(hoverTarget, { onMouseMove, onMouseLeave })
    }

    // Мобайл: тап по слайдеру триггерит клик по ссылке
    const enableMobileClick = sliderEl.dataset.mobileClick === 'true'
    const mobileClickSelector = sliderEl.dataset.mobileClickSelector || '.slider-hover__link'

    if (isMobile && enableMobileClick) {
      let touchStartX = 0
      let touchStartY = 0
      let touchMoved = false

      const link = document.querySelector<HTMLAnchorElement>(mobileClickSelector)

      sliderEl.addEventListener('touchstart', (e: TouchEvent) => {
        if (e.touches.length !== 1) return
        touchMoved = false
        touchStartX = e.touches[0].clientX
        touchStartY = e.touches[0].clientY
      })

      sliderEl.addEventListener('touchmove', (e: TouchEvent) => {
        if (e.touches.length !== 1) return
        const dx = Math.abs(e.touches[0].clientX - touchStartX)
        const dy = Math.abs(e.touches[0].clientY - touchStartY)
        if (dx > 10 || dy > 10) touchMoved = true
      })

      sliderEl.addEventListener('touchend', (e: TouchEvent) => {
        if (!touchMoved && link) {
          link.click()
        }
      })
    }
  })
}