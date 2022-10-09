import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { links as ContainerLinks } from "~/components/Container";
import MyCoursesTable from "~/components/courses/MyCoursesTable";
import AvatarIcon from "~/components/icons/AvatarIcon";
import CheckIcon from "~/components/icons/CheckIcon";
import CloseIcon from "~/components/icons/CloseIcon";
import Page from "~/components/layout/Page";
import Table, { links as TableLinks } from "~/components/Table";
import {
  getCoursesEnrolled,
  getCoursesEnrolledWithGradeAccess,
  getCoursesLecturing,
  getProfessorUserExtended,
  getStudentUserExtended,
} from "~/DAO/composites/composites.server";
import { getProfessorId } from "~/DAO/professorDAO.server";
import { getStudentId } from "~/DAO/studentDAO.server";
import type { UserModelT } from "~/DAO/userDAO.server";
import { getRegistrarUserProfile, getUser } from "~/DAO/userDAO.server";
import { USER_ROLE } from "~/data/data";
import profileStyles from "~/styles/profile.css";
import { bc_users_id_profile } from "~/utils/breadcrumbs";
import { formatDate } from "~/utils/dateUtils";
import { paramToInt } from "~/utils/paramToInt";
import { logout, requireUser } from "~/utils/session.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: profileStyles }, ...ContainerLinks(), ...TableLinks()];
};

type LoaderDataT = {
  breadcrumbData: Awaited<ReturnType<typeof bc_users_id_profile>>;
  user: Exclude<Awaited<ReturnType<typeof getRegistrarUserProfile>>, null> &
    Exclude<Awaited<ReturnType<typeof getProfessorUserExtended>>, null> &
    Exclude<Awaited<ReturnType<typeof getStudentUserExtended>>, null>;
  userRole: UserModelT["role"];
  courses: Exclude<Awaited<ReturnType<typeof getCoursesLecturing>>, null> &
    Exclude<Awaited<ReturnType<typeof getCoursesEnrolled>>, null> &
    Exclude<Awaited<ReturnType<typeof getCoursesEnrolledWithGradeAccess>>, null>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const id = paramToInt(params.userId);
  if (id == null) throw new Response("Not Found", { status: 404 });

  const activeUser = await requireUser(request);
  if (activeUser === null) return logout(request);
  if (activeUser.id === id) return redirect("/my-profile");

  const user = await getUser(id);
  if (!user) throw new Response("Not Found", { status: 404 });

  let userExtended;
  let coursesRegistered;
  switch (user.role) {
    case USER_ROLE.SUPERADMIN:
    case USER_ROLE.REGISTRAR:
      userExtended = await getRegistrarUserProfile(user.id);
      break;
    case USER_ROLE.PROFESSOR:
      userExtended = await getProfessorUserExtended(user.id);
      const prof = await getProfessorId(user.id);
      if (!prof) throw new Error();
      coursesRegistered = await getCoursesLecturing(prof.id);
      break;
    case USER_ROLE.STUDENT:
      userExtended = await getStudentUserExtended(user.id);
      const student = await getStudentId(user.id);
      if (!student) throw new Error();
      switch (activeUser.role) {
        case USER_ROLE.SUPERADMIN:
        case USER_ROLE.REGISTRAR:
          coursesRegistered = await getCoursesEnrolled(student.id);
          break;
        case USER_ROLE.PROFESSOR:
          coursesRegistered = await getCoursesEnrolledWithGradeAccess(student.id, activeUser.id);
          break;
      }
      break;
    default:
      throw new Response("Unauthorized", { status: 401 });
  }
  if (!userExtended) throw new Error();

  const path = new URL(request.url).pathname;
  const breadcrumbData = await bc_users_id_profile(path);

  return {
    breadcrumbData,
    user: userExtended,
    userRole: activeUser.role,
    courses: coursesRegistered,
  };
};

const UserProfilePage = () => {
  const { breadcrumbData, user, userRole, courses } = useLoaderData() as LoaderDataT;
  const activeUserHasPriviledge =
    userRole === "PROFESSOR" || userRole === "REGISTRAR" || userRole === "SUPERADMIN";
  const isReg = user.role === "REGISTRAR";
  const isProf = user.role === "PROFESSOR";
  const isStud = user.role === "STUDENT";

  let avatarColor = "";
  if (user.profile?.is_public) {
    const gender = user.profile?.gender;
    if (gender === "M") avatarColor = "gender-male";
    if (gender === "F") avatarColor = "gender-female";
  }
  const noResultsMsg = "User hasn't registered to any courses";

  return (
    <Page wide breadcrumbs={breadcrumbData}>
      <>
        <div className="profile-container">
          <div className="profile-heading">
            <div className="profile-avatar">
              <AvatarIcon width={40} height={40} className={`icon ${avatarColor}`} />
            </div>
            <div className="profile-identity">
              {user.profile?.is_public ? (
                <div className="fullname">{user.profile?.fullname || "-"}</div>
              ) : (
                <div className="fullname">-</div>
              )}
              <div className="username">{user.username}</div>
            </div>
          </div>
          <div className="profile-info-section section-separator">
            <div className="info-list">
              <div className="field font-300">Department</div>
              <div className="field">{user.department?.title}</div>
              {isReg && (
                <>
                  <div className="field font-300">Title</div>
                  <div className="field">{user.registrar?.title}</div>
                </>
              )}
              {isProf && (
                <>
                  <div className="field font-300">Title</div>
                  <div className="field">{user.professor?.title}</div>
                  <div className="field font-300">Courses following</div>
                  <div className="field">{user.professor.coursesFollowingNumber}</div>
                  <div className="field font-300 link-simple">Courses lecturing</div>
                  <div className="field">{user.professor.coursesLecturingNumber}</div>
                </>
              )}
              {isStud && (
                <>
                  <div className="field font-300">Studies status</div>
                  <div className="field">{user.student?.studies_status}</div>
                  <div className="field font-300">Enrollment year</div>
                  <div className="field">{user.student?.enrollment_year}</div>
                  <div className="field font-300">Courses following</div>
                  <div className="field">{user.student?.coursesFollowingNumber}</div>
                  <div className="field font-300 link-simple">Courses enrolled</div>
                  <div className="field">{user.student?.coursesEnrolledNumber}</div>
                </>
              )}
            </div>
          </div>
          <div className="profile-info-section">
            <div className="info-list">
              <div className="field font-300">Email</div>
              {user.profile?.is_public && user.profile?.email ? (
                <div className="field link">
                  <a href={`mailto:${user.profile.email}`}>{user.profile.email}</a>
                </div>
              ) : (
                <div className="field">-</div>
              )}
              <div className="field font-300">Phone</div>
              {user.profile?.is_public && user.profile?.phone ? (
                <div className="field link">
                  <a href={`tel:+30${user.profile.phone}`}>{user.profile.phone}</a>
                </div>
              ) : (
                <div className="field">-</div>
              )}
              <div className="field font-300">Profile is public</div>
              <div className="field">
                {user.profile?.is_public ? (
                  <CheckIcon height={20} width={20} />
                ) : (
                  <CloseIcon height={20} width={20} />
                )}
              </div>
              <div className="field font-300">Member since</div>
              <div className="field">
                {user.profile?.created_at && formatDate(new Date(user.profile?.created_at))}
              </div>
            </div>
          </div>
        </div>
        {user.profile?.is_public && user.profile?.info && (
          <div className="about-me-section">
            <div className="title">About me</div>
            <div className="content">{user.profile?.info}</div>
          </div>
        )}
        {isProf || (isStud && activeUserHasPriviledge) ? (
          <Table data={courses} noResultsMsg={noResultsMsg} userRole={user.role}>
            <MyCoursesTable />
          </Table>
        ) : (
          <></>
        )}
      </>
    </Page>
  );
};

export default UserProfilePage;
