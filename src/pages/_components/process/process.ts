import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Инициализация анимации процесса
export function initProcessAnimation(): (() => void) | void {
  const processItems = document.querySelectorAll('[data-process-item]')

  if (!processItems.length) return

  // Устанавливаем начальное состояние
  gsap.set(processItems, { opacity: 0, y: 50 })
  gsap.set('[data-process-progress]', { scaleY: 0 })

  const scrollTriggers: ScrollTrigger[] = []

  // Создаем ScrollTrigger для показа элементов (они появляются в нижней трети экрана)
  processItems.forEach((item, index) => {
    const showTrigger = ScrollTrigger.create({
      trigger: item,
      start: 'top 75%', // Элемент появляется когда входит в нижнюю треть экрана
      end: 'top 75%',
      onEnter: () => {
        // Показываем элемент
        gsap.to(item, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out'
        })
      },
      onLeaveBack: () => {
        // При выходе назад скрываем элемент
        gsap.to(item, {
          opacity: 0,
          y: 50,
          duration: 0.6,
          ease: 'power2.in'
        })
      }
    })

    scrollTriggers.push(showTrigger)
  })

  // Создаем один общий ScrollTrigger для последовательного заполнения прогресса
  const progressTrigger = ScrollTrigger.create({
    trigger: processItems[0],
    start: 'top 70%',
    end: () => `+=${window.innerHeight * 2.5}`,
    scrub: 1,
    onUpdate: (self) => {
      const totalItems = processItems.length
      const globalProgress = self.progress

      // Определяем текущий активный элемент и его локальный прогресс
      const itemProgress = globalProgress * totalItems
      const currentItemIndex = Math.floor(itemProgress)
      const localProgress = itemProgress - currentItemIndex

      processItems.forEach((item, index) => {
        const progressLine = item.querySelector('[data-process-progress]') as HTMLElement

        if (index < currentItemIndex) {
          // Предыдущие элементы - полный прогресс и активность
          if (progressLine) {
            gsap.set(progressLine, { scaleY: 1 })
          }
          item.classList.add('active')
        } else if (index === currentItemIndex) {
          // Текущий элемент - заполняем прогресс
          if (progressLine) {
            gsap.set(progressLine, { scaleY: localProgress })
          }

          // Активируем когда прогресс достигает 100%
          if (localProgress >= 1) {
            item.classList.add('active')
          } else {
            item.classList.remove('active')
          }
        } else {
          // Будущие элементы - без прогресса и активности
          if (progressLine) {
            gsap.set(progressLine, { scaleY: 0 })
          }
          item.classList.remove('active')
        }
      })
    },
    onLeave: () => {
      // При завершении секции все элементы активны
      processItems.forEach((item) => {
        const progressLine = item.querySelector('[data-process-progress]') as HTMLElement
        if (progressLine) {
          gsap.set(progressLine, { scaleY: 1 })
        }
        item.classList.add('active')
      })
    },
    onLeaveBack: () => {
      // При выходе назад сбрасываем все
      processItems.forEach((item) => {
        const progressLine = item.querySelector('[data-process-progress]') as HTMLElement
        if (progressLine) {
          gsap.set(progressLine, { scaleY: 0 })
        }
        item.classList.remove('active')
      })
    }
  })

  scrollTriggers.push(progressTrigger)

  // Обработчик изменения размера окна
  const handleResize = () => {
    scrollTriggers.forEach(trigger => trigger.refresh())
  }

  window.addEventListener('resize', handleResize)

  // Возвращаем функцию очистки
  return () => {
    scrollTriggers.forEach(trigger => trigger.kill())
    window.removeEventListener('resize', handleResize)
  }
}
