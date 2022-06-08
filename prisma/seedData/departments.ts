import type { Department } from "@prisma/client";

export const departments: {
  titleId: Department["title_id"];
  fullTitle: Department["full_title"];
}[] = [
  { titleId: "IT", fullTitle: "Informatics and Telematics" },
  { titleId: "GEO", fullTitle: "Geography" },
];
