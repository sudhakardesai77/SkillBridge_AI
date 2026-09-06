import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/axios";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      toast.error("Please fill all required fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      console.log("Register Response:", res.data);

      toast.success("Registration successful!");

      navigate("/");
    } catch (err) {
      console.error("Register Error:", err);

      toast.error(
        err.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg,#2563eb,#4f46e5,#9333ea)",
        padding: "20px",
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
        {/* Logo */}

        <h1
          style={{
            textAlign: "center",
            marginBottom: "10px",
            fontSize: "34px",
            fontWeight: "bold",
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
          Create Your Account
        </p>

        {/* Name */}

        <label>Name</label>

        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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

        {/* Email */}

        <label>Email</label>

        <input
          type="email"
          placeholder="Enter your email"
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

        {/* Password */}

        <label>Password</label>

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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

        {/* Role */}

        <label>Register As</label>

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "10px",
            marginBottom: "25px",
          }}
        >
          {/* Student */}

          <button
            type="button"
            onClick={() => setRole("student")}
            style={{
              flex: 1,
              padding: "13px",
              borderRadius: "10px",
              border:
                role === "student"
                  ? "2px solid white"
                  : "2px solid transparent",
              background:
                role === "student"
                  ? "white"
                  : "rgba(255,255,255,0.2)",
              color:
                role === "student"
                  ? "#2563eb"
                  : "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            🎓 Student
          </button>

          {/* Recruiter */}

          <button
            type="button"
            onClick={() => setRole("recruiter")}
            style={{
              flex: 1,
              padding: "13px",
              borderRadius: "10px",
              border:
                role === "recruiter"
                  ? "2px solid white"
                  : "2px solid transparent",
              background:
                role === "recruiter"
                  ? "white"
                  : "rgba(255,255,255,0.2)",
              color:
                role === "recruiter"
                  ? "#2563eb"
                  : "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            🧑‍💼 Recruiter
          </button>
        </div>

        {/* Selected role */}

        <p
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "14px",
          }}
        >
          Registering as:{" "}
          <strong>
            {role === "recruiter"
              ? "Recruiter"
              : "Student"}
          </strong>
        </p>

        {/* Register Button */}

        <button
          onClick={handleRegister}
          disabled={loading}
          style={{
            width: "100%",
            padding: "15px",
            background: loading
              ? "#bfdbfe"
              : "#ffffff",
            color: "#2563eb",
            border: "none",
            borderRadius: "10px",
            cursor: loading
              ? "not-allowed"
              : "pointer",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        {/* Login */}

        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: "#f3f4f6",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/"
            style={{
              color: "#fff",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;