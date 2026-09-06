import {
  useEffect,
  useState,
} from "react";

import CompanyCard from "./CompanyCard";

import {
  getCompanies,
} from "../../api/companyApi";

function CompanySelector({
  onSelect,
}) {
  const [companies, setCompanies] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadCompanies =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await getCompanies();

          console.log(
            "Companies loaded:",
            response.companies
          );

          setCompanies(
            response.companies || []
          );
        } catch (err) {
          console.error(
            "Company Selector Error:",
            err
          );

          setError(
            err?.response?.data?.message ||
              "Failed to load companies."
          );
        } finally {
          setLoading(false);
        }
      };

    loadCompanies();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center">
        <p className="text-gray-500">
          Loading companies...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-6">
        <p className="font-semibold">
          {error}
        </p>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center">
        <p className="text-gray-500">
          No companies found.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {companies.map(
        (company) => (
          <CompanyCard
            key={company._id}
            company={company}
            onClick={onSelect}
          />
        )
      )}
    </div>
  );
}

export default CompanySelector;