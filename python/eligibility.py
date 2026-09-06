import json

with open("companies.json", "r") as f:
    COMPANIES = json.load(f)


def check_eligibility(student_cgpa, student_skills):

    results = []

    student_skill_set = {skill.lower() for skill in student_skills}

    for company in COMPANIES:

        matched = []

        missing = []

        for skill in company["skills"]:

            if skill.lower() in student_skill_set:
                matched.append(skill)
            else:
                missing.append(skill)

        eligible = (
            student_cgpa >= company["minCGPA"]
            and len(missing) == 0
        )

        match_percentage = round(
            (len(matched) / len(company["skills"])) * 100
        )

        results.append({
            "company": company["company"],
            "eligible": eligible,
            "cgpaRequired": company["minCGPA"],
            "cgpaEligible": student_cgpa >= company["minCGPA"],
            "matchedSkills": matched,
            "missingSkills": missing,
            "matchPercentage": match_percentage
        })

    return results