export const inputmaskExamples = () => {
  if (!document.querySelector('#inputmask-examples')) return

  document.querySelector('#btn-init')?.addEventListener('click', () => {
    window.frontApi.inputmask.init()
  })

  document.querySelector('#btn-reinit')?.addEventListener('click', () => {
    window.frontApi.inputmask.reinit('#reinit-input')
  })

  document.querySelector('#btn-reinit-all')?.addEventListener('click', () => {
    window.frontApi.inputmask.reinitAll()
  })
}