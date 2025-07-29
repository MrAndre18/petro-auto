import type { HTMLAttributes } from 'astro/types'

type CellType = 'head' | 'body' | 'foot'
type CellContent = { text: string } | { html: string }

// Добавляйте моды из `table.scss` сюда
type CellMod = 'test' | 'highlight' | (string & {})

type NewCell = {
  content: CellContent
  classList?: string[]
  mods?: CellMod[]
} & (HTMLAttributes<'td'> & {})

export type Table = { thead?: NewCell[[]]; tbody?: NewCell[[]]; tfoot?: NewCell[[]] }
