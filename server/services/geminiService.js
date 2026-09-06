const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ==================================================
// CLEAN JSON
// ==================================================

const cleanJson = (text) => {
  if (!text) {
    return "";
  }

  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
};

// ==================================================
// SAFE URL CHECK
// ==================================================

const isValidUrl = (url) => {
  try {
    const parsedUrl = new URL(url);

    return (
      parsedUrl.protocol === "http:" ||
      parsedUrl.protocol === "https:"
    );
  } catch {
    return false;
  }
};

// ==================================================
// INTERVIEW ANSWER EVALUATION
// ==================================================

const evaluateAnswer = async (question, answer) => {
  const prompt = `
You are an expert technical interviewer.

Interview Question:
${question}

Candidate Answer:
${answer}

Evaluate the candidate's answer fairly.

Consider:
- Technical correctness
- Understanding of the concept
- Completeness
- Clarity
- Relevance
- Interview quality

Give a score from 0 to 10.

Return ONLY valid JSON:

{
  "score": 8,
  "strengths": [
    "..."
  ],
  "weaknesses": [
    "..."
  ],
  "improvedAnswer": "..."
}

Rules:
1. Score must be a number from 0 to 10.
2. Strengths must be an array.
3. Weaknesses must be an array.
4. improvedAnswer must provide a better interview-quality answer.
5. Do not return Markdown.
6. Do not return anything outside the JSON object.
`;

  const models = [
    "gemini-3.5-flash-lite",
    "gemini-3.6-flash",
    "gemini-3.1-flash-lite",
    "gemini-2.5-flash",
  ];

  let lastError = null;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      const text = cleanJson(response.text);

      if (!text) {
        throw new Error("Gemini returned an empty response.");
      }

      const result = JSON.parse(text);

      if (
        typeof result.score !== "number" ||
        !Array.isArray(result.strengths) ||
        !Array.isArray(result.weaknesses) ||
        typeof result.improvedAnswer !== "string"
      ) {
        throw new Error(
          "Invalid interview evaluation response."
        );
      }

      result.score = Math.max(
        0,
        Math.min(10, Number(result.score))
      );

      return result;
    } catch (error) {
      lastError = error;

      console.error(
        `Interview evaluation model ${model} failed:`,
        error.message
      );
    }
  }

  throw (
    lastError ||
    new Error("All Gemini evaluation models failed.")
  );
};

// ==================================================
// GENERATE INTERVIEW QUESTIONS
// ==================================================

const generateInterviewQuestions = async ({
  company = "",
  role = "Software Engineer",
  interviewType = "Mixed",
  questionCount = 10,
  currentSkills = [],
}) => {
  let count = Number(questionCount);

  if (Number.isNaN(count) || count < 5) {
    count = 10;
  }

  if (count > 30) {
    count = 30;
  }

  const skillsText =
    Array.isArray(currentSkills) &&
    currentSkills.length > 0
      ? currentSkills.join(", ")
      : "No resume skills provided.";

  let typeInstructions = "";

  if (interviewType === "Technical") {
    typeInstructions = `
Focus mainly on technical interview questions:
- DSA
- Java/programming
- OOP
- DBMS
- SQL
- Operating Systems
- Computer Networks
- APIs
- System Design
- Projects
`;
  } else if (interviewType === "HR") {
    typeInstructions = `
Focus mainly on HR and behavioral questions:
- Tell me about yourself
- Strengths and weaknesses
- Teamwork
- Leadership
- Conflict handling
- Problem solving
- Failure and learning
- Career goals
- Company motivation
- Situational questions
`;
  } else {
    typeInstructions = `
Create a realistic mixed interview containing:
- Technical questions
- DSA/programming
- OOP
- DBMS/SQL
- OS/Networks
- Projects
- System Design when appropriate
- HR/behavioral questions
- Company-specific questions
`;
  }

  const prompt = `
You are an experienced interviewer conducting a realistic software engineering interview.

Company:
${company}

Role:
${role}

Interview Type:
${interviewType}

Number of Questions:
${count}

Candidate Skills:
${skillsText}

${typeInstructions}

Generate exactly ${count} realistic interview questions.

Return ONLY valid JSON:

{
  "questions": [
    {
      "question": "Explain the difference between HashMap and ConcurrentHashMap in Java.",
      "topic": "Java / Collections"
    }
  ]
}
`;

  const models = [
    "gemini-3.5-flash-lite",
    "gemini-3.6-flash",
    "gemini-3.1-flash-lite",
    "gemini-2.5-flash",
  ];

  let lastError = null;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      const text = cleanJson(response.text);

      if (!text) {
        throw new Error(
          "Gemini returned an empty response."
        );
      }

      const result = JSON.parse(text);

      if (
        !result.questions ||
        !Array.isArray(result.questions)
      ) {
        throw new Error(
          "Invalid interview question response."
        );
      }

      if (result.questions.length !== count) {
        throw new Error(
          `Gemini returned ${result.questions.length} questions instead of ${count}.`
        );
      }

      const uniqueQuestions = [];
      const seen = new Set();

      for (const item of result.questions) {
        if (!item.question) {
          continue;
        }

        const questionText = String(
          item.question
        ).trim();

        const questionKey = questionText
          .toLowerCase()
          .replace(/\s+/g, " ")
          .trim();

        if (seen.has(questionKey)) {
          continue;
        }

        seen.add(questionKey);

        uniqueQuestions.push({
          question: questionText,
          topic: String(
            item.topic || "General"
          ).trim(),
        });
      }

      if (uniqueQuestions.length !== count) {
        throw new Error(
          "Duplicate interview questions generated."
        );
      }

      return {
        questions: uniqueQuestions,
      };
    } catch (error) {
      lastError = error;

      console.error(
        `Interview question model ${model} failed:`,
        error.message
      );
    }
  }

  throw (
    lastError ||
    new Error(
      "All Gemini interview question models failed."
    )
  );
};

// ==================================================
// AI ROADMAP WITH CLICKABLE RESOURCES
// ==================================================

const generateRoadmapAI = async (
  company,
  missingSkills,
  currentSkills = []
) => {
  const prompt = `
You are an expert career coach and software engineering mentor.

Create a personalized learning roadmap for a B.Tech student preparing for software engineering placements.

==================================================
TARGET COMPANY
==================================================

Company:
${company}

==================================================
STUDENT'S CURRENT SKILLS
==================================================

${
  currentSkills.length > 0
    ? currentSkills.join(", ")
    : "No skills provided"
}

==================================================
SKILLS TO LEARN
==================================================

${missingSkills.join(", ")}

==================================================
TASK
==================================================

Create a structured learning roadmap.

Requirements:

1. Focus on the missing skills.
2. Start from fundamentals.
3. Progress toward interview preparation.
4. Include practical learning and practice.
5. Create between 3 and 8 weeks.
6. Each week must contain between 3 and 6 topics.
7. Each week must contain useful DIRECT learning resources.

==================================================
VERY IMPORTANT RESOURCE RULES
==================================================

Every resource MUST be an object with:

- title
- type
- url

Allowed resource types:

- Video
- Article
- Practice
- Documentation
- Course

IMPORTANT:

1. Use well-known and trustworthy educational resources.
2. Use direct HTTPS URLs.
3. Do NOT invent URLs.
4. Do NOT use Google search URLs.
5. Prefer resources such as:
   - LeetCode
   - GeeksforGeeks
   - HackerRank
   - MDN
   - official documentation
   - SQLBolt
   - reliable YouTube educational channels
6. Give 2 to 4 resources for each week.
7. Include a mixture of learning and practice resources when possible.

==================================================
OUTPUT RULES
==================================================

1. Return ONLY valid JSON.
2. Do NOT use Markdown.
3. Do NOT use code blocks.
4. estimatedWeeks must equal roadmap length.
5. Week numbers start from 1.

==================================================
EXACT OUTPUT FORMAT
==================================================

{
  "company": "${company}",
  "estimatedWeeks": 4,
  "roadmap": [
    {
      "week": 1,
      "focus": "DSA Fundamentals",
      "topics": [
        "Arrays",
        "Strings",
        "Time Complexity"
      ],
      "resources": [
        {
          "title": "Striver A2Z DSA Course",
          "type": "Course",
          "url": "https://www.youtube.com/"
        },
        {
          "title": "LeetCode Arrays Practice",
          "type": "Practice",
          "url": "https://leetcode.com/problemset/"
        }
      ]
    }
  ]
}
`;

  const models = [
    "gemini-3.5-flash-lite",
    "gemini-3.6-flash",
    "gemini-3.1-flash-lite",
    "gemini-2.5-flash",
  ];

  let lastError = null;

  for (const model of models) {
    try {
      console.log(
        `Trying roadmap model: ${model}`
      );

      const response =
        await ai.models.generateContent({
          model,
          contents: prompt,
        });

      const text = cleanJson(response.text);

      if (!text) {
        throw new Error(
          "Gemini returned an empty roadmap."
        );
      }

      const result = JSON.parse(text);

      if (
        !result ||
        !Array.isArray(result.roadmap) ||
        result.roadmap.length === 0
      ) {
        throw new Error(
          "Invalid roadmap returned by Gemini."
        );
      }

      // ==========================================
      // CLEAN ROADMAP
      // ==========================================

      const cleanedRoadmap =
        result.roadmap.map(
          (item, index) => {

            const cleanedResources =
              Array.isArray(item.resources)
                ? item.resources
                    .filter(Boolean)
                    .map((resource) => {

                      // New resource object format
                      if (
                        typeof resource === "object" &&
                        resource !== null
                      ) {

                        const title = String(
                          resource.title ||
                          "Learning Resource"
                        ).trim();

                        const type = String(
                          resource.type ||
                          "Resource"
                        ).trim();

                        const url = String(
                          resource.url || ""
                        ).trim();

                        return {
                          title,
                          type,
                          url: isValidUrl(url)
                            ? url
                            : "",
                        };
                      }

                      // Old string format safety
                      return {
                        title: String(
                          resource
                        ).trim(),
                        type: "Resource",
                        url: "",
                      };
                    })
                : [];

            return {
              week:
                Number(item.week) ||
                index + 1,

              focus:
                String(
                  item.focus || "Learning"
                ).trim(),

              topics:
                Array.isArray(item.topics)
                  ? item.topics
                      .filter(Boolean)
                      .map((topic) =>
                        String(topic).trim()
                      )
                  : [],

              resources:
                cleanedResources,
            };
          }
        );

      console.log(
        `Roadmap successfully generated using ${model}`
      );

      return {
        company:
          result.company || company,

        estimatedWeeks:
          cleanedRoadmap.length,

        roadmap:
          cleanedRoadmap,
      };

    } catch (error) {
      lastError = error;

      console.error(
        `Roadmap model ${model} failed:`,
        error.message
      );
    }
  }

  throw (
    lastError ||
    new Error(
      "All Gemini roadmap models failed."
    )
  );
};

// ==================================================
// AI CODING PROBLEMS
// ==================================================

const generateCodingRecommendations = async (
  currentSkills = [],
  jobTitle = "",
  platform = "LeetCode",
  difficulty = "Medium",
  problemCount = 20,
  company = "",
  jobDescription = "",
  jobSkills = [],
  existingProblems = []
) => {
  let count = Number(problemCount);

  if (Number.isNaN(count) || count < 1) {
    count = 20;
  }

  if (count > 50) {
    count = 50;
  }

  const alreadyTracked =
    Array.isArray(existingProblems)
      ? existingProblems
      : [];

  const existingProblemText =
    alreadyTracked.length > 0
      ? alreadyTracked
          .map(
            (problem, index) =>
              `${index + 1}. ${problem.title || ""} | ${problem.platform || ""} | ${problem.difficulty || ""}`
          )
          .join("\n")
      : "No problems are currently tracked.";

  const prompt = `
You are an expert DSA mentor and technical interview preparation coach.

Create a personalized coding practice set.

Company:
${company || "Not specified"}

Job Title:
${jobTitle || "Software Engineer"}

Candidate Skills:
${currentSkills.join(", ") || "None provided."}

Required Job Skills:
${jobSkills.join(", ") || "None provided."}

Do not recommend these existing problems:

${existingProblemText}

Platform:
${platform}

Difficulty:
${difficulty}

Number of Problems:
${count}

Return ONLY valid JSON:

{
  "problems": [
    {
      "title": "Two Sum",
      "topic": "Arrays, Hashing",
      "description": "Find two numbers whose values add up to a target.",
      "difficulty": "${difficulty}",
      "platform": "${platform}",
      "link": "https://leetcode.com/problems/two-sum/",
      "reason": "Strengthens array and hashing skills."
    }
  ]
}
`;

  const models = [
    "gemini-3.5-flash-lite",
    "gemini-3.6-flash",
    "gemini-3.1-flash-lite",
    "gemini-2.5-flash",
  ];

  let lastError = null;

  for (const model of models) {
    try {
      const response =
        await ai.models.generateContent({
          model,
          contents: prompt,
        });

      const text = cleanJson(response.text);

      if (!text) {
        throw new Error(
          "Gemini returned an empty response."
        );
      }

      const result = JSON.parse(text);

      if (
        !result.problems ||
        !Array.isArray(result.problems)
      ) {
        throw new Error(
          "Invalid problem response."
        );
      }

      if (result.problems.length !== count) {
        throw new Error(
          `Gemini returned ${result.problems.length} problems instead of ${count}.`
        );
      }

      const validProblems =
        result.problems
          .filter((problem) => {
            return (
              problem.title &&
              problem.topic &&
              problem.description &&
              problem.difficulty === difficulty &&
              problem.platform === platform &&
              problem.link &&
              problem.reason
            );
          })
          .map((problem) => ({
            title: String(problem.title).trim(),
            topic: String(problem.topic).trim(),
            description: String(
              problem.description
            ).trim(),
            difficulty: problem.difficulty,
            platform: problem.platform,
            link: String(problem.link).trim(),
            reason: String(problem.reason).trim(),
          }));

      return {
        problems: validProblems,
      };

    } catch (error) {
      lastError = error;

      console.error(
        `Coding model ${model} failed:`,
        error.message
      );
    }
  }

  throw (
    lastError ||
    new Error(
      "All Gemini coding models failed."
    )
  );
};

// ==================================================
// EXPORT
// ==================================================

module.exports = {
  evaluateAnswer,
  generateInterviewQuestions,
  generateRoadmapAI,
  generateCodingRecommendations,
};