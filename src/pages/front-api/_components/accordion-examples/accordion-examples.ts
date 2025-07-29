export const accordionExamples = () => {
  if (!document.querySelector('#accordions-examples')) return

  const accordion = window.frontApi.accordion

  // Инициализация
  const handleInit = () => accordion.init('[data-accordion-container]')
  const handleInitAll = () => accordion.initAll()
  document.querySelector('#accordion-init')?.removeEventListener('click', handleInit)
  document.querySelector('#accordion-init')?.addEventListener('click', handleInit)
  document.querySelector('#accordion-init-all')?.removeEventListener('click', handleInitAll)
  document.querySelector('#accordion-init-all')?.addEventListener('click', handleInitAll)

  // Переинициализация
  const handleReinit = () => accordion.reinit('[data-accordion-container]')
  const handleReinitAll = () => accordion.reinitAll()
  document.querySelector('#accordion-reinit')?.removeEventListener('click', handleReinit)
  document.querySelector('#accordion-reinit')?.addEventListener('click', handleReinit)
  document.querySelector('#accordion-reinit-all')?.removeEventListener('click', handleReinitAll)
  document.querySelector('#accordion-reinit-all')?.addEventListener('click', handleReinitAll)

  // Открытие отдельных
  const handleOpen1 = () => accordion.open('#ac0')
  const handleOpen2 = () => accordion.open('#ac1')
  const handleOpen3 = () => accordion.open('#ac2')
  document.querySelector('#accordion-open-1')?.removeEventListener('click', handleOpen1)
  document.querySelector('#accordion-open-1')?.addEventListener('click', handleOpen1)
  document.querySelector('#accordion-open-2')?.removeEventListener('click', handleOpen2)
  document.querySelector('#accordion-open-2')?.addEventListener('click', handleOpen2)
  document.querySelector('#accordion-open-3')?.removeEventListener('click', handleOpen3)
  document.querySelector('#accordion-open-3')?.addEventListener('click', handleOpen3)

  // Открытие всех
  const handleOpenAll = () => accordion.openAll()
  document.querySelector('#accordion-open-all')?.removeEventListener('click', handleOpenAll)
  document.querySelector('#accordion-open-all')?.addEventListener('click', handleOpenAll)

  // Закрытие отдельных
  const handleClose1 = () => accordion.close('#ac0')
  const handleClose2 = () => accordion.close('#ac1')
  const handleClose3 = () => accordion.close('#ac2')
  document.querySelector('#accordion-close-1')?.removeEventListener('click', handleClose1)
  document.querySelector('#accordion-close-1')?.addEventListener('click', handleClose1)
  document.querySelector('#accordion-close-2')?.removeEventListener('click', handleClose2)
  document.querySelector('#accordion-close-2')?.addEventListener('click', handleClose2)
  document.querySelector('#accordion-close-3')?.removeEventListener('click', handleClose3)
  document.querySelector('#accordion-close-3')?.addEventListener('click', handleClose3)

  // Закрытие всех
  const handleCloseAll = () => accordion.closeAll()
  document.querySelector('#accordion-close-all')?.removeEventListener('click', handleCloseAll)
  document.querySelector('#accordion-close-all')?.addEventListener('click', handleCloseAll)

  // Получение инстанса
  const handleGetInstance = () => {
    const instance = accordion.getInstance('#ac1')
    console.log('[Instance]', instance)
  }
  document.querySelector('#accordion-get-instance')?.removeEventListener('click', handleGetInstance)
  document.querySelector('#accordion-get-instance')?.addEventListener('click', handleGetInstance)

  // Получение инстанса элемента
  const handleGetElementInstance = () => {
    const instance = accordion.getElementInstance('#ac1')
    console.log('[ElementInstance]', instance)
  }
  document.querySelector('#accordion-get-element-instance')?.removeEventListener('click', handleGetElementInstance)
  document.querySelector('#accordion-get-element-instance')?.addEventListener('click', handleGetElementInstance)

  // Подписка на события аккордеона
  accordion.off('open')
  accordion.off('close')

  accordion.on('open', (el: { dataset: { accordion: any } }) => {
    console.log('[Accordion opened]', el.dataset.accordion)
  })

  accordion.on('close', (el: { dataset: { accordion: any } }) => {
    console.log('[Accordion closed]', el.dataset.accordion)
  })
}
