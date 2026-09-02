/**
 * Export and Import Utility Functions
 * Supports CSV and JSON with proper UTF-8 encoding, automatic file download trigger, and robust parsing.
 */

export interface ExportColumn<T = any> {
  key: keyof T | string;
  label: string;
  formatter?: (val: any, row: T) => string | number;
}

/**
 * Exports data array to a downloadable CSV file
 */
export function exportToCSV<T extends Record<string, any>>(
  filename: string,
  data: T[],
  columns?: ExportColumn<T>[]
): void {
  if (!data || data.length === 0) {
    alert('Tidak ada data untuk diekspor.');
    return;
  }

  const effectiveCols: { key: string; label: string; formatter?: (v: any, r: T) => any }[] =
    columns && columns.length > 0
      ? (columns as any)
      : Object.keys(data[0]).map((key) => ({ key, label: key }));

  // Header row
  const headerRow = effectiveCols.map((c) => `"${String(c.label).replace(/"/g, '""')}"`).join(',');

  // Data rows
  const dataRows = data.map((row) =>
    effectiveCols
      .map((c) => {
        let val = row[c.key];
        if (c.formatter) {
          val = c.formatter(val, row);
        } else if (Array.isArray(val)) {
          val = val.join('; ');
        } else if (typeof val === 'object' && val !== null) {
          val = JSON.stringify(val);
        }
        return `"${String(val ?? '').replace(/"/g, '""')}"`;
      })
      .join(',')
  );

  const csvContent = '\uFEFF' + [headerRow, ...dataRows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports data array or object to a formatted JSON file
 */
export function exportToJSON<T>(filename: string, data: T): void {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Parses raw CSV string into an array of objects
 */
export function parseCSV(csvText: string): Record<string, string>[] {
  const cleanText = csvText.replace(/^\uFEFF/, '').trim();
  if (!cleanText) return [];

  const lines: string[] = [];
  let currentLine = '';
  let inQuotes = false;

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      currentLine += '"';
      i++; // skip next quote
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (currentLine.trim()) {
        lines.push(currentLine);
      }
      currentLine = '';
      if (char === '\r' && nextChar === '\n') {
        i++; // skip LF after CR
      }
    } else {
      currentLine += char;
    }
  }
  if (currentLine.trim()) {
    lines.push(currentLine);
  }

  if (lines.length === 0) return [];

  // Parse header
  const parseLine = (lineStr: string): string[] => {
    const cells: string[] = [];
    let cell = '';
    let insideQuote = false;

    for (let j = 0; j < lineStr.length; j++) {
      const c = lineStr[j];
      const next = lineStr[j + 1];

      if (c === '"' && insideQuote && next === '"') {
        cell += '"';
        j++;
      } else if (c === '"') {
        insideQuote = !insideQuote;
      } else if (c === ',' && !insideQuote) {
        cells.push(cell.trim());
        cell = '';
      } else {
        cell += c;
      }
    }
    cells.push(cell.trim());
    return cells;
  };

  const headers = parseLine(lines[0]);
  const results: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rowValues = parseLine(lines[i]);
    const rowObj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      rowObj[h] = rowValues[idx] ?? '';
    });
    results.push(rowObj);
  }

  return results;
}
