export const toastsExamples = () => {
  if (!document.querySelector('#toasts-examples')) return
  const toast = window.frontApi.toast

  // События
  toast.onAnyInit(t => console.log('[init]', t))
  toast.onAnyOpen(t => console.log('[open]', t))
  toast.onAnyClose(t => console.log('[close]', t))

  // Шаблоны
  const successNode = document.querySelector('#toast-success') as HTMLElement | null
  const errorNode = document.querySelector('#toast-error') as HTMLElement | null

  if (!successNode || !errorNode) {
    console.warn('Toast templates not found')
    return
  }

  // Инстансы
  const toastSuccess = toast.init({
    node: successNode.cloneNode(true),
    duration: 3000,
    gravity: 'top',
    position: 'right'
  })

  const toastError = toast.init({
    node: errorNode.cloneNode(true),
    duration: 3000,
    gravity: 'top',
    position: 'right'
  })

  // Обработчики
  const handleShowSuccess = () => toastSuccess.show()
  const handleShowError = () => toastError.show()
  const handleShowTemp = () =>
    toast.show({
      text: 'Временный toast',
      duration: 3000,
      gravity: 'top',
      position: 'right'
    })

  const handleHideSuccess = () => toast.hide('#toast-success')
  const handleGet = () => {
    const found = toast.get('#toast-success')
    console.log('Найден:', found)
  }

  const handleReinit = () => {
    toast
      .reinit('#toast-success', {
        duration: 4000,
        gravity: 'bottom'
      })
      .show()
  }

  const handleInitAll = () => toast.initAll()

  // Назначение слушателей
  const withListeners = (selector: string, handler: EventListener) => {
    const el = document.querySelector(selector)
    if (!el) return
    el.removeEventListener('click', handler)
    el.addEventListener('click', handler)
  }

  withListeners('#btn-show-success', handleShowSuccess)
  withListeners('#btn-show-error', handleShowError)
  withListeners('#btn-show-temp', handleShowTemp)
  withListeners('#btn-hide-success', handleHideSuccess)
  withListeners('#btn-get', handleGet)
  withListeners('#btn-reinit', handleReinit)
  withListeners('#btn-init-all', handleInitAll)
}
