export function parseRawDataInput(text: string): any[] {
  const t = text.trim();
  if (!t) return [];

  if (t.startsWith("[") || t.startsWith("{")) {
    const json = JSON.parse(t);
    return Array.isArray(json) ? json : [json];
  } else {
    // Attempt dirty CSV parse
    const lines = t.split("\n");
    const headers = lines[0].split(",").map((h) => h.trim());
    return lines
      .slice(1)
      .filter((l) => l.trim())
      .map((line) => {
        const values = line.split(",").map((v) => v.trim());
        const obj: Record<string, string> = {};
        headers.forEach((h, i) => {
          obj[h] = values[i] || "";
        });
        return obj;
      });
  }
}
