import type { ActionFunction, LinksFunction, LoaderFunction } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import FormSelect from "~/components/form/FormSelect";
import AvatarIcon from "~/components/icons/AvatarIcon";
import CheckIcon from "~/components/icons/CheckIcon";
import CloseIcon from "~/components/icons/CloseIcon";
import CogIcon from "~/components/icons/CogIcon";
import Page from "~/components/layout/Page";
import {
  getDepartmentsList,
  getProfessorUserExtended,
  getStudentUserExtended,
} from "~/DAO/composites/composites.server";
import type { UserModelT } from "~/DAO/userDAO.server";
import { getRegistrarUserProfile, updateSuperadminDepartment } from "~/DAO/userDAO.server";
import { USER_ROLE } from "~/data/data";
import profileStyles from "~/styles/profile.css";
import { bc_myprofile } from "~/utils/breadcrumbs";
import { formatDate } from "~/utils/dateUtils";
import { preventUnlessHasAccess } from "~/utils/permissionUtils.server";
import { logout, requireUser } from "~/utils/session.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: profileStyles }];
};

export const action: ActionFunction = async ({ request, params }) => {
  if (request.method !== "PUT") throw new Response("Method Not Allowed", { status: 405 });
  const user = await requireUser(request);
  if (user === null) return logout(request);
  preventUnlessHasAccess(user.role, USER_ROLE.SUPERADMIN);

  const formData = await request.formData();
  const body = Object.fromEntries(formData);
  const depId = `${body.department}`;

  await updateSuperadminDepartment(user.id, depId);

  return null;
};

type LoaderDataT = {
  breadcrumbData: Awaited<ReturnType<typeof bc_myprofile>>;
  user: Exclude<Awaited<ReturnType<typeof getRegistrarUserProfile>>, null> &
    Exclude<Awaited<ReturnType<typeof getProfessorUserExtended>>, null> &
    Exclude<Awaited<ReturnType<typeof getStudentUserExtended>>, null>;
  userRole: UserModelT["role"];
  departments: Awaited<ReturnType<typeof getDepartmentsList>>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  if (user === null) return logout(request);

  let departments;
  let userExtended;
  switch (user.role) {
    case USER_ROLE.SUPERADMIN:
      departments = await getDepartmentsList();
    case USER_ROLE.REGISTRAR:
      userExtended = await getRegistrarUserProfile(user.id);
      break;
    case USER_ROLE.PROFESSOR:
      userExtended = await getProfessorUserExtended(user.id);
      break;
    case USER_ROLE.STUDENT:
      userExtended = await getStudentUserExtended(user.id);
      break;
    default:
      throw new Response("Unauthorized", { status: 401 });
  }
  if (!userExtended) throw new Error();

  const path = new URL(request.url).pathname;
  const breadcrumbData = await bc_myprofile(path);

  return { breadcrumbData, user: userExtended, userRole: user.role, departments };
};

const ProfileIndexPage = () => {
  const { breadcrumbData, user, userRole, departments } = useLoaderData() as LoaderDataT;
  const fetcher = useFetcher();
  const isBusy = fetcher.state !== "idle";
  const [selectedDepId, setSelectedDepId] = useState(user.dep_id);
  const isAdmin = userRole === "SUPERADMIN";
  const isReg = userRole === "REGISTRAR";
  const isProf = userRole === "PROFESSOR";
  const isStud = userRole === "STUDENT";

  let avatarColor = "";
  const gender = user.profile?.gender;
  if (gender === "M") avatarColor = "gender-male";
  if (gender === "F") avatarColor = "gender-female";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepId(e.currentTarget.value);
  };

  const headingActions = (): JSX.Element | null => {
    return (
      <span className="svg-link">
        <Link to="edit">
          <CogIcon />
        </Link>
      </span>
    );
  };

  return (
    <Page wide breadcrumbs={breadcrumbData} Actions={headingActions()}>
      <>
        <div className="profile-container">
          <div className="profile-heading">
            <div className="profile-avatar">
              <AvatarIcon width={40} height={40} className={`icon ${avatarColor}`} />
            </div>
            <div className="profile-identity">
              <div className="fullname">{user.profile?.fullname || "-"}</div>
              <div className="username">{user.username}</div>
            </div>
          </div>
          <div className="profile-info-section section-separator">
            <div className="info-list">
              <div className="field font-300">Department</div>
              {isAdmin ? (
                <div className="field">
                  <fetcher.Form method="put" action="?index" className="select-department-form">
                    <FormSelect
                      label="department"
                      optionsText={departments.map((dep) => dep.depTitle)}
                      values={departments.map((dep) => dep.depId)}
                      defaultValue={user.dep_id}
                      disabled={isBusy}
                      handleChange={handleChange}
                    />
                    {selectedDepId !== user.dep_id && (
                      <div className="form-submit">
                        <button type="submit" disabled={isBusy}>
                          <CheckIcon width={20} height={20} />
                        </button>
                      </div>
                    )}
                  </fetcher.Form>
                </div>
              ) : (
                <div className="field">{user.department?.title}</div>
              )}
              {isReg && (
                <>
                  <div className="field font-300">Title</div>
                  <div className="field">{user.registrar?.title}</div>
                </>
              )}
              {isProf && (
                <>
                  <div className="field font-300">Title</div>
                  <div className="field">{user.professor.title}</div>
                  <div className="field font-300">Courses following</div>
                  <div className="field">{user.professor.coursesFollowingNumber}</div>
                  <div className="field font-300 link-simple">
                    <Link to="/my-courses">Courses lecturing ↗</Link>
                  </div>
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
                  <div className="field font-300 link-simple">
                    <Link to="/my-courses">Courses enrolled ↗</Link>
                  </div>
                  <div className="field">{user.student?.coursesEnrolledNumber}</div>
                </>
              )}
            </div>
          </div>
          <div className="profile-info-section">
            <div className="info-list">
              <div className="field font-300">Email</div>
              {user.profile?.email ? (
                <div className="field link">
                  <a href={`mailto:${user.profile.email}`}>{user.profile.email}</a>
                </div>
              ) : (
                <div className="field">{"-"}</div>
              )}
              <div className="field font-300">Phone</div>
              {user.profile?.phone ? (
                <div className="field link">
                  <a href={`tel:+30${user.profile.phone}`}>{user.profile.phone}</a>
                </div>
              ) : (
                <div className="field">{"-"}</div>
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
        <div className="about-me-section">
          <div className="title">About me</div>
          {user.profile?.info && <div className="content">{user.profile?.info}</div>}
        </div>
      </>
    </Page>
  );
};

export default ProfileIndexPage;
