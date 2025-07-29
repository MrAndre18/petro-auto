export default function inputSearchInit(): void {
  const forms = document.querySelectorAll<HTMLElement>('.input-search')

  if (forms.length === 0) return

  forms.forEach(form => {
    const resetButton = form.querySelector<HTMLElement>('[data-search-reset]')

    const input = form.querySelector<HTMLInputElement>('input')

    resetButton?.addEventListener('click', () => {
      if (input) {
        input.value = ''
        input.dispatchEvent(new Event('input')) // если нужно триггернуть слушатели
      }
    })
  })
}