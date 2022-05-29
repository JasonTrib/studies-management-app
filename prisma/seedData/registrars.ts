import type { Registrar, User, Profile } from "@prisma/client";

export const registrars: {
  id: Registrar["id"];
  title: Registrar["title"];
  department: Registrar["department"];
  userId: User["id"];
  profileId: Profile["id"];
}[] = [
  { id: 1, title: "IT Secretary", department: "IT", userId: 2, profileId: 2 },
  { id: 2, title: "GEO Secretary", department: "GEO", userId: 3, profileId: 3 },
];
