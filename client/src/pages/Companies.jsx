import { useEffect, useState } from "react";
import {
  useNavigate,
} from "react-router-dom";

import CompanyCard from "../components/common/CompanyCard";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

import {
  getCompanies,
} from "../api/companyApi";

function Companies() {
  const [companies, setCompanies] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const navigate =
    useNavigate();

  // =====================================================
  // LOAD COMPANIES
  // =====================================================

  useEffect(() => {
    const loadCompanies =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await getCompanies();

          setCompanies(
            response.companies || []
          );
        } catch (err) {
          console.error(
            "Companies Error:",
            err
          );

          setError(
            "Failed to load companies."
          );
        } finally {
          setLoading(false);
        }
      };

    loadCompanies();
  }, []);

  // =====================================================
  // FILTER
  // =====================================================

  const filteredCompanies =
    companies.filter(
      (company) =>
        company.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-8">
          <h1 className="text-4xl font-bold mb-2">
            Company Explorer
          </h1>

          <p className="text-gray-500 mb-8">
            Explore companies,
            packages, eligibility,
            skills and hiring
            processes.
          </p>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <input
              type="text"
              placeholder="Search company..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full md:w-96 border rounded-xl p-3 bg-white"
            />

            <div className="bg-white rounded-xl px-5 py-3 text-gray-600">
              <span className="font-semibold">
                {filteredCompanies.length}
              </span>{" "}
              companies
            </div>
          </div>

          {/* Loading */}

          {loading && (
            <div className="bg-white rounded-2xl p-10 text-center">
              <p className="text-gray-500">
                Loading companies...
              </p>
            </div>
          )}

          {/* Error */}

          {!loading && error && (
            <div className="bg-red-50 text-red-600 rounded-2xl p-6">
              {error}
            </div>
          )}

          {/* Empty */}

          {!loading &&
            !error &&
            filteredCompanies.length ===
              0 && (
              <div className="bg-white rounded-2xl p-10 text-center">
                <p className="text-gray-500">
                  No companies found.
                </p>
              </div>
            )}

          {/* Companies */}

          {!loading &&
            !error &&
            filteredCompanies.length >
              0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCompanies.map(
                  (company) => (
                    <CompanyCard
                      key={
                        company._id
                      }
                      company={company}
                      onClick={() =>
                        navigate(
                          `/companies/${encodeURIComponent(
                            company.name
                          )}`
                        )
                      }
                    />
                  )
                )}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default Companies;