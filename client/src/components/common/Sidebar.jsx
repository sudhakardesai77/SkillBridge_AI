import {
  FaHome,
  FaFileUpload,
  FaChartBar,
  FaBuilding,
  FaTools,
  FaRoad,
  FaUser,
  FaSignOutAlt,
  FaMicrophone,
  FaHistory,
  FaCode,
  FaBriefcase,
  FaUsers,
  FaClipboardList,
  FaPlusCircle,
} from "react-icons/fa";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";


function Sidebar() {
  const navigate = useNavigate();


  // ================= GET USER ROLE =================

  const storedUser =
    localStorage.getItem("user");

  let user = null;

  try {

    user = storedUser
      ? JSON.parse(storedUser)
      : null;

  } catch (error) {

    console.error(
      "Invalid stored user:",
      error
    );

  }


  const role =
    user?.role || "student";


  // ================= LOGOUT =================

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    localStorage.removeItem(
      "parsedResume"
    );

    localStorage.removeItem(
      "missingSkills"
    );

    localStorage.removeItem(
      "resumeSkills"
    );

    navigate("/");

  };


  // ================= STUDENT MENU =================

  const studentMenu = [

    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaHome />,
    },

    {
      name: "Resume",
      path: "/resume",
      icon: <FaFileUpload />,
    },

    {
      name: "ATS Score",
      path: "/ats",
      icon: <FaChartBar />,
    },

    {
      name: "Eligibility",
      path: "/eligibility",
      icon: <FaBuilding />,
    },

    {
      name: "Skill Gap",
      path: "/skill-gap",
      icon: <FaTools />,
    },

    {
      name: "Roadmap",
      path: "/roadmap",
      icon: <FaRoad />,
    },

    {
      name: "Jobs & Internships",
      path: "/jobs",
      icon: <FaBriefcase />,
    },

    {
      name: "Saved Jobs",
      path: "/saved-jobs",
      icon: <FaBriefcase />,
    },

    {
      name: "Companies",
      path: "/companies",
      icon: <FaBuilding />,
    },

    {
      name: "Coding Tracker",
      path: "/coding-tracker",
      icon: <FaCode />,
    },

    {
      name: "Mock Interview",
      path: "/mock-interview",
      icon: <FaMicrophone />,
    },

    {
      name: "Interview History",
      path: "/interview-history",
      icon: <FaHistory />,
    },

    {
      name: "My Applications",
      path: "/my-applications",
      icon: <FaClipboardList />,
    },

    {
      name: "Profile",
      path: "/profile",
      icon: <FaUser />,
    },

  ];


  // ================= RECRUITER MENU =================

  const recruiterMenu = [

    {
      name: "Recruiter Dashboard",
      path: "/recruiter-dashboard",
      icon: <FaHome />,
    },

    {
      name: "Post Job",
      path: "/recruiter/post-job",
      icon: <FaPlusCircle />,
    },

    {
      name: "My Jobs",
      path: "/recruiter/my-jobs",
      icon: <FaBriefcase />,
    },

  ];


  // ================= ADMIN MENU =================

  const adminMenu = [

    {
      name: "Admin Dashboard",
      path: "/admin-dashboard",
      icon: <FaHome />,
    },

    {
      name: "Users",
      path: "/admin/users",
      icon: <FaUsers />,
    },

    {
      name: "Jobs",
      path: "/admin/jobs",
      icon: <FaBriefcase />,
    },

    {
      name: "Applications",
      path: "/admin/applications",
      icon: <FaClipboardList />,
    },

    {
      name: "Analytics",
      path: "/admin/analytics",
      icon: <FaChartBar />,
    },

  ];


  // ================= SELECT MENU =================

  let menu = studentMenu;

  if (role === "recruiter") {
    menu = recruiterMenu;
  }

  if (role === "admin") {
    menu = adminMenu;
  }


  // ================= ROLE LABEL =================

  const getRoleLabel = () => {

    if (role === "admin") {
      return "Administrator";
    }

    if (role === "recruiter") {
      return "Recruiter";
    }

    return "Student";

  };


  // ================= UI =================

  return (

    <aside className="w-72 min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 text-white flex flex-col">


      {/* ================= LOGO ================= */}

      <div className="p-8 border-b border-blue-500">

        <h1 className="text-4xl font-extrabold text-center">
          🚀
        </h1>

        <h2 className="text-3xl font-bold text-center mt-2">
          SkillBridge AI
        </h2>

        <p className="text-center text-blue-200 text-sm mt-2">
          Career Intelligence Platform
        </p>

      </div>


      {/* ================= ROLE ================= */}

      <div className="px-5 pt-5">

        <div className="bg-blue-800/70 rounded-xl px-4 py-3">

          <p className="text-blue-200 text-xs uppercase tracking-wide">
            Logged in as
          </p>

          <p className="font-semibold mt-1">
            {getRoleLabel()}
          </p>

        </div>

      </div>


      {/* ================= NAVIGATION ================= */}

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">

        {menu.map((item) => (

          <NavLink
            key={item.path}
            to={item.path}

            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-white text-blue-800 font-semibold shadow-md"
                  : "hover:bg-blue-600"
              }`
            }
          >

            <span className="text-lg">
              {item.icon}
            </span>

            <span>
              {item.name}
            </span>

          </NavLink>

        ))}

      </nav>


      {/* ================= LOGOUT ================= */}

      <div className="p-4 border-t border-blue-500">

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 py-3 rounded-xl font-semibold transition"
        >

          <FaSignOutAlt />

          Logout

        </button>

      </div>


    </aside>

  );
}

export default Sidebar;