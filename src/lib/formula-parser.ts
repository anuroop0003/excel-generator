import type { ExcelColumn } from "@/pages/create-template/types";
import * as formulajs from "@formulajs/formulajs";

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
  // The regex \b ensures we only capture isolated letters, ignoring function names.
  const cellRegex = /\b([A-Za-z]+)(\d*)\b/g;

  // We consider all uppercase formulajs exports as valid function names.
  // To avoid evaluating variables like 'A' when they clash, let's just make sure
  // it doesn't just replace legitimate cell columns like A, B, C...
  // Wait, if columns are "A" "B", they might match "A" from formulajs if there is a function called 'A'.
  // Typically formulajs functions are words like SUM, CONCAT, etc.
  // We'll safely verify if it's a known formulsjs function.
  // For safety, let's keep a known set of 1-letter exclusions if needed?
  // Wait, there's no formulajs function called "A".

  exp = exp.replace(cellRegex, (_match, colLetter, _rowNumStr) => {
    const upperCol = colLetter.toUpperCase();

    // Check if the matched word is actually a function mapped in formulajs
    if (
      upperCol in formulajs &&
      typeof (formulajs as any)[upperCol] === "function"
    ) {
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
    const FUNCS = { ...formulajs };
    // Add mapping for standard CONCAT since @formulajs might only have CONCATENATE
    // Wait, formulajs has CONCAT as well. Let's just pass everything.

    // Some math functions need mapping if they don't exist natively or if you use symbols? No, JS evaluator handles symbols (+ - * /)

    const funcNames = Object.keys(FUNCS);
    const funcValues = Object.values(FUNCS);

    // Inject JS evaluators
    const evaluator = new Function(...funcNames, `return ${exp};`);
    const result = evaluator(...funcValues);

    return String(result);
  } catch (e) {
    console.warn("Formula Evaluation Failed:", exp, e);
    return "#ERROR!";
  }
};
