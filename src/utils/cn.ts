import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utilitário para mesclar classes do Tailwind de forma inteligente.
 * Combina clsx (classes condicionais) + tailwind-merge (resolve conflitos).
 *
 * @example
 * cn("px-2 py-1", condition && "bg-blue-500")
 * cn("px-2", "px-4") // resultado: "px-4" (último prevalece)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
