import { format } from "date-fns";

/**
 * Formats a date using a given format.
 * @param date Date object or ISO string.
 * @param dateFormat Format pattern (date-fns).
 * @returns Formatted date string.
 */
export const formatDate = (date: Date | string, dateFormat: string): string => {
  if (typeof date === "string") {
    const [year, month, day] = date.split("T")[0].split("-").map(Number);
    return format(new Date(year, month - 1, day), dateFormat);
  }
  return format(date, dateFormat);
};

/**
 * Receives a full name and returns the initials of the first and last names.
 * @param name Full name of a person.
 * @returns Initials of the first and last names.
 */
export const getFirstAndLastInitials = (name: string): string => {
  const names = name.split(" ");
  const firstInitial = names[0].charAt(0).toUpperCase();
  const lastInitial = names[names.length - 1].charAt(0).toUpperCase();

  return firstInitial + lastInitial;
};

/**
 * Receives a full name and returns its first name, for compact spots such as legends and chips.
 * @param name Full name of a person.
 * @returns The first name, or the trimmed input when it has a single word.
 */
export const getFirstName = (name: string): string => name.trim().split(/\s+/)[0] ?? name;
