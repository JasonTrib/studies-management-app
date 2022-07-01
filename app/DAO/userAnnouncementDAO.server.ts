import type { Announcement, User } from "@prisma/client";
import { prisma } from "~/db.server";

export function getUserAnnouncementsPosted(userId: User["id"]) {
  return prisma.userAnnouncement.findMany({
    where: {
      user_id: userId,
      has_posted: true,
    },
    include: {
      announcement: true,
    },
  });
}

function getUserAnnoucement(userId: User["id"], annId: Announcement["id"]) {
  return prisma.userAnnouncement.findUnique({
    where: {
      user_id_announcement_id: {
        user_id: userId,
        announcement_id: annId,
      },
    },
    include: {
      announcement: {
        include: {
          course: true,
        },
      },
      user: {
        select: {
          profile: true,
        },
      },
    },
  });
}
