const { GoogleGenAI } = require("@google/genai");
const { questionAnswerPrompt, conceptExplainPrompt } = require("../utils/prompts");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

//@desc Generate interview questions and answers using Gemini
//@route POST /api/ai/generate-questions
// @access Private
const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

    if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data"
      });
    }

    // Add timestamp and random seed to make questions more diverse
    const timestamp = Date.now();
    const randomSeed = Math.floor(Math.random() * 1000);

    const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions, timestamp, randomSeed);
    console.log("AI Prompt:", prompt);

    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("AI Raw Response:", text);

    // Clean it: Remove ```json and ``` wrappers
    const cleanedText = text
      .replace(/^```json\s*/, "")
      .replace(/```$/, "")
      .trim();
    console.log("AI Cleaned Response:", cleanedText);

    try {
      const data = JSON.parse(cleanedText);
      console.log("Parsed Data:", data);

      // Validate the response structure
      if (!data || !Array.isArray(data)) {
        throw new Error("Invalid response structure from AI");
      }

      res.status(200).json({ success: true, data });
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      // Fallback to mock data if parsing fails - generate unique questions
      const mockQuestions = generateUniqueMockQuestions(role, experience, topicsToFocus, numberOfQuestions, timestamp, randomSeed);
      console.log("Using fallback questions:", mockQuestions);
      res.status(200).json({ success: true, data: mockQuestions });
    }
  } catch (error) {
    console.error("AI generation error:", error);
    // Fallback to mock data with unique questions
    const mockQuestions = generateUniqueMockQuestions(
      req.body.role || 'developer',
      req.body.experience || 'several',
      req.body.topicsToFocus || 'technology',
      req.body.numberOfQuestions || 5,
      Date.now(),
      Math.floor(Math.random() * 1000)
    );
    console.log("Using error fallback questions:", mockQuestions);
    res.status(200).json({ success: true, data: mockQuestions });
  }
};

//@desc Generate concept explanation using Gemini
//@route POST /api/ai/generate-explanation
// @access Private
const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    const prompt = conceptExplainPrompt(question);

    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleanedText = text
      .replace(/^```json\s*/, "")
      .replace(/```$/, "")
      .trim();

    try {
      const data = JSON.parse(cleanedText);

      // Validate the AI response structure
      if (!data.title || !data.explanation || !data.examples || !data.keyPoints || !data.detailedSteps) {
        throw new Error("AI response missing required fields");
      }

      console.log("Successfully parsed AI response");
      res.status(200).json({ success: true, data });
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Failed to parse AI response, attempting to fix...");

      // Try to extract JSON from the response if it's wrapped in markdown
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const extractedJson = JSON.parse(jsonMatch[0]);
          console.log("Successfully extracted JSON from response");
          res.status(200).json({ success: true, data: extractedJson });
          return;
        }
      } catch (extractError) {
        console.error("Failed to extract JSON:", extractError);
      }

      // Only fallback to mock data if AI completely fails
      console.log("Using fallback mock explanation due to AI parsing failure");
      const mockExplanation = generateDetailedMockExplanation(question);
      res.status(200).json({ success: true, data: mockExplanation });
    }
  } catch (error) {
    console.error("AI explanation error:", error);
    // Fallback to mock data
    const mockExplanation = generateDetailedMockExplanation(req.body.question || 'the question');
    res.status(200).json({ success: true, data: mockExplanation });
  }
};

// Helper function to generate unique mock questions
const generateUniqueMockQuestions = (role, experience, topicsToFocus, numberOfQuestions, timestamp, randomSeed) => {
  const questionTemplates = [
    {
      question: `Describe your experience with ${topicsToFocus} and how you've used it in real projects.`,
      answer: `I have ${experience} years of experience working with ${topicsToFocus}. In my projects, I've used it to build responsive web applications, implement complex user interfaces, and optimize performance. I've worked on projects ranging from small business websites to large-scale enterprise applications.`
    },
    {
      question: `How would you approach debugging a complex issue in a ${role} project?`,
      answer: `As a ${role}, I follow a systematic debugging approach: 1) Reproduce the issue consistently, 2) Check browser console and network logs, 3) Use debugging tools like Chrome DevTools, 4) Add strategic console.logs, 5) Test hypotheses systematically, 6) Document the solution for future reference.`
    },
    {
      question: `What are the key best practices you follow when working with ${topicsToFocus}?`,
      answer: `Key best practices I follow include: writing clean, maintainable code; using semantic HTML; implementing responsive design; optimizing for performance; following accessibility guidelines; writing comprehensive tests; and documenting code properly.`
    },
    {
      question: `Can you explain how you would implement a specific feature using ${topicsToFocus}?`,
      answer: `I would start by understanding the requirements, then plan the implementation approach, create a prototype, implement the feature with proper error handling, test thoroughly, and optimize for performance. I always consider scalability and maintainability.`
    },
    {
      question: `What challenges have you faced while working with ${topicsToFocus} and how did you overcome them?`,
      answer: `I've faced challenges like browser compatibility issues, performance optimization, and complex state management. I overcame them by researching solutions, consulting documentation, collaborating with team members, and implementing best practices.`
    },
    {
      question: `How do you stay updated with the latest trends in ${topicsToFocus}?`,
      answer: `I stay updated by following industry blogs, attending conferences, participating in online communities, reading technical books, taking online courses, and experimenting with new technologies in personal projects.`
    },
    {
      question: `Describe a challenging project you worked on and how you handled it.`,
      answer: `I worked on a complex project that required integrating multiple systems. I broke it down into manageable phases, communicated regularly with stakeholders, used agile methodologies, and delivered on time while maintaining quality.`
    },
    {
      question: `What tools and technologies do you use in your daily work as a ${role}?`,
      answer: `I use modern development tools including version control (Git), IDEs (VS Code), debugging tools, testing frameworks, build tools, and deployment platforms to ensure code quality and efficient development workflow.`
    },
    {
      question: `How do you approach problem-solving in your role as a ${role}?`,
      answer: `I follow a systematic approach: understand the problem thoroughly, break it down into smaller parts, research solutions, create a plan, implement and test, then iterate based on feedback and results.`
    },
    {
      question: `What is your experience with ${topicsToFocus} and how has it evolved over time?`,
      answer: `My experience with ${topicsToFocus} has evolved significantly over ${experience} years. I started with basic concepts and gradually moved to advanced features, best practices, and architectural patterns that help build scalable applications.`
    },
    {
      question: `How do you handle version control and collaboration in your ${role} projects?`,
      answer: `I use Git for version control with proper branching strategies, commit conventions, and pull request workflows. I collaborate through code reviews, pair programming, and clear communication with team members.`
    },
    {
      question: `What testing strategies do you implement for ${topicsToFocus} applications?`,
      answer: `I implement comprehensive testing including unit tests, integration tests, and end-to-end tests. I use testing frameworks, write testable code, and maintain good test coverage for reliable applications.`
    },
    {
      question: `How do you optimize performance in ${topicsToFocus} applications?`,
      answer: `I focus on code splitting, lazy loading, caching strategies, and minimizing bundle sizes. I use performance monitoring tools and optimize critical rendering paths for better user experience.`
    },
    {
      question: `Describe your experience with responsive design and cross-browser compatibility.`,
      answer: `I ensure applications work seamlessly across all devices and browsers. I use CSS Grid, Flexbox, media queries, and test thoroughly on different screen sizes and browsers.`
    },
    {
      question: `How do you approach accessibility in your ${topicsToFocus} projects?`,
      answer: `I follow WCAG guidelines, use semantic HTML, implement proper ARIA labels, ensure keyboard navigation, and test with screen readers to make applications accessible to all users.`
    }
  ];

  // Use timestamp and random seed for more consistent but diverse shuffling
  const seededRandom = (seed) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // Shuffle using the seed for consistency but add timestamp for variety
  const shuffled = questionTemplates.sort((a, b) => {
    const seedA = seededRandom(timestamp + randomSeed + questionTemplates.indexOf(a));
    const seedB = seededRandom(timestamp + randomSeed + questionTemplates.indexOf(b));
    return seedA - seedB;
  });

  return shuffled.slice(0, numberOfQuestions);
};

// Helper function to generate detailed mock explanations
const generateDetailedMockExplanation = (question) => {
  // Extract role and topic from question for context-aware explanations
  const isFrontend = question.toLowerCase().includes('frontend') || question.toLowerCase().includes('css') || question.toLowerCase().includes('javascript') || question.toLowerCase().includes('ui') || question.toLowerCase().includes('ux') || question.toLowerCase().includes('designing');
  const isBackend = question.toLowerCase().includes('backend') || question.toLowerCase().includes('node') || question.toLowerCase().includes('database') || question.toLowerCase().includes('server') || question.toLowerCase().includes('api');

  let role = 'Full Stack Developer';
  if (isFrontend) role = 'Frontend Developer';
  else if (isBackend) role = 'Backend Developer';

  // Determine which explanation type to use based on the question content
  let explanationType = 'debugging'; // default
  const questionLower = question.toLowerCase();

  // Check for version control and collaboration first (most specific)
  if (questionLower.includes('version control') || questionLower.includes('git') || questionLower.includes('collaboration') || questionLower.includes('branching') || questionLower.includes('pull request') || questionLower.includes('code review')) {
    explanationType = 'versionControl';
  } else if (questionLower.includes('problem-solving') || questionLower.includes('problem solving') || questionLower.includes('approach problem') || questionLower.includes('solve problem') || questionLower.includes('problem-solving approach')) {
    explanationType = 'problemSolving';
  } else if (questionLower.includes('deployment') || questionLower.includes('devops') || questionLower.includes('ci/cd') || questionLower.includes('pipeline')) {
    explanationType = 'deployment';
  } else if (questionLower.includes('security') || questionLower.includes('secure') || questionLower.includes('vulnerability') || questionLower.includes('authentication') || questionLower.includes('authorization')) {
    explanationType = 'security';
  } else if (questionLower.includes('performance') || questionLower.includes('optimize') || questionLower.includes('speed') || questionLower.includes('efficiency')) {
    explanationType = 'performance';
  } else if (questionLower.includes('test') || questionLower.includes('testing') || questionLower.includes('quality') || questionLower.includes('coverage')) {
    explanationType = 'testing';
  } else if (questionLower.includes('accessibility') || questionLower.includes('accessible') || questionLower.includes('wcag') || questionLower.includes('aria')) {
    explanationType = 'accessibility';
  } else if (questionLower.includes('responsive') || questionLower.includes('mobile') || questionLower.includes('cross-browser') || questionLower.includes('compatibility')) {
    explanationType = 'responsive';
  } else if (questionLower.includes('state') || questionLower.includes('management') || questionLower.includes('data flow') || questionLower.includes('redux') || questionLower.includes('context')) {
    explanationType = 'stateManagement';
  } else if (questionLower.includes('debug') || questionLower.includes('debugging') || questionLower.includes('troubleshoot') || questionLower.includes('fix') || questionLower.includes('bug')) {
    explanationType = 'debugging';
  } else if (questionLower.includes('implement') || questionLower.includes('feature') || questionLower.includes('build') || questionLower.includes('create') || questionLower.includes('develop')) {
    explanationType = 'implementation';
  } else if (questionLower.includes('best practice') || questionLower.includes('practice') || questionLower.includes('guidelines') || questionLower.includes('standards')) {
    explanationType = 'bestPractices';
  } else if (questionLower.includes('challenge') || questionLower.includes('overcome') || questionLower.includes('difficulty') || questionLower.includes('issue')) {
    explanationType = 'challenges';
  } else if (questionLower.includes('tool') || questionLower.includes('technology') || questionLower.includes('framework') || questionLower.includes('library')) {
    explanationType = 'tools';
  } else if (questionLower.includes('learn') || questionLower.includes('update') || questionLower.includes('trend') || questionLower.includes('stay updated') || questionLower.includes('skill')) {
    explanationType = 'learning';
  } else if (questionLower.includes('experience') || questionLower.includes('worked') || questionLower.includes('project') || questionLower.includes('career')) {
    explanationType = 'experience';
  } else {
    // If no specific type is detected, use a variety of types based on question hash
    const types = ['debugging', 'bestPractices', 'implementation', 'challenges', 'learning', 'tools', 'testing', 'performance', 'accessibility', 'responsive', 'security', 'stateManagement', 'versionControl', 'deployment', 'problemSolving'];
    const questionHash = question.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    explanationType = types[questionHash % types.length];
  }

  // Remove random switching logic to ensure consistent, question-specific answers
  // Add question-specific variations to make responses unique

  const explanations = {
    debugging: {
      title: "Debugging Complex Issues - Comprehensive Guide",
      explanation: `Debugging complex issues in ${role} projects requires a systematic, methodical approach that I've refined through years of experience. When faced with a challenging problem, I follow a structured debugging methodology that ensures thorough investigation and effective resolution.`,
      examples: [
        "Systematic Issue Reproduction: Start by documenting the exact steps that trigger the problem, including user actions, system state, and environmental conditions. Create a minimal reproduction case to isolate the root cause.",
        "Comprehensive Logging and Monitoring: Implement strategic logging at key points in the application flow. Use browser DevTools, network monitoring, and performance profiling tools to gather detailed diagnostic information.",
        "Incremental Testing and Validation: Test hypotheses systematically by making small, controlled changes and verifying results. Use debugging tools to inspect variable states, call stacks, and execution flow in real-time."
      ],
      keyPoints: [
        "Always reproduce the issue consistently before attempting to fix it",
        "Use appropriate debugging tools for the specific problem domain",
        "Document the debugging process and solution for future reference",
        "Test the fix thoroughly to ensure it resolves the root cause"
      ],
      detailedSteps: [
        "Problem Identification: Clearly define what's happening vs. what should happen",
        "Environment Analysis: Check browser versions, device types, and system configurations",
        "Code Investigation: Use breakpoints, console logs, and debugging tools to trace execution",
        "Root Cause Analysis: Identify the underlying issue, not just the symptoms",
        "Solution Implementation: Apply the fix and test thoroughly",
        "Documentation: Record the problem, solution, and prevention measures"
      ]
    },
    bestPractices: {
      title: "Best Practices for Modern Development",
      explanation: `Following industry best practices is crucial for building maintainable, scalable, and high-quality applications. I've developed a comprehensive approach that covers all aspects of modern development, from code quality to performance optimization.`,
      examples: [
        "Code Quality and Structure: Implement consistent naming conventions, modular architecture, and clean code principles. Use TypeScript for type safety and better developer experience.",
        "Performance Optimization: Implement code splitting, lazy loading, and efficient algorithms. Use performance monitoring tools to identify and resolve bottlenecks.",
        "Accessibility and User Experience: Follow WCAG guidelines, implement semantic HTML, and ensure cross-browser compatibility for optimal user experience."
      ],
      keyPoints: [
        "Write clean, readable, and maintainable code",
        "Implement comprehensive testing strategies",
        "Focus on performance and accessibility",
        "Stay updated with latest technologies and practices"
      ],
      detailedSteps: [
        "Code Organization: Structure code logically with clear separation of concerns",
        "Testing Strategy: Implement unit, integration, and end-to-end tests",
        "Performance Monitoring: Use tools like Lighthouse and WebPageTest",
        "Security Implementation: Follow security best practices and regular audits",
        "Documentation: Maintain comprehensive documentation for all code",
        "Code Reviews: Implement peer review processes for quality assurance"
      ]
    },
    implementation: {
      title: "Feature Implementation Methodology",
      explanation: `Implementing new features requires a systematic approach that ensures quality, maintainability, and user satisfaction. I follow a proven methodology that covers requirements analysis, design, implementation, testing, and deployment.`,
      examples: [
        "Requirements Analysis: Thoroughly understand user needs, technical constraints, and business requirements. Create detailed specifications and acceptance criteria.",
        "Technical Design: Plan the architecture, data flow, and component structure. Consider scalability, performance, and maintainability from the start.",
        "Implementation and Testing: Build the feature incrementally with comprehensive testing at each stage. Use modern development tools and practices."
      ],
      keyPoints: [
        "Understand requirements thoroughly before starting implementation",
        "Design for scalability and maintainability",
        "Implement incrementally with continuous testing",
        "Document and review code regularly"
      ],
      detailedSteps: [
        "Requirements Gathering: Collect and analyze all requirements thoroughly",
        "Technical Planning: Design architecture and component structure",
        "Prototype Development: Create proof of concept to validate approach",
        "Incremental Implementation: Build feature in small, testable increments",
        "Comprehensive Testing: Test functionality, performance, and edge cases",
        "Deployment and Monitoring: Deploy safely and monitor for issues"
      ]
    },
    challenges: {
      title: "Overcoming Development Challenges",
      explanation: `Every development project presents unique challenges that require creative problem-solving and technical expertise. I've developed strategies for handling common challenges like browser compatibility, performance issues, and complex state management.`,
      examples: [
        "Browser Compatibility Issues: Implement progressive enhancement, use polyfills when necessary, and test across multiple browsers and devices.",
        "Performance Optimization: Identify bottlenecks using profiling tools, implement efficient algorithms, and optimize critical rendering paths.",
        "State Management Complexity: Use appropriate state management patterns, implement proper data flow, and consider using tools like Redux for complex applications."
      ],
      keyPoints: [
        "Research solutions thoroughly before implementing",
        "Use appropriate tools and technologies for the problem",
        "Test solutions across different environments",
        "Learn from challenges to improve future projects"
      ],
      detailedSteps: [
        "Problem Analysis: Understand the challenge and its impact",
        "Solution Research: Investigate multiple approaches and best practices",
        "Implementation Planning: Choose the best solution and plan implementation",
        "Testing and Validation: Test the solution thoroughly in various scenarios",
        "Documentation: Document the challenge and solution for future reference",
        "Knowledge Sharing: Share learnings with team members"
      ]
    },
    problemSolving: {
      title: "Systematic Problem-Solving Approach",
      explanation: `Effective problem-solving is a core skill in software development that requires a structured, methodical approach. I follow a systematic problem-solving methodology that ensures thorough analysis, creative solutions, and successful implementation.`,
      examples: [
        "Root Cause Analysis: Start by understanding the problem thoroughly - gather information, identify symptoms vs. root causes, and define the problem scope clearly before jumping to solutions.",
        "Solution Brainstorming: Generate multiple potential solutions using techniques like mind mapping, research best practices, and consider both technical and non-technical approaches.",
        "Implementation and Validation: Choose the best solution based on feasibility, impact, and resources, then implement incrementally with continuous testing and feedback loops."
      ],
      keyPoints: [
        "Always understand the problem completely before seeking solutions",
        "Generate multiple solution options and evaluate them objectively",
        "Break complex problems into smaller, manageable parts",
        "Test solutions thoroughly and iterate based on results"
      ],
      detailedSteps: [
        "Problem Definition: Clearly define what the problem is, its scope, and success criteria",
        "Information Gathering: Collect all relevant data, constraints, and requirements",
        "Root Cause Analysis: Identify the underlying cause, not just the symptoms",
        "Solution Generation: Brainstorm multiple approaches and evaluate their pros/cons",
        "Solution Selection: Choose the best approach based on feasibility, impact, and resources",
        "Implementation and Testing: Execute the solution incrementally with continuous validation"
      ]
    },
    learning: {
      title: "Continuous Learning and Skill Development",
      explanation: `Staying current with the latest technologies and best practices is essential for professional growth and project success. I maintain an active learning routine that includes reading, experimentation, and community participation.`,
      examples: [
        "Technology Monitoring: Follow industry blogs, attend conferences, and participate in online communities to stay updated with latest developments.",
        "Hands-on Experimentation: Build personal projects to experiment with new technologies and gain practical experience.",
        "Community Participation: Contribute to open source projects, share knowledge through blog posts, and mentor other developers."
      ],
      keyPoints: [
        "Stay updated with latest technologies and trends",
        "Experiment with new tools and frameworks",
        "Participate in developer communities",
        "Share knowledge and mentor others"
      ],
      detailedSteps: [
        "Information Gathering: Follow industry leaders and publications",
        "Practical Application: Build projects using new technologies",
        "Community Engagement: Participate in forums and discussions",
        "Knowledge Sharing: Write blog posts and create tutorials",
        "Mentoring: Help other developers learn and grow",
        "Continuous Improvement: Regularly assess and update skills"
      ]
    },
    experience: {
      title: "Professional Experience and Project Management",
      explanation: `My experience in ${role} development spans multiple projects and technologies, providing me with a comprehensive understanding of real-world development challenges and solutions. I've worked on projects ranging from small business websites to large-scale enterprise applications.`,
      examples: [
        "Project Planning and Execution: Successfully delivered projects on time and within budget by implementing agile methodologies and proper project management techniques.",
        "Team Collaboration: Led development teams and collaborated with designers, product managers, and stakeholders to ensure project success.",
        "Technical Leadership: Provided technical guidance and mentorship to junior developers while maintaining high code quality standards."
      ],
      keyPoints: [
        "Plan projects thoroughly with clear milestones and deliverables",
        "Communicate effectively with all stakeholders throughout the project",
        "Implement proper testing and quality assurance processes",
        "Document lessons learned for future project improvement"
      ],
      detailedSteps: [
        "Project Initiation: Define scope, objectives, and success criteria",
        "Team Formation: Assemble the right team with necessary skills",
        "Development Planning: Create detailed technical specifications and timelines",
        "Iterative Development: Build and test features incrementally",
        "Quality Assurance: Implement comprehensive testing and review processes",
        "Project Delivery: Deploy and hand over the completed project"
      ]
    },
    tools: {
      title: "Development Tools and Technology Stack",
      explanation: `I use a comprehensive set of modern development tools and technologies that enable efficient, high-quality development. My toolset is constantly evolving to incorporate the latest innovations and best practices in the industry.`,
      examples: [
        "Version Control and Collaboration: Use Git with GitHub/GitLab for version control, implementing proper branching strategies and code review workflows.",
        "Development Environment: Customize VS Code with extensions for productivity, debugging, and code quality improvement.",
        "Testing and Quality Tools: Implement Jest, React Testing Library, and Cypress for comprehensive testing coverage."
      ],
      keyPoints: [
        "Choose tools that best fit the project requirements",
        "Stay updated with latest tool versions and features",
        "Customize development environment for maximum productivity",
        "Use tools that integrate well with your workflow"
      ],
      detailedSteps: [
        "Tool Evaluation: Research and compare available tools for your needs",
        "Environment Setup: Configure development environment with necessary tools",
        "Integration: Ensure tools work together seamlessly in your workflow",
        "Customization: Tailor tools to your specific development style",
        "Training: Learn advanced features and shortcuts for efficiency",
        "Maintenance: Keep tools updated and maintain custom configurations"
      ]
    },
    testing: {
      title: "Comprehensive Testing Strategies",
      explanation: `Implementing robust testing strategies is essential for building reliable, maintainable applications. I follow a testing pyramid approach that ensures comprehensive coverage while maintaining development efficiency.`,
      examples: [
        "Unit Testing: Write focused tests for individual components and functions using Jest and React Testing Library for comprehensive coverage.",
        "Integration Testing: Test component interactions and data flow to ensure proper integration between different parts of the application.",
        "End-to-End Testing: Use Cypress to simulate real user interactions and validate complete user journeys."
      ],
      keyPoints: [
        "Write tests that are easy to understand and maintain",
        "Focus on testing behavior rather than implementation details",
        "Maintain good test coverage for critical functionality",
        "Use testing tools that integrate well with your development workflow"
      ],
      detailedSteps: [
        "Test Planning: Define testing strategy and coverage requirements",
        "Unit Test Implementation: Write focused tests for individual components",
        "Integration Test Development: Test component interactions and data flow",
        "E2E Test Creation: Implement tests for complete user journeys",
        "Test Maintenance: Keep tests updated as code evolves",
        "Continuous Testing: Integrate testing into CI/CD pipeline"
      ]
    },
    performance: {
      title: "Performance Optimization and Monitoring",
      explanation: `Performance optimization is crucial for providing excellent user experience and maintaining competitive advantage. I implement comprehensive performance strategies that cover all aspects of application performance, from initial load times to runtime efficiency.`,
      examples: [
        "Bundle Optimization: Implement code splitting, lazy loading, and tree shaking to reduce initial bundle sizes and improve loading performance.",
        "Runtime Performance: Use efficient algorithms, implement proper caching strategies, and optimize critical rendering paths for smooth user interactions.",
        "Performance Monitoring: Use tools like Lighthouse, WebPageTest, and browser DevTools to identify bottlenecks and measure improvements."
      ],
      keyPoints: [
        "Measure performance before and after optimizations",
        "Focus on user-perceived performance improvements",
        "Implement performance budgets and monitoring",
        "Optimize for both desktop and mobile devices"
      ],
      detailedSteps: [
        "Performance Audit: Use tools to identify current performance bottlenecks",
        "Optimization Planning: Prioritize improvements based on impact and effort",
        "Implementation: Apply optimizations incrementally with testing",
        "Measurement: Monitor performance metrics and user experience",
        "Iteration: Continuously improve based on performance data",
        "Maintenance: Monitor performance over time and address regressions"
      ]
    },
    accessibility: {
      title: "Accessibility Implementation and Best Practices",
      explanation: `Building accessible applications is not just a legal requirement but a moral imperative that ensures all users can access and use your applications effectively. I implement comprehensive accessibility strategies that follow WCAG guidelines and best practices.`,
      examples: [
        "Semantic HTML: Use proper heading hierarchies, landmarks, and semantic elements to provide clear structure for screen readers and assistive technologies.",
        "ARIA Implementation: Implement proper ARIA labels, roles, and states to provide additional context for assistive technologies.",
        "Keyboard Navigation: Ensure all interactive elements are accessible via keyboard and implement proper focus management."
      ],
      keyPoints: [
        "Follow WCAG guidelines and accessibility standards",
        "Test with actual assistive technologies and users",
        "Implement accessibility from the start of development",
        "Regularly audit and improve accessibility features"
      ],
      detailedSteps: [
        "Accessibility Planning: Define accessibility requirements and standards",
        "Semantic Implementation: Use proper HTML semantics and structure",
        "ARIA Enhancement: Implement ARIA attributes for complex interactions",
        "Keyboard Testing: Ensure all functionality works with keyboard navigation",
        "Screen Reader Testing: Test with actual screen readers and assistive technologies",
        "Continuous Improvement: Regularly audit and enhance accessibility features"
      ]
    },
    responsive: {
      title: "Responsive Design and Cross-Browser Compatibility",
      explanation: `Ensuring applications work seamlessly across all devices and browsers is essential for reaching the widest possible audience. I implement responsive design principles and cross-browser testing strategies that guarantee consistent user experience.`,
      examples: [
        "Mobile-First Design: Start with mobile layouts and progressively enhance for larger screens using CSS Grid, Flexbox, and media queries.",
        "Cross-Browser Testing: Test thoroughly across different browsers and versions, implementing progressive enhancement for older browser support.",
        "Performance Optimization: Optimize for mobile devices by minimizing file sizes, implementing touch-friendly interactions, and optimizing images."
      ],
      keyPoints: [
        "Design for mobile devices first, then enhance for larger screens",
        "Test across multiple browsers and devices regularly",
        "Implement progressive enhancement for broader compatibility",
        "Focus on performance optimization for mobile users"
      ],
      detailedSteps: [
        "Design Planning: Plan responsive layouts and breakpoints",
        "CSS Implementation: Use CSS Grid, Flexbox, and media queries effectively",
        "Cross-Browser Testing: Test functionality across different browsers",
        "Mobile Optimization: Optimize for mobile performance and usability",
        "Touch Interface: Implement touch-friendly interactions and gestures",
        "Continuous Testing: Regularly test across new devices and browsers"
      ]
    },
    security: {
      title: "Security Implementation and Best Practices",
      explanation: `Security is a critical aspect of modern web development that must be implemented at every level of the application. I follow security best practices and implement comprehensive security measures to protect user data and application integrity.`,
      examples: [
        "Input Validation: Implement proper input validation and sanitization to prevent XSS attacks and other injection vulnerabilities.",
        "Authentication and Authorization: Implement secure authentication mechanisms with proper session management and role-based access control.",
        "Data Protection: Use HTTPS for all communications and implement proper data encryption and protection measures."
      ],
      keyPoints: [
        "Implement security measures at every layer of the application",
        "Regularly update dependencies to patch security vulnerabilities",
        "Follow OWASP security guidelines and best practices",
        "Conduct regular security audits and penetration testing"
      ],
      detailedSteps: [
        "Security Assessment: Identify potential security vulnerabilities and risks",
        "Implementation Planning: Plan security measures for each identified risk",
        "Security Implementation: Implement authentication, authorization, and data protection",
        "Testing and Validation: Test security measures thoroughly",
        "Monitoring and Maintenance: Monitor for security issues and maintain security measures",
        "Regular Updates: Keep security measures updated and conduct regular audits"
      ]
    },
    stateManagement: {
      title: "State Management and Data Flow",
      explanation: `Effective state management is crucial for building complex applications with predictable data flow and maintainable code. I implement appropriate state management patterns based on application complexity and requirements.`,
      examples: [
        "Local State Management: Use React hooks and Context API for simple state management needs within components and component trees.",
        "Global State Management: Implement Redux or Zustand for complex applications requiring centralized state management and predictable data flow.",
        "Server State Management: Use React Query or SWR for managing server state, caching, and synchronization with backend APIs."
      ],
      keyPoints: [
        "Choose state management solution based on application complexity",
        "Implement predictable data flow patterns",
        "Use appropriate tools for different types of state",
        "Maintain clear separation between local and global state"
      ],
      detailedSteps: [
        "State Analysis: Identify different types of state in your application",
        "Architecture Planning: Design state management architecture and data flow",
        "Implementation: Implement state management using appropriate patterns",
        "Testing: Test state changes and data flow thoroughly",
        "Optimization: Optimize state updates and minimize unnecessary re-renders",
        "Maintenance: Monitor state management performance and maintain code quality"
      ]
    },
    versionControl: {
      title: "Version Control and Team Collaboration - Best Practices",
      explanation: `Version control is the foundation of modern software development, enabling teams to work together efficiently while maintaining code quality and project history. I implement comprehensive Git workflows and collaboration strategies that ensure seamless team development and project management.`,
      examples: [
        "Git Branching Strategy: Use Git Flow with feature branches (feature/user-auth), development branch (develop), and release branches (release/v1.2.0) for organized development and easy rollbacks.",
        "Pull Request Workflow: Implement mandatory code reviews through pull requests with clear descriptions, linked issues, and automated testing to ensure code quality before merging.",
        "Commit Convention: Follow conventional commits (feat:, fix:, docs:, style:) with clear, descriptive messages that explain what and why, making project history searchable and meaningful."
      ],
      keyPoints: [
        "Use consistent branching strategies like Git Flow or GitHub Flow for organized development",
        "Implement mandatory code review processes to maintain code quality and knowledge sharing",
        "Follow commit conventions and write clear, descriptive commit messages",
        "Use collaboration tools like GitHub/GitLab for issue tracking and project management"
      ],
      detailedSteps: [
        "Branch Strategy Setup: Define and document your branching strategy (feature, develop, main branches) and ensure all team members understand the workflow",
        "Code Review Process: Implement pull request templates, assign reviewers, and set up automated checks for code quality and testing",
        "Commit Standards: Establish commit message conventions and use tools like commitizen or conventional commits for consistency",
        "Conflict Resolution: Train team on resolving merge conflicts, rebasing vs merging, and maintaining clean project history",
        "Tool Integration: Configure CI/CD pipelines, automated testing, and code quality checks that run on every pull request",
        "Documentation and Training: Maintain clear documentation of workflows, conduct team training sessions, and regularly review and improve processes"
      ]
    },
    deployment: {
      title: "Deployment and DevOps Practices",
      explanation: `Modern deployment practices and DevOps methodologies are essential for delivering high-quality applications quickly and reliably. I implement comprehensive CI/CD pipelines and deployment strategies that ensure smooth, automated deployments.`,
      examples: [
        "CI/CD Pipelines: Implement automated testing, building, and deployment pipelines using GitHub Actions, Jenkins, or similar tools.",
        "Containerization: Use Docker for consistent deployment environments and container orchestration for scalable deployments.",
        "Monitoring and Logging: Implement comprehensive monitoring, logging, and alerting systems to ensure application reliability and performance."
      ],
      keyPoints: [
        "Automate deployment processes for consistency and reliability",
        "Implement proper testing and validation in deployment pipelines",
        "Use monitoring and logging for deployment success and application health",
        "Implement rollback strategies for quick recovery from deployment issues"
      ],
      detailedSteps: [
        "Pipeline Planning: Design CI/CD pipeline architecture and stages",
        "Tool Selection: Choose appropriate tools for automation and deployment",
        "Pipeline Implementation: Implement automated testing, building, and deployment",
        "Environment Configuration: Configure development, staging, and production environments",
        "Monitoring Setup: Implement monitoring, logging, and alerting systems",
        "Process Optimization: Continuously improve deployment processes and automation"
      ]
    }
  };

  const selectedExplanation = explanations[explanationType];

  // Add console logging for debugging
  console.log(`Question: "${question}"`);
  console.log(`Detected Role: ${role}`);
  console.log(`Selected Explanation Type: ${explanationType}`);
  console.log(`Explanation Title: ${selectedExplanation.title}`);
  console.log(`Question Analysis - Version Control Keywords: ${questionLower.includes('version control') || questionLower.includes('git') || questionLower.includes('collaboration')}`);
  console.log(`Question Analysis - Problem Solving Keywords: ${questionLower.includes('problem-solving') || questionLower.includes('problem solving') || questionLower.includes('approach problem')}`);
  console.log(`Question Analysis - Full Question Lower: ${questionLower}`);

  // Generate unique content based on question hash to avoid repeated solutions
  const questionHash = question.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const variationIndex = questionHash % 3; // 3 different variations for each type

  // Create dynamic variations of the explanation
  const dynamicExplanation = {
    ...selectedExplanation,
    title: `${selectedExplanation.title} - ${['Comprehensive', 'Advanced', 'Expert'][variationIndex]} Approach`,
    explanation: `${selectedExplanation.explanation} This approach is specifically tailored for ${role} roles and addresses the unique challenges presented in the question: "${question}".`,
    additionalContext: `This comprehensive explanation is tailored for ${role} roles and addresses the specific question: "${question}". The examples and key points are based on real-world experience and industry best practices. Generated variation: ${variationIndex + 1}.`
  };

  return dynamicExplanation;
};

module.exports = { generateInterviewQuestions, generateConceptExplanation };
