import { useEffect, useState } from "react";

import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

import CompanyCard from "../components/eligibility/CompanyCard";
import { getEligibility } from "../api/eligibilityApi";

function Eligibility() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEligibility = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await getEligibility();

        console.log("Eligibility Response:", res);

        if (res.success) {
          setCompanies(res.companies || []);
        } else {
          setError("Unable to load company eligibility.");
        }
      } catch (err) {
        console.error("Eligibility Error:", err);

        if (err.response) {
          console.error(
            "Server Response:",
            err.response.data
          );
        }

        setError("Failed to load company eligibility.");
      } finally {
        setLoading(false);
      }
    };

    loadEligibility();
  }, []);

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />

        <div className="flex-1">
          <Navbar />

          <div className="flex justify-center items-center min-h-[80vh]">
            <h1 className="text-3xl font-bold text-blue-600">
              Checking Company Eligibility...
            </h1>
          </div>
        </div>
      </div>
    );
  }

  // ================= ERROR =================

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />

        <div className="flex-1">
          <Navbar />

          <div className="p-8">
            <div className="bg-white rounded-2xl shadow p-8 text-center">

              <h1 className="text-3xl font-bold text-red-600">
                Eligibility Error
              </h1>

              <p className="mt-4 text-gray-600">
                {error}
              </p>

            </div>
          </div>
        </div>
      </div>
    );
  }

  // ================= PAGE =================

  return (
    <div className="flex min-h-screen bg-gray-100">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <div className="p-8 max-w-7xl mx-auto">

          {/* ================= HEADER ================= */}

          <div className="mb-8">

            <h1 className="text-4xl font-bold">
              Company Eligibility
            </h1>

            <p className="text-gray-500 mt-2">
              Check which companies you are eligible for
              based on your CGPA and skills.
            </p>

          </div>

          {/* ================= SUMMARY ================= */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            <div className="bg-white rounded-2xl shadow-md p-6">

              <p className="text-gray-500">
                Total Companies
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {companies.length}
              </h2>

            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">

              <p className="text-gray-500">
                Eligible
              </p>

              <h2 className="text-3xl font-bold text-green-600 mt-2">
                {
                  companies.filter(
                    (company) =>
                      company.eligible === true
                  ).length
                }
              </h2>

            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">

              <p className="text-gray-500">
                Not Eligible
              </p>

              <h2 className="text-3xl font-bold text-red-600 mt-2">
                {
                  companies.filter(
                    (company) =>
                      company.eligible === false
                  ).length
                }
              </h2>

            </div>

          </div>

          {/* ================= NO DATA ================= */}

          {companies.length === 0 ? (

            <div className="bg-white rounded-2xl shadow-md p-10 text-center">

              <h2 className="text-2xl font-bold">
                No Company Data
              </h2>

              <p className="text-gray-500 mt-2">
                We could not find any company eligibility
                information.
              </p>

            </div>

          ) : (

            /* ================= COMPANY CARDS ================= */

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {companies.map((company, index) => (

                <CompanyCard
                  key={
                    company.company ||
                    company.name ||
                    index
                  }
                  company={company}
                />

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Eligibility;