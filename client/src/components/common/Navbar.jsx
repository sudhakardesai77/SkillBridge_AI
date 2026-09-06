import { FaBell, FaUserCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import API from "../../api/axios";

function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          return;
        }

        const res = await API.get("/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Navbar User:", res.data);

        setUser(res.data.data.user);
      } catch (err) {
        console.error("Navbar User Error:", err);
      }
    };

    loadUser();
  }, []);

  // Display role properly
  const displayRole =
    user?.role === "recruiter"
      ? "Recruiter"
      : user?.role === "admin"
      ? "Admin"
      : "Student";

  return (
    <header className="bg-white shadow-sm h-20 px-8 flex items-center justify-between">
      
      {/* Left */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          🚀 SkillBridge AI
        </h1>

        <p className="text-gray-500 text-sm">
          Career Intelligence Platform
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-6">

        {/* Notification */}
        <button className="relative text-2xl text-gray-600 hover:text-blue-600 transition">
          <FaBell />

          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User */}
        <div className="flex items-center gap-3">

          <FaUserCircle className="text-5xl text-blue-600" />

          <div>

            <h2 className="font-bold text-lg">
              {displayRole}
            </h2>

            <p className="text-sm text-gray-500">
              Welcome Back 👋
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Navbar;