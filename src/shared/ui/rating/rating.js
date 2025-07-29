export const rating = () => {
  const ratings = document.querySelectorAll('[data-rating]')

  if (!ratings) return

  for (const rating of ratings) {
    const ratingItems = rating.querySelectorAll('[data-rating-mark]')
    let isTouchMoving = false

    rating.addEventListener(
      'touchstart',
      () => {
        isTouchMoving = true

        clearRating(ratingItems)
      },
      { passive: true }
    )

    rating.addEventListener(
      'touchend',
      () => {
        isTouchMoving = false
        const activeMark = rating.querySelector('[data-rating-mark].active')
        if (activeMark) {
          const mark = activeMark.getAttribute('data-rating-mark')
          console.log('Выставлена оценка mark =', mark)
        }
      },
      { passive: true }
    )

    rating.addEventListener(
      'touchmove',
      e => {
        if (!isTouchMoving) return

        const touch = e.touches[0]
        const touchX = touch.clientX

        const elementUnderTouch = document.elementFromPoint(touchX, touch.clientY)

        if (elementUnderTouch && elementUnderTouch.hasAttribute('data-rating-mark')) {
          requestAnimationFrame(() => {
            highlightStars(elementUnderTouch)
          })
        }
      },
      { passive: true }
    )

    for (const ratingItem of ratingItems) {
      if (!ratingItem.hasAttribute('data-rating-init')) {
        ratingItem.addEventListener('mouseup', setMark)
        ratingItem.addEventListener('mouseover', () => {
          if (isMouseDown) highlightStars(ratingItem)
        })
        ratingItem.setAttribute('data-rating-init', '')
      }
    }
  }

  let isMouseDown = false

  document.addEventListener('mousedown', () => {
    isMouseDown = true
  })

  document.addEventListener('mouseup', () => {
    isMouseDown = false
  })

  function highlightStars(targetElement) {
    const mark = targetElement.getAttribute('data-rating-mark')
    const ratingWrapper = targetElement.closest('[data-rating-wrapper]')
    const ratingItems = ratingWrapper.querySelectorAll('[data-rating-mark]')

    clearRating(ratingItems)

    for (let i = ratingItems.length - 1; i >= ratingItems.length - mark; i--) {
      ratingItems[i].classList.add('active')
    }

    ratingWrapper.classList.add('active')
  }

  function setMark() {
    highlightStars(this)
    const mark = this.getAttribute('data-rating-mark')
    console.log('Выставлена оценка mark =', mark)

    const ratingWrapper = this.closest('[data-rating-wrapper]')
    const sendRatingButton = ratingWrapper.querySelector('[data-rating-button]')
    sendRatingButton?.classList.remove('disabled')
  }

  function clearRating(ratingItems) {
    ratingItems.forEach(item => {
      item.classList.remove('active')
    })
  }
}
