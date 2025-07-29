export interface ProgressBarOptions {
  node: HTMLElement
}

export class ProgressBar {
  public readonly root: HTMLElement
  private readonly element: HTMLProgressElement
  private readonly label: HTMLSpanElement | null

  constructor(options: ProgressBarOptions) {
    this.root = options.node
    this.element = this.root.querySelector('.progress-bar__element')!
    this.label = this.root.querySelector('.progress-bar__label')

    this.updateLabel()
  }

  private updateLabel(): void {
    if (!this.label) {
      return
    }

    if (this.isIndeterminate()) {
      this.label.textContent = 'Загрузка...'
      return
    }
    const value = this.getValue()
    const max = this.getMax()
    const percentage = max > 0 ? Math.round((value / max) * 100) : 0
    this.label.textContent = `${percentage}%`
  }

  public setValue(value: number): void {
    const max = this.getMax()
    const clampedValue = Math.max(0, Math.min(value, max))
    this.element.value = clampedValue
    this.updateLabel()
  }

  public getValue(): number {
    return this.element.value
  }

  public setMax(max: number): void {
    this.element.max = max
    this.updateLabel()
  }

  public getMax(): number {
    return this.element.max
  }

  public setIndeterminate(state: boolean): void {
    if (state) {
      this.element.removeAttribute('value')
    } else {
      if (!this.element.hasAttribute('value')) {
        this.element.value = 0
      }
    }
    this.updateLabel()
  }

  public isIndeterminate(): boolean {
    return !this.element.hasAttribute('value')
  }

  public destroy(): void {
    if (this.label) {
      this.label.textContent = ''
    }
  }
}
