import { gsap } from 'gsap'

export type AnimationType = 'slide' | 'cards' | 'fade'

export interface AnimationApi {
  animateTransition(
    from: HTMLElement | null,
    to: HTMLElement | null,
    direction: 'forward' | 'backward' | 'none',
    onComplete?: () => void
  ): void
}

class SlideAnimation implements AnimationApi {
  animateTransition(from: HTMLElement | null, to: HTMLElement | null, direction: 'forward' | 'backward' | 'none', onComplete?: () => void) {
    if (!from || !to || direction === 'none') return
    gsap.killTweensOf([from, to])
    const width = to.offsetWidth
    // Оба слоя видимы и на своих местах
    gsap.set([from, to], { opacity: 1, pointerEvents: 'auto', visibility: 'visible' })
    gsap.set(to, { zIndex: 2 })
    gsap.set(from, { zIndex: 1 })
    if (direction === 'forward') {
      gsap.set(to, { x: width, opacity: 0 })
      gsap.to(to, {
        x: width * 0.5,
        opacity: 1,
        duration: 0.3
      })
      gsap.to(to, {
        x: 0,
        duration: 0.3,
        onComplete: () => { gsap.set(to, { x: 0 }) }
      })
      gsap.to(from, {
        x: -width,
        duration: 0.6,
        onComplete: () => {
          gsap.set(from, { opacity: 0, pointerEvents: 'none', visibility: 'hidden', zIndex: '', x: 0 })
          if (onComplete) onComplete()
        }
      })
    } else {
      gsap.set(to, { x: -width, opacity: 0 })
      gsap.to(to, {
        x: -width * 0.5,
        opacity: 1,
        duration: 0.3
      })
      gsap.to(to, {
        x: 0,
        duration: 0.3,
        onComplete: () => { gsap.set(to, { x: 0 }) }
      })
      gsap.to(from, {
        x: width * 0.5,
        duration: 0.3
      })
      gsap.to(from, {
        x: width,
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          gsap.set(from, { opacity: 0, pointerEvents: 'none', visibility: 'hidden', zIndex: '', x: 0 })
          if (onComplete) onComplete()
        }
      })
    }
  }
}

class CardsAnimation implements AnimationApi {
  animateTransition(from: HTMLElement | null, to: HTMLElement | null, direction: 'forward' | 'backward' | 'none', onComplete?: () => void) {
    if (!from || !to || direction === 'none') return
    gsap.killTweensOf([from, to])
    const width = to.offsetWidth
    gsap.set([from, to], { opacity: 1, pointerEvents: 'auto', visibility: 'visible' })
    if (direction === 'forward') {
      gsap.set(to, { zIndex: 2 })
      gsap.set(from, { zIndex: 1 })
      // Новый слой появляется справа
      gsap.set(to, { x: width, opacity: 0 })
      gsap.to(to, {
        x: width * 0.5,
        opacity: 1,
        duration: 0.3
      })
      gsap.to(to, {
        x: 0,
        duration: 0.3,
        onComplete: () => { gsap.set(to, { x: 0 }) }
      })
      // Предыдущий слой остаётся на месте и уменьшается
      gsap.set(from, { x: 0 })
      gsap.to(from, { scale: 0.95, duration: 0.6 })
    } else {
      // При переходе назад: текущий слой остаётся поверх до завершения анимации
      gsap.set(from, { zIndex: 2 })
      gsap.set(to, { zIndex: 1 })
      // Текущий слой уходит вправо
      gsap.set(to, { x: 0, opacity: 1 })
      gsap.to(from, {
        x: width * 0.5,
        duration: 0.3
      })
      gsap.to(from, {
        x: width,
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          gsap.set(from, { opacity: 0, pointerEvents: 'none', visibility: 'hidden', x: 0, scale: 1, zIndex: 1 })
          gsap.set(to, { zIndex: 2 })
          if (onComplete) onComplete()
        }
      })
      gsap.to(to, {
        scale: 1,
        duration: 0.6
      })
    }
  }
}

class FadeAnimation implements AnimationApi {
  animateTransition(from: HTMLElement | null, to: HTMLElement | null, direction: 'forward' | 'backward' | 'none', onComplete?: () => void) {
    if (!from || !to || direction === 'none') return
    gsap.killTweensOf([from, to])
    gsap.set([from, to], { pointerEvents: 'auto', visibility: 'visible' })
    gsap.set(to, { opacity: 0 })
    gsap.set(from, { opacity: 1 })
    gsap.to(from, {
      opacity: 0, duration: 0.4, onComplete: () => {
        gsap.set(from, { opacity: 0, pointerEvents: 'none', visibility: 'hidden' })
        if (onComplete) onComplete()
      }
    })
    gsap.to(to, { opacity: 1, duration: 0.4 })
  }
}

export function getAnimation(type: AnimationType): AnimationApi {
  switch (type) {
    case 'slide':
      return new SlideAnimation()
    case 'cards':
      return new CardsAnimation()
    case 'fade':
      return new FadeAnimation()
    default:
      return new SlideAnimation()
  }
} 