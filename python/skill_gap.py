import json

with open("companies.json", "r") as f:
    COMPANIES = json.load(f)


def analyze_skill_gap(company_name, student_skills):

    student_skill_set = {
    skill.lower()
    for skill in student_skills
    if skill.lower() != "dsa"
}

    company = None

    for c in COMPANIES:
        if c["company"].lower() == company_name.lower():
            company = c
            break

    if company is None:
        return {
            "error": "Company not found"
        }

    matched = []
    missing = []
    recommendations = []

    for skill in company["skills"]:

        if skill.lower() in student_skill_set:
            matched.append(skill)
        else:
            missing.append(skill)

            recommendations.append({
                "skill": skill,
                "priority": "High",
                "reason": f"{company_name} requires this skill."
            })

    match_percentage = round(
        (len(matched) / len(company["skills"])) * 100
    )

    return {
        "company": company_name,
        "skillMatch": match_percentage,
        "matchedSkills": matched,
        "missingSkills": missing,
        "recommendations": recommendations
    }