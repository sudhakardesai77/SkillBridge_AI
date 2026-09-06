import API from "./axios";

export const getSkillGap = async (
  company,
  skills
) => {

  const token = localStorage.getItem("token");

  const res = await API.post(
    "/skill-gap",
    {
      company,
      skills,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};