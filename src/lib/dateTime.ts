import { DateTime } from "luxon";

export function friendlySince(start: Date, end: Date) {
  const days = daysSince(start, end);
  if (days < 1 && end.getDate() === start.getDate()) {
    return DateTime.fromJSDate(start)
      .toLocaleString(DateTime.TIME_SIMPLE)
      .split(" ")
      .map((b) => b.toLowerCase())
      .join("");
  } else if (days < 2 && end.getDate() - start.getDate() === 1) {
    return "Yesterday";
  } else if (days < 8) {
    return `${Math.ceil(days)} days ago`;
  } else if (days < 365) {
    return DateTime.fromJSDate(start).toLocaleString({
      month: "long",
      day: "numeric",
    });
  } else {
    return DateTime.fromJSDate(start).toLocaleString(DateTime.DATE_SHORT);
  }
}

export function daysSince(start: Date, end: Date) {
  const startDt = DateTime.fromJSDate(start);
  const endDt = DateTime.fromJSDate(end);
  return endDt.diff(startDt, "days").days;
}
