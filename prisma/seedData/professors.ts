import type { Professor, User, Profile } from "@prisma/client";

export const professors: {
  id: Professor["id"];
  title: Professor["title"];
  department: Professor["department"];
  userId: User["id"];
  profileId: Profile["id"];
}[] = [
  { id: 1, title: "Professor", department: "GEO", userId: 4, profileId: 4 },
  { id: 2, title: "Professor", department: "IT", userId: 5, profileId: 5 },
  { id: 3, title: "Professor", department: "IT", userId: 6, profileId: 6 },
  {
    id: 4,
    title: "Assistant Professor",
    department: "IT",
    userId: 7,
    profileId: 7,
  },
];
