const DELAY_MS = 150
const DRAG_THRESHOLD = 5

type ScrollState = {
  timer: number | null
  enabled: boolean
  isDragging: boolean
  dragStartX: number
  scrollStartX: number
  hasMoved: boolean
  hasHorizontalScroll: boolean
}

const stateMap = new WeakMap<HTMLElement, ScrollState>()

// Проверка наличия горизонтального скролла
const hasHorizontalScroll = (el: HTMLElement): boolean => {
  return el.scrollWidth > el.clientWidth
}

// Обновление состояния скролла для элемента
const updateScrollState = (el: HTMLElement): void => {
  const st = stateMap.get(el)
  if (st) {
    st.hasHorizontalScroll = hasHorizontalScroll(el)
  }
}

// Дебаунс для ResizeObserver
const debounce = (func: Function, wait: number) => {
  let timeout: number | null = null
  return (...args: any[]) => {
    if (timeout) clearTimeout(timeout)
    timeout = window.setTimeout(() => func(...args), wait)
  }
}

const handleLinksScroll = (e: WheelEvent): void => {
  const el = e.currentTarget as HTMLElement
  let st = stateMap.get(el)

  if (!st) {
    st = {
      timer: null,
      enabled: false,
      isDragging: false,
      dragStartX: 0,
      scrollStartX: 0,
      hasMoved: false,
      hasHorizontalScroll: hasHorizontalScroll(el)
    }
    stateMap.set(el, st)
  }

  // Проверяем наличие горизонтального скролла
  if (!st.hasHorizontalScroll) return

  if (!st.enabled) {
    if (st.timer === null) {
      st.timer = window.setTimeout(() => {
        const cur = stateMap.get(el)
        if (cur) cur.enabled = true
      }, DELAY_MS)
    }
    return
  }

  // Определяем направление скролла
  let scrollAmount = 0
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
    scrollAmount = e.deltaX
  } else {
    // Для вертикального скролла проверяем, есть ли вертикальный скролл
    // Если нет вертикального скролла, используем для горизонтального
    const hasVerticalScroll = el.scrollHeight > el.clientHeight
    if (!hasVerticalScroll) {
      scrollAmount = e.deltaY
    } else {
      return // Позволяем обычный вертикальный скролл
    }
  }

  if (scrollAmount === 0) return

  e.stopImmediatePropagation()
  e.preventDefault()

  // Учитываем границы скролла
  const maxScrollLeft = el.scrollWidth - el.clientWidth
  const newScrollLeft = Math.max(0, Math.min(maxScrollLeft, el.scrollLeft + scrollAmount))
  el.scrollLeft = newScrollLeft
}

const handleMouseDown = (e: MouseEvent): void => {
  if (e.button !== 0) return

  const el = e.currentTarget as HTMLElement
  let st = stateMap.get(el)

  if (!st) {
    st = {
      timer: null,
      enabled: false,
      isDragging: false,
      dragStartX: 0,
      scrollStartX: 0,
      hasMoved: false,
      hasHorizontalScroll: hasHorizontalScroll(el)
    }
    stateMap.set(el, st)
  }

  // Не начинаем перетаскивание, если нет горизонтального скролла
  if (!st.hasHorizontalScroll) return

  st.isDragging = true
  st.dragStartX = e.clientX
  st.scrollStartX = el.scrollLeft
  st.hasMoved = false

  e.preventDefault()
  e.stopPropagation()

  // Устанавливаем курсор
  document.body.style.setProperty('cursor', 'grabbing', 'important')
  el.style.cursor = 'grabbing'
}

const handleMouseMove = (e: MouseEvent, targetEl?: HTMLElement): void => {
  const el = (targetEl || e.currentTarget) as HTMLElement
  const st = stateMap.get(el)

  if (!st || !st.isDragging || !st.hasHorizontalScroll) return

  const deltaX = e.clientX - st.dragStartX
  const absDeltaX = Math.abs(deltaX)

  if (absDeltaX > DRAG_THRESHOLD) {
    st.hasMoved = true

    // Учитываем границы скролла
    const maxScrollLeft = el.scrollWidth - el.clientWidth
    const newScrollLeft = Math.max(0, Math.min(maxScrollLeft, st.scrollStartX - deltaX))
    el.scrollLeft = newScrollLeft

    e.preventDefault()
  }
}

const handleMouseUp = (e: MouseEvent, targetEl?: HTMLElement): void => {
  const el = (targetEl || e.currentTarget) as HTMLElement
  const st = stateMap.get(el)

  if (!st || !st.isDragging) return

  st.isDragging = false

  // Сбрасываем курсор
  document.body.style.removeProperty('cursor')
  updateCursorForElement(el)

  // Блокируем клики после перетаскивания
  if (st.hasMoved) {
    e.preventDefault()
    e.stopImmediatePropagation()

    // Более надежная блокировка кликов
    const blockClicks = (clickEvent: Event) => {
      clickEvent.preventDefault()
      clickEvent.stopImmediatePropagation()
    }

    // Блокируем на несколько кадров
    document.addEventListener('click', blockClicks, { capture: true })
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.removeEventListener('click', blockClicks, { capture: true })
      })
    })
  }

  st.hasMoved = false
}

const handleMouseLeave = (e: MouseEvent): void => {
  const el = e.currentTarget as HTMLElement
  const st = stateMap.get(el)

  if (!st) return

  // Сбрасываем только состояние wheel скролла
  if (!st.isDragging) {
    if (st.timer) clearTimeout(st.timer)
    st.timer = null
    st.enabled = false
  }
}

const handleClick = (e: MouseEvent): void => {
  const el = e.currentTarget as HTMLElement
  const st = stateMap.get(el)

  if (st?.hasMoved) {
    e.preventDefault()
    e.stopImmediatePropagation()
  }
}

// Обновление курсора для элемента
const updateCursorForElement = (el: HTMLElement): void => {
  const st = stateMap.get(el)
  if (st?.hasHorizontalScroll) {
    el.style.cursor = 'grab'
  } else {
    el.style.cursor = ''
  }
}

// Глобальные обработчики - объявляем один раз
let globalHandlersAdded = false

const addGlobalHandlers = (): void => {
  if (globalHandlersAdded) return
  globalHandlersAdded = true

  // Глобальный mousemove
  document.addEventListener('mousemove', (e) => {
    let hasActiveDrag = false

    document.querySelectorAll<HTMLElement>('[data-horizontal-scroll]').forEach(element => {
      const st = stateMap.get(element)
      if (st?.isDragging && st.hasHorizontalScroll) {
        hasActiveDrag = true
        handleMouseMove(e, element)
      }
    })

    // Управление курсором документа
    if (hasActiveDrag) {
      document.body.style.setProperty('cursor', 'grabbing', 'important')
    } else if (!document.body.style.getPropertyValue('cursor')) {
      document.body.style.removeProperty('cursor')
    }
  })

  // Глобальный mouseup
  document.addEventListener('mouseup', (e) => {
    document.querySelectorAll<HTMLElement>('[data-horizontal-scroll]').forEach(element => {
      const st = stateMap.get(element)
      if (st?.isDragging) {
        handleMouseUp(e, element)
      }
    })
    document.body.style.removeProperty('cursor')
  })

  // Сброс при потере фокуса
  window.addEventListener('blur', () => {
    document.querySelectorAll<HTMLElement>('[data-horizontal-scroll]').forEach(element => {
      const st = stateMap.get(element)
      if (st?.isDragging) {
        st.isDragging = false
        st.hasMoved = false
      }
    })
    document.body.style.removeProperty('cursor')
  })
}

export const initHorizontalScroll = (): void => {
  addGlobalHandlers()

  // ResizeObserver для отслеживания изменений размера
  const resizeObserver = new ResizeObserver(
    debounce((entries: ResizeObserverEntry[]) => {
      entries.forEach(entry => {
        const el = entry.target as HTMLElement
        updateScrollState(el)
        updateCursorForElement(el)
      })
    }, 100)
  )

  document.querySelectorAll<HTMLElement>('[data-horizontal-scroll]').forEach(el => {
    const initialState: ScrollState = {
      timer: null,
      enabled: false,
      isDragging: false,
      dragStartX: 0,
      scrollStartX: 0,
      hasMoved: false,
      hasHorizontalScroll: hasHorizontalScroll(el)
    }

    stateMap.set(el, initialState)
    updateCursorForElement(el)

    // Наблюдаем за изменениями размера
    resizeObserver.observe(el)

    // Обработчики событий
    el.addEventListener('mouseenter', () => {
      const st = stateMap.get(el)
      if (st?.timer) {
        clearTimeout(st.timer)
        st.timer = null
        st.enabled = false
      }
    })

    el.addEventListener('mouseleave', handleMouseLeave)
    el.addEventListener('wheel', handleLinksScroll, { passive: false, capture: true })
    el.addEventListener('mousedown', handleMouseDown)
    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseup', handleMouseUp)
    el.addEventListener('click', handleClick, { capture: true })
  })
}

// Функция для обновления скролла при динамических изменениях
export const updateHorizontalScroll = (selector?: string): void => {
  const elements = selector
    ? document.querySelectorAll<HTMLElement>(selector)
    : document.querySelectorAll<HTMLElement>('[data-horizontal-scroll]')

  elements.forEach(el => {
    updateScrollState(el)
    updateCursorForElement(el)
  })
}

// Функция для программного скролла
export const scrollHorizontally = (element: HTMLElement, amount: number, smooth = true): void => {
  const st = stateMap.get(element)
  if (!st?.hasHorizontalScroll) return

  const maxScrollLeft = element.scrollWidth - element.clientWidth
  const newScrollLeft = Math.max(0, Math.min(maxScrollLeft, element.scrollLeft + amount))

  if (smooth) {
    element.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    })
  } else {
    element.scrollLeft = newScrollLeft
  }
}