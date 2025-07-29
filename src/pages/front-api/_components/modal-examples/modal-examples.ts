// src/scripts/modalExamples.ts
export const modalExamples = () => {
  const modal = window.frontApi.modals

  document.getElementById('btn-init')?.addEventListener('click', () => {
    console.log('modal.init("[data-modal=\'modal-1\']")')
    modal.init('[data-modal="modal-1"]')
  })

  document.getElementById('btn-init-all')?.addEventListener('click', () => {
    console.log('modal.initAll()')
    modal.initAll()
  })

  document.getElementById('btn-show')?.addEventListener('click', () => {
    console.log('modal.show("[data-modal=\'modal-1\']")')
    modal.show('[data-modal="modal-1"]')
  })

  document.getElementById('btn-hide')?.addEventListener('click', () => {
    console.log('modal.hide("[data-modal=\'modal-1\']")')
    modal.hide('[data-modal="modal-1"]')
  })

  document.getElementById('btn-destroy')?.addEventListener('click', () => {
    console.log('modal.destroy("[data-modal=\'modal-1\']")')
    modal.destroy('[data-modal="modal-1"]')
  })

  document.getElementById('btn-destroy-all')?.addEventListener('click', () => {
    console.log('modal.destroyAll()')
    modal.destroyAll()
  })

  document.getElementById('btn-get')?.addEventListener('click', () => {
    console.log('modal.get →', modal.get('[data-modal="modal-1"]'))
  })

  modal.onAnyInit(instance => console.log('[init]', instance))
  modal.onAnyOpen(instance => console.log('[open]', instance))
  modal.onAnyClose(instance => console.log('[close]', instance))
}
