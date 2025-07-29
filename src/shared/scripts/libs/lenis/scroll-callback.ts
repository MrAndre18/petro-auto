export function scrollCallback(target: HTMLElement): void {
  const animationType = target.getAttribute('data-scroll-animation')

  if (animationType) {
    target.classList.add(`animate-${animationType}`)

    setTimeout(() => {
      target.classList.remove(`animate-${animationType}`)
    }, 650)
  }
}
