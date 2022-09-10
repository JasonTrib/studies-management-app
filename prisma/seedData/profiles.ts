import type { Profile } from "@prisma/client";

export const profiles: {
  id: Profile["id"];
  userId: Profile["user_id"];
  fullname: Profile["fullname"];
  email: Profile["email"];
  gender?: Profile["gender"];
  phone?: Profile["phone"];
  isPublic: Profile["is_public"];
}[] = [
  {
    id: 1,
    fullname: "Jason Talley",
    email: "jasontalley@email.com",
    userId: 1,
    gender: "M",
    isPublic: false,
  },
  {
    id: 2,
    fullname: "Celine Preston",
    email: "celinepreston@email.com",
    userId: 2,
    phone: "6900000000",
    isPublic: true,
  },
  {
    id: 3,
    fullname: "Natalie Coleman",
    email: "nataliecoleman@email.com",
    userId: 3,
    phone: "6900000001",
    isPublic: true,
  },
  {
    id: 4,
    fullname: "Melvin Reese",
    email: "melvinreese@email.com",
    userId: 4,
    gender: "M",
    isPublic: true,
  },
  {
    id: 5,
    fullname: "Gregory Tanner",
    email: "gregorytanner@email.com",
    userId: 5,
    gender: "M",
    phone: "6900000002",
    isPublic: true,
  },
  {
    id: 6,
    fullname: "Wendy Flower",
    email: "wendyflower@email.com",
    userId: 6,
    gender: "F",
    phone: "6900000003",
    isPublic: true,
  },
  {
    id: 7,
    fullname: "Thomas Buckley",
    email: "thomasbuckley@email.com",
    userId: 7,
    isPublic: true,
  },
  {
    id: 8,
    fullname: "John Ellwood",
    email: "johnellwood@email.com",
    userId: 8,
    gender: "M",
    phone: "6900000004",
    isPublic: false,
  },
  {
    id: 9,
    fullname: "Mark Bowman",
    email: "markbowman@email.com",
    userId: 9,
    gender: "M",
    isPublic: true,
  },
  {
    id: 10,
    fullname: "Helen Byrne",
    email: "helenbyrne@email.com",
    userId: 10,
    phone: "6900000005",
    isPublic: true,
  },
  {
    id: 11,
    fullname: "Steve Wickens",
    email: "stevewickens@email.com",
    userId: 11,
    isPublic: false,
  },
  {
    id: 12,
    fullname: "Anna Huffman",
    email: "annahuffman@email.com",
    userId: 12,
    isPublic: false,
  },
  {
    id: 13,
    fullname: "Denice Hatfield",
    email: "denicehatfield@email.com",
    userId: 13,
    gender: "F",
    isPublic: true,
  },
  {
    id: 14,
    fullname: "Clyde Robinson",
    email: "clyderobinson@email.com",
    userId: 14,
    gender: "M",
    phone: "6900000006",
    isPublic: false,
  },
];
