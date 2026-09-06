from roadmap import generate_roadmap
from flask import Flask, request, jsonify

from parser import parse_resume
from ats import calculate_ats_score
from eligibility import check_eligibility
from skill_gap import analyze_skill_gap

app = Flask(__name__)


# =====================================================
# HEALTH
# =====================================================

@app.route("/health")
def health():

    return jsonify({
        "success": True,
        "message": "Python Resume Service Running"
    })


# =====================================================
# PARSE RESUME
# =====================================================

@app.route("/parse", methods=["POST"])
def parse():

    if "resume" not in request.files:

        return jsonify({
            "success": False,
            "message": "No resume uploaded"
        }), 400

    try:

        resume = parse_resume(
            request.files["resume"]
        )

        print("====================================")
        print("RESUME PARSING RESULT")
        print("Name:", resume.get("name"))
        print("Email:", resume.get("email"))
        print("College:", resume.get("college"))
        print("Branch:", resume.get("branch"))
        print("CGPA:", resume.get("cgpa"))
        print("Skills:", resume.get("skills"))
        print("====================================")

        return jsonify({
            "success": True,
            "data": {
                "name": resume.get("name", ""),
                "email": resume.get("email", ""),
                "phone": resume.get("phone", ""),
                "college": resume.get("college", ""),
                "branch": resume.get("branch", ""),
                "cgpa": resume.get("cgpa", ""),
                "linkedin": resume.get("linkedin", ""),
                "github": resume.get("github", ""),
                "leetcode": resume.get("leetcode", ""),
                "skills": resume.get("skills", []),
                "projects": resume.get("projects", []),
            }
        })

    except Exception as error:

        print("Resume Parsing Error:", error)

        return jsonify({
            "success": False,
            "message": str(error)
        }), 500


# =====================================================
# ATS SCORE
# =====================================================

@app.route("/ats", methods=["POST"])
def ats():

    if "resume" not in request.files:

        return jsonify({
            "success": False,
            "message": "Resume not uploaded"
        }), 400

    try:

        resume = parse_resume(
            request.files["resume"]
        )

        result = calculate_ats_score(
            resume["text"]
        )

        return jsonify({
            "success": True,
            **result
        })

    except Exception as error:

        print("ATS Error:", error)

        return jsonify({
            "success": False,
            "message": str(error)
        }), 500


# =====================================================
# COMPANY ELIGIBILITY
# =====================================================

@app.route("/eligibility", methods=["POST"])
def eligibility():

    try:

        data = request.get_json()

        cgpa = data.get("cgpa", 0)
        skills = data.get("skills", [])

        result = check_eligibility(
            cgpa,
            skills
        )

        return jsonify({
            "success": True,
            "companies": result
        })

    except Exception as error:

        print("Eligibility Error:", error)

        return jsonify({
            "success": False,
            "message": str(error)
        }), 500


# =====================================================
# SKILL GAP
# =====================================================

@app.route("/skill-gap", methods=["POST"])
def skill_gap():

    try:

        data = request.get_json()

        company = data.get("company")
        skills = data.get("skills", [])

        result = analyze_skill_gap(
            company,
            skills
        )

        return jsonify({
            "success": True,
            "data": result
        })

    except Exception as error:

        print("Skill Gap Error:", error)

        return jsonify({
            "success": False,
            "message": str(error)
        }), 500


# =====================================================
# ROADMAP
# =====================================================

@app.route("/roadmap", methods=["POST"])
def roadmap():

    try:

        data = request.get_json()

        company = data.get("company")
        missing = data.get("missingSkills", [])

        result = generate_roadmap(
            company,
            missing
        )

        return jsonify({
            "success": True,
            "data": result
        })

    except Exception as error:

        print("Roadmap Error:", error)

        return jsonify({
            "success": False,
            "message": str(error)
        }), 500


# =====================================================
# START SERVER
# =====================================================

if __name__ == "__main__":

    app.run(
        debug=True,
        port=8000
    )