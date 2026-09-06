import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import { getProfile, updateProfile } from "../api/profileApi";
import { toast } from "react-toastify";

function Profile() {
  const [form, setForm] = useState({
    name: "",
    college: "",
    branch: "",
    cgpa: "",
    skills: "",
    linkedin: "",
    github: "",
    leetcode: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();

        const user = res.data.user;

        setForm({
          name: user.name || "",
          college: user.college || "",
          branch: user.branch || "",
          cgpa: user.cgpa || "",
          skills: user.skills?.join(", ") || "",
          linkedin: user.linkedin || "",
          github: user.github || "",
          leetcode: user.leetcode || "",
        });
      } catch (err) {
        console.log(err);
        toast.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...form,
        cgpa: Number(form.cgpa),
        skills: form.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill !== ""),
      };

      await updateProfile(payload);

      toast.success("Profile Updated Successfully");
    } catch (err) {
      console.log(err);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="max-w-5xl mx-auto p-8">

          <h1 className="text-3xl font-bold mb-2">
            My Profile
          </h1>

          <p className="text-gray-500 mb-8">
            Keep your profile updated to receive accurate ATS scores,
            eligibility checks, and personalized roadmaps.
          </p>

          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-5">

            <div>
              <label className="font-semibold">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-2"
              />
            </div>

            <div>
              <label className="font-semibold">College</label>
              <input
                type="text"
                name="college"
                value={form.college}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-2"
              />
            </div>

            <div>
              <label className="font-semibold">Branch</label>
              <input
                type="text"
                name="branch"
                value={form.branch}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-2"
              />
            </div>

            <div>
              <label className="font-semibold">CGPA</label>
              <input
                type="number"
                step="0.01"
                name="cgpa"
                value={form.cgpa}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-2"
              />
            </div>

            <div>
              <label className="font-semibold">
                Skills (comma separated)
              </label>
              <textarea
                rows="3"
                name="skills"
                value={form.skills}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-2"
                placeholder="Java, Python, React, SQL"
              />
            </div>

            <div>
              <label className="font-semibold">LinkedIn</label>
              <input
                type="text"
                name="linkedin"
                value={form.linkedin}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-2"
              />
            </div>

            <div>
              <label className="font-semibold">GitHub</label>
              <input
                type="text"
                name="github"
                value={form.github}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-2"
              />
            </div>

            <div>
              <label className="font-semibold">LeetCode</label>
              <input
                type="text"
                name="leetcode"
                value={form.leetcode}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-2"
              />
            </div>

            <div className="pt-4">
              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
              >
                Save Profile
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;