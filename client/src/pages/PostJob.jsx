import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createJob } from "../api/jobApi";
import { getCompanies } from "../api/companyApi";
import Sidebar from "../components/common/Sidebar";

function PostJob() {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] =
    useState(null);

  const [formData, setFormData] = useState({
    company: "",
    companyWebsite: "",
    jobTitle: "",
    location: "",
    jobType: "Full-time",
    description: "",
    skills: [],
    applyLink: "",
  });

  const [loadingCompanies, setLoadingCompanies] =
    useState(true);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  // ==========================================
  // LOAD COMPANIES
  // ==========================================

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        setLoadingCompanies(true);

        const res = await getCompanies();

        setCompanies(res.companies || []);
      } catch (error) {
        console.error(
          "Load Companies Error:",
          error
        );

        setMessage("Failed to load companies.");
      } finally {
        setLoadingCompanies(false);
      }
    };

    loadCompanies();
  }, []);

  // ==========================================
  // SELECT COMPANY
  // ==========================================

  const handleCompanyChange = (e) => {
    const companyName = e.target.value;

    const company = companies.find(
      (item) => item.name === companyName
    );

    setSelectedCompany(company || null);

    if (!company) {
      setFormData({
        company: "",
        companyWebsite: "",
        jobTitle: "",
        location: "",
        jobType: "Full-time",
        description: "",
        skills: [],
        applyLink: "",
      });

      return;
    }

    setFormData({
      company: company.name,
      companyWebsite: company.website || "",
      jobTitle:
        company.roles?.length > 0
          ? company.roles[0]
          : "",
      location: company.location || "India",
      jobType: "Full-time",
      skills: company.skills || [],
      description: "",
      applyLink: company.website || "",
    });
  };

  // ==========================================
  // SELECT ROLE
  // ==========================================

  const handleRoleChange = (e) => {
    setFormData({
      ...formData,
      jobTitle: e.target.value,
    });
  };

  // ==========================================
  // GENERATE DESCRIPTION
  // ==========================================

  const generateJobDescription = () => {
    if (!selectedCompany) {
      alert("Please select a company first.");
      return;
    }

    if (!formData.jobTitle) {
      alert("Please select a job role first.");
      return;
    }

    const skillsText =
      formData.skills.length > 0
        ? formData.skills
            .map((skill) => `• ${skill}`)
            .join("\n")
        : "• Relevant technical skills";

    const description = `About the Opportunity

${formData.company} is looking for a motivated and talented ${formData.jobTitle} to join its team.

Job Responsibilities

• Work on real-world projects and technical solutions.
• Collaborate with team members and experienced professionals.
• Develop, test, and maintain high-quality applications or systems.
• Learn new technologies and contribute to innovative solutions.
• Solve technical problems efficiently.

Required Skills

${skillsText}

Location

${formData.location || "India"}

Who Can Apply

Candidates with strong problem-solving skills, good communication abilities, and a willingness to learn new technologies are encouraged to apply.

Company Information

Learn more about ${formData.company} through the official company website.`;

    setFormData({
      ...formData,
      description,
    });
  };

  // ==========================================
  // GENERAL INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // SUBMIT JOB
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.company) {
      setMessage("Please select a company.");
      return;
    }

    if (!formData.jobTitle) {
      setMessage("Please select a job role.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await createJob(formData);

      alert("🎉 Job posted successfully!");

      navigate("/recruiter/my-jobs");
    } catch (error) {
      console.error("Post Job Error:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to post job."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">

        <div className="max-w-3xl mx-auto">

          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            ✨ AI Assisted Job Posting
          </h1>

          <p className="text-gray-500 mb-6">
            Select a company and job role. SkillBridge AI
            automatically prepares job details using company
            requirements from the database.
          </p>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-xl shadow"
          >

            {message && (
              <div className="mb-5 bg-red-100 text-red-700 p-4 rounded-lg">
                {message}
              </div>
            )}

            {/* COMPANY */}

            <div className="mb-5">

              <label className="block font-semibold mb-2">
                Select Company *
              </label>

              <select
                value={formData.company}
                onChange={handleCompanyChange}
                required
                disabled={loadingCompanies}
                className="w-full border p-3 rounded-lg"
              >

                <option value="">
                  {loadingCompanies
                    ? "Loading companies..."
                    : "Select a company"}
                </option>

                {companies.map((company) => (
                  <option
                    key={company._id}
                    value={company.name}
                  >
                    {company.name}
                  </option>
                ))}

              </select>

            </div>

            {/* JOB ROLE */}

            <div className="mb-5">

              <label className="block font-semibold mb-2">
                Select Job Role *
              </label>

              {selectedCompany?.roles?.length > 0 ? (

                <select
                  value={formData.jobTitle}
                  onChange={handleRoleChange}
                  required
                  className="w-full border p-3 rounded-lg"
                >

                  <option value="">
                    Select a job role
                  </option>

                  {selectedCompany.roles.map(
                    (role, index) => (
                      <option
                        key={index}
                        value={role}
                      >
                        {role}
                      </option>
                    )
                  )}

                </select>

              ) : (

                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  required
                  className="w-full border p-3 rounded-lg"
                  placeholder="Enter job title"
                />

              )}

            </div>

            {/* LOCATION */}

            <div className="mb-5">

              <label className="block font-semibold mb-2">
                Location
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
              />

            </div>

            {/* JOB TYPE */}

            <div className="mb-5">

              <label className="block font-semibold mb-2">
                Job Type
              </label>

              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
              >

                <option value="Full-time">
                  Full-time
                </option>

                <option value="Internship">
                  Internship
                </option>

                <option value="Part-time">
                  Part-time
                </option>

              </select>

            </div>

            {/* COMPANY WEBSITE */}

            {formData.companyWebsite && (

              <div className="mb-5">

                <label className="block font-semibold mb-2">
                  🌐 Official Company Website
                </label>

                <a
                  href={formData.companyWebsite}
                  target="_blank"
                  rel="noreferrer"
                  className="block bg-blue-50 border border-blue-200 text-blue-700 p-3 rounded-lg hover:bg-blue-100"
                >
                  {formData.companyWebsite}
                </a>

              </div>

            )}

            {/* SKILLS */}

            <div className="mb-5">

              <label className="block font-semibold mb-2">
                Required Skills
              </label>

              <div className="flex flex-wrap gap-2 p-4 bg-blue-50 rounded-lg">

                {formData.skills.length > 0 ? (

                  formData.skills.map(
                    (skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    )
                  )

                ) : (

                  <p className="text-gray-500">
                    Select a company to load skills.
                  </p>

                )}

              </div>

            </div>

            {/* AI GENERATE */}

            <button
              type="button"
              onClick={generateJobDescription}
              disabled={!selectedCompany}
              className="w-full mb-5 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition"
            >
              ✨ Generate Job Description with AI
            </button>

            {/* DESCRIPTION */}

            <div className="mb-6">

              <label className="block font-semibold mb-2">
                AI Generated Job Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="12"
                className="w-full border p-3 rounded-lg"
                placeholder="Click Generate Job Description with AI..."
              />

            </div>

            {/* APPLY LINK */}

            <div className="mb-6">

              <label className="block font-semibold mb-2">
                💼 Application / Careers Link
              </label>

              <input
                type="url"
                name="applyLink"
                value={formData.applyLink}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                placeholder="Company careers or application link"
              />

              <p className="text-sm text-gray-500 mt-2">
                You can use the official company website or
                add a specific careers/application link.
              </p>

            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-bold text-lg transition"
            >

              {loading
                ? "Posting Job..."
                : "🚀 Post Job"}

            </button>

          </form>

        </div>

      </main>

    </div>
  );
}

export default PostJob;