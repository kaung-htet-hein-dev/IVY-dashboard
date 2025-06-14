import { format } from "date-fns";

export const getFormattedShowDateTime = (date: string): string => {
  return format(
    typeof date === "string" ? new Date(date) : date,
    "dd/MM/yyyy hh:mm a"
  );
};

// /**
//  * Formats a time in 00:00 am/pm format
//  * @param date Date string or Date object
//  * @returns Formatted time string (e.g., 09:30 am)
//  */
// export const formatTime = (date: string | Date): string => {
//   return format(typeof date === "string" ? new Date(date) : date, "hh:mm a");
// };
