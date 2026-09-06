const mongoose = require("mongoose");
require("dotenv").config();

const Company = require("./models/Company");

const companies = [
  {
    name: "Amazon",
    icon: "amazon",
    minCGPA: 8.0,
    package: "₹28 LPA+",
    location: "Bangalore, Hyderabad, Chennai",
    description:
      "Technology roles focused on scalable systems, software development and problem solving.",
    roles: [
      "Software Development Engineer",
      "SDE Intern",
      "Cloud Engineer",
    ],
    skills: [
      "Java",
      "DSA",
      "DBMS",
      "Operating Systems",
      "Computer Networks",
      "System Design",
    ],
    rounds: [
      "Online Assessment",
      "Technical Interview 1",
      "Technical Interview 2",
      "Bar Raiser / Managerial",
      "HR",
    ],
    resources: [
      "LeetCode",
      "Striver A2Z DSA",
      "System Design Primer",
      "DBMS Notes",
    ],
    website: "https://www.amazon.jobs/",
  },

  {
    name: "Microsoft",
    icon: "microsoft",
    minCGPA: 7.5,
    package: "₹30 LPA+",
    location: "Hyderabad, Bangalore, Noida",
    description:
      "Software engineering opportunities across cloud, applications and developer platforms.",
    roles: [
      "Software Engineer",
      "Software Engineer Intern",
      "Cloud Engineer",
    ],
    skills: [
      "C++",
      "Java",
      "DSA",
      "Algorithms",
      "Operating Systems",
      "System Design",
    ],
    rounds: [
      "Online Coding Test",
      "Technical Interview 1",
      "Technical Interview 2",
      "Managerial Round",
      "HR",
    ],
    resources: [
      "LeetCode",
      "NeetCode",
      "System Design Primer",
    ],
    website: "https://careers.microsoft.com/",
  },

  {
    name: "Google",
    icon: "google",
    minCGPA: 8.5,
    package: "₹40 LPA+",
    location: "Bangalore, Hyderabad",
    description:
      "Engineering roles involving algorithms, distributed systems and large-scale products.",
    roles: [
      "Software Engineer",
      "Software Engineering Intern",
      "Site Reliability Engineer",
    ],
    skills: [
      "DSA",
      "Algorithms",
      "C++",
      "Java",
      "System Design",
      "Problem Solving",
    ],
    rounds: [
      "Online Assessment",
      "Technical Interview",
      "Technical Interview",
      "Googleyness / Behavioral",
    ],
    resources: [
      "LeetCode",
      "CP Handbook",
      "Google Interview Preparation",
    ],
    website:
      "https://www.google.com/about/careers/",
  },

  {
    name: "Infosys",
    icon: "building",
    minCGPA: 6.5,
    package: "₹6–10 LPA",
    location: "Pan India",
    description:
      "Technology and consulting roles for graduate engineers.",
    roles: [
      "Systems Engineer",
      "Digital Specialist Engineer",
      "Technology Analyst",
    ],
    skills: [
      "Java",
      "Python",
      "SQL",
      "DBMS",
      "DSA",
      "Aptitude",
      "Communication",
    ],
    rounds: [
      "Online Assessment",
      "Technical Interview",
      "HR Interview",
    ],
    resources: [
      "IndiaBix",
      "GeeksforGeeks",
      "PrepInsta",
    ],
    website:
      "https://www.infosys.com/careers/",
  },

  {
    name: "TCS Digital",
    icon: "building",
    minCGPA: 7.0,
    package: "₹7–12 LPA",
    location: "Pan India",
    description:
      "Graduate engineering opportunities across software and IT services.",
    roles: [
      "Graduate Engineer Trainee",
      "Assistant System Engineer",
      "Software Engineer",
    ],
    skills: [
      "Java",
      "Python",
      "SQL",
      "DBMS",
      "DSA",
      "Aptitude",
    ],
    rounds: [
      "National Qualifier Test",
      "Technical Interview",
      "Managerial Interview",
      "HR",
    ],
    resources: [
      "TCS Previous Papers",
      "IndiaBix",
      "PrepInsta",
    ],
    website: "https://www.tcs.com/careers",
  },

  {
    name: "Accenture",
    icon: "building",
    minCGPA: 6.5,
    package: "₹6–12 LPA",
    location: "Pan India",
    description:
      "Technology consulting and software development opportunities.",
    roles: [
      "Associate Software Engineer",
      "Application Developer",
      "Analyst",
    ],
    skills: [
      "Java",
      "Python",
      "SQL",
      "DSA",
      "Cloud Computing",
      "Communication",
    ],
    rounds: [
      "Cognitive Assessment",
      "Technical Assessment",
      "Technical Interview",
      "HR Interview",
    ],
    resources: [
      "GeeksforGeeks",
      "IndiaBix",
      "HackerRank",
    ],
    website:
      "https://www.accenture.com/in-en/careers",
  },

  {
    name: "Wipro",
    icon: "building",
    minCGPA: 6.5,
    package: "₹5–10 LPA",
    location: "Pan India",
    description:
      "Software engineering and IT services opportunities.",
    roles: [
      "Project Engineer",
      "Software Engineer",
      "Graduate Engineer",
    ],
    skills: [
      "Java",
      "Python",
      "SQL",
      "DBMS",
      "DSA",
      "Aptitude",
    ],
    rounds: [
      "Online Assessment",
      "Coding Test",
      "Technical Interview",
      "HR",
    ],
    resources: [
      "IndiaBix",
      "GeeksforGeeks",
      "PrepInsta",
    ],
    website:
      "https://careers.wipro.com/",
  },

  {
    name: "Cognizant",
    icon: "building",
    minCGPA: 6.5,
    package: "₹5–10 LPA",
    location: "Chennai, Bangalore, Pune, Hyderabad",
    description:
      "Software development and digital technology opportunities.",
    roles: [
      "Programmer Analyst",
      "Software Engineer",
      "Graduate Engineer",
    ],
    skills: [
      "Java",
      "Python",
      "SQL",
      "DBMS",
      "DSA",
      "Communication",
    ],
    rounds: [
      "Communication Assessment",
      "Aptitude",
      "Technical Interview",
      "HR",
    ],
    resources: [
      "GeeksforGeeks",
      "IndiaBix",
      "HackerRank",
    ],
    website:
      "https://careers.cognizant.com/",
  },

  {
    name: "HCLTech",
    icon: "building",
    minCGPA: 6.5,
    package: "₹5–12 LPA",
    location: "Noida, Chennai, Bangalore",
    description:
      "Technology roles covering software development and enterprise systems.",
    roles: [
      "Software Engineer",
      "Graduate Engineer",
      "Technical Engineer",
    ],
    skills: [
      "Java",
      "C++",
      "Python",
      "SQL",
      "DSA",
      "Cloud Computing",
    ],
    rounds: [
      "Aptitude",
      "Coding Assessment",
      "Technical Interview",
      "HR",
    ],
    resources: [
      "GeeksforGeeks",
      "LeetCode",
      "IndiaBix",
    ],
    website:
      "https://www.hcltech.com/careers",
  },

  {
    name: "Tech Mahindra",
    icon: "building",
    minCGPA: 6.0,
    package: "₹5–10 LPA",
    location: "Pan India",
    description:
      "IT and software engineering roles across multiple technology domains.",
    roles: [
      "Software Engineer",
      "Associate Software Engineer",
      "Graduate Engineer",
    ],
    skills: [
      "Java",
      "Python",
      "SQL",
      "DBMS",
      "DSA",
      "Communication",
    ],
    rounds: [
      "Aptitude",
      "Technical Test",
      "Technical Interview",
      "HR",
    ],
    resources: [
      "IndiaBix",
      "GeeksforGeeks",
      "PrepInsta",
    ],
    website:
      "https://careers.techmahindra.com/",
  },

  {
    name: "Capgemini",
    icon: "building",
    minCGPA: 6.5,
    package: "₹5–10 LPA",
    location: "Pan India",
    description:
      "Technology consulting and software engineering roles.",
    roles: [
      "Analyst",
      "Software Engineer",
      "Associate Consultant",
    ],
    skills: [
      "Java",
      "Python",
      "SQL",
      "DSA",
      "DBMS",
      "Aptitude",
    ],
    rounds: [
      "Aptitude",
      "Coding Test",
      "Technical Interview",
      "HR",
    ],
    resources: [
      "GeeksforGeeks",
      "IndiaBix",
      "HackerRank",
    ],
    website:
      "https://www.capgemini.com/in-en/careers/",
  },

  {
    name: "Deloitte",
    icon: "building",
    minCGPA: 7.0,
    package: "₹8–15 LPA",
    location: "Hyderabad, Bangalore, Pune",
    description:
      "Technology consulting, analytics and software engineering opportunities.",
    roles: [
      "Analyst",
      "Technology Analyst",
      "Software Engineer",
    ],
    skills: [
      "Java",
      "Python",
      "SQL",
      "DBMS",
      "Problem Solving",
      "Communication",
    ],
    rounds: [
      "Aptitude",
      "Technical Assessment",
      "Technical Interview",
      "HR",
    ],
    resources: [
      "GeeksforGeeks",
      "HackerRank",
      "IndiaBix",
    ],
    website:
      "https://www.deloitte.com/careers",
  },

  {
    name: "IBM",
    icon: "building",
    minCGPA: 6.5,
    package: "₹7–14 LPA",
    location: "Bangalore, Hyderabad, Pune",
    description:
      "Software, cloud, AI and enterprise technology roles.",
    roles: [
      "Software Developer",
      "Associate Developer",
      "Cloud Developer",
    ],
    skills: [
      "Java",
      "Python",
      "SQL",
      "Cloud Computing",
      "DSA",
      "DBMS",
    ],
    rounds: [
      "Online Assessment",
      "Coding Test",
      "Technical Interview",
      "HR",
    ],
    resources: [
      "LeetCode",
      "IBM SkillsBuild",
      "GeeksforGeeks",
    ],
    website:
      "https://www.ibm.com/careers",
  },

  {
    name: "Oracle",
    icon: "building",
    minCGPA: 7.0,
    package: "₹10–20 LPA",
    location: "Bangalore, Hyderabad",
    description:
      "Software engineering opportunities across databases, cloud and enterprise systems.",
    roles: [
      "Software Developer",
      "Cloud Engineer",
      "Member Technical Staff",
    ],
    skills: [
      "Java",
      "C++",
      "DSA",
      "DBMS",
      "SQL",
      "System Design",
    ],
    rounds: [
      "Coding Assessment",
      "Technical Interview",
      "Technical Interview",
      "HR",
    ],
    resources: [
      "LeetCode",
      "GeeksforGeeks",
      "Oracle Learning",
    ],
    website:
      "https://www.oracle.com/careers/",
  },

  {
    name: "Adobe",
    icon: "building",
    minCGPA: 7.5,
    package: "₹15–30 LPA",
    location: "Noida, Bangalore",
    description:
      "Engineering roles involving creative software, cloud platforms and large-scale applications.",
    roles: [
      "Computer Scientist",
      "Software Engineer",
      "Software Engineer Intern",
    ],
    skills: [
      "C++",
      "Java",
      "DSA",
      "Algorithms",
      "System Design",
      "OOP",
    ],
    rounds: [
      "Online Assessment",
      "Technical Interview",
      "Technical Interview",
      "Managerial",
    ],
    resources: [
      "LeetCode",
      "GeeksforGeeks",
      "System Design Primer",
    ],
    website:
      "https://www.adobe.com/careers.html",
  },

  {
    name: "Salesforce",
    icon: "building",
    minCGPA: 7.0,
    package: "₹12–25 LPA",
    location: "Hyderabad, Bangalore",
    description:
      "Cloud software engineering and platform development roles.",
    roles: [
      "Software Engineer",
      "Member Technical Staff",
      "Developer",
    ],
    skills: [
      "Java",
      "JavaScript",
      "DSA",
      "SQL",
      "OOP",
      "System Design",
    ],
    rounds: [
      "Online Assessment",
      "Technical Interview",
      "Managerial",
      "HR",
    ],
    resources: [
      "LeetCode",
      "Trailhead",
      "GeeksforGeeks",
    ],
    website:
      "https://www.salesforce.com/company/careers/",
  },

  {
    name: "Walmart Global Tech",
    icon: "building",
    minCGPA: 7.0,
    package: "₹12–25 LPA",
    location: "Bangalore, Chennai",
    description:
      "Engineering roles focused on large-scale commerce and technology systems.",
    roles: [
      "Software Engineer",
      "Software Engineer Intern",
      "Data Engineer",
    ],
    skills: [
      "Java",
      "Python",
      "DSA",
      "SQL",
      "System Design",
      "DBMS",
    ],
    rounds: [
      "Coding Assessment",
      "Technical Interview",
      "Managerial Interview",
      "HR",
    ],
    resources: [
      "LeetCode",
      "GeeksforGeeks",
      "System Design Primer",
    ],
    website:
      "https://tech.walmart.com/content/walmart-global-tech/en_us/careers.html",
  },

  {
    name: "Flipkart",
    icon: "building",
    minCGPA: 7.0,
    package: "₹12–25 LPA",
    location: "Bangalore",
    description:
      "Engineering roles involving large-scale e-commerce systems.",
    roles: [
      "Software Development Engineer",
      "SDE Intern",
      "Backend Engineer",
    ],
    skills: [
      "Java",
      "C++",
      "DSA",
      "Algorithms",
      "System Design",
      "DBMS",
    ],
    rounds: [
      "Online Assessment",
      "Technical Interview",
      "Machine Coding",
      "Managerial",
    ],
    resources: [
      "LeetCode",
      "GeeksforGeeks",
      "System Design Primer",
    ],
    website:
      "https://www.flipkartcareers.com/",
  },

  {
    name: "Zoho",
    icon: "building",
    minCGPA: 6.0,
    package: "₹6–12 LPA",
    location: "Chennai",
    description:
      "Product engineering opportunities across business software products.",
    roles: [
      "Member Technical Staff",
      "Software Developer",
      "Developer",
    ],
    skills: [
      "Java",
      "C++",
      "DSA",
      "OOP",
      "SQL",
      "Problem Solving",
    ],
    rounds: [
      "Aptitude",
      "Programming Round",
      "Technical Interview",
      "HR",
    ],
    resources: [
      "LeetCode",
      "GeeksforGeeks",
      "HackerRank",
    ],
    website:
      "https://www.zoho.com/careers/",
  },

  {
    name: "Paytm",
    icon: "building",
    minCGPA: 7.0,
    package: "₹10–20 LPA",
    location: "Noida, Bangalore",
    description:
      "Software engineering roles across fintech and digital commerce products.",
    roles: [
      "Software Engineer",
      "Backend Developer",
      "SDE Intern",
    ],
    skills: [
      "Java",
      "DSA",
      "SQL",
      "DBMS",
      "System Design",
      "Spring Boot",
    ],
    rounds: [
      "Coding Test",
      "Technical Interview",
      "Managerial",
      "HR",
    ],
    resources: [
      "LeetCode",
      "GeeksforGeeks",
      "System Design Primer",
    ],
    website:
      "https://paytm.com/careers/",
  },

  {
    name: "PhonePe",
    icon: "building",
    minCGPA: 7.0,
    package: "₹12–25 LPA",
    location: "Bangalore",
    description:
      "Engineering roles focused on payments and large-scale financial technology.",
    roles: [
      "Software Engineer",
      "Backend Engineer",
      "SDE Intern",
    ],
    skills: [
      "Java",
      "DSA",
      "System Design",
      "DBMS",
      "SQL",
      "Distributed Systems",
    ],
    rounds: [
      "Online Assessment",
      "Technical Interview",
      "Machine Coding",
      "Managerial",
    ],
    resources: [
      "LeetCode",
      "System Design Primer",
      "GeeksforGeeks",
    ],
    website:
      "https://www.phonepe.com/careers/",
  },

  {
    name: "Atlassian",
    icon: "building",
    minCGPA: 7.5,
    package: "₹20–40 LPA",
    location: "Bangalore",
    description:
      "Product engineering roles involving developer and collaboration tools.",
    roles: [
      "Software Engineer",
      "Backend Engineer",
      "Software Engineer Intern",
    ],
    skills: [
      "Java",
      "Python",
      "DSA",
      "System Design",
      "Algorithms",
      "Distributed Systems",
    ],
    rounds: [
      "Coding Assessment",
      "Technical Interview",
      "System Design",
      "Managerial",
    ],
    resources: [
      "LeetCode",
      "System Design Primer",
      "NeetCode",
    ],
    website:
      "https://www.atlassian.com/company/careers",
  },

  {
    name: "Cisco",
    icon: "building",
    minCGPA: 7.0,
    package: "₹10–20 LPA",
    location: "Bangalore, Pune",
    description:
      "Networking, software and cloud engineering opportunities.",
    roles: [
      "Software Engineer",
      "Network Engineer",
      "Software Engineer Intern",
    ],
    skills: [
      "C++",
      "Java",
      "Computer Networks",
      "Operating Systems",
      "DSA",
      "Linux",
    ],
    rounds: [
      "Online Assessment",
      "Technical Interview",
      "Managerial",
      "HR",
    ],
    resources: [
      "GeeksforGeeks",
      "Cisco Networking Academy",
      "LeetCode",
    ],
    website:
      "https://jobs.cisco.com/",
  },

  {
    name: "JPMorgan Chase",
    icon: "building",
    minCGPA: 7.0,
    package: "₹10–25 LPA",
    location: "Bangalore, Hyderabad, Mumbai",
    description:
      "Technology roles across banking, cloud, software and financial systems.",
    roles: [
      "Software Engineer",
      "Technology Analyst",
      "Software Engineer Intern",
    ],
    skills: [
      "Java",
      "Python",
      "SQL",
      "DSA",
      "DBMS",
      "System Design",
    ],
    rounds: [
      "Online Assessment",
      "Technical Interview",
      "Technical Interview",
      "HR",
    ],
    resources: [
      "LeetCode",
      "HackerRank",
      "GeeksforGeeks",
    ],
    website:
      "https://www.jpmorganchase.com/careers",
  },
];

const seedCompanies = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "MongoDB Connected"
    );

    await Company.deleteMany({});

    await Company.insertMany(
      companies
    );

    console.log(
      `✅ ${companies.length} companies added successfully`
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "❌ Company Seed Error:",
      error.message
    );

    process.exit(1);
  }
};

seedCompanies();