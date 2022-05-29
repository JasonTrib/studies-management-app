import type { Profile } from "@prisma/client";

export const profiles: {
  id: Profile["id"];
  name: Profile["name"];
  surname: Profile["surname"];
  email: Profile["email"];
  userId: Profile["user_id"];
}[] = [
  { id: 1, name: "jason", surname: "t.", email: "jason@email.com", userId: 1 },
  {
    id: 2,
    name: "celine",
    surname: "p.",
    email: "celine@email.com",
    userId: 2,
  },
  {
    id: 3,
    name: "natalie",
    surname: "c.",
    email: "natalie@email.com",
    userId: 3,
  },
  {
    id: 4,
    name: "melvin",
    surname: "c.",
    email: "melvin@email.com",
    userId: 4,
  },
  {
    id: 5,
    name: "gregory",
    surname: "a.",
    email: "gregory@email.com",
    userId: 5,
  },
  { id: 6, name: "wendy", surname: "s.", email: "wendy@email.com", userId: 6 },
  {
    id: 7,
    name: "thomas",
    surname: "m.",
    email: "thomas@email.com",
    userId: 7,
  },
  { id: 8, name: "john", surname: "e.", email: "john@email.com", userId: 8 },
  { id: 9, name: "mark", surname: "l.", email: "mark@email.com", userId: 9 },
  {
    id: 10,
    name: "helen",
    surname: "p.",
    email: "helen@email.com",
    userId: 10,
  },
  {
    id: 11,
    name: "steve",
    surname: "w.",
    email: "steve@email.com",
    userId: 11,
  },
  { id: 12, name: "anna", surname: "b.", email: "anna@email.com", userId: 12 },
  {
    id: 13,
    name: "denice",
    surname: "h.",
    email: "denice@email.com",
    userId: 13,
  },
];
