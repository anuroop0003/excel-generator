import type { ExcelColumn } from "../pages/create-template/types";

export interface Template {
  id: string;
  name: string;
  columns: ExcelColumn[];
  lastModified: number;
}

const STORAGE_KEY = "excel_generator_templates";

export const getTemplates = (): Template[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to parse templates from local storage", e);
    return [];
  }
};

export const saveTemplate = (template: Template) => {
  const templates = getTemplates();
  const index = templates.findIndex((t) => t.id === template.id);
  if (index !== -1) {
    templates[index] = template;
  } else {
    templates.push(template);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
};

export const deleteTemplate = (id: string) => {
  const templates = getTemplates().filter((t) => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
};

export const getTemplateById = (id: string): Template | undefined => {
  return getTemplates().find((t) => t.id === id);
};
