import type { ExcelColumn } from "@/pages/create-template/types";

// Convert column letter to index (A => 0, B => 1, Z => 25, AA => 26)
export const colLetterToIndex = (letter: string) => {
  let column = 0;
  for (let i = 0; i < letter.length; i++) {
    column +=
      (letter.toUpperCase().charCodeAt(i) - 64) *
      Math.pow(26, letter.length - i - 1);
  }
  return column - 1;
};

export const evaluateFormula = (
  formula: string,
  rowData: any,
  _rowIndex: number,
  columns: ExcelColumn[],
): string => {
  if (!formula) return "";

  let exp = formula.trim();
  if (exp.startsWith("=")) {
    exp = exp.substring(1);
  }

  // Replace cell references (e.g., A2, B2, or just A, B) with actual data.
  // The regex \b ensures we only capture isolated letters, ignoring function names like CONCAT.
  const cellRegex = /\b([A-Za-z]+)(\d*)\b/g;

  exp = exp.replace(cellRegex, (_match, colLetter, _rowNumStr) => {
    // Skip mapped Excel function names so we do not mistake CONCAT for column letters C,O,N,C,A,T
    const upperFuncNames = [
      "CONCAT",
      "CONCATENATE",
      "SUM",
      "AVERAGE",
      "IF",
      "AND",
      "OR",
      "LOWER",
      "UPPER",
      "PROPER",
    ];
    if (upperFuncNames.includes(colLetter.toUpperCase())) {
      return _match; // Keep function exactly as is
    }

    const colIndex = colLetterToIndex(colLetter);

    // Fetch the current rowData's value for that column letter index.
    if (colIndex >= 0 && colIndex < columns.length) {
      const colName = columns[colIndex].name;
      const val = rowData[colName];

      if (val === undefined || val === null) return '""';

      // If it is numeric, output as number so math works (+ - * /)
      if (typeof val === "number") return String(val);
      if (!isNaN(Number(val)) && String(val).trim() !== "") return String(val);

      // Otherwise, it's text. Wrap realistically in JS quotes to form a safe string
      return JSON.stringify(String(val));
    }

    return '""';
  });

  try {
    // Map common Excel Functions to JS equivalent operations
    const FUNCS = {
      CONCAT: (...args: any[]) => args.join(""),
      CONCATENATE: (...args: any[]) => args.join(""),
      SUM: (...args: any[]) =>
        args.reduce((acc, val) => acc + (Number(val) || 0), 0),
      AVERAGE: (...args: any[]) =>
        args.length
          ? args.reduce((acc, val) => acc + (Number(val) || 0), 0) / args.length
          : 0,
      LOWER: (str: string) => String(str).toLowerCase(),
      UPPER: (str: string) => String(str).toUpperCase(),
      PROPER: (str: string) =>
        String(str).replace(
          /\w\S*/g,
          (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase(),
        ),
      IF: (condition: boolean, trueVal: any, falseVal: any) =>
        condition ? trueVal : falseVal,
      AND: (...args: any[]) => args.every(Boolean),
      OR: (...args: any[]) => args.some(Boolean),
    };

    const funcNames = Object.keys(FUNCS);
    const funcValues = Object.values(FUNCS);

    // Inject custom JS evaluators
    const evaluator = new Function(...funcNames, `return ${exp};`);
    const result = evaluator(...funcValues);

    return String(result);
  } catch (e) {
    console.warn("Formula Evaluation Failed:", exp, e);
    return "#ERROR!";
  }
};
