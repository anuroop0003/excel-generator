import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getColumnLetter(index: number): string {
  let letter = "";
  let tempIndex = index;
  while (tempIndex >= 0) {
    letter = String.fromCharCode((tempIndex % 26) + 65) + letter;
    tempIndex = Math.floor(tempIndex / 26) - 1;
  }
  return letter;
}
