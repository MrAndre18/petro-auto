import { InputUpload } from './inputUpload'
import type { InputUploadOptions } from './inputUpload'

class InputUploadManager {
  private instances: Map<HTMLElement, InputUpload> = new Map()

  public init(root: HTMLElement | string, options: Partial<InputUploadOptions> = {}): InputUpload {
    const el = typeof root === 'string' ? document.querySelector<HTMLElement>(root) : root
    if (!el) {
      throw new Error(`[InputUploadManager] Element not found for selector: ${root}`)
    }
    if (this.instances.has(el)) {
      return this.instances.get(el)!
    }
    const inst = new InputUpload({ root: el, ...options })
    this.instances.set(el, inst)
    return inst
  }

  public get(root: HTMLElement | string): InputUpload | undefined {
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

  public initAll(selector = '[data-input-upload-instance]'): void {
    document.querySelectorAll<HTMLElement>(selector).forEach(el => {
      this.init(el)
    })
  }

  public destroyAll(): void {
    this.instances.forEach(inst => inst.destroy())
    this.instances.clear()
  }

  public reset(root: HTMLElement | string): void {
    this.get(root)?.reset()
  }

  public getFiles(root: HTMLElement | string): File[] | undefined {
    return this.get(root)?.getFiles()
  }
}

export const inputUploadManager = new InputUploadManager()
