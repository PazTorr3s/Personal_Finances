export type FilterMode = "day" | "week" | "month" | "year";

export function getDateRange(
  mode: FilterMode,
  selectedDate: Date
) {
  const start = new Date(selectedDate);
  const end = new Date(selectedDate);

  switch (mode) {
    case "day":
      break;

    case "week": {
      const day = start.getDay() || 7;
      start.setDate(start.getDate() - day + 1);
      end.setDate(start.getDate() + 6);
      break;
    }

    case "month":
      start.setDate(1);
      end.setMonth(start.getMonth() + 1);
      end.setDate(0);
      break;

    case "year":
      start.setMonth(0, 1);
      end.setMonth(11, 31);
      break;
  }

  return { start, end };
}
