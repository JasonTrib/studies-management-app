import type { Profile } from "@prisma/client";

export const profiles: {
  id: Profile["id"];
  name: Profile["name"];
  surname: Profile["surname"];
  email: Profile["email"];
}[] = [
  { id: 1, name: "jason", surname: "t.", email: "jason@email.com" },
  { id: 2, name: "celine", surname: "p.", email: "celine@email.com" },
  { id: 3, name: "natalie", surname: "c.", email: "natalie@email.com" },
  { id: 4, name: "melvin", surname: "c.", email: "melvin@email.com" },
  { id: 5, name: "gregory", surname: "a.", email: "gregory@email.com" },
  { id: 6, name: "wendy", surname: "s.", email: "wendy@email.com" },
  { id: 7, name: "thomas", surname: "m.", email: "thomas@email.com" },
  { id: 8, name: "john", surname: "e.", email: "john@email.com" },
  { id: 9, name: "mark", surname: "l.", email: "mark@email.com" },
  { id: 10, name: "helen", surname: "p.", email: "helen@email.com" },
  { id: 11, name: "steve", surname: "w.", email: "steve@email.com" },
  { id: 12, name: "anna", surname: "b.", email: "anna@email.com" },
  { id: 13, name: "denice", surname: "h.", email: "denice@email.com" },
];
