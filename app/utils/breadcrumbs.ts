import { getCourse } from "~/DAO/courseDAO.server";

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
    { text: "Edit course", isLink: false },
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
    { text: (await getCourse(parseInt(pathSegs[1])))?.title || "", isLink: true },
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
