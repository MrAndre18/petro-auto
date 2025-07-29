export const swiperExamples = (): void => {
  if (!document.querySelector('#swiper-examples')) return

  const api = window.frontApi?.swiper
  const selector = '#exampleSwiper'

  if (!api) {
    console.warn('[swiper] window.frontApi.swiper не найден')
    return
  }

  document.querySelector('[data-swiper-example-init]')?.addEventListener('click', () => {
    api.init(selector)
  })

  document.querySelector('[data-swiper-example-init-all]')?.addEventListener('click', () => {
    api.initAll()
  })

  document.querySelector('[data-swiper-example-reinit]')?.addEventListener('click', () => {
    api.reinit(selector)
    console.log('[reinit] Слайдер переинициализирован')
  })

  document.querySelector('[data-swiper-example-reinit-all]')?.addEventListener('click', () => {
    api.reinitAll()
    console.log('[reinitAll] Все слайдеры переинициализированы')
  })

  document.querySelector('[data-swiper-example-is-init]')?.addEventListener('click', () => {
    const result = api.isInit(selector)
    console.log(`[isInit] Результат: ${result}`)
  })

  document.querySelector('[data-swiper-example-get]')?.addEventListener('click', () => {
    const instance = api.get(selector)
    console.log('[get] Экземпляр:', instance)
  })
}
