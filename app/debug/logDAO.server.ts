import { getDepartments, getDepartment } from "~/DAO/departmentDAO.server";
import {
  getProfessorCoursesAnnouncements,
  getProfessorCourseAnnouncements,
  getProfessorCourses,
  getProfessorCoursesFollowed,
} from "~/DAO/professorCourseDAO.server";
import {
  getStudentCoursesAnnouncements,
  getStudentCourseAnnouncements,
  getStudentCourses,
  getStudentCoursesFollowed,
} from "~/DAO/studentCourseDAO.server";
import { getUserAnnouncementsPosted } from "~/DAO/userAnnouncementDAO.server";
import { getAllAnnoucements } from "../DAO/announcementDAO.server";
import {
  getAllCourses,
  getCourses,
  getCourse,
  getCoursesAnnoucements,
  getCourseAnnoucements,
} from "../DAO/courseDAO.server";
import {
  getAllProfessors,
  getProfessor,
  getProfessorsProfile,
  getProfessorProfile,
} from "../DAO/professorDAO.server";
import {
  getAllRegistrars,
  getRegistrars,
  getRegistrar,
  getRegistrarsProfile,
  getRegistrarProfile,
} from "../DAO/registrarDAO.server";
import {
  getAllStudents,
  getStudents,
  getStudent,
  getStudentsProfile,
  getStudentProfile,
} from "../DAO/studentDAO.server";
import {
  getAllUsers,
  getProfessors,
  getUserAnnouncements,
  getUserPassword,
} from "../DAO/userDAO.server";

export const logUserDAO = async () => {
  const allUsers = await getAllUsers();
  const userPassword = await getUserPassword(1);
  const userAnnouncements = await getUserAnnouncements(4);
  const userAnnouncementsPosted = await getUserAnnouncementsPosted(8);

  console.log("~~~~~~~ allUsers ~~~~~~~");
  console.log(allUsers);
  console.log("~~~~~~~ userPassword ~~~~~~~");
  console.log(userPassword);
  console.log("~~~~~~~ userAnnouncements ~~~~~~~");
  console.log(userAnnouncements);
  console.log("~~~~~~~ userAnnouncementsPosted ~~~~~~~");
  console.log(userAnnouncementsPosted);
};

export const logDepartmentDAO = async () => {
  const departments = await getDepartments();
  const department = await getDepartment("IT");

  console.log("~~~~~~~ departments ~~~~~~~");
  console.log(departments);
  console.log("~~~~~~~ department ~~~~~~~");
  console.log(department);
};

export const logCourseDAO = async () => {
  const allCourses = await getAllCourses();
  const courses = await getCourses("IT");
  const course = await getCourse(1);

  console.log("~~~~~~~ allCourses ~~~~~~~");
  console.log(allCourses);
  console.log("~~~~~~~ courses ~~~~~~~");
  console.log(courses);
  console.log("~~~~~~~ course ~~~~~~~");
  console.log(course);
};

export const logAnnouncementDAO = async () => {
  const allAnnouncements = await getAllAnnoucements();
  const courseAnnouncements = await getCoursesAnnoucements("IT");
  const courseAnnouncement = await getCourseAnnoucements(3);

  console.log("~~~~~~~ allAnnouncements ~~~~~~~");
  console.log(allAnnouncements);
  console.log("~~~~~~~ courseAnnouncements ~~~~~~~");
  console.log(courseAnnouncements);
  console.log("~~~~~~~ courseAnnouncement ~~~~~~~");
  console.log(courseAnnouncement);
};

export const logStudentDAO = async () => {
  const allStudents = await getAllStudents();
  const students = await getStudents("IT");
  const student = await getStudent(2);
  const studentsProfiles = await getStudentsProfile("IT");
  const studentProfile = await getStudentProfile(3);
  const studentCourses = await getStudentCourses(5);
  const studentFollowedCourses = await getStudentCoursesFollowed(1);
  const studentAnnouncements = await getStudentCoursesAnnouncements(4);
  const studentCourseAnnouncements = await getStudentCourseAnnouncements(4, 1);

  console.log("~~~~~~~ allStudents ~~~~~~~");
  console.log(allStudents);
  console.log("~~~~~~~ students ~~~~~~~");
  console.log(students);
  console.log("~~~~~~~ student ~~~~~~~");
  console.log(student);
  console.log("~~~~~~~ studentsProfiles ~~~~~~~");
  console.log(studentsProfiles);
  console.log("~~~~~~~ studentProfile ~~~~~~~");
  console.log(studentProfile);
  console.log("~~~~~~~ studentCourses ~~~~~~~");
  console.log(studentCourses);
  console.log("~~~~~~~ studentFollowedCourses ~~~~~~~");
  console.log(studentFollowedCourses);
  console.log("~~~~~~~ studentAnnouncements ~~~~~~~");
  console.log(studentAnnouncements);
  console.log("~~~~~~~ studentCourseAnnouncements ~~~~~~~");
  console.log(studentCourseAnnouncements);
};

export const logProfessorDAO = async () => {
  const allProfessors = await getAllProfessors();
  const professors = await getProfessors("IT");
  const professor = await getProfessor(2);
  const professorsProfiles = await getProfessorsProfile("IT");
  const professorProfile = await getProfessorProfile(1);
  const professorCourses = await getProfessorCourses(4);
  const professorFollowedCourses = await getProfessorCoursesFollowed(3);
  const professorAnnouncements = await getProfessorCoursesAnnouncements(3);
  const professorCourseAnnouncements = await getProfessorCourseAnnouncements(3, 1);

  console.log("~~~~~~~ allProfessors ~~~~~~~");
  console.log(allProfessors);
  console.log("~~~~~~~ professors ~~~~~~~");
  console.log(professors);
  console.log("~~~~~~~ professor ~~~~~~~");
  console.log(professor);
  console.log("~~~~~~~ professorsProfiles ~~~~~~~");
  console.log(professorsProfiles);
  console.log("~~~~~~~ professorProfile ~~~~~~~");
  console.log(professorProfile);
  console.log("~~~~~~~ professorCourses ~~~~~~~");
  console.log(professorCourses);
  console.log("~~~~~~~ professorFollowedCourses ~~~~~~~");
  console.log(professorFollowedCourses);
  console.log("~~~~~~~ professorAnnouncements ~~~~~~~");
  console.log(professorAnnouncements);
  console.log("~~~~~~~ professorCourseAnnouncements ~~~~~~~");
  console.log(professorCourseAnnouncements);
};

export const logURegistrarDAO = async () => {
  const allRegistrars = await getAllRegistrars();
  const registrars = await getRegistrars("IT");
  const registrar = await getRegistrar(2);
  const registrarsProfiles = await getRegistrarsProfile("IT");
  const registrarProfile = await getRegistrarProfile(2);

  console.log("~~~~~~~ allRegistrars ~~~~~~~");
  console.log(allRegistrars);
  console.log("~~~~~~~ registrars ~~~~~~~");
  console.log(registrars);
  console.log("~~~~~~~ registrar ~~~~~~~");
  console.log(registrar);
  console.log("~~~~~~~ registrarsProfiles ~~~~~~~");
  console.log(registrarsProfiles);
  console.log("~~~~~~~ registrarProfile ~~~~~~~");
  console.log(registrarProfile);
};
