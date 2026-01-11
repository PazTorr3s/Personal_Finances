import type { Transaction } from "./transaction.types";

export function parseLocalDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function filterTransactionsByDate(
  transactions: Transaction[],
  selectedDate: Date,
  mode: "day" | "week" | "month" | "year"
) {
  let start = startOfDay(selectedDate);
  let end = endOfDay(selectedDate);

  switch (mode) {
    case "week": {
      const day = start.getDay() || 7;
      start.setDate(start.getDate() - day + 1);
      end = endOfDay(new Date(start));
      end.setDate(start.getDate() + 6);
      break;
    }

    case "month":
      start = startOfDay(new Date(start.getFullYear(), start.getMonth(), 1));
      end = endOfDay(new Date(start.getFullYear(), start.getMonth() + 1, 0));
      break;

    case "year":
      start = startOfDay(new Date(start.getFullYear(), 0, 1));
      end = endOfDay(new Date(start.getFullYear(), 11, 31));
      break;
  }

  return transactions.filter((t) => {
    const txDate = startOfDay(parseLocalDate(t.date));
    return txDate >= start && txDate <= end;
  });
}
