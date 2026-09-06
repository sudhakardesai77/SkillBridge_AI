import fitz
import re


# =====================================================
# SKILLS
# =====================================================

SKILL_PATTERNS = {

    # ================= PROGRAMMING =================

    "Java": [
        r"\bjava\b"
    ],

    "Python": [
        r"\bpython\b"
    ],

    "C": [
        r"\bc\b"
    ],

    "C++": [
        r"\bc\+\+\b"
    ],

    "C#": [
        r"\bc#\b"
    ],

    "JavaScript": [
        r"\bjavascript\b"
    ],

    "TypeScript": [
        r"\btypescript\b"
    ],

    "Go": [
        r"\bgo\b"
    ],

    "Rust": [
        r"\brust\b"
    ],

    "Kotlin": [
        r"\bkotlin\b"
    ],

    "Swift": [
        r"\bswift\b"
    ],

    "PHP": [
        r"\bphp\b"
    ],

    # ================= WEB =================

    "HTML": [
        r"\bhtml\b"
    ],

    "CSS": [
        r"\bcss\b"
    ],

    "Bootstrap": [
        r"\bbootstrap\b"
    ],

    "React": [
        r"\breact(?:\.js)?\b"
    ],

    "Angular": [
        r"\bangular\b"
    ],

    "Vue.js": [
        r"\bvue(?:\.js)?\b"
    ],

    "Node.js": [
        r"\bnode\.?js\b"
    ],

    "Express.js": [
        r"\bexpress\.?js\b",
        r"\bexpress\(node\)\b"
    ],

    "Next.js": [
        r"\bnext\.?js\b"
    ],

    "MERN": [
        r"\bmern\b"
    ],

    "MEAN": [
        r"\bmean\b"
    ],

    # ================= DATABASE =================

    "MongoDB": [
        r"\bmongodb\b"
    ],

    "MySQL": [
        r"\bmysql\b"
    ],

    "PostgreSQL": [
        r"\bpostgresql\b"
    ],

    "SQL": [
        r"\bsql\b"
    ],

    "SQLite": [
        r"\bsqlite\b"
    ],

    "Oracle": [
        r"\boracle\b"
    ],

    "Redis": [
        r"\bredis\b"
    ],

    "Firebase": [
        r"\bfirebase\b"
    ],

    # ================= CS FUNDAMENTALS =================

    "DSA": [
        r"\bdsa\b",
        r"\bdata structures\s*(?:and|&)\s*algorithms\b"
    ],

    "Data Structures": [
        r"\bdata structures\b"
    ],

    "Algorithms": [
        r"\balgorithms\b"
    ],

    "DBMS": [
        r"\bdbms\b",
        r"\bdatabase management system\b"
    ],

    "Operating Systems": [
        r"\boperating systems?\b"
    ],

    "Computer Networks": [
        r"\bcomputer networks?\b"
    ],

    "Object Oriented Programming": [
        r"\bobject[\s-]+oriented programming\b"
    ],

    "OOP": [
        r"\boop\b",
        r"\boops\b",
        r"\bobject[\s-]+oriented programming\b"
    ],

    # ================= AI / ML =================

    "Machine Learning": [
        r"\bmachine learning\b"
    ],

    "Deep Learning": [
        r"\bdeep learning\b"
    ],

    "Artificial Intelligence": [
        r"\bartificial intelligence\b"
    ],

    "Natural Language Processing": [
        r"\bnatural language processing\b",
        r"\bnlp\b"
    ],

    "Computer Vision": [
        r"\bcomputer vision\b"
    ],

    "TensorFlow": [
        r"\btensorflow\b"
    ],

    "PyTorch": [
        r"\bpytorch\b"
    ],

    "Scikit-learn": [
        r"\bscikit[- ]learn\b"
    ],

    "Pandas": [
        r"\bpandas\b"
    ],

    "NumPy": [
        r"\bnumpy\b"
    ],

    # ================= CLOUD / DEVOPS =================

    "AWS": [
        r"\baws\b"
    ],

    "Microsoft Azure": [
        r"\bmicrosoft azure\b"
    ],

    "Azure": [
        r"\bazure\b"
    ],

    "Google Cloud": [
        r"\bgoogle cloud\b"
    ],

    "Docker": [
        r"\bdocker\b"
    ],

    "Kubernetes": [
        r"\bkubernetes\b"
    ],

    "Jenkins": [
        r"\bjenkins\b"
    ],

    # ================= TOOLS =================

    "Git": [
        r"\bgit\b"
    ],

    "GitHub": [
        r"\bgithub\b"
    ],

    "Postman": [
        r"\bpostman\b"
    ],

    "VS Code": [
        r"\bvs\s*code\b"
    ],

    "Ajax": [
        r"\bajax\b"
    ],

    "API Testing": [
        r"\bapi testing\b"
    ],

    "REST API": [
        r"\brest(?:ful)? api\b"
    ],

    "API": [
        r"\bapi\b"
    ],

    "Flexbox": [
        r"\bflexbox\b"
    ],

    # ================= MOBILE =================

    "Android": [
        r"\bandroid\b"
    ],

    # ================= SECURITY =================

    "JWT": [
        r"\bjwt\b"
    ],

    "Cybersecurity": [
        r"\bcyber[\s-]?security\b"
    ],

    "Network Security": [
        r"\bnetwork security\b"
    ],

    # ================= OTHER =================

    "Cloudinary": [
        r"\bcloudinary\b"
    ],

    "Linux": [
        r"\blinux\b"
    ]
}


# =====================================================
# EXTRACT TEXT
# =====================================================

def extract_text(file):

    pdf = fitz.open(
        stream=file.read(),
        filetype="pdf"
    )

    text = ""

    for page in pdf:
        text += page.get_text() + "\n"

    pdf.close()

    return text


# =====================================================
# NORMALIZE TEXT
# =====================================================

def normalize_text(text):

    text = text.replace("\u00a0", " ")

    text = text.replace("\u2013", "-")
    text = text.replace("\u2014", "-")

    text = re.sub(
        r"[ \t]+",
        " ",
        text
    )

    return text.strip()


# =====================================================
# EXTRACT CGPA
# =====================================================

def extract_cgpa(text, lines):

    # -------------------------------------------------
    # Normalize complete text
    # -------------------------------------------------

    normalized_text = normalize_text(
        text.replace("\n", " ")
    )

    # -------------------------------------------------
    # Different CGPA / GPA formats
    # -------------------------------------------------

    patterns = [

        # ---------------------------------------------
        # (9.1 CGPA)
        # ---------------------------------------------

        r"\(\s*(\d{1,2}(?:\.\d+)?)\s*(?:c\.?\s*g\.?\s*p\.?\s*a\.?)\s*\)",

        # ---------------------------------------------
        # 9.1 CGPA
        # ---------------------------------------------

        r"\b(\d{1,2}(?:\.\d+)?)\s*(?:c\.?\s*g\.?\s*p\.?\s*a\.?)\b",

        # ---------------------------------------------
        # CGPA: 9.1
        # CGPA - 9.1
        # CGPA = 9.1
        # ---------------------------------------------

        r"\b(?:c\.?\s*g\.?\s*p\.?\s*a\.?)\s*[:=\-]\s*(\d{1,2}(?:\.\d+)?)\b",

        # ---------------------------------------------
        # CGPA 9.1
        # ---------------------------------------------

        r"\b(?:c\.?\s*g\.?\s*p\.?\s*a\.?)\s+(\d{1,2}(?:\.\d+)?)\b",

        # ---------------------------------------------
        # 9.1 / 10 CGPA
        # ---------------------------------------------

        r"\b(\d{1,2}(?:\.\d+)?)\s*/\s*10\s*(?:c\.?\s*g\.?\s*p\.?\s*a\.?)\b",

        # ---------------------------------------------
        # CGPA 9.1 / 10
        # ---------------------------------------------

        r"\b(?:c\.?\s*g\.?\s*p\.?\s*a\.?)\s*[:=\-]?\s*(\d{1,2}(?:\.\d+)?)\s*/\s*10\b",

        # ---------------------------------------------
        # CGPA of 9.1
        # ---------------------------------------------

        r"\b(?:c\.?\s*g\.?\s*p\.?\s*a\.?)\s+(?:of\s+)?(\d{1,2}(?:\.\d+)?)\b",

        # ---------------------------------------------
        # GPA: 9.1
        # ---------------------------------------------

        r"\b(?:gpa|grade\s+point\s+average)\s*[:=\-]?\s*(\d{1,2}(?:\.\d+)?)\b",

        # ---------------------------------------------
        # 9.1 GPA
        # ---------------------------------------------

        r"\b(\d{1,2}(?:\.\d+)?)\s*(?:gpa)\b",

        # ---------------------------------------------
        # Cumulative GPA: 9.1
        # ---------------------------------------------

        r"\bcumulative\s+gpa\s*[:=\-]?\s*(\d{1,2}(?:\.\d+)?)\b"
    ]

    # -------------------------------------------------
    # Find candidates with education context
    # -------------------------------------------------

    candidates = []

    for index, line in enumerate(lines):

        line_clean = normalize_text(line)

        # Look for CGPA/GPA in this line
        for pattern in patterns:

            matches = re.finditer(
                pattern,
                line_clean,
                re.IGNORECASE
            )

            for match in matches:

                try:

                    value = float(
                        match.group(1)
                    )

                except (
                    ValueError,
                    TypeError
                ):

                    continue

                # CGPA/GPA must normally be 0-10
                if not (0 <= value <= 10):
                    continue

                # -------------------------------------------------
                # Build nearby education context
                # -------------------------------------------------

                context_lines = lines[
                    max(0, index - 3):
                    min(len(lines), index + 4)
                ]

                context = " ".join(
                    context_lines
                ).lower()

                # -------------------------------------------------
                # Education level scoring
                # -------------------------------------------------

                score = 0

                # Bachelor's degree
                if re.search(
                    r"\b(b\.?\s*tech|btech|"
                    r"b\.?\s*e|be|"
                    r"bachelor|"
                    r"undergraduate|"
                    r"graduation|"
                    r"degree)\b",
                    context,
                    re.IGNORECASE
                ):
                    score += 100

                # Master's degree
                if re.search(
                    r"\b(m\.?\s*tech|mtech|"
                    r"m\.?\s*e|me|"
                    r"master|postgraduate)\b",
                    context,
                    re.IGNORECASE
                ):
                    score += 120

                # PhD
                if re.search(
                    r"\b(ph\.?\s*d|doctorate|doctoral)\b",
                    context,
                    re.IGNORECASE
                ):
                    score += 130

                # Diploma
                if re.search(
                    r"\bdiploma\b",
                    context,
                    re.IGNORECASE
                ):
                    score += 60

                # Intermediate / 12th
                if re.search(
                    r"\b(intermediate|12th|higher secondary|"
                    r"senior secondary|class 12)\b",
                    context,
                    re.IGNORECASE
                ):
                    score += 20

                # School / SSC
                if re.search(
                    r"\b(ssc|10th|secondary school|"
                    r"high school|class 10)\b",
                    context,
                    re.IGNORECASE
                ):
                    score += 5

                # If the line itself contains CGPA/GPA
                score += 10

                candidates.append({
                    "value": value,
                    "score": score,
                    "index": index,
                    "line": line_clean,
                    "context": context
                })

                # One value should not be added repeatedly
                break


    # -------------------------------------------------
    # Remove duplicate candidates
    # -------------------------------------------------

    unique_candidates = []

    seen = set()

    for candidate in candidates:

        key = (
            candidate["value"],
            candidate["index"]
        )

        if key not in seen:

            seen.add(key)

            unique_candidates.append(
                candidate
            )


    # -------------------------------------------------
    # Select best candidate
    # -------------------------------------------------

    if unique_candidates:

        unique_candidates.sort(
            key=lambda item: (
                item["score"],
                item["index"]
            ),
            reverse=True
        )

        best = unique_candidates[0]

        print(
            "CGPA Candidates:",
            [
                (
                    item["value"],
                    item["score"]
                )
                for item in unique_candidates
            ]
        )

        print(
            "Selected CGPA:",
            best["value"]
        )

        cgpa = best["value"]

    else:

        cgpa = ""

        print(
            "No CGPA/GPA detected."
        )


    return cgpa


# =====================================================
# EXTRACT SKILLS
# =====================================================

def extract_skills(text, lines):

    skills = []

    # -------------------------------------------------
    # Prefer skills section
    # -------------------------------------------------

    skills_section_text = ""

    capture = False

    section_headings = [
        "skills",
        "technical skills",
        "technical skill",
        "key skills",
        "core skills",
        "skills & technologies",
        "technical skills & tools"
    ]

    stop_sections = [
        "projects",
        "project",
        "education",
        "experience",
        "work experience",
        "professional experience",
        "internship",
        "internships",
        "certificates",
        "certifications",
        "achievements",
        "awards",
        "languages",
        "references"
    ]

    for line in lines:

        normalized = re.sub(
            r"^[•\-\*]+\s*",
            "",
            line.lower()
        ).strip()

        if normalized in section_headings:

            capture = True

            continue

        if capture:

            if (
                normalized in stop_sections
                or any(
                    normalized.startswith(
                        section
                    )
                    for section in stop_sections
                )
            ):

                break

            skills_section_text += (
                " " + line
            )


    # -------------------------------------------------
    # If no skills section found, use full resume
    # -------------------------------------------------

    search_text = (
        skills_section_text
        if skills_section_text.strip()
        else text
    )

    # -------------------------------------------------
    # Search skills
    # -------------------------------------------------

    for skill_name, patterns in SKILL_PATTERNS.items():

        found = False

        for pattern in patterns:

            if re.search(
                pattern,
                search_text,
                re.IGNORECASE
            ):

                found = True

                break

        if found and skill_name not in skills:

            skills.append(
                skill_name
            )


    return skills


# =====================================================
# EXTRACT NAME
# =====================================================

def extract_name(lines):

    for line in lines[:5]:

        cleaned = line.strip()

        if not cleaned:
            continue

        if "@" in cleaned:
            continue

        if re.search(
            r"\d{7,}",
            cleaned
        ):
            continue

        if "http" in cleaned.lower():
            continue

        if (
            1 <= len(cleaned.split()) <= 6
            and len(cleaned) <= 80
        ):

            return cleaned

    return ""


# =====================================================
# EXTRACT COLLEGE
# =====================================================

def extract_college(lines):

    for line in lines:

        lower = line.lower()

        if (
            "university" in lower
            or "college" in lower
            or "institute" in lower
        ):

            return line.strip()

    return ""


# =====================================================
# EXTRACT BRANCH
# =====================================================

def extract_branch(text):

    branch_patterns = [

        r"\bcomputer science and engineering\b",

        r"\bcomputer science engineering\b",

        r"\bcomputer science\b",

        r"\bcse\b",

        r"\binformation technology\b",

        r"\bit\b",

        r"\belectronics and communication engineering\b",

        r"\belectronics and communication\b",

        r"\bece\b",

        r"\belectrical and electronics engineering\b",

        r"\belectrical engineering\b",

        r"\beee\b",

        r"\bmechanical engineering\b",

        r"\bmechanical\b",

        r"\bcivil engineering\b",

        r"\bcivil\b",

        r"\bartificial intelligence\b",

        r"\bdata science\b",

        r"\bdata analytics\b"
    ]

    for pattern in branch_patterns:

        match = re.search(
            pattern,
            text,
            re.IGNORECASE
        )

        if match:

            return match.group().strip()

    return ""


# =====================================================
# EXTRACT PROJECTS
# =====================================================

def extract_projects(lines):

    projects = []

    capture = False

    project_headings = [

        "projects",
        "project",
        "academic projects",
        "personal projects"

    ]

    stop_keywords = [

        "education",
        "education details",

        "skill",
        "skills",
        "technical skill",
        "technical skills",

        "certificate",
        "certificates",
        "certification",
        "certifications",

        "experience",
        "work experience",
        "professional experience",

        "internship",
        "internships",

        "achievement",
        "achievements",

        "language",
        "languages",

        "contact",

        "profile",
        "summary",
        "objective",

        "hobbies",
        "interests",

        "reference",
        "references",

        "declaration"

    ]

    for line in lines:

        lower = line.lower().strip()

        normalized = re.sub(
            r"^[•\-\*]+\s*",
            "",
            lower
        ).strip()

        # Start project section
        if normalized in project_headings:

            capture = True

            continue

        if capture:

            # Stop at another section
            if (
                normalized in stop_keywords
                or any(
                    normalized.startswith(
                        x
                    )
                    for x in stop_keywords
                )
                or (
                    line.strip().isupper()
                    and len(
                        line.strip().split()
                    ) <= 4
                )
            ):

                break

            cleaned = re.sub(
                r"^[•\-\*]+\s*",
                "",
                line
            ).strip()

            if len(cleaned) < 5:
                continue

            if cleaned.lower().startswith(
                "http"
            ):
                continue

            if cleaned not in projects:

                projects.append(
                    cleaned
                )

    return projects


# =====================================================
# MAIN PARSER
# =====================================================

def parse_resume(file):

    text = extract_text(file)

    lines = [
        line.strip()
        for line in text.split("\n")
        if line.strip()
    ]


    # =================================================
    # EMAIL
    # =================================================

    email = ""

    email_match = re.search(
        r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}",
        text
    )

    if email_match:

        email = email_match.group()


    # =================================================
    # PHONE
    # =================================================

    phone = ""

    phone_match = re.search(
        r"(?:\+91[\s-]?)?[6-9]\d{9}",
        text
    )

    if phone_match:

        phone = phone_match.group()


    # =================================================
    # LINKEDIN
    # =================================================

    linkedin = ""

    linkedin_match = re.search(
        r"(?:https?://)?(?:www\.)?"
        r"linkedin\.com/in/"
        r"[A-Za-z0-9\-_\/]+",
        text,
        re.IGNORECASE
    )

    if linkedin_match:

        linkedin = linkedin_match.group()


    # =================================================
    # GITHUB
    # =================================================

    github = ""

    github_match = re.search(
        r"(?:https?://)?(?:www\.)?"
        r"github\.com/"
        r"[A-Za-z0-9\-_]+",
        text,
        re.IGNORECASE
    )

    if github_match:

        github = github_match.group()


    # =================================================
    # LEETCODE
    # =================================================

    leetcode = ""

    leetcode_match = re.search(
        r"(?:https?://)?(?:www\.)?"
        r"leetcode\.com/"
        r"[A-Za-z0-9\-_\/]+",
        text,
        re.IGNORECASE
    )

    if leetcode_match:

        leetcode = leetcode_match.group()


    # =================================================
    # NAME
    # =================================================

    name = extract_name(lines)


    # =================================================
    # COLLEGE
    # =================================================

    college = extract_college(lines)


    # =================================================
    # BRANCH
    # =================================================

    branch = extract_branch(text)


    # =================================================
    # CGPA
    # =================================================

    cgpa = extract_cgpa(
        text,
        lines
    )


    # =================================================
    # SKILLS
    # =================================================

    skills = extract_skills(
        text,
        lines
    )


    # =================================================
    # PROJECTS
    # =================================================

    projects = extract_projects(
        lines
    )


    # =================================================
    # FINAL RESULT
    # =================================================

    result = {

        "text": text,

        "name": name,

        "email": email,

        "phone": phone,

        "college": college,

        "branch": branch,

        "cgpa": cgpa,

        "linkedin": linkedin,

        "github": github,

        "leetcode": leetcode,

        "skills": skills,

        "projects": projects
    }


    # =================================================
    # DEBUG OUTPUT
    # =================================================

    print(
        "===================================="
    )

    print(
        "Resume Parsed Successfully"
    )

    print(
        "Name:",
        name
    )

    print(
        "Email:",
        email
    )

    print(
        "College:",
        college
    )

    print(
        "Branch:",
        branch
    )

    print(
        "CGPA:",
        cgpa
    )

    print(
        "Skills:",
        skills
    )

    print(
        "Projects:",
        len(projects)
    )

    print(
        "===================================="
    )


    return result