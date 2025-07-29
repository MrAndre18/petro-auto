export const selectExamples = () => {
  const page = document.querySelector('.select-examples') as HTMLElement
  if (!page) return

  const select = window.frontApi.select

  page.querySelector('#select-init')?.addEventListener('click', () => {
    select.init('#tomSelect1')
  })

  page.querySelector('#select-init-all')?.addEventListener('click', () => {
    select.initAll()
  })

  page.querySelector('#select-reinit')?.addEventListener('click', () => {
    select.reInit('#tomSelect1')
  })

  page.querySelector('#select-reinit-all')?.addEventListener('click', () => {
    select.reInitAll()
  })

  page.querySelector('#select-destroy')?.addEventListener('click', () => {
    select.destroy('#tomSelect1')
  })

  page.querySelector('#select-get-current-option')?.addEventListener('click', () => {
    console.log(select.getCurrentOption('#tomSelect1'))
  })

  page.querySelector('#select-add-option')?.addEventListener('click', () => {
    const instance = select.getInstance('#tomSelect1')
    instance?.addOption({ value: '4', label: 'New 4' })
  })

  page.querySelector('#select-remove-option')?.addEventListener('click', () => {
    select.getInstance('#tomSelect1')?.removeOption('2')
  })

  page.querySelector('#select-remove-all-options')?.addEventListener('click', () => {
    select.removeAllOptions('#tomSelect2')
  })

  page.querySelector('#select-reset')?.addEventListener('click', () => {
    select.resetOptions(
      '#tomSelect1',
      [
        { value: 'new1', label: 'New 1' },
        { value: 'new2', label: 'New 2' }
      ],
      'new1'
    )
  })

  page.querySelector('#select-get-value')?.addEventListener('click', () => {
    console.log('[value]', select.getValue('#tomSelect1'))
  })

  page.querySelector('#select-set-value')?.addEventListener('click', () => {
    select.setValue('#tomSelect2', ['a', 'c'])
  })

  page.querySelector('#select-is-init')?.addEventListener('click', () => {
    console.log(select.isInit('#tomSelect1'))
  })

  page.querySelector('#select-get-instance')?.addEventListener('click', () => {
    console.log(select.getInstance('#tomSelect1'))
  })
}
