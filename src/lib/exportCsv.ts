export function exportCsv(filename: string, rows: Record<string, string | number | boolean>[]) {
  if (rows.length === 0) return;

  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(";"),
    ...rows.map((row) =>
      headers
        .map((h) => {
          const val = row[h] ?? "";
          const str = String(val).replace(/"/g, '""');
          return str.includes(";") || str.includes('"') || str.includes("\n")
            ? `"${str}"`
            : str;
        })
        .join(";")
    ),
  ].join("\n");

  // UTF-8 BOM — Excel Türkçe karakter desteği için
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
