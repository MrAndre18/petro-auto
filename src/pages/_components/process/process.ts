import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Инициализация анимации процесса
export function initProcessAnimation(): (() => void) | void {

  const processItems = document.querySelectorAll('[data-process-item]')

  if (!processItems.length) {
    return
  }

  // Устанавливаем начальное состояние
  gsap.set(processItems, { opacity: 0, y: 50 })
  gsap.set('[data-process-progress]', { scaleY: 0 })

  // Убираем активность у всех элементов в начале
  processItems.forEach(item => {
    item.classList.remove('active')
      ; (item as HTMLElement).dataset.visible = 'false'
  })

  // Первый элемент становится активным изначально
  if (processItems[0]) {
    processItems[0].classList.add('active')
  }

  const scrollTriggers: ScrollTrigger[] = []

  // Создаем триггер для показа элементов (без скрытия)
  const visibilityTrigger = ScrollTrigger.create({
    trigger: processItems[0].parentElement || processItems[0], // используем родительский контейнер
    start: 'top 100%',
    end: 'bottom 0%',
    onUpdate: () => {
      processItems.forEach((item) => {
        const rect = item.getBoundingClientRect()
        const shouldShow = rect.top < window.innerHeight * 0.8
        const isCurrentlyVisible = (item as HTMLElement).dataset.visible === 'true'

        if (shouldShow && !isCurrentlyVisible) {
          gsap.to(item, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out'
          })
            ; (item as HTMLElement).dataset.visible = 'true'
        }
      })
    }
  })

  // Принудительно показываем элементы, которые уже должны быть видимыми
  setTimeout(() => {
    processItems.forEach((item) => {
      const rect = item.getBoundingClientRect()
      if (rect.top < window.innerHeight * 0.8) {
        gsap.set(item, { opacity: 1, y: 0 })
          ; (item as HTMLElement).dataset.visible = 'true'
      }
    })
  }, 100)

  scrollTriggers.push(visibilityTrigger)

  // Создаем индивидуальные триггеры для каждого элемента
  processItems.forEach((item, index) => {
    const progressLine = item.querySelector('[data-process-progress]') as HTMLElement

    if (!progressLine) return

    const progressTrigger = ScrollTrigger.create({
      trigger: item,
      start: 'center 60%', // Элемент начинает заполняться когда его центр достигает 60% экрана
      end: 'center 40%',   // И заканчивает когда центр достигает 40% экрана (т.е. прошел середину)
      scrub: 1,
      onUpdate: (self) => {
        // Заполняем прогресс текущего элемента
        gsap.set(progressLine, { scaleY: self.progress })

        // Когда прогресс достигает 100%, активируем следующий элемент
        if (self.progress >= 0.99 && index < processItems.length - 1) {
          const nextItem = processItems[index + 1]
          if (nextItem && !nextItem.classList.contains('active')) {
            nextItem.classList.add('active')
          }
        }
      },
      onLeave: () => {
        // При полном прохождении - прогресс 100%
        gsap.set(progressLine, { scaleY: 1 })

        // Активируем следующий элемент если еще не активирован
        if (index < processItems.length - 1) {
          const nextItem = processItems[index + 1]
          if (nextItem) {
            nextItem.classList.add('active')
          }
        }
      },
      onLeaveBack: () => {
        // При возврате назад - сбрасываем только прогресс, не трогаем видимость
        gsap.set(progressLine, { scaleY: 0 })

        // Убираем активность у следующего элемента
        if (index < processItems.length - 1) {
          const nextItem = processItems[index + 1]
          if (nextItem) {
            nextItem.classList.remove('active')
          }
        }
      }
    })

    scrollTriggers.push(progressTrigger)
  })

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
