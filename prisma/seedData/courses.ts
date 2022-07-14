import type { Course, Professor } from "@prisma/client";

export const courses: {
  id: Course["id"];
  title: Course["title"];
  description: Course["description"];
  semester: Course["semester"];
  depId: Course["dep_id"];
  isElective: Course["is_elective"];
  isPostgraduate: Course["is_postgraduate"];
  professorId: Professor["id"];
}[] = [
  {
    id: 1,
    title: "Meteorology - Climatology",
    description:
      "The course is a study of the theory and practice of weather analysis and forecasting, surface and upper " +
      "air analysis, fronts and wave cyclones, satellite meteorology, sounding analysis, thermodynamic diagram, " +
      "cross sections, forecasting, NMC models, MOS, radar meteorology, severe weather.",
    semester: "1",
    depId: "GEO",
    isElective: false,
    isPostgraduate: false,
    professorId: 1,
  },
  {
    id: 2,
    title: "Object Oriented Programming",
    description:
      "The course focuses on the understanding and practical mastery of object-oriented concepts such as classes, " +
      "objects, data abstraction, methods, method overloading, inheritance and polymorphism. Practical applications " +
      "in the domain of data science and as seen in stacks, queues, lists, and trees will be examined.",
    semester: "3",
    depId: "IT",
    isElective: false,
    isPostgraduate: false,
    professorId: 2,
  },
  {
    id: 3,
    title: "Data Structures",
    description:
      "The course focuses on basic and essential topics in data structures, including array-based lists, " +
      "linked lists, skiplists, hash tables, recursion, binary trees, scapegoat trees, red-black trees, heaps, " +
      "sorting algorithms, graphs, and binary trees.",
    semester: "3",
    depId: "IT",
    isElective: false,
    isPostgraduate: false,
    professorId: 2,
  },
  {
    id: 4,
    title: "Cloud Services",
    description:
      "This course provides a hands-on comprehensive study of Cloud concepts and capabilities across the various " +
      "Cloud service models including Infrastructure as a Service (IaaS), Platform as a Service (PaaS), Software as " +
      "a Service (SaaS), and Business Process as a Service (BPaaS).",
    semester: "1",
    depId: "IT",
    isElective: true,
    isPostgraduate: true,
    professorId: 2,
  },
  {
    id: 5,
    title: "Signals and Systems",
    description:
      "Introduction to the fundamentals of continuous and discrete time signal and system analysis. This course " +
      "will cover linear system analysis including impulse response and convolution, Fourier series, Fourier " +
      "transform, sampling, discrete time signal and system analysis, and Z-transforms",
    semester: "5",
    depId: "IT",
    isElective: false,
    isPostgraduate: false,
    professorId: 3,
  },
  {
    id: 6,
    title: "Discrete Mathematics",
    description:
      "Discrete Mathematics is a branch of mathematics that deals with separable and distinct numbers. " +
      "Combinations, graph theory, and logical statements are included, and numbers can be finite or infinite. " +
      "It's used in computer science to design the apps and programs we use every day. The goal of this course is " +
      "to build the mathematical foundation for computer science courses such as data structures, algorithms, " +
      "relational and database theory, and for mathematics courses such as linear and abstract algebra, " +
      "combinatorics, probability, logic and set theory, and number theory.",
    semester: "2",
    depId: "IT",
    isElective: false,
    isPostgraduate: false,
    professorId: 3,
  },
  {
    id: 7,
    title: "Cryptography",
    description:
      "Cryptography is an indispensable tool for protecting information in computer systems. In this course you " +
      "will learn the inner workings of cryptographic systems and how to correctly use them in real-world " +
      "applications.",
    semester: "7",
    depId: "IT",
    isElective: true,
    isPostgraduate: false,
    professorId: 3,
  },
  {
    id: 8,
    title: "Data Bases",
    description:
      "This course is an introduction to the principles underlying the design and implementation of relational " +
      "databases and database management systems. One of the basic skills that will be covered is the use of " +
      "Structured Query Language (SQL), the most common database manipulation language.",
    semester: "2",
    depId: "IT",
    isElective: false,
    isPostgraduate: false,
    professorId: 4,
  },
  {
    id: 9,
    title: "Operating Systems",
    description:
      "This course examines the important problems in operating system design and implementation. The operating " +
      "system provides an established, convenient, and efficient interface between user programs and the bare " +
      "hardware of the computer on which they run.",
    semester: "3",
    depId: "IT",
    isElective: false,
    isPostgraduate: false,
    professorId: 5,
  },
  {
    id: 10,
    title: "Artificial Intelligence",
    description:
      "In this course you will learn what Artificial Intelligence (AI) is, explore use cases and applications of " +
      "AI, understand AI concepts and terms like machine learning, deep learning and neural networks. You will be " +
      "exposed to various issues and concerns surrounding AI such as ethics and bias, & jobs.",
    semester: "4",
    depId: "IT",
    isElective: true,
    isPostgraduate: false,
    professorId: 5,
  },
  {
    id: 11,
    title: "Computer Networks",
    description:
      "This course provides an introduction to computer networks, with a special focus on the Internet architecture " +
      "and protocols. Topics include layered network architectures, addressing, naming, forwarding, routing, " +
      "communication reliability, the client-server model, web and email protocols.",
    semester: "6",
    depId: "IT",
    isElective: true,
    isPostgraduate: false,
    professorId: 5,
  },
];
