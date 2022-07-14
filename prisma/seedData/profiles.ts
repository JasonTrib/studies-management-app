import type { Profile } from "@prisma/client";

export const profiles: {
  id: Profile["id"];
  name: Profile["name"];
  surname: Profile["surname"];
  email: Profile["email"];
  userId: Profile["user_id"];
}[] = [
  { id: 1, name: "Jason", surname: "Talley", email: "jasontalley@email.com", userId: 1 },
  { id: 2, name: "Celine", surname: "Preston", email: "celinepreston@email.com", userId: 2 },
  { id: 3, name: "Natalie", surname: "Coleman", email: "nataliecoleman@email.com", userId: 3 },
  { id: 4, name: "Melvin", surname: "Reese", email: "melvinreese@email.com", userId: 4 },
  { id: 5, name: "Gregory", surname: "Tanner", email: "gregorytanner@email.com", userId: 5 },
  { id: 6, name: "Wendy", surname: "Flower", email: "wendyflower@email.com", userId: 6 },
  { id: 7, name: "Thomas", surname: "Buckley", email: "thomasbuckley@email.com", userId: 7 },
  { id: 8, name: "John", surname: "Ellwood", email: "johnellwood@email.com", userId: 8 },
  { id: 9, name: "Mark", surname: "Bowman", email: "markbowman@email.com", userId: 9 },
  { id: 10, name: "Helen", surname: "Byrne", email: "helenbyrne@email.com", userId: 10 },
  { id: 11, name: "Steve", surname: "Wickens", email: "stevewickens@email.com", userId: 11 },
  { id: 12, name: "Anna", surname: "Huffman", email: "annahuffman@email.com", userId: 12 },
  { id: 13, name: "Denice", surname: "Hatfield", email: "denicehatfield@email.com", userId: 13 },
  { id: 14, name: "Clyde", surname: "Robinson", email: "clyderobinson@email.com", userId: 14 },
];
