import axios from "axios"
import { ModalApi } from "@shared/scripts/components/modals/modal-manager"

const { show: openModal, hide: closeModal } = ModalApi

const AUTO_CLOSE_TIMEOUT = 10000
let closeModalTimeout: number | undefined | null = null

const autoCloseModal = (modal: HTMLElement) => {
  if (!modal) return

  if (closeModalTimeout) clearTimeout(closeModalTimeout)

  closeModalTimeout = setTimeout(() => {
    closeModal(modal)
  }, AUTO_CLOSE_TIMEOUT)
}

const submitHandler = (e: Event, form: HTMLFormElement) => {
  e.preventDefault()
  const valid = window.frontApi.form.isValidForm(form)

  if (!valid) return

  const successModal = document.querySelector(`[data-modal="success-modal"]`) as HTMLElement
  const errorModal = document.querySelector(`[data-modal="error-modal"]`) as HTMLElement
  const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement

  const submitButtonTextElement = submitButton.querySelector('span') as HTMLSpanElement
  const submitButtonText = submitButtonTextElement.innerHTML

  submitButton.disabled = true
  submitButtonTextElement.innerHTML = 'Отправка...'
  submitButton.style.opacity = '0.5'

  const name = form.querySelector<HTMLInputElement>('[name=name]')!.value
  const email = form.querySelector<HTMLInputElement>('[name=email]')!.value
  const phone = form.querySelector<HTMLInputElement>('[name=tel]')!.value
  const comment = form.querySelector<HTMLTextAreaElement>('[name=message]')!.value

  const data = {
    name,
    email,
    phone,
    comment
  }

  axios
    .post("send-message.php", data, {
      headers: { 'Content-Type': 'application/json' },
    })
    .then(response => {
      openModal(successModal)
      autoCloseModal(successModal)

      form.reset()
    })
    .catch(error => {
      openModal(errorModal)
      autoCloseModal(errorModal)
    })
    .finally(() => {
      const parentModal = form.closest('[data-modal]') as HTMLElement
      if (parentModal) {
        closeModal(parentModal)
      }

      submitButton.disabled = false
      submitButtonTextElement.innerHTML = submitButtonText
      submitButton.style.opacity = '1'
    })
}

const feedbackForm = () => {
  const forms = document.querySelectorAll('[data-form=feedback]') as NodeListOf<HTMLFormElement>

  if (!forms.length) return

  forms.forEach(form => form.addEventListener('submit', e => submitHandler(e, form)))
}

export { feedbackForm }
