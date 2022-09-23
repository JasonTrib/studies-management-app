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

export const courses_id_anns_id = async (path: string) => {
  const pathSegs = getPathSegs(path);

  const textSegs = [
    { text: "Courses", isLink: true },
    { text: (await getCourse(parseInt(pathSegs[1])))?.title || "", isLink: true },
    { text: "Announcements", isLink: true },
    { text: (await getCourse(parseInt(pathSegs[1])))?.title || "", isLink: false },
  ];

  return crumbBuilder(pathSegs, textSegs);
};
