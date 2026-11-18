export type CsvColumn<T> = { header: string; value: (row: T) => string | number | null | undefined }

/**
 * Quote a cell per RFC 4180, and neutralise values that spreadsheet apps would run as formulas
 * (leading =, +, -, @, tab or CR) by prefixing a single quote.
 */
function escapeCell(raw: string | number | null | undefined): string {
  let s = raw == null ? '' : String(raw)
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export function toCsv<T>(rows: readonly T[], columns: readonly CsvColumn<T>[]): string {
  const lines = [columns.map((c) => escapeCell(c.header)).join(',')]
  for (const row of rows) lines.push(columns.map((c) => escapeCell(c.value(row))).join(','))
  return lines.join('\r\n')
}

/** Trigger a browser download. The BOM makes Excel open the file as UTF-8. */
export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob(['﻿', csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}
