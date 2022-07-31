import type { Profile } from "@prisma/client";
import { prisma } from "~/db.server";
export type { Profile as ProfileModelT } from "@prisma/client";

export function getProfile(userId: Profile["user_id"]) {
  return prisma.profile.findUnique({
    where: { user_id: userId },
  });
}

export type profileDataT = {
  user_id: number;
  name?: string;
  surname?: string;
  email?: string;
  gender?: "M" | "F";
  phone?: string;
  info?: string;
  avatar?: string;
  is_public: boolean;
  updated_at: string;
};

export function updateProfile(data: profileDataT) {
  return prisma.profile.update({
    where: { user_id: data.user_id },
    data: {
      email: data.email,
      name: data.name,
      surname: data.surname,
      gender: data.gender,
      phone: data.phone,
      info: data.info,
      avatar: data.avatar,
      is_public: data.is_public,
      updated_at: data.updated_at,
    },
  });
}
