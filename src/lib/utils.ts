import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import moment from 'moment';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function formatDate(date: Date): string {
  return date?.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export const currentDate =(date:string)=>  moment(date).format('LLLL')