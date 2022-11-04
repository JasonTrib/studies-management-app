export const INIT_UNDERGRAD_CURRICULUM = [
  { semester: { electives: 0 } },
  { semester: { electives: 0 } },
  { semester: { electives: 0 } },
  { semester: { electives: 0 } },
  { semester: { electives: 0 } },
  { semester: { electives: 0 } },
  { semester: { electives: 0 } },
  { semester: { electives: 0 } },
];

export const INIT_POSTGRAD_CURRICULUM = [
  { semester: { electives: 1 } },
  { semester: { electives: 1 } },
  { semester: { electives: 1 } },
  { semester: { electives: 1 } },
];

export const INIT_REGISTRATION_PERIODS = {
  fallSemester: {
    startDate: new Date(`${new Date().getFullYear()}-09-01`).toISOString(),
    endDate: new Date(`${new Date().getFullYear()}-12-31`).toISOString(),
  },
  springSemester: {
    startDate: new Date(`${new Date().getFullYear()}-02-01`).toISOString(),
    endDate: new Date(`${new Date().getFullYear()}-05-31`).toISOString(),
  },
};
