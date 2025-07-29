import { ProgressBar } from './progressBar'
import type { ProgressBarOptions } from './progressBar'

class ProgressBarManager {
  private instances: Map<HTMLElement, ProgressBar> = new Map()

  public init(
    root: HTMLElement | string,
    options: Partial<Omit<ProgressBarOptions, 'node'>> = {}
  ): ProgressBar {
    const el = typeof root === 'string' ? document.querySelector<HTMLElement>(root) : root
    if (!el) {
      throw new Error(`[ProgressBarManager] Root element not found: ${root}`)
    }
    if (this.instances.has(el)) {
      return this.instances.get(el)!
    }
    const inst = new ProgressBar({ node: el, ...options })
    this.instances.set(el, inst)
    return inst
  }

  public get(root: HTMLElement | string): ProgressBar | undefined {
    const el = typeof root === 'string' ? document.querySelector<HTMLElement>(root) : root
    return el ? this.instances.get(el) : undefined
  }

  public destroy(root: HTMLElement | string): void {
    const el = typeof root === 'string' ? document.querySelector<HTMLElement>(root) : root
    if (!el) return
    const inst = this.instances.get(el)
    if (inst) {
      inst.destroy()
      this.instances.delete(el)
    }
  }

  public initAll(selector = '[data-progress-bar-instance]'): void {
    document.querySelectorAll<HTMLElement>(selector).forEach(el => {
      if (!this.instances.has(el)) {
        this.init(el)
      }
    })
  }

  public destroyAll(): void {
    this.instances.forEach(inst => inst.destroy())
    this.instances.clear()
  }

  public setValue(root: HTMLElement | string, value: number): void {
    this.get(root)?.setValue(value)
  }

  public setMax(root: HTMLElement | string, max: number): void {
    this.get(root)?.setMax(max)
  }

  public setIndeterminate(root: HTMLElement | string, state: boolean): void {
    this.get(root)?.setIndeterminate(state)
  }
}

export const progressBarManager = new ProgressBarManager()
