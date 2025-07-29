const RESTRICT_INPUT_CHARACTERS = true

function getTargetAndAction(button: HTMLButtonElement): {
  input: HTMLInputElement | null
  action: 'increment' | 'decrement' | null
} {
  const incrementId = button.dataset.inputNumberButtonIncrementId
  if (incrementId) {
    const instance = document.getElementById(incrementId)
    const input = instance?.querySelector<HTMLInputElement>('input')
    return { input: input || null, action: 'increment' }
  }

  const decrementId = button.dataset.inputNumberButtonDecrementId
  if (decrementId) {
    const instance = document.getElementById(decrementId)
    const input = instance?.querySelector<HTMLInputElement>('input')
    return { input: input || null, action: 'decrement' }
  }

  const instance = button.closest<HTMLElement>('[data-input-number-instance]')
  if (instance) {
    const hasIncrementAttr = button.hasAttribute('data-input-number-button-increment')
    const hasDecrementAttr = button.hasAttribute('data-input-number-button-decrement')

    if (hasIncrementAttr || hasDecrementAttr) {
      const input = instance.querySelector<HTMLInputElement>('input')
      return {
        input: input || null,
        action: hasIncrementAttr ? 'increment' : 'decrement'
      }
    }
  }

  return { input: null, action: null }
}

function handleDocumentClick(event: MouseEvent) {
  const target = event.target as HTMLElement
  const button = target.closest('button')

  if (!button) {
    return
  }

  const { input, action } = getTargetAndAction(button)

  if (!input || !action) {
    return
  }

  event.preventDefault()

  const isIncrement = action === 'increment'

  const step = Math.abs(parseFloat(input.step)) || 1
  const min = input.hasAttribute('min') ? parseFloat(input.min) : -Infinity
  const max = input.hasAttribute('max') ? parseFloat(input.max) : Infinity
  let currentValue = parseFloat(input.value)

  if (isNaN(currentValue)) {
    currentValue = min > -Infinity ? min : 0
  }

  const newValue = currentValue + (isIncrement ? step : -step)
  const clampedValue = Math.max(min, Math.min(max, newValue))

  if (clampedValue !== currentValue) {
    input.value = String(clampedValue)
    input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }))
  }
}

function handleInputEvent(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input || input.tagName !== 'INPUT' || !input.closest('[data-input-number-instance]')) {
    return
  }

  const isPositive = input.hasAttribute('data-input-number-positive-only')
  const originalValue = input.value
  let sanitizedValue: string

  if (isPositive) {
    sanitizedValue = originalValue.replace(/[^\d]/g, '')
  } else {
    const digits = originalValue.replace(/[^\d]/g, '')
    sanitizedValue = originalValue.startsWith('-') ? '-' + digits : digits
  }

  if (sanitizedValue !== originalValue) {
    input.value = sanitizedValue
  }
}

function handleBlurEvent(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input || input.tagName !== 'INPUT' || !input.closest('[data-input-number-instance]')) {
    return
  }

  const min = input.hasAttribute('min') ? parseFloat(input.min) : -Infinity
  const max = input.hasAttribute('max') ? parseFloat(input.max) : Infinity
  let currentValue = parseFloat(input.value)

  if (isNaN(currentValue)) {
    currentValue = min > -Infinity ? min : 0
  }

  const clampedValue = Math.max(min, Math.min(max, currentValue))

  if (clampedValue !== parseFloat(input.value)) {
    input.value = String(clampedValue)
    input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }))
  }
}

export function initializeInputNumberManager() {
  if (typeof document !== 'undefined') {
    document.addEventListener('click', handleDocumentClick)

    if (RESTRICT_INPUT_CHARACTERS) {
      document.addEventListener('input', handleInputEvent)
      document.addEventListener('blur', handleBlurEvent, true)
    }
  }
}
