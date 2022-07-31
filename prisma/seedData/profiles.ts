import type { Profile } from "@prisma/client";

export const profiles: {
  id: Profile["id"];
  fullname: Profile["fullname"];
  email: Profile["email"];
  userId: Profile["user_id"];
}[] = [
  { id: 1, fullname: "Jason Talley", email: "jasontalley@email.com", userId: 1 },
  { id: 2, fullname: "Celine Preston", email: "celinepreston@email.com", userId: 2 },
  { id: 3, fullname: "Natalie Coleman", email: "nataliecoleman@email.com", userId: 3 },
  { id: 4, fullname: "Melvin Reese", email: "melvinreese@email.com", userId: 4 },
  { id: 5, fullname: "Gregory Tanner", email: "gregorytanner@email.com", userId: 5 },
  { id: 6, fullname: "Wendy Flower", email: "wendyflower@email.com", userId: 6 },
  { id: 7, fullname: "Thomas Buckley", email: "thomasbuckley@email.com", userId: 7 },
  { id: 8, fullname: "John Ellwood", email: "johnellwood@email.com", userId: 8 },
  { id: 9, fullname: "Mark Bowman", email: "markbowman@email.com", userId: 9 },
  { id: 10, fullname: "Helen Byrne", email: "helenbyrne@email.com", userId: 10 },
  { id: 11, fullname: "Steve Wickens", email: "stevewickens@email.com", userId: 11 },
  { id: 12, fullname: "Anna Huffman", email: "annahuffman@email.com", userId: 12 },
  { id: 13, fullname: "Denice Hatfield", email: "denicehatfield@email.com", userId: 13 },
  { id: 14, fullname: "Clyde Robinson", email: "clyderobinson@email.com", userId: 14 },
];
