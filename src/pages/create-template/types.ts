export type ColumnType = "String" | "Number" | "Date" | "Boolean" | "Enum";

export interface Option {
  value: string;
  label: string;
}

export interface ExcelColumn {
  id: string;
  name: string;
  type: ColumnType;
  isFormula?: boolean;
  formula?: string;
  options?: Option[];
  required?: boolean;
  formatting?: string;
  validation?: string;
}
