import { swiperApi } from '@shared/scripts/libs/swiper/swiper-manager'

class CarCardManager {
  init(): void {
    setTimeout(() => {
      this.initCards()
    }, 100)
  }

  private initCards(): void {
    const cards = document.querySelectorAll<HTMLElement>('.car-card')

    cards.forEach(card => {
      const swiperElement = card.querySelector<HTMLElement>('[data-swiper]')
      if (!swiperElement) return

      const swiperId = swiperElement.dataset.swiper
      if (!swiperId) return

      const swiper = swiperApi.get(`[data-swiper="${swiperId}"]`)
      if (!swiper) return

      this.bindMouseEvents(card, swiperId, swiper)
    })
  }

  private bindMouseEvents(card: HTMLElement, swiperId: string, swiper: any): void {
    const slidesCount = swiper.slides.length

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const cardWidth = rect.width

      // Вычисляем зону (0 до slidesCount-1)
      const zone = Math.floor((x / cardWidth) * slidesCount)
      const slideIndex = Math.min(zone, slidesCount - 1)

      // Переключаемся на соответствующий слайд
      if (swiper.activeIndex !== slideIndex) {
        swiper.slideTo(slideIndex)
      }
    })

    card.addEventListener('mouseleave', () => {
      // При выходе мыши из карточки переключаемся на первый слайд
      swiper.slideTo(0)
    })
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const carCardManager = new CarCardManager()
  carCardManager.init()
})

export { CarCardManager } 