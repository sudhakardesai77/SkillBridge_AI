import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      // ================= LOGIN =================

      const res = await API.post("/auth/login", {
        email,
        password,
      });

      console.log("Login Response:", res.data);

      // ================= SAVE TOKEN =================

      const token = res.data.data.token;

      localStorage.setItem("token", token);

      // ================= GET USER PROFILE =================

      const profileResponse = await API.get("/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = profileResponse.data.data.user;

      // ================= SAVE USER =================

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      console.log("Logged in user:", user);
      console.log("Role:", user.role);

      toast.success("Login Successful!");

      // ================= ROLE BASED REDIRECT =================

      if (user.role === "recruiter") {
        navigate("/recruiter-dashboard");
      } else if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      console.error("Login Error:", err);

      toast.error(
        err.response?.data?.message || "Login Failed"
      );
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg,#2563eb,#4f46e5,#9333ea)",
      }}
    >
      <div
        style={{
          width: "420px",
          padding: "40px",
          borderRadius: "20px",
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(15px)",
          boxShadow: "0 15px 35px rgba(0,0,0,0.25)",
          color: "white",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "10px",
            fontSize: "34px",
          }}
        >
          🚀 SkillBridge AI
        </h1>

        <p
          style={{
            textAlign: "center",
            opacity: 0.9,
            marginBottom: "30px",
          }}
        >
          Welcome Back
        </p>

        <label>Email</label>

        <input
          type="email"
          placeholder="Enter your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            marginTop: "8px",
            marginBottom: "20px",
            borderRadius: "10px",
            border: "none",
            outline: "none",
            fontSize: "16px",
            boxSizing: "border-box",
          }}
        />

        <label>Password</label>

        <div
          style={{
            position: "relative",
            marginTop: "8px",
            marginBottom: "25px",
          }}
        >
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "10px",
              border: "none",
              outline: "none",
              fontSize: "16px",
              boxSizing: "border-box",
              paddingRight: "50px",
            }}
          />

          <span
            onClick={() =>
              setShowPassword(!showPassword)
            }
            style={{
              position: "absolute",
              right: "15px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#555",
              fontSize: "18px",
            }}
          >
            {showPassword ? (
              <FaEyeSlash />
            ) : (
              <FaEye />
            )}
          </span>
        </div>

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "15px",
            background: "#ffffff",
            color: "#2563eb",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "18px",
            fontWeight: "bold",
            transition: "0.3s",
          }}
          onMouseOver={(e) => {
            e.target.style.background = "#dbeafe";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "#ffffff";
          }}
        >
          Login
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: "#f3f4f6",
          }}
        >
          Don't have an account?{" "}

          <Link
            to="/register"
            style={{
              color: "#fff",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;