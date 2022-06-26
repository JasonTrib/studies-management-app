import { format } from "date-fns";

export const formatDate = (date: Date) => {
  return format(date, "EEEE, d MMMM yyyy");
};
