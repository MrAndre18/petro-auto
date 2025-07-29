export function tooltipExamples() {
  const target: string = '[data-tooltip]'

  const page = document.querySelector('.tooltip-examples') as HTMLElement
  if (!page) return

  const tooltip = window.frontApi.tooltip
  const base = 'data-tooltip-example'

  const on = (suffix: string, handler: () => void) => {
    page.querySelector(`[${base}-${suffix}]`)?.addEventListener('click', handler)
  }

  on('init', () => {
    console.info('tooltip-examples')
    tooltip.init(target)
  })

  on('re-init', () => {
    tooltip.reInit(target)
  })

  on('destroy', () => {
    tooltip.destroy(target)
  })

  on('show', () => {
    tooltip.show(target)
  })

  on('hide', () => {
    tooltip.hide(target)
  })

  on('is-init', () => {
    const isInit = tooltip.isInit(target)
    console.info(isInit)
  })

  on('init-all', () => {
    tooltip.initAll()
  })

  on('destroy-all', () => {
    tooltip.destroyAll()
  })

  on('re-init-all', () => {
    tooltip.reInitAll()
  })

  on('get-instance', () => {
    const instance = tooltip.getInstance(target)
    console.info(instance)
  })

  on('get-element', () => {
    const element = tooltip.getElement(target)
    console.info(element)
  })
}
