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
    description:
      "Statistics covers the mathematical principles and techniques used to analyze and interpret data. " +
      "The course material includes topics such as probability theory, statistical distributions, hypothesis " +
      "testing, regression analysis, and data visualization. This course can be applied in a variety of fields, " +
      "including data science, machine learning, economics, and business.",
    semester: 4,
    isCompulsory: false,
    isPostgraduate: false,
  },
  {
    id: 14,
    depId: "IT",
    title: "Probabilities",
    description:
      "Probabilities focuses on the mathematics of uncertainty and the ways in which probabilities can " +
      "be used to model and analyze real-world situations. The course material includes topics such as probability " +
      "theory, statistical distributions, and stochastic processes. This course is relevant to a wide range of " +
      "fields, including computer science, data science, machine learning, economics, and finance, and has a " +
      "significant impact on many aspects of modern society, including the development of new technologies and the " +
      "making of informed decisions in various industries.",
    semester: 3,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 15,
    depId: "IT",
    title: "Linear Algebra",
    description:
      "Linear Algebra is a branch of mathematics that deals with vector spaces and linear transformations between those spaces. It is a fundamental mathematical discipline that has a wide range of applications in various fields, including computer science, engineering, and physics. The course material of a Linear Algebra course typically includes topics such as vector algebra, matrix operations, systems of linear equations, eigenvalues and eigenvectors, and abstract vector spaces. Students taking this course will learn how to manipulate and analyze linear equations and matrices, and how to use these concepts to solve real-world problems. Linear algebra is an important subject that is essential for students interested in pursuing further studies in mathematics and related fields.",
    semester: 1,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 16,
    depId: "IT",
    title: "Optical Communications",
    description:
      "Optical Communications is a course that focuses on the use of light waves to transmit information over long distances. This technology plays a crucial role in modern communication systems, including the internet and satellite networks. The course material for an Optical Communications course covers topics such as the principles of light propagation, fiber optic transmission, optoelectronic devices, wavelength division multiplexing, and error correction techniques.",
    semester: 6,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 17,
    depId: "IT",
    title: "Computer Simulations",
    description:
      "Computer Simulations is a course that teaches students how to use computers to model and analyze complex systems. This subject is widely applicable in various fields, including engineering, science, economics, and business. The course material for a Computer Simulations course includes topics such as modeling methodologies, numerical techniques, programming concepts, and visualization techniques.",
    semester: 7,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 18,
    depId: "IT",
    title: "Digital Signal Processing",
    description:
      "Digital Signal Processing is a field of study that focuses on the analysis and manipulation of digital signals using mathematical and computational techniques. Digital signals are used to represent and transmit information in a variety of applications, including audio, video, and communication systems. Students who study Digital Signal Processing will learn about topics such as discrete-time signals and systems, Fourier analysis, filter design, and signal processing algorithms.",
    semester: 7,
    isCompulsory: false,
    isPostgraduate: false,
  },
  {
    id: 19,
    depId: "IT",
    title: "Machine Learning",
    description:
      "Machine learning is a field of computer science that involves the development of algorithms and models that enable computers to learn and improve their performance on a specific task without explicit programming. These techniques are widely used in a variety of applications, including image and speech recognition, natural language processing, and predictive analytics. Machine learning requires a strong foundation in mathematics and computer science and has significant practical applications in many areas.",
    semester: 5,
    isCompulsory: false,
    isPostgraduate: false,
  },
  {
    id: 20,
    depId: "IT",
    title: "Robotics",
    description:
      "Robotics is a field that deals with the design, construction, operation, and application of robots. Robots are automated machines that can be programmed to perform a variety of tasks, including manufacturing, assembly, transportation, inspection, and surgery. Robotics combines principles from engineering, computer science, and neuroscience to develop intelligent machines that can interact with the physical world.",
    semester: 6,
    isCompulsory: false,
    isPostgraduate: false,
  },
  {
    id: 21,
    depId: "IT",
    title: "Electronics",
    description:
      "Electronics is a field that deals with the design, construction, and operation of electronic devices and systems. Electronics involves the use of electrical circuits to process and transmit information, control systems, and power devices. It is an essential field in modern technology and has applications in a wide range of industries, including telecommunications, computing, transportation, and medicine.",
    semester: 1,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 22,
    depId: "IT",
    title: "Wireless Sensor Networking",
    description:
      "Wireless sensor networking involves the use of small, wireless devices called sensors that are deployed to monitor various conditions or phenomena and transmit the data they collect back to a central location for analysis. These networks can be used in a wide range of applications, including environmental monitoring, industrial automation, and security systems.",
    semester: 8,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 23,
    depId: "IT",
    title: "Human-Computer Interaction",
    description:
      "Human-computer interaction (HCI) refers to the study of how people interact with computers and technology. It encompasses the design and evaluation of user interfaces, as well as the development of new technologies that improve the user experience. HCI is an interdisciplinary field that combines elements of computer science, psychology, and design.",
    semester: 5,
    isCompulsory: false,
    isPostgraduate: false,
  },
  {
    id: 24,
    depId: "IT",
    title: "Data Mining",
    description:
      "Data mining is the process of analyzing large sets of data to discover patterns and trends. It involves using specialized algorithms and software to search for and extract insights from data, and is often used in business, science, and other fields to make informed decisions and predictions. Data mining can be applied to various types of data, including text, images, and numerical data.",
    semester: 8,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 25,
    depId: "IT",
    title: "Information Systems Security",
    description:
      "Information systems security refers to the practice of protecting computer systems, networks, and the data they store from unauthorized access or attacks. It involves the use of various technologies, policies, and procedures to secure systems and protect against threats such as malware, hackers, and data breaches. Information systems security is critical for businesses, organizations, and individuals to ensure the confidentiality, integrity, and availability of their systems and data.",
    semester: 8,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 26,
    depId: "IT",
    title: "Computer Architecture",
    description:
      "Computer architecture refers to the design and organization of computer systems. It encompasses the hardware components of a computer, such as the processor, memory, and input/output devices, as well as the relationships between these components and the way they interact. Computer architecture also includes the design of the instruction set, which defines the operations that the processor can perform, and the system architecture, which defines how the hardware components work together to perform those operations. Understanding computer architecture is important for designing and optimizing computer systems for specific tasks and environments.",
    semester: 3,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 27,
    depId: "IT",
    title: "Computer Graphics",
    description:
      "Computer graphics is the field of study that deals with generating and manipulating images and video using computers. It involves using specialized software and algorithms to create and display visual content, such as 2D and 3D graphics, animation, and visual effects. Computer graphics is used in a wide range of applications, including video games, movies, scientific visualization, and user interface design.",
    semester: 7,
    isCompulsory: false,
    isPostgraduate: false,
  },
  {
    id: 28,
    depId: "IT",
    title: "Web Technologies",
    description:
      "Web technologies refer to the tools, languages, and frameworks that are used to build and maintain websites and web-based applications. They include HTML, CSS, and JavaScript for building the front-end user interface, as well as server-side technologies such as PHP, Ruby, and Java for building the back-end logic and functionality. Web technologies also include database systems, cloud computing platforms, and content management systems, which are used to store, manage, and deliver web content and data. Web technologies are constantly evolving and are critical for building and maintaining modern, interactive, and responsive websites and web-based applications.",
    semester: 4,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 29,
    depId: "IT",
    title: "Distributed Systems",
    description:
      "Distributed systems are computer systems that consist of multiple interconnected computers that work together to perform a common task or service. These systems are designed to be distributed across multiple locations, often connected via a network, and are designed to be fault-tolerant and scalable. Distributed systems are used in a variety of applications, including cloud computing, distributed databases, and distributed file systems. They require specialized algorithms and protocols to ensure coordination and communication between the distributed components, and to handle issues such as fault tolerance and data consistency.",
    semester: 5,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 30,
    depId: "IT",
    title: "Network Programming",
    description:
      "Network programming refers to the use of programming languages and APIs to build applications that communicate over a network. It involves developing client-server applications, using protocols such as HTTP, TCP, and UDP to exchange data and communicate with other systems. Network programming also includes the development of distributed systems, which are systems that consist of multiple interconnected computers working together to perform a common task or service.",
    semester: 5,
    isCompulsory: true,
    isPostgraduate: false,
  },
  {
    id: 31,
    depId: "IT",
    title: "Mobile Application Development",
    description:
      "The course 'Mobile Application Development' is concerned with the process of creating software applications for mobile devices, such as smartphones and tablets. It covers topics such as mobile platform development environments, mobile user interface design, and mobile application development frameworks. The course also covers topics such as mobile security, device hardware and sensors, and the development of mobile web applications. The goal of the course is to provide students with the knowledge and skills needed to design and develop mobile apps for various platforms.",
    semester: 5,
    isCompulsory: false,
    isPostgraduate: false,
  },
  {
    id: 32,
    depId: "IT",
    title: "Compiler Design",
    description:
      "Compiler design is the field of study that deals with the creation of compilers, which are software programs that translate source code written in a high-level programming language into machine code that can be executed by a computer. Compiler design involves the analysis of source code, the design of data structures and algorithms to represent and manipulate the code, and the generation of machine code that implements the source code. ",
    semester: 4,
    isCompulsory: false,
    isPostgraduate: false,
  },
  {
    id: 33,
    depId: "IT",
    title: "Telecommunication Systems",
    description:
      "Telecommunication systems are networks of devices and infrastructure that are used to transmit information over distances using various communication technologies, such as telephone lines, radio waves, and satellite systems. They enable the transmission of voice, data, and multimedia content.",
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
