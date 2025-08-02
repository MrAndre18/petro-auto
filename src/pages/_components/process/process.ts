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

  // Убираем активность у всех элементов в начале и устанавливаем начальное состояние
  processItems.forEach(item => {
    item.classList.remove('active')
      ; (item as HTMLElement).dataset.visible = 'false' // Изначально все элементы скрыты
  })

  // Дополнительная защита - убираем активность через небольшую задержку
  setTimeout(() => {
    processItems.forEach(item => {
      item.classList.remove('active')
    })
  }, 100)

  // MutationObserver убран - проблема найдена и исправлена

  const scrollTriggers: ScrollTrigger[] = []

  // Убираем отдельный ScrollTrigger для показа - будем показывать элементы через логику прогресса

  // Создаем один общий ScrollTrigger для последовательного заполнения прогресса
  const progressTrigger = ScrollTrigger.create({
    trigger: processItems[0],
    start: 'top 70%',
    end: () => `+=${window.innerHeight * 2.5}`,
    scrub: 1,
    onUpdate: (self) => {
      const totalItems = processItems.length
      const globalProgress = self.progress

      // ПРИНУДИТЕЛЬНО убираем активность у всех элементов в начале каждого обновления
      processItems.forEach(item => {
        item.classList.remove('active')
      })

      // Определяем текущий активный элемент и его локальный прогресс
      const itemProgress = globalProgress * totalItems
      const currentItemIndex = Math.floor(itemProgress)
      const localProgress = itemProgress - currentItemIndex

      // В самом начале (когда нет прогресса) только показываем/скрываем элементы
      // БЕЗ АКТИВНОСТИ - она будет добавлена только когда прогресс начнется
      if (globalProgress === 0) {
        processItems.forEach((item, index) => {
          const rect = item.getBoundingClientRect()
          const shouldShow = rect.top < window.innerHeight * 0.75
          const isCurrentlyVisible = (item as HTMLElement).dataset.visible === 'true'

          if (shouldShow && !isCurrentlyVisible) {
            gsap.to(item, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power2.out'
            })
              ; (item as HTMLElement).dataset.visible = 'true'
          } else if (!shouldShow && isCurrentlyVisible) {
            gsap.to(item, {
              opacity: 0,
              y: 50,
              duration: 0.6,
              ease: 'power2.in'
            })
              ; (item as HTMLElement).dataset.visible = 'false'
          }
        })
        return
      }

      processItems.forEach((item, index) => {
        const progressLine = item.querySelector('[data-process-progress]') as HTMLElement

        // Проверяем нужно ли показать элемент (когда он входит в нижнюю треть экрана)
        const rect = item.getBoundingClientRect()
        const shouldShow = rect.top < window.innerHeight * 0.75
        const isCurrentlyVisible = (item as HTMLElement).dataset.visible === 'true'

        if (shouldShow && !isCurrentlyVisible) {
          // Показываем элемент если он должен быть видим и сейчас скрыт
          gsap.to(item, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out'
          })
            ; (item as HTMLElement).dataset.visible = 'true'
        } else if (!shouldShow && isCurrentlyVisible) {
          // Скрываем элемент если он не должен быть видим и сейчас показан
          gsap.to(item, {
            opacity: 0,
            y: 50,
            duration: 0.6,
            ease: 'power2.in'
          })
            ; (item as HTMLElement).dataset.visible = 'false'
        }

        // Логика прогресса
        if (index < currentItemIndex) {
          // Предыдущие элементы - полный прогресс
          if (progressLine) {
            gsap.set(progressLine, { scaleY: 1 })
          }
        } else if (index === currentItemIndex) {
          // Текущий элемент - заполняем прогресс
          if (progressLine) {
            gsap.set(progressLine, { scaleY: localProgress })
          }
        } else {
          // Будущие элементы - без прогресса
          if (progressLine) {
            gsap.set(progressLine, { scaleY: 0 })
          }
        }

        // ИСПРАВЛЕННАЯ логика активности
        let shouldBeActive = false

        if (index < currentItemIndex) {
          // Все предыдущие завершенные элементы активны
          shouldBeActive = true
        } else if (index === currentItemIndex) {
          // Текущий элемент активен пока заполняется ЕГО прогресс
          shouldBeActive = true
        }

        // Применяем активность только если элемент должен быть активным
        if (shouldBeActive) {
          item.classList.add('active')
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
      processItems.forEach((item, index) => {
        const progressLine = item.querySelector('[data-process-progress]') as HTMLElement
        if (progressLine) {
          gsap.set(progressLine, { scaleY: 0 })
        }

        // Скрываем элементы и убираем активность
        gsap.to(item, {
          opacity: 0,
          y: 50,
          duration: 0.6,
          ease: 'power2.in'
        })
        item.classList.remove('active')
          ; (item as HTMLElement).dataset.visible = 'false'
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
