import type { UserAnnouncement } from "@prisma/client";

export const userAnnouncements: {
  id: UserAnnouncement["id"];
  annId: UserAnnouncement["announcement_id"];
  userId: UserAnnouncement["user_id"];
  hasPosted: UserAnnouncement["has_posted"];
  hasSeen: UserAnnouncement["has_seen"];
}[] = [
  {
    id: 1,
    annId: 1,
    userId: 1,
    hasPosted: false,
    hasSeen: true,
  },
  {
    id: 2,
    annId: 1,
    userId: 4,
    hasPosted: true,
    hasSeen: false,
  },
  {
    id: 3,
    annId: 2,
    userId: 1,
    hasPosted: false,
    hasSeen: false,
  },
];
