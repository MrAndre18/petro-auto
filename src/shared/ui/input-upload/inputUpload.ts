export interface InputUploadOptions {
  root: HTMLElement
  maxFiles?: number
}

export class InputUpload {
  public readonly root: HTMLElement
  private readonly input: HTMLInputElement
  private readonly filesListEl: HTMLUListElement
  private readonly maxFiles: number
  private files: File[] = []

  constructor(options: InputUploadOptions) {
    this.root = options.root
    this.input = this.root.querySelector('.input-upload__input')!
    this.filesListEl = this.root.querySelector('.input-upload__files-list')!
    this.maxFiles = Number(this.root.dataset.maxFiles) || options.maxFiles || 5

    this.input.addEventListener('change', this.handleInputChange)
    this.root.addEventListener('click', this.handleRemoveClick)
    this.root.addEventListener('dragover', this.handleDragOver)
    this.root.addEventListener('dragleave', this.handleDragLeave)
    this.root.addEventListener('drop', this.handleDrop)
  }

  private handleInputChange = () => {
    const selected = Array.from(this.input.files || [])
    this.addFiles(selected)
    this.input.value = ''
  }

  private handleRemoveClick = (e: Event) => {
    const target = e.target as HTMLElement
    const removeBtn = target.closest('.input-upload__remove-btn')
    if (removeBtn) {
      const idx = Number(removeBtn.getAttribute('data-idx'))
      this.files.splice(idx, 1)
      this.render()
    }
  }

  private handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    this.root.classList.add('input-upload--dragover')
  }

  private handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    this.root.classList.remove('input-upload--dragover')
  }

  private handleDrop = (e: DragEvent) => {
    e.preventDefault()
    this.root.classList.remove('input-upload--dragover')
    const dropped = Array.from(e.dataTransfer?.files || [])
    this.addFiles(dropped)
  }

  private addFiles(newFiles: File[]) {
    const combined = this.input.multiple ? [...this.files, ...newFiles] : newFiles
    this.files = combined.slice(0, this.maxFiles)
    this.render()
  }

  private render() {
    this.filesListEl.innerHTML = ''
    this.files.forEach((file, idx) => {
      const itemEl = document.createElement('li')
      itemEl.className = 'input-upload__file-item'

      const nameEl = document.createElement('span')
      nameEl.className = 'input-upload__file-name'
      nameEl.textContent = file.name
      nameEl.title = file.name

      const removeBtn = document.createElement('button')
      removeBtn.className = 'input-upload__remove-btn'
      removeBtn.type = 'button'
      removeBtn.innerHTML = '&times;'
      removeBtn.setAttribute('data-idx', String(idx))
      removeBtn.setAttribute('aria-label', `Remove ${file.name}`)

      itemEl.appendChild(nameEl)
      itemEl.appendChild(removeBtn)
      this.filesListEl.appendChild(itemEl)
    })
    this.updateInputFiles()
  }

  private updateInputFiles() {
    const dataTransfer = new DataTransfer()
    this.files.forEach(file => dataTransfer.items.add(file))
    this.input.files = dataTransfer.files
  }

  public reset() {
    this.files = []
    this.render()
  }

  public destroy() {
    this.input.removeEventListener('change', this.handleInputChange)
    this.root.removeEventListener('click', this.handleRemoveClick)
    this.root.removeEventListener('dragover', this.handleDragOver)
    this.root.removeEventListener('dragleave', this.handleDragLeave)
    this.root.removeEventListener('drop', this.handleDrop)
    this.filesListEl.innerHTML = ''
  }

  public getFiles(): File[] {
    return this.files
  }
}
