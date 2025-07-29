export const tabsExamples = () => {
  if (!document.querySelector('#tabs-examples')) return

  const tabs = window.frontApi.tabs

  // Обработчики
  const handleInit = () => tabs.init('[data-tabs="example-tabs"]')
  const handleInitAll = () => tabs.initAll()
  const handleSetActive = () => tabs.setActive('[data-tabs="example-tabs"]', 1)
  const handleGetActive = () => {
    const active = tabs.getActive('[data-tabs="example-tabs"]')
    console.log('[Active tab]', active)
  }
  const handleReinit = () => {
    tabs.reinit('[data-tabs="example-tabs"]', {
      lazy: true
    })
  }
  const handleLogInstances = () => {
    console.log('[Instances]', tabs.instances)
  }

  // Навешивание с removeEventListener
  document.querySelector('#tabs-init')?.removeEventListener('click', handleInit)
  document.querySelector('#tabs-init')?.addEventListener('click', handleInit)

  document.querySelector('#tabs-init-all')?.removeEventListener('click', handleInitAll)
  document.querySelector('#tabs-init-all')?.addEventListener('click', handleInitAll)

  document.querySelector('#tabs-set-active')?.removeEventListener('click', handleSetActive)
  document.querySelector('#tabs-set-active')?.addEventListener('click', handleSetActive)

  document.querySelector('#tabs-get-active')?.removeEventListener('click', handleGetActive)
  document.querySelector('#tabs-get-active')?.addEventListener('click', handleGetActive)

  document.querySelector('#tabs-reinit')?.removeEventListener('click', handleReinit)
  document.querySelector('#tabs-reinit')?.addEventListener('click', handleReinit)

  document.querySelector('#tabs-log-instances')?.removeEventListener('click', handleLogInstances)
  document.querySelector('#tabs-log-instances')?.addEventListener('click', handleLogInstances)

  tabs.onAnyInit(tabs => {
    console.log('[Init]', tabs)
  })

  tabs.onAnyChange(({ activeTab, prevTab }) => {
    console.log('[Change]', activeTab.id, 'from', prevTab?.id)
  })
}
