import {
  FaAmazon,
  FaMicrosoft,
  FaGoogle,
  FaBuilding,
} from "react-icons/fa";

export const companies = [
  {
    id: 1,
    name: "Amazon",
    icon: FaAmazon,
    minCGPA: 8,
    package: "₹28 LPA",
    location: "Hyderabad, Bangalore",

    skills: [
      "Java",
      "DSA",
      "DBMS",
      "Operating Systems",
      "Computer Networks",
    ],

    rounds: [
      "Online Assessment",
      "Technical Interview 1",
      "Technical Interview 2",
      "HR Interview",
    ],

    resources: [
      "Striver A2Z DSA",
      "LeetCode Top 150",
      "DBMS Notes",
      "OS Notes",
    ],
  },

  {
    id: 2,
    name: "Microsoft",
    icon: FaMicrosoft,
    minCGPA: 7.5,
    package: "₹45 LPA",
    location: "Hyderabad, Noida",

    skills: [
      "C++",
      "Java",
      "DSA",
      "System Design",
    ],

    rounds: [
      "Online Coding Test",
      "Technical Interview",
      "Managerial Round",
      "HR Round",
    ],

    resources: [
      "NeetCode",
      "LeetCode",
      "System Design Primer",
    ],
  },

  {
    id: 3,
    name: "Google",
    icon: FaGoogle,
    minCGPA: 8.5,
    package: "₹60 LPA",
    location: "Bangalore",

    skills: [
      "DSA",
      "Algorithms",
      "Problem Solving",
      "System Design",
    ],

    rounds: [
      "Google OA",
      "Coding Interview",
      "Googlyness Round",
    ],

    resources: [
      "Google Interview Prep",
      "LeetCode",
      "CP Handbook",
    ],
  },

  {
    id: 4,
    name: "Infosys",
    icon: FaBuilding,
    minCGPA: 6.5,
    package: "₹8 LPA",
    location: "Pan India",

    skills: [
      "Java",
      "SQL",
      "Aptitude",
      "Communication",
    ],

    rounds: [
      "Online Test",
      "Technical",
      "HR",
    ],

    resources: [
      "PrepInsta",
      "IndiaBix",
    ],
  },

  {
    id: 5,
    name: "TCS Digital",
    icon: FaBuilding,
    minCGPA: 7,
    package: "₹7 LPA",
    location: "Pan India",

    skills: [
      "Java",
      "DSA",
      "SQL",
      "Aptitude",
    ],

    rounds: [
      "Online Assessment",
      "Technical Interview",
      "Managerial Interview",
    ],

    resources: [
      "TCS Previous Papers",
      "PrepInsta",
    ],
  },
];