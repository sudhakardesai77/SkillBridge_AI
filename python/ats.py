import re

def calculate_ats_score(text):

    score = 0

    strengths = []
    missing = []

    # -----------------------------
    # Contact Information (20)
    # -----------------------------

    if re.search(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", text):
        score += 5
        strengths.append("Professional email found")
    else:
        missing.append("Email missing")

    if re.search(r"\+?\d[\d\s-]{8,}", text):
        score += 5
        strengths.append("Phone number found")
    else:
        missing.append("Phone number missing")

    if "linkedin" in text.lower():
        score += 5
        strengths.append("LinkedIn profile included")
    else:
        missing.append("LinkedIn profile missing")

    if "github" in text.lower():
        score += 5
        strengths.append("GitHub profile included")
    else:
        missing.append("GitHub profile missing")

    # -----------------------------
    # Skills (30)
    # -----------------------------

    skill_keywords = [
        "java",
        "python",
        "c++",
        "c",
        "javascript",
        "react",
        "node",
        "express",
        "mongodb",
        "sql",
        "html",
        "css",
        "docker",
        "aws",
        "git",
        "rest",
        "api",
        "machine learning",
        "dbms",
        "operating systems",
        "computer networks"
    ]

    found = 0

    for skill in skill_keywords:
        if skill.lower() in text.lower():
            found += 1

    score += min(found * 2, 30)

    if found >= 10:
        strengths.append("Strong technical skillset")
    else:
        missing.append("Add more relevant technical skills")

    # -----------------------------
    # Projects (20)
    # -----------------------------

    if "projects" in text.lower():
        score += 20
        strengths.append("Projects section included")
    else:
        missing.append("Projects section missing")

    # -----------------------------
    # Education (10)
    # -----------------------------

    if "education" in text.lower():
        score += 10
        strengths.append("Education section included")
    else:
        missing.append("Education section missing")

    # -----------------------------
    # Resume Length (20)
    # -----------------------------

    words = len(text.split())

    if words > 300:
        score += 20
        strengths.append("Good resume length")
    elif words > 150:
        score += 15
    else:
        missing.append("Resume is too short")

    return {
        "ats_score": score,
        "strengths": strengths,
        "missing": missing
    }