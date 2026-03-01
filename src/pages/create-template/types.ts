export type ColumnType = "String" | "Number" | "Date" | "Boolean" | "Enum";

export interface ExcelColumn {
  id: string;
  name: string;
  type: ColumnType;
  isFormula?: boolean;
  formula?: string;
  options?: string;
  required?: boolean;
  defaultValue?: string;
  formatting?: string;
  validation?: string;
}
