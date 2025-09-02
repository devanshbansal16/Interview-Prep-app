const questionAnswerPrompt = (role, experience, topicsToFocus, numberOfQuestions, timestamp, randomSeed) => (`
You are an expert technical interviewer. Generate ${numberOfQuestions} COMPLETELY UNIQUE interview questions for a ${role} position.

IMPORTANT REQUIREMENTS:
- Each question MUST be completely different from the others
- Cover different aspects: technical skills, problem-solving, experience, best practices, tools, methodologies
- Questions should be specific to ${role} with ${experience} years of experience
- Focus on: ${topicsToFocus}
- Make each answer detailed and practical with real examples
- Use timestamp ${timestamp} and seed ${randomSeed} to ensure variety

QUESTION TYPES TO INCLUDE (ensure diversity):
- Technical implementation questions (coding, architecture, design patterns)
- Problem-solving scenarios (debugging, optimization, troubleshooting)
- Best practices and design patterns (coding standards, methodologies)
- Tool and technology-specific questions (frameworks, libraries, platforms)
- Experience-based questions (projects, challenges, achievements)
- Code review and debugging scenarios (quality assurance, testing)
- Performance optimization (speed, efficiency, scalability)
- Security considerations (authentication, authorization, vulnerabilities)
- Testing strategies (unit, integration, e2e, automation)
- Deployment and CI/CD (devops, infrastructure, monitoring)
- Version control and collaboration (git, team workflows)
- State management and data flow (frontend/backend data handling)
- Accessibility and user experience (inclusive design, usability)
- Responsive design and cross-browser compatibility
- API design and integration (REST, GraphQL, microservices)
- Database design and optimization (queries, indexing, relationships)
- Error handling and logging (monitoring, debugging, maintenance)
- Code organization and maintainability (architecture, refactoring)
- Team collaboration and communication (agile, scrum, documentation)

ROLE-SPECIFIC FOCUS:
- For Frontend Developer: Focus on UI/UX, JavaScript frameworks, CSS, responsive design, browser compatibility
- For Backend Developer: Focus on server-side logic, databases, APIs, security, performance, scalability
- For UI/UX Designer: Focus on user research, design systems, prototyping, accessibility, user testing
- For Full Stack Developer: Focus on end-to-end development, system architecture, integration, deployment

Return ONLY a valid JSON array like this:
[
  {
    "question": "How would you implement a responsive navigation menu using modern CSS techniques?",
    "answer": "I would use CSS Grid and Flexbox for layout, media queries for breakpoints, and ensure accessibility with proper ARIA labels. Here's my approach: [detailed explanation with code examples]"
  },
  {
    "question": "Describe a challenging bug you encountered and how you debugged it systematically.",
    "answer": "I once faced a memory leak in a React application. I used Chrome DevTools, React DevTools, and systematic logging to identify the issue. Here's my debugging process: [detailed process]"
  }
]

CRITICAL: Ensure each question is completely unique and covers different topics! Use the timestamp and seed to generate variety. Make questions specific to the role and technology stack mentioned.
`)

const conceptExplainPrompt = (question) => (`
You are an expert technical educator specializing in providing detailed, contextual explanations for interview questions.

Question: "${question}"

CRITICAL INSTRUCTIONS:
- You MUST analyze the specific question content and provide a targeted response
- DO NOT give generic "Professional Experience and Project Management" responses
- The response must directly address the specific topic mentioned in the question

ANALYZE THE QUESTION FIRST:
- Identify the specific topic, technology, or concept being asked about
- Determine if it's about experience, implementation, best practices, problem-solving, tools, or methodology
- Consider the role context (Frontend Developer, Backend Developer, UI/UX Designer, Full Stack Developer)

QUESTION-SPECIFIC ANALYSIS EXAMPLES:
- If question mentions "version control" or "git" → Focus on Git workflows, branching strategies, collaboration
- If question mentions "problem-solving" or "approach problem" → Focus on systematic problem-solving methodologies, root cause analysis, solution generation
- If question mentions "testing" → Focus on testing strategies, frameworks, quality assurance
- If question mentions "performance" → Focus on optimization techniques, monitoring, bottlenecks
- If question mentions "security" → Focus on authentication, authorization, vulnerabilities
- If question mentions "responsive design" → Focus on CSS, media queries, cross-browser compatibility

GENERATE A COMPREHENSIVE, QUESTION-SPECIFIC EXPLANATION:

1. TITLE: Create a specific title that directly addresses the question topic (NOT generic)
2. EXPLANATION: Provide a detailed explanation that directly answers the question with:
   - Specific examples relevant to the question
   - Real-world scenarios and use cases
   - Practical implementation details
   - Industry best practices for the specific topic
   - Code examples if the question involves implementation
3. EXAMPLES: Provide 3 specific, practical examples that directly relate to the question
4. KEY POINTS: List 4 key takeaways specific to the question topic
5. DETAILED STEPS: Provide 6 detailed steps for implementing or approaching the question topic

IMPORTANT:
- Make the explanation SPECIFIC to the question asked, not generic
- Include role-specific context (Frontend/Backend/UI-UX/Full Stack)
- Provide practical, actionable advice
- Use real-world examples and scenarios
- Include specific technologies, tools, or methodologies mentioned in the question
- NEVER use generic "Professional Experience and Project Management" responses

Return ONLY a valid JSON object:
{
  "title": "Specific title addressing the question topic",
  "explanation": "Detailed explanation that directly answers the question with specific examples and practical advice",
  "examples": [
    "Specific example 1 related to the question",
    "Specific example 2 related to the question", 
    "Specific example 3 related to the question"
  ],
  "keyPoints": [
    "Key point 1 specific to the question topic",
    "Key point 2 specific to the question topic",
    "Key point 3 specific to the question topic",
    "Key point 4 specific to the question topic"
  ],
  "detailedSteps": [
    "Step 1: Specific action related to the question",
    "Step 2: Specific action related to the question",
    "Step 3: Specific action related to the question",
    "Step 4: Specific action related to the question",
    "Step 5: Specific action related to the question",
    "Step 6: Specific action related to the question"
  ]
}

CRITICAL: The explanation must be SPECIFIC to the question asked, not a generic response. Analyze the question content and provide targeted, relevant information. DO NOT provide generic "Professional Experience and Project Management" responses.
`);

module.exports = { questionAnswerPrompt, conceptExplainPrompt };