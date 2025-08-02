export const cookies = () => {
  const cookiesModal = document.querySelector('[data-cookies]')

  if (!cookiesModal) {
    return
  }

  const cookiesAccept = cookiesModal.querySelector('[data-cookies-accept]')

  if (!cookiesAccept) {
    return
  }

  cookiesAccept.addEventListener('click', () => {
    cookiesModal.remove()
  })
}