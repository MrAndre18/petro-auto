import { BREAKPOINT_DESKTOP } from '../../shared/scripts/config.js'

export const stickyAnchors = () => {
  console.log('StickyAnchors')

  const scrollContent = document.querySelector('[data-scroll-content]')
  if (!scrollContent) return

  const contentBlock = scrollContent.querySelector('[data-anchors-scroll-content]')
  const anchorsBlock = scrollContent.querySelector('[data-anchors-links]')
  if (!contentBlock || !anchorsBlock) return

  const anchors = [...anchorsBlock.querySelectorAll('a')]
  const chapters = [...contentBlock.querySelectorAll('[id]')]
  const anchorsList = anchorsBlock.querySelector('[data-anchors-aside]')
  const header = document.querySelector('[data-header="body"]')

  let rafId = null
  let headerHeight = header?.getBoundingClientRect().height || 0

  const checkStack = () => {
    const rect = anchorsBlock.getBoundingClientRect()
    const isStack = rect.top <= headerHeight
    anchorsBlock.classList.toggle('is-stack', isStack)
    rafId = null
  }

  const handleScroll = () => {
    if (!rafId) {
      rafId = requestAnimationFrame(checkStack)
    }
  }

  const anchorsArray = anchors.map(a => ({
    element: a,
    href: a.getAttribute('href'),
    width: a.getBoundingClientRect().width
  }))

  let paddingLeft = parseFloat(getComputedStyle(anchorsBlock).paddingLeft)
  let anchorSumWidth = anchorsArray.reduce((acc, a) => acc + a.width, 0)

  let anchorsGap =
    anchorsArray.length > 1
      ? (anchorsList.getBoundingClientRect().width - anchorSumWidth) / (anchorsArray.length - 1)
      : 0

  let currentIndex = 0
  let ignoreObserver = false
  let observerTimeout = null
  let prevWindowWidth = window.innerWidth // Для отслеживания изменения ширины

  const applyScroll = offset => {
    anchorsBlock.scrollTo({ left: offset, behavior: 'smooth' })
  }

  const observer = new IntersectionObserver(
    entries => {
      if (ignoreObserver) return

      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const chapterId = entry.target.id
          const correspondingAnchorIndex = anchors.findIndex(a => {
            const href = a.getAttribute('href')
            return href && href.startsWith('#') && href.substring(1) === chapterId
          })

          if (correspondingAnchorIndex !== -1) {
            currentIndex = correspondingAnchorIndex
            anchors.forEach(a => a.classList.remove('active'))
            anchors[currentIndex].classList.add('active')

            if (anchorsList && window.innerWidth < BREAKPOINT_DESKTOP) {
              let offset = 0
              for (let i = 0; i < currentIndex; i++) {
                offset += anchorsArray[i].width + anchorsGap
              }
              applyScroll(offset)
            }
          }
        }
      })
    },
    {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    }
  )

  anchors.forEach(anchor => {
    if (anchor.hasAttribute('data-scrolls-scroll-anchor-init')) return

    anchor.addEventListener('click', e => {
      ignoreObserver = true
      if (observerTimeout) clearTimeout(observerTimeout)
      observerTimeout = setTimeout(() => {
        ignoreObserver = false
      }, 1000)

      anchors.forEach(a => a.classList.remove('active'))
      anchor.classList.add('active')

      if (anchorsList && window.innerWidth < BREAKPOINT_DESKTOP) {
        const index = anchors.indexOf(anchor)
        let offset = 0
        for (let i = 0; i < index; i++) {
          offset += anchorsArray[i].width + anchorsGap
        }
        applyScroll(offset)
        console.log('offset', offset)
      }
    })

    anchor.setAttribute('data-scrolls-scroll-anchor-init', '')
  })

  let resizeTimeout
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      const currentWindowWidth = window.innerWidth

      // Всегда обновляем высоту хедера
      headerHeight = header?.getBoundingClientRect().height || 0

      // Проверяем изменение ширины и мобильный режим
      const widthChanged = currentWindowWidth !== prevWindowWidth
      const isMobile = currentWindowWidth < BREAKPOINT_DESKTOP

      if (widthChanged && isMobile) {
        // Пересчитываем параметры только для мобильного режима
        anchorsArray.forEach(a => {
          a.width = a.element.getBoundingClientRect().width
        })

        anchorSumWidth = anchorsArray.reduce((acc, a) => acc + a.width, 0)
        paddingLeft = parseFloat(getComputedStyle(anchorsBlock).paddingLeft)

        anchorsGap =
          anchorsArray.length > 1
            ? (anchorsList.getBoundingClientRect().width - anchorSumWidth) /
              (anchorsArray.length - 1)
            : 0
      }

      // Обновляем предыдущую ширину
      prevWindowWidth = currentWindowWidth

      // Всегда проверяем позицию sticky
      handleScroll()
    }, 100)
  })

  window.addEventListener('scroll', handleScroll)
  checkStack()

  chapters.forEach(chapter => {
    observer.observe(chapter)
  })

  return () => {
    observer.disconnect()
    if (observerTimeout) clearTimeout(observerTimeout)
    window.removeEventListener('resize', resizeTimeout)
    window.removeEventListener('scroll', handleScroll)
    if (rafId) cancelAnimationFrame(rafId)
  }
}
