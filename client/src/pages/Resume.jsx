import { useEffect, useState } from "react";

import {
  uploadResume,
  deleteResume,
} from "../api/resumeApi";

import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

import { toast } from "react-toastify";

import {
  FaCloudUploadAlt,
  FaFilePdf,
  FaTrash,
  FaEye,
  FaSyncAlt,
} from "react-icons/fa";

import ResumeAnalysisCard from "../components/resume/ResumeAnalysisCard";

import { analyzeResume } from "../api/atsApi";

import API from "../api/axios";


function Resume() {

  // =====================================================
  // STATE
  // =====================================================

  const [file, setFile] = useState(null);

  const [uploading, setUploading] =
    useState(false);

  const [deletingResume, setDeletingResume] =
    useState(false);

  const [resumeData, setResumeData] =
    useState(null);

  const [atsScore, setAtsScore] =
    useState(null);

  const [atsStrengths, setAtsStrengths] =
    useState([]);

  const [currentResume, setCurrentResume] =
    useState(null);


  // =====================================================
  // LOAD CURRENT RESUME
  // =====================================================

  useEffect(() => {

    const loadCurrentResume = async () => {

      try {

        const token =
          localStorage.getItem("token");

        if (!token) {
          return;
        }


        const res = await API.get(
          "/auth/profile",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


        const user =
          res.data?.data?.user;


        // -------------------------------------------------
        // CURRENT RESUME
        // -------------------------------------------------

        if (user?.resume?.url) {

          setCurrentResume(
            user.resume
          );

        } else {

          setCurrentResume(null);

        }


        // -------------------------------------------------
        // PARSED RESUME
        // -------------------------------------------------

        if (user?.resumeData) {

          setResumeData(
            user.resumeData
          );

          // Keep localStorage synchronized
          localStorage.setItem(
            "parsedResume",
            JSON.stringify(
              user.resumeData
            )
          );


          // Keep skills synchronized
          if (
            Array.isArray(
              user.resumeData.skills
            )
          ) {

            localStorage.setItem(
              "resumeSkills",
              JSON.stringify(
                user.resumeData.skills
              )
            );

          }

        }

      } catch (error) {

        console.error(
          "Load Resume Error:",
          error
        );

      }

    };


    loadCurrentResume();

  }, []);


  // =====================================================
  // SELECT PDF
  // =====================================================

  const handleFileChange = (event) => {

    const selectedFile =
      event.target.files?.[0];


    if (!selectedFile) {
      return;
    }


    // -------------------------------------------------
    // PDF VALIDATION
    // -------------------------------------------------

    if (
      selectedFile.type !==
      "application/pdf"
    ) {

      toast.error(
        "Please select a PDF file only."
      );

      event.target.value = "";

      setFile(null);

      return;
    }


    // -------------------------------------------------
    // FILE SIZE VALIDATION
    // 10 MB
    // -------------------------------------------------

    const maxSize =
      10 * 1024 * 1024;


    if (
      selectedFile.size >
      maxSize
    ) {

      toast.error(
        "Resume file must be less than 10 MB."
      );

      event.target.value = "";

      setFile(null);

      return;
    }


    setFile(selectedFile);

  };


  // =====================================================
  // UPLOAD / REPLACE RESUME
  // =====================================================

  const handleUpload = async () => {

    if (!file) {

      toast.error(
        "Please choose a PDF first."
      );

      return;
    }


    try {

      setUploading(true);


      // -------------------------------------------------
      // UPLOAD RESUME
      // -------------------------------------------------

      const res =
        await uploadResume(file);


      console.log(
        "Resume Response:",
        res
      );


      // -------------------------------------------------
      // UPDATE CURRENT RESUME
      // -------------------------------------------------

      if (
        res.data?.resume
      ) {

        setCurrentResume(
          res.data.resume
        );

      }


      // -------------------------------------------------
      // UPDATE PARSED RESUME
      // -------------------------------------------------

      if (
        res.data?.parsedResume
      ) {

        const parsed =
          res.data.parsedResume;


        setResumeData(parsed);


        localStorage.setItem(
          "parsedResume",
          JSON.stringify(parsed)
        );


        // -------------------------------------------------
        // UPDATE RESUME SKILLS
        // -------------------------------------------------

        const skills =
          Array.isArray(parsed.skills)
            ? parsed.skills
            : [];


        localStorage.setItem(
          "resumeSkills",
          JSON.stringify(skills)
        );


        console.log(
          "Parsed Resume:",
          parsed
        );

      }


      // -------------------------------------------------
      // ANALYZE ATS
      // -------------------------------------------------

      try {

        const ats =
          await analyzeResume();


        console.log(
          "ATS:",
          ats
        );


        setAtsScore(
          ats?.ats_score ?? null
        );


        setAtsStrengths(
          Array.isArray(
            ats?.strengths
          )
            ? ats.strengths
            : []
        );

      } catch (atsError) {

        console.error(
          "ATS Analysis Error:",
          atsError
        );


        toast.warning(
          "Resume uploaded, but ATS analysis could not be completed."
        );

      }


      // -------------------------------------------------
      // SUCCESS MESSAGE
      // -------------------------------------------------

      if (
        currentResume
      ) {

        toast.success(
          "Resume replaced successfully!"
        );

      } else {

        toast.success(
          "Resume uploaded successfully!"
        );

      }


      // -------------------------------------------------
      // RESET FILE
      // -------------------------------------------------

      setFile(null);


      const input =
        document.getElementById(
          "resumeInput"
        );


      if (input) {
        input.value = "";
      }

    } catch (error) {

      console.error(
        "Upload Resume Error:",
        error
      );


      toast.error(
        error.response?.data?.message ||
        "Resume upload failed."
      );

    } finally {

      setUploading(false);

    }

  };


  // =====================================================
  // DELETE RESUME
  // =====================================================

  const handleDeleteResume = async () => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete your current resume?\n\nYour parsed resume data and resume skills will also be removed."
      );


    if (!confirmed) {
      return;
    }


    try {

      setDeletingResume(true);


      await deleteResume();


      // -------------------------------------------------
      // CLEAR FRONTEND STATE
      // -------------------------------------------------

      setCurrentResume(null);

      setResumeData(null);

      setAtsScore(null);

      setAtsStrengths([]);


      // -------------------------------------------------
      // CLEAR LOCAL STORAGE
      // -------------------------------------------------

      localStorage.removeItem(
        "parsedResume"
      );

      localStorage.removeItem(
        "resumeSkills"
      );

      localStorage.removeItem(
        "missingSkills"
      );


      // -------------------------------------------------
      // CLEAR SELECTED FILE
      // -------------------------------------------------

      setFile(null);


      const input =
        document.getElementById(
          "resumeInput"
        );


      if (input) {
        input.value = "";
      }


      toast.success(
        "Resume deleted successfully."
      );

    } catch (error) {

      console.error(
        "Delete Resume Error:",
        error
      );


      toast.error(
        error.response?.data?.message ||
        "Failed to delete resume."
      );

    } finally {

      setDeletingResume(false);

    }

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div
      style={{
        display: "flex",
        background: "#f4f7fc",
        minHeight: "100vh",
      }}
    >

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <Sidebar />


      {/* =================================================
          MAIN AREA
      ================================================= */}

      <div
        style={{
          flex: 1,
        }}
      >

        <Navbar />


        <div
          style={{
            padding: "35px",
          }}
        >

          {/* =================================================
              PAGE TITLE
          ================================================= */}

          <h2
            style={{
              marginBottom: "8px",
              fontSize: "24px",
              fontWeight: "700",
            }}
          >
            Resume Upload
          </h2>


          <p
            style={{
              color: "#666",
              marginBottom: "30px",
            }}
          >
            Upload your latest resume to analyze ATS score
            and skills.
          </p>


          {/* =================================================
              MAIN CARD
          ================================================= */}

          <div
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "50px",
              boxShadow:
                "0 8px 25px rgba(0,0,0,0.08)",
              textAlign: "center",
            }}
          >

            {/* =================================================
                UPLOAD ICON
            ================================================= */}

            <FaCloudUploadAlt
              size={75}
              color="#2563EB"
              style={{
                marginBottom: "20px",
              }}
            />


            <h2
              style={{
                marginBottom: "10px",
              }}
            >
              {currentResume
                ? "Replace Resume"
                : "Upload Resume"}
            </h2>


            <p
              style={{
                color: "#777",
                marginBottom: "30px",
              }}
            >
              {currentResume
                ? "Upload a new PDF to replace your current resume."
                : "Upload your resume in PDF format."}
            </p>


            {/* =================================================
                HIDDEN FILE INPUT
            ================================================= */}

            <input
              id="resumeInput"
              type="file"
              accept=".pdf,application/pdf"
              style={{
                display: "none",
              }}
              onChange={
                handleFileChange
              }
            />


            {/* =================================================
                CHOOSE PDF BUTTON
            ================================================= */}

            <label
              htmlFor="resumeInput"
              style={{
                display: "inline-block",
                background:
                  uploading
                    ? "#999"
                    : "#2563EB",
                color: "white",
                padding:
                  "12px 30px",
                borderRadius: "10px",
                cursor:
                  uploading
                    ? "not-allowed"
                    : "pointer",
                fontWeight: "600",
                minWidth: "180px",
                marginBottom: "25px",
              }}
            >
              📄 Choose PDF
            </label>


            {/* =================================================
                SELECTED FILE
            ================================================= */}

            {file && (

              <div
                style={{
                  marginBottom: "25px",
                  padding: "12px 18px",
                  background:
                    "#f0fdf4",
                  borderRadius: "10px",
                  color: "#16a34a",
                  fontWeight: "600",
                  fontSize: "16px",
                  display:
                    "inline-flex",
                  alignItems:
                    "center",
                  gap: "8px",
                }}
              >

                <FaFilePdf
                  color="red"
                />

                <span>
                  {file.name}
                </span>

              </div>

            )}


            {/* =================================================
                CURRENT RESUME
            ================================================= */}

            {currentResume && (

              <div
                style={{
                  background:
                    "#ffffff",
                  borderRadius: "16px",
                  padding: "20px",
                  marginBottom: "25px",
                  boxShadow:
                    "0 5px 18px rgba(0,0,0,0.06)",
                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "space-between",
                  gap: "20px",
                  flexWrap:
                    "wrap",
                  textAlign: "left",
                }}
              >

                {/* ---------------------------------------------
                    RESUME INFO
                --------------------------------------------- */}

                <div>

                  <h3
                    style={{
                      margin: 0,
                      fontSize: "18px",
                      fontWeight: "700",
                    }}
                  >
                    📄 Current Resume
                  </h3>


                  <p
                    style={{
                      margin:
                        "7px 0 0",
                      color: "#666",
                      fontSize: "14px",
                    }}
                  >
                    Your currently active resume
                  </p>


                  {currentResume.uploadedAt && (

                    <p
                      style={{
                        margin:
                          "5px 0 0",
                        color: "#999",
                        fontSize: "13px",
                      }}
                    >
                      Uploaded:{" "}
                      {new Date(
                        currentResume.uploadedAt
                      ).toLocaleDateString()}
                    </p>

                  )}

                </div>


                {/* ---------------------------------------------
                    ACTION BUTTONS
                --------------------------------------------- */}

                <div
                  style={{
                    display: "flex",
                    alignItems:
                      "center",
                    gap: "10px",
                    flexWrap:
                      "wrap",
                  }}
                >

                  {/* VIEW */}

                  <a
                    href={
                      currentResume.url
                    }
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding:
                        "10px 16px",
                      borderRadius:
                        "9px",
                      background:
                        "#eff6ff",
                      color:
                        "#2563eb",
                      textDecoration:
                        "none",
                      fontWeight:
                        "600",
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap: "7px",
                    }}
                  >

                    <FaEye />

                    View Resume

                  </a>


                  {/* DELETE */}

                  <button
                    onClick={
                      handleDeleteResume
                    }
                    disabled={
                      deletingResume ||
                      uploading
                    }
                    style={{
                      padding:
                        "10px 16px",
                      borderRadius:
                        "9px",
                      border: "none",
                      background:
                        deletingResume
                          ? "#aaa"
                          : "#fee2e2",
                      color:
                        "#dc2626",
                      fontWeight:
                        "600",
                      cursor:
                        deletingResume
                          ? "not-allowed"
                          : "pointer",
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap: "7px",
                    }}
                  >

                    <FaTrash />

                    {deletingResume
                      ? "Deleting..."
                      : "Delete Resume"}

                  </button>

                </div>

              </div>

            )}


            {/* =================================================
                UPLOAD / REPLACE BUTTON
            ================================================= */}

            <button
              onClick={
                handleUpload
              }
              disabled={
                uploading ||
                !file
              }
              style={{
                display: "block",
                margin:
                  "0 auto",
                padding:
                  "12px 30px",
                background:
                  uploading ||
                  !file
                    ? "#999"
                    : "#2563EB",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                cursor:
                  uploading ||
                  !file
                    ? "not-allowed"
                    : "pointer",
                fontSize: "16px",
                fontWeight: "600",
                minWidth: "200px",
                display:
                  "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                gap: "8px",
              }}
            >

              {uploading ? (

                <>
                  <FaSyncAlt
                    style={{
                      animation:
                        "spin 1s linear infinite",
                    }}
                  />

                  {currentResume
                    ? "Replacing..."
                    : "Uploading..."}
                </>

              ) : (

                <>
                  ⬆️

                  {currentResume
                    ? "Replace Resume"
                    : "Upload Resume"}
                </>

              )}

            </button>


            {/* =================================================
                HELPER TEXT
            ================================================= */}

            <p
              style={{
                marginTop: "15px",
                color: "#888",
                fontSize: "13px",
              }}
            >
              PDF only • Maximum size 10 MB
            </p>


            {/* =================================================
                AI RESUME DASHBOARD
            ================================================= */}

            {resumeData && (

              <div
                style={{
                  marginTop: "45px",
                  textAlign: "left",
                }}
              >

                <h2
                  style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    marginBottom: "25px",
                  }}
                >
                  🚀 AI Resume Dashboard
                </h2>


                {/* ---------------------------------------------
                    ANALYSIS CARDS
                --------------------------------------------- */}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "20px",
                  }}
                >

                  <ResumeAnalysisCard
                    title="Skills"
                    value={
                      Array.isArray(
                        resumeData.skills
                      )
                        ? resumeData.skills.length
                        : 0
                    }
                    color="#2563EB"
                  />


                  <ResumeAnalysisCard
                    title="Projects"
                    value={
                      Array.isArray(
                        resumeData.projects
                      )
                        ? resumeData.projects.length
                        : 0
                    }
                    color="#16A34A"
                  />


                  <ResumeAnalysisCard
                    title="ATS Score"
                    value={
                      atsScore ??
                      "--"
                    }
                    color="#F97316"
                  />


                  <ResumeAnalysisCard
                    title="Resume"
                    value="Uploaded"
                    color="#9333EA"
                  />

                </div>

              </div>

            )}


            {/* =================================================
                RESUME ANALYSIS
            ================================================= */}

            {resumeData && (

              <div
                style={{
                  marginTop: "40px",
                  textAlign: "left",
                  background:
                    "#f8fafc",
                  borderRadius:
                    "20px",
                  padding:
                    "30px",
                }}
              >

                <h2
                  style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    marginBottom: "25px",
                  }}
                >
                  📄 Resume Analysis
                </h2>


                {/* ---------------------------------------------
                    BASIC INFORMATION
                --------------------------------------------- */}

                <div
                  style={{
                    background:
                      "#ffffff",
                    borderRadius:
                      "15px",
                    padding:
                      "20px",
                    marginBottom:
                      "25px",
                  }}
                >

                  <p
                    style={{
                      marginBottom:
                        "10px",
                    }}
                  >
                    <strong>
                      Name:
                    </strong>{" "}
                    {resumeData.name ||
                      "Not detected"}
                  </p>


                  <p
                    style={{
                      marginBottom:
                        "10px",
                    }}
                  >
                    <strong>
                      Email:
                    </strong>{" "}
                    {resumeData.email ||
                      "Not detected"}
                  </p>


                  <p>
                    <strong>
                      Phone:
                    </strong>{" "}
                    {resumeData.phone ||
                      "Not detected"}
                  </p>

                </div>


                {/* =================================================
                    ATS ANALYSIS
                ================================================= */}

                {atsScore !== null && (

                  <div
                    style={{
                      background:
                        "#ffffff",
                      borderRadius:
                        "15px",
                      padding:
                        "25px",
                      marginBottom:
                        "25px",
                      boxShadow:
                        "0 4px 15px rgba(0,0,0,0.05)",
                    }}
                  >

                    <h2
                      style={{
                        fontSize:
                          "24px",
                        fontWeight:
                          "700",
                        marginBottom:
                          "15px",
                      }}
                    >
                      📊 ATS Analysis
                    </h2>


                    <p
                      style={{
                        fontSize:
                          "48px",
                        fontWeight:
                          "700",
                        color:
                          "#16a34a",
                        marginBottom:
                          "20px",
                      }}
                    >
                      {atsScore}%
                    </p>


                    <h3
                      style={{
                        fontSize:
                          "20px",
                        fontWeight:
                          "700",
                        marginBottom:
                          "12px",
                      }}
                    >
                      Strengths
                    </h3>


                    {atsStrengths.length >
                    0 ? (

                      <ul
                        style={{
                          paddingLeft:
                            "25px",
                        }}
                      >

                        {atsStrengths.map(
                          (
                            item,
                            index
                          ) => (

                            <li
                              key={
                                index
                              }
                              style={{
                                marginBottom:
                                  "8px",
                              }}
                            >
                              {item}
                            </li>

                          )
                        )}

                      </ul>

                    ) : (

                      <p
                        style={{
                          color:
                            "#777",
                        }}
                      >
                        No strengths available.
                      </p>

                    )}

                  </div>

                )}


                {/* =================================================
                    SKILLS
                ================================================= */}

                <div
                  style={{
                    marginTop:
                      "30px",
                  }}
                >

                  <h3
                    style={{
                      fontSize:
                        "22px",
                      fontWeight:
                        "700",
                      marginBottom:
                        "15px",
                    }}
                  >
                    🛠 Skills
                  </h3>


                  {Array.isArray(
                    resumeData.skills
                  ) &&
                  resumeData.skills.length >
                    0 ? (

                    <div
                      style={{
                        display:
                          "flex",
                        flexWrap:
                          "wrap",
                        gap:
                          "10px",
                      }}
                    >

                      {resumeData.skills.map(
                        (
                          skill,
                          index
                        ) => (

                          <span
                            key={
                              `${skill}-${index}`
                            }
                            style={{
                              background:
                                "#dbeafe",
                              color:
                                "#1d4ed8",
                              padding:
                                "8px 15px",
                              borderRadius:
                                "999px",
                              fontWeight:
                                "600",
                              fontSize:
                                "14px",
                            }}
                          >
                            {skill}
                          </span>

                        )
                      )}

                    </div>

                  ) : (

                    <p
                      style={{
                        color:
                          "#777",
                      }}
                    >
                      No skills detected.
                    </p>

                  )}

                </div>


                {/* =================================================
                    PROJECTS
                ================================================= */}

                <div
                  style={{
                    marginTop:
                      "30px",
                  }}
                >

                  <h3
                    style={{
                      fontSize:
                        "22px",
                      fontWeight:
                        "700",
                      marginBottom:
                        "15px",
                    }}
                  >
                    💼 Projects
                  </h3>


                  {Array.isArray(
                    resumeData.projects
                  ) &&
                  resumeData.projects.length >
                    0 ? (

                    <ul
                      style={{
                        paddingLeft:
                          "25px",
                      }}
                    >

                      {resumeData.projects.map(
                        (
                          project,
                          index
                        ) => (

                          <li
                            key={
                              `${project}-${index}`
                            }
                            style={{
                              marginBottom:
                                "8px",
                            }}
                          >
                            {project}
                          </li>

                        )
                      )}

                    </ul>

                  ) : (

                    <p
                      style={{
                        color:
                          "#777",
                      }}
                    >
                      No projects detected.
                    </p>

                  )}

                </div>

              </div>

            )}

          </div>

        </div>

      </div>


      {/* =================================================
          SPINNING ANIMATION
      ================================================= */}

      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>

    </div>

  );
}


export default Resume;