import { z } from "zod";

export const columnTypeSchema = z.enum([
  "String",
  "Number",
  "Date",
  "Boolean",
  "Enum",
]);

export const optionSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const excelColumnSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Field name is required"),
  type: columnTypeSchema,
  isFormula: z.boolean().optional(),
  formula: z.string().optional(),
  options: z.array(optionSchema).optional(),
  required: z.boolean().optional(),
  formatting: z.string().optional(),
  validation: z.string().optional(),
});

export const createTemplateSchema = z.object({
  id: z.string(),
  templateName: z.string().min(1, "Template name is required"),
  columns: z.array(excelColumnSchema),
});

export type CreateTemplateFormValues = z.infer<typeof createTemplateSchema>;
