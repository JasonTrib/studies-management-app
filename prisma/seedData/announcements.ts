import type { Announcement } from "@prisma/client";

export const announcements: {
  id: Announcement["id"];
  body: Announcement["body"];
  title: Announcement["title"];
  courseId: Announcement["course_id"];
}[] = [
  {
    id: 1,
    title: "Examination",
    body: "The exam will take place on Friday 13/2 at 9:00.",
    courseId: 1,
  },
  {
    id: 2,
    title: "Exam results",
    body: "The exam results will be announced Monday 23/2.",
    courseId: 1,
  },
  {
    id: 3,
    title: "Thursday's lecture",
    body: "Thursday's lecture to be held on auditorium B1.",
    courseId: 2,
  },
  {
    id: 4,
    title: "Seminar invitation",
    body: "On 2/11 our univercity will welcome Dr Peter Smith who will give a presentation on 'The performance variability and evaluation of cloud services'.",
    courseId: 4,
  },
  {
    id: 5,
    title: "No Tuesday lecture",
    body: "The lecture of 20/4 is cancelled due to a public transport strike.",
    courseId: 6,
  },
  {
    id: 6,
    title: "Course material",
    body: "chapters 1, 2, 4 (excluding 4.1-4.5) and 5",
    courseId: 7,
  },
  {
    id: 7,
    title: "Grades",
    body: "Grades have been submitted, if you want to go over a review of your grade, contact me before 11/7.",
    courseId: 7,
  },
];
