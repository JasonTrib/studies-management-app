import { getAnnouncement } from "~/DAO/announcementDAO.server";
import { getCourse } from "~/DAO/courseDAO.server";
import { getUser } from "~/DAO/userDAO.server";

const getPathSegs = (path: string) => path.split("/").filter((x) => x);
const calcPath = (pathSegs: string[], idx: number) =>
  [...Array(idx)]
    .map((_, i) => (pathSegs[i] ? `/${pathSegs[i]}` : null))
    .filter((x) => x)
    .join("");
const crumbBuilder = (pathSegs: string[], textSegs: { text: string; isLink: boolean }[]) =>
  textSegs.map((textSeg, i) => ({
    seg: calcPath(pathSegs, i + 1),
    text: textSeg.text,
    isLink: textSeg.isLink,
  }));

// =========================
// =========================

export const bc_courses = async (path: string) => {
  const pathSegs = getPathSegs(path);

  const textSegs = [{ text: "Courses", isLink: true }];

  return crumbBuilder(pathSegs, textSegs);
};

export const bc_courses_new = async (path: string) => {
  const pathSegs = getPathSegs(path);

  const textSegs = [
    { text: "Courses", isLink: true },
    { text: "New course", isLink: true },
  ];

  return crumbBuilder(pathSegs, textSegs);
};

export const bc_courses_id = async (path: string) => {
  const pathSegs = getPathSegs(path);

  const textSegs = [
    { text: "Courses", isLink: true },
    { text: (await getCourse(parseInt(pathSegs[1])))?.title || "", isLink: true },
  ];

  return crumbBuilder(pathSegs, textSegs);
};

export const bc_courses_id_edit = async (path: string) => {
  const pathSegs = getPathSegs(path);

  const textSegs = [
    { text: "Courses", isLink: true },
    { text: (await getCourse(parseInt(pathSegs[1])))?.title || "", isLink: true },
    { text: "Edit course", isLink: true },
  ];

  return crumbBuilder(pathSegs, textSegs);
};

export const bc_courses_id_anns = async (path: string) => {
  const pathSegs = getPathSegs(path);

  const textSegs = [
    { text: "Courses", isLink: true },
    { text: (await getCourse(parseInt(pathSegs[1])))?.title || "", isLink: true },
    { text: "Announcements", isLink: true },
  ];

  return crumbBuilder(pathSegs, textSegs);
};

export const bc_courses_id_anns_id = async (path: string) => {
  const pathSegs = getPathSegs(path);

  const textSegs = [
    { text: "Courses", isLink: true },
    { text: (await getCourse(parseInt(pathSegs[1])))?.title || "", isLink: true },
    { text: "Announcements", isLink: true },
    { text: (await getAnnouncement(parseInt(pathSegs[3])))?.title || "", isLink: true },
  ];

  return crumbBuilder(pathSegs, textSegs);
};

export const bc_courses_id_anns_new = async (path: string) => {
  const pathSegs = getPathSegs(path);

  const textSegs = [
    { text: "Courses", isLink: true },
    { text: (await getCourse(parseInt(pathSegs[1])))?.title || "", isLink: true },
    { text: "Announcements", isLink: true },
    { text: "New announcement", isLink: true },
  ];

  return crumbBuilder(pathSegs, textSegs);
};

export const bc_users = async (path: string) => {
  const pathSegs = getPathSegs(path);

  const textSegs = [{ text: "Users", isLink: true }];

  return crumbBuilder(pathSegs, textSegs);
};

export const bc_users_id_profile = async (path: string) => {
  const pathSegs = getPathSegs(path);

  const textSegs = [
    { text: "Users", isLink: true },
    { text: (await getUser(parseInt(pathSegs[1])))?.username || "", isLink: false },
    { text: "Profile", isLink: true },
  ];

  return crumbBuilder(pathSegs, textSegs);
};

export const bc_users_regs = async (path: string) => {
  const pathSegs = getPathSegs(path);

  const textSegs = [
    { text: "Users", isLink: true },
    { text: "Registrars", isLink: true },
  ];

  return crumbBuilder(pathSegs, textSegs);
};

export const bc_users_profs = async (path: string) => {
  const pathSegs = getPathSegs(path);

  const textSegs = [
    { text: "Users", isLink: true },
    { text: "Professors", isLink: true },
  ];

  return crumbBuilder(pathSegs, textSegs);
};

export const bc_users_profs_new = async (path: string) => {
  const pathSegs = getPathSegs(path);

  const textSegs = [
    { text: "Users", isLink: true },
    { text: "Professors", isLink: true },
    { text: "New professor", isLink: true },
  ];

  return crumbBuilder(pathSegs, textSegs);
};

export const bc_users_studs = async (path: string) => {
  const pathSegs = getPathSegs(path);

  const textSegs = [
    { text: "Users", isLink: true },
    { text: "Students", isLink: true },
  ];

  return crumbBuilder(pathSegs, textSegs);
};

export const bc_users_studs_new = async (path: string) => {
  const pathSegs = getPathSegs(path);

  const textSegs = [
    { text: "Users", isLink: true },
    { text: "Students", isLink: true },
    { text: "New student", isLink: true },
  ];

  return crumbBuilder(pathSegs, textSegs);
};

export const bc_myprofile = async (path: string) => {
  const pathSegs = getPathSegs(path);

  const textSegs = [{ text: "My profile", isLink: true }];

  return crumbBuilder(pathSegs, textSegs);
};

export const bc_myprofile_edit = async (path: string) => {
  const pathSegs = getPathSegs(path);

  const textSegs = [
    { text: "My profile", isLink: true },
    { text: "Edit", isLink: true },
  ];

  return crumbBuilder(pathSegs, textSegs);
};

export const bc_mycourses = async (path: string) => {
  const pathSegs = getPathSegs(path);

  const textSegs = [{ text: "My courses", isLink: true }];

  return crumbBuilder(pathSegs, textSegs);
};

export const bc_anns = async (path: string) => {
  const pathSegs = getPathSegs(path);

  const textSegs = [{ text: "Announcements", isLink: true }];

  return crumbBuilder(pathSegs, textSegs);
};
