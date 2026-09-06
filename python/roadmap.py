ROADMAP = {

    "DSA": {
        "weeks": 2,
        "topics": [
            "Arrays",
            "Strings",
            "Searching",
            "Sorting",
            "Linked Lists",
            "Stacks",
            "Queues",
            "Trees",
            "Graphs"
        ],
        "resources": [
            "Striver A2Z DSA Sheet",
            "LeetCode Top Interview 150"
        ]
    },

    "DBMS": {
        "weeks": 1,
        "topics": [
            "ER Model",
            "Normalization",
            "SQL",
            "Transactions"
        ],
        "resources": [
            "GeeksforGeeks DBMS",
            "SQLBolt"
        ]
    },

    "Operating Systems": {
        "weeks": 1,
        "topics": [
            "Processes",
            "Threads",
            "Deadlocks",
            "Scheduling"
        ],
        "resources": [
            "Operating Systems by Gate Smashers"
        ]
    },

    "Computer Networks": {
        "weeks": 1,
        "topics": [
            "OSI Model",
            "TCP/IP Model",
            "HTTP",
            "DNS"
        ],
        "resources": [
            "Computer Networks by Gate Smashers"
        ]
    },

    "Java": {
        "weeks": 1,
        "topics": [
            "OOP",
            "Collections",
            "Streams"
        ],
        "resources": [
            "Java Brains",
            "Coding with John"
        ]
    },

    "Python": {
        "weeks": 1,
        "topics": [
            "Functions",
            "OOP",
            "Libraries"
        ],
        "resources": [
            "freeCodeCamp Python"
        ]
    },

    "Aptitude": {
        "weeks": 1,
        "topics": [
            "Percentages",
            "Profit and Loss",
            "Time and Work",
            "Time and Distance",
            "Probability",
            "Data Interpretation"
        ],
        "resources": [
            "IndiaBix",
            "CareerRide Aptitude Playlist"
        ]
    },

    "System Design": {
        "weeks": 2,
        "topics": [
            "Scalability",
            "Load Balancing",
            "Caching",
            "Database Design",
            "Microservices",
            "Message Queues"
        ],
        "resources": [
            "System Design Primer",
            "Gaurav Sen YouTube"
        ]
    }
}


# ================= GENERATE ROADMAP =================

def generate_roadmap(company, missing_skills):

    print("===================================")
    print("Generating Roadmap")
    print("Company:", company)
    print("Missing Skills:", missing_skills)
    print("===================================")

    roadmap = []

    current_week = 1

    # Remove duplicate skills
    missing_skills = list(dict.fromkeys(missing_skills))

    for skill in missing_skills:

        # Clean skill name
        skill = skill.strip()

        # Check whether roadmap exists
        if skill not in ROADMAP:

            print(
                f"Skipping '{skill}' because "
                f"it is not available in ROADMAP."
            )

            continue

        skill_data = ROADMAP[skill]

        weeks = skill_data["weeks"]
        topics = skill_data["topics"]
        resources = skill_data["resources"]

        # Number of topics in each week
        topics_per_week = (
            len(topics) + weeks - 1
        ) // weeks

        # Create weekly roadmap
        for i in range(weeks):

            start = i * topics_per_week
            end = start + topics_per_week

            weekly_topics = topics[start:end]

            # Don't create empty weeks
            if not weekly_topics:
                continue

            if weeks == 1:
                focus = skill
            else:
                focus = f"{skill} - Part {i + 1}"

            roadmap.append({

                "week": current_week,

                "focus": focus,

                "topics": weekly_topics,

                "resources": resources

            })

            current_week += 1

    # ================= RESULT =================

    result = {
        "company": company,

        "estimatedWeeks": len(roadmap),

        "roadmap": roadmap
    }

    print("===================================")
    print("Generated Roadmap:")
    print(result)
    print("===================================")

    return result