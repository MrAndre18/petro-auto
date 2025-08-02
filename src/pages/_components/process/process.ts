import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Инициализация анимации процесса
export function initProcessAnimation(): (() => void) | void {
  const processItems = document.querySelectorAll('[data-process-item]')

  if (!processItems.length) return

  // Функция для расчета адаптивной длины анимации
  function getAdaptiveEndValue() {
    const viewportHeight = window.innerHeight
    const baseLength = processItems.length * 200 // Базовая длина
    const adaptiveLength = Math.max(viewportHeight * 1.5, baseLength)
    return `+=${adaptiveLength}`
  }

  // Устанавливаем начальное состояние
  gsap.set(processItems, { opacity: 0, y: 50 })
  gsap.set('[data-process-progress]', { scaleY: 0 })

  // Состояние анимации
  const state = {
    currentStep: -1,  // Текущий активный шаг (-1 = ничего не активно)
    firstActivated: false,
    sectionCompleted: false  // Была ли секция полностью завершена
  }

  // Функция для появления элемента
  function showElement(index: number) {
    const item = processItems[index]
    gsap.to(item, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      delay: index * 0.1 // Небольшая задержка для каскадного появления
    })
  }

  // Функция для скрытия элемента
  function hideElement(index: number) {
    const item = processItems[index]
    gsap.to(item, {
      opacity: 0,
      y: 50,
      duration: 0.6,
      ease: 'power2.in'
    })
  }

  // Функция для активации элемента
  function activateElement(index: number) {
    const item = processItems[index]
    if (!item.classList.contains('active')) {
      item.classList.add('active')
      state.currentStep = index
    }
  }

  // Функция для деактивации элемента
  function deactivateElement(index: number) {
    const item = processItems[index]
    if (item.classList.contains('active')) {
      item.classList.remove('active')
    }
  }

  // Функция для обновления прогресса
  function updateProgress(index: number, progress: number) {
    const item = processItems[index]
    const progressLine = item.querySelector('[data-process-progress]') as HTMLElement
    if (progressLine) {
      gsap.set(progressLine, { scaleY: Math.max(0, Math.min(1, progress)) })
    }
  }

  // Функция для определения какой элемент должен быть активен на текущем уровне скролла
  function calculateCurrentState(globalProgress: number) {
    const totalSteps = processItems.length
    const stepSize = 1 / totalSteps

    // Определяем текущий шаг
    const currentIndex = Math.floor(globalProgress / stepSize)
    const localProgress = (globalProgress % stepSize) / stepSize

    return {
      currentIndex: Math.min(currentIndex, totalSteps - 1),
      localProgress: Math.max(0, Math.min(1, localProgress))
    }
  }

  // Создаем один общий ScrollTrigger для всей секции
  let scrollTrigger = ScrollTrigger.create({
    trigger: processItems[0],
    start: 'top 80%',
    end: getAdaptiveEndValue,
    scrub: 1,
    onUpdate: (self) => {
      const { currentIndex, localProgress } = calculateCurrentState(self.progress)

      // Отмечаем, что секция была завершена, если дошли до конца
      if (self.progress >= 0.99) {
        state.sectionCompleted = true
      }

      // Показываем/скрываем элементы (одинаково для обоих направлений)
      processItems.forEach((_, index) => {
        if (index < currentIndex) {
          // Предыдущие элементы - показываем и делаем активными с полным прогрессом
          showElement(index)
          updateProgress(index, 1)
          activateElement(index)
        } else if (index === currentIndex) {
          // Текущий элемент - показываем
          showElement(index)
          updateProgress(index, localProgress)

          // Активируем текущий элемент
          if (index === 0) {
            // Первый элемент - активируем через время после появления
            if (localProgress > 0.3 && !state.firstActivated) {
              setTimeout(() => {
                activateElement(0)
                state.firstActivated = true
              }, 500)
            }
          } else {
            // Остальные элементы - активируем сразу (предыдущий уже завершен)
            activateElement(index)
          }
        } else if (index === currentIndex + 1 && localProgress >= 0.7) {
          // Следующий элемент - показываем когда текущий прогресс >= 70%
          showElement(index)
          updateProgress(index, 0)
          deactivateElement(index)
        } else {
          // Остальные элементы скрываем
          hideElement(index)
          updateProgress(index, 0)
          deactivateElement(index)
        }
      })

      // Особая логика для последнего элемента при завершении секции
      if (currentIndex === processItems.length - 1 && localProgress >= 0.99) {
        activateElement(currentIndex)
      }
    },
    onLeave: () => {
      // При выходе из секции сбрасываем все
      processItems.forEach((_, index) => {
        hideElement(index)
        updateProgress(index, 0)
        deactivateElement(index)
      })
      state.currentStep = -1
      state.firstActivated = false
      state.sectionCompleted = false
    },
    onEnterBack: () => {
      // При возврате сбрасываем состояние
      state.firstActivated = false
      state.currentStep = -1
      state.sectionCompleted = false
    }
  })

  // Обработчик изменения размера окна для пересчета длины анимации
  const handleResize = () => {
    if (scrollTrigger) {
      scrollTrigger.refresh()
    }
  }

  window.addEventListener('resize', handleResize)

  // Возвращаем функцию очистки
  return () => {
    if (scrollTrigger) {
      scrollTrigger.kill()
    }
    window.removeEventListener('resize', handleResize)
  }
}
