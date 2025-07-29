export interface InputUploadOptions {
  node: HTMLInputElement
  accept?: string
  multiple?: boolean
  maxSize?: number
  onChange?: (files: FileList) => void
}
