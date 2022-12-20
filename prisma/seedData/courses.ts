import type { Course } from "@prisma/client";

const generateGeoCourses = (startingIdx: number, num: number) => {
  return [...Array(num)].map((_, idx) => {
    return {
      id: startingIdx + idx,
      depId: "GEO",
      title: `Geo Course ${idx + 1}`,
      description: null,
      semester: 4,
      isCompulsory: false,
      isPostgraduate: false,
    };
  });
};

type CourseT = {
  id: Course["id"];
  depId: Course["dep_id"];
  title: Course["title"];
  description: Course["description"];
  semester: Course["semester"];
  isCompulsory: Course["is_compulsory"];
  isPostgraduate: Course["is_postgraduate"];
}[];

export const it_courses: CourseT = [
  {
    id: 1,
    depId: "IT",
    title: "Programming I",
    description: "",
    semester: 1,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 2,
    depId: "IT",
    title: "Programming II",
    description: "",
    semester: 2,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 3,
    depId: "IT",
    title: "Object Oriented Programming",
    description:
      "The course focuses on the understanding and practical mastery of object-oriented concepts such as classes, " +
      "objects, data abstraction, methods, method overloading, inheritance and polymorphism. Practical applications " +
      "in the domain of data science and as seen in stacks, queues, lists, and trees will be examined.",
    semester: 3,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 4,
    depId: "IT",
    title: "Algorithms and Data Structures",
    description:
      "The course focuses on basic and essential topics in data structures, including array-based lists, " +
      "linked lists, skiplists, hash tables, recursion, binary trees, scapegoat trees, red-black trees, heaps, " +
      "sorting algorithms, graphs, and binary trees.",
    semester: 3,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 5,
    depId: "IT",
    title: "Digital Web Services",
    description: "",
    semester: 6,
    isCompulsory: false,
    isPostgraduate: false,
  },
  {
    id: 6,
    depId: "IT",
    title: "Signals and Systems",
    description:
      "Introduction to the fundamentals of continuous and discrete time signal and system analysis. This course " +
      "will cover linear system analysis including impulse response and convolution, Fourier series, Fourier " +
      "transform, sampling, discrete time signal and system analysis, and Z-transforms",
    semester: 6,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 7,
    depId: "IT",
    title: "Cryptography",
    description:
      "Cryptography is an indispensable tool for protecting information in computer systems. In this course you " +
      "will learn the inner workings of cryptographic systems and how to correctly use them in real-world " +
      "applications.",
    semester: 6,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 8,
    depId: "IT",
    title: "Database Systems",
    description:
      "This course is an introduction to the principles underlying the design and implementation of relational " +
      "databases and database management systems. One of the basic skills that will be covered is the use of " +
      "Structured Query Language (SQL), the most common database manipulation language.",
    semester: 2,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 9,
    depId: "IT",
    title: "Operating Systems",
    description:
      "This course examines the important problems in operating system design and implementation. The operating " +
      "system provides an established, convenient, and efficient interface between user programs and the bare " +
      "hardware of the computer on which they run.",
    semester: 4,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 10,
    depId: "IT",
    title: "Artificial Intelligence",
    description:
      "In this course you will learn what Artificial Intelligence (AI) is, explore use cases and applications of " +
      "AI, understand AI concepts and terms like machine learning, deep learning and neural networks. You will be " +
      "exposed to various issues and concerns surrounding AI such as ethics and bias, & jobs.",
    semester: 4,
    isCompulsory: false,
    isPostgraduate: false,
  },
  {
    id: 11,
    depId: "IT",
    title: "Computer Networks",
    description:
      "This course provides an introduction to computer networks, with a special focus on the Internet architecture " +
      "and protocols. Topics include layered network architectures, addressing, naming, forwarding, routing, " +
      "communication reliability, the client-server model, web and email protocols.",
    semester: 4,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 12,
    depId: "IT",
    title: "Discrete Mathematics",
    description:
      "Discrete Mathematics is a branch of mathematics that deals with separable and distinct numbers. " +
      "Combinations, graph theory, and logical statements are included, and numbers can be finite or infinite. " +
      "It's used in computer science to design the apps and programs we use every day. The goal of this course is " +
      "to build the mathematical foundation for computer science courses such as data structures, algorithms, " +
      "relational and database theory, and for mathematics courses such as linear and abstract algebra, " +
      "combinatorics, probability, logic and set theory, and number theory.",
    semester: 2,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 13,
    depId: "IT",
    title: "Statistics",
    description: "",
    semester: 4,
    isCompulsory: false,
    isPostgraduate: false,
  },
  {
    id: 14,
    depId: "IT",
    title: "Probabilities",
    description: "",
    semester: 3,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 15,
    depId: "IT",
    title: "Linear Algebra",
    description: "",
    semester: 1,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 16,
    depId: "IT",
    title: "Optical Communications",
    description: "",
    semester: 6,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 17,
    depId: "IT",
    title: "Computer Simulations",
    description: "",
    semester: 7,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 18,
    depId: "IT",
    title: "Digital Signal Processing",
    description: "",
    semester: 7,
    isCompulsory: false,
    isPostgraduate: false,
  },
  {
    id: 19,
    depId: "IT",
    title: "Machine Learning",
    description: "",
    semester: 5,
    isCompulsory: false,
    isPostgraduate: false,
  },
  {
    id: 20,
    depId: "IT",
    title: "Robotics",
    description: "",
    semester: 6,
    isCompulsory: false,
    isPostgraduate: false,
  },
  {
    id: 21,
    depId: "IT",
    title: "Electronics",
    description: "",
    semester: 1,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 22,
    depId: "IT",
    title: "Wireless Sensor Networking",
    description: "",
    semester: 8,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 23,
    depId: "IT",
    title: "Human-Computer Interaction",
    description: "",
    semester: 5,
    isCompulsory: false,
    isPostgraduate: false,
  },
  {
    id: 24,
    depId: "IT",
    title: "Data Mining",
    description: "",
    semester: 8,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 25,
    depId: "IT",
    title: "Information Systems Security",
    description: "",
    semester: 8,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 26,
    depId: "IT",
    title: "Computer Architecture",
    description: "",
    semester: 3,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 27,
    depId: "IT",
    title: "Computer Graphics",
    description: "",
    semester: 7,
    isCompulsory: false,
    isPostgraduate: false,
  },
  {
    id: 28,
    depId: "IT",
    title: "Web Technologies",
    description: "",
    semester: 4,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 29,
    depId: "IT",
    title: "Distributed Systems",
    description: "",
    semester: 5,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 30,
    depId: "IT",
    title: "Network Programming",
    description: "",
    semester: 5,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 31,
    depId: "IT",
    title: "Mobile Application Development",
    description: "",
    semester: 5,
    isCompulsory: false,
    isPostgraduate: false,
  },
  {
    id: 32,
    depId: "IT",
    title: "Compiler Design",
    description: "",
    semester: 4,
    isCompulsory: false,
    isPostgraduate: false,
  },
  {
    id: 33,
    depId: "IT",
    title: "Telecommunication Systems",
    description: "",
    semester: 5,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 34,
    depId: "IT",
    title: "Thesis",
    description: "",
    semester: 7,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 35,
    depId: "IT",
    title: "Efficient Algorithms for Large-Scale Data Processing",
    description:
      "This course covers a range of topics related to the development and implementation of efficient " +
      "algorithms for handling large volumes of data. These include data structures, computational complexity, " +
      "divide-and-conquer algorithms, streaming algorithms, sketching algorithms, and parallel and distributed " +
      "algorithms. The course will also touch on the various tools and libraries for developing efficient algorithms.",
    semester: 1,
    isCompulsory: false,
    isPostgraduate: true,
  },
  {
    id: 36,
    depId: "IT",
    title: "Natural Language Processing for Sentiment Analysis",
    description:
      "In this course, students will learn about the fundamental concepts and techniques of NLP, including " +
      "language modeling, text classification, and text summarization. They will also learn about advanced " +
      "techniques for sentiment analysis, such as sentiment lexicons, deep learning approaches, and transfer " +
      "learning. The course will cover both supervised and unsupervised approaches to sentiment analysis and " +
      "will introduce students to a variety of tools and libraries for NLP, including Python's Natural Language " +
      "Toolkit (nltk).",
    semester: 1,
    isCompulsory: false,
    isPostgraduate: true,
  },
  {
    id: 37,
    depId: "IT",
    title: "Blockchain Technology and Its Applications",
    description:
      "Blockchain is a decentralized and distributed ledger technology that enables secure and transparent " +
      "record-keeping and transfer of value. This course will cover the fundamental principles and mechanisms " +
      "of blockchain technology, including consensus algorithms, smart contracts, and cryptographic techniques.",
    semester: 1,
    isCompulsory: false,
    isPostgraduate: true,
  },
];

export const geo_courses: CourseT = [
  {
    id: 100,
    depId: "GEO",
    title: "Physical Geography",
    description: null,
    semester: 1,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 101,
    depId: "GEO",
    title: "Historical Geography",
    description: null,
    semester: 1,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 102,
    depId: "GEO",
    title: "Economics Facts for Geographers",
    description: null,
    semester: 1,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 103,
    depId: "GEO",
    title: "Introduction to Computer Science",
    description: null,
    semester: 1,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 104,
    depId: "GEO",
    title: "Introduction to Anthropogeography",
    description: null,
    semester: 1,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 105,
    depId: "GEO",
    title: "Foreign Language I",
    description: null,
    semester: 1,
    isCompulsory: false,
    isPostgraduate: false,
  },
  {
    id: 106,
    depId: "GEO",
    title: "Statistical Analysis for Geographers",
    description: null,
    semester: 2,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 107,
    depId: "GEO",
    title: "Social Geography",
    description: null,
    semester: 2,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 108,
    depId: "GEO",
    title: "Introduction to Cartography",
    description: null,
    semester: 2,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 109,
    depId: "GEO",
    title: "Environment and Man",
    description: null,
    semester: 2,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 110,
    depId: "GEO",
    title: "Academic Skills and Scientific Literature",
    description: null,
    semester: 2,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 111,
    depId: "GEO",
    title: "Foreign Language II",
    description: null,
    semester: 2,
    isCompulsory: false,
    isPostgraduate: false,
  },
  {
    id: 112,
    depId: "GEO",
    title: "Meteorology - Climatology",
    description:
      "The course is a study of the theory and practice of weather analysis and forecasting, surface and upper " +
      "air analysis, fronts and wave cyclones, satellite meteorology, sounding analysis, thermodynamic diagram, " +
      "cross sections, forecasting, NMC models, MOS, radar meteorology, severe weather.",
    semester: 3,
    isCompulsory: true,
    isPostgraduate: false,
  },
  ...generateGeoCourses(113, 35),
];

export const courses: CourseT = [...it_courses, ...geo_courses];
