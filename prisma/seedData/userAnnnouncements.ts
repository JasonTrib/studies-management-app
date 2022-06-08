import type { UserAnnouncement } from "@prisma/client";

export const userAnnouncements: {
  annId: UserAnnouncement["announcement_id"];
  userId: UserAnnouncement["user_id"];
  hasPosted: UserAnnouncement["has_posted"];
  hasSeen: UserAnnouncement["has_seen"];
}[] = [
  {
    annId: 1,
    userId: 1,
    hasPosted: false,
    hasSeen: true,
  },
  {
    annId: 1,
    userId: 4,
    hasPosted: true,
    hasSeen: false,
  },
  {
    annId: 2,
    userId: 1,
    hasPosted: false,
    hasSeen: false,
  },
];
