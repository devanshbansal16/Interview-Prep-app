const questionAnswerPrompt = (role, experience, topicsToFocus, numberOfQuestions, timestamp, randomSeed) => (`
Generate ${numberOfQuestions} unique interview questions for a ${role} position with ${experience} experience. Focus on: ${topicsToFocus}.

Requirements:
- Each question must be different
- Cover technical skills, problem-solving, best practices
- Make answers practical with examples
- Use seed ${randomSeed} for variety

Return ONLY a valid JSON array:
[
  {
    "question": "How would you implement a responsive navigation menu?",
    "answer": "I would use CSS Grid/Flexbox, media queries, and ensure accessibility with ARIA labels. Here's my approach: [detailed explanation]"
  }
]

Make questions specific to ${role} and ${topicsToFocus}.
`)

const conceptExplainPrompt = (question) => (`
Explain this interview question: "${question}"

Provide a clear, practical explanation with examples and key points.

Return ONLY a valid JSON object:
{
  "title": "Title for the explanation",
  "explanation": "Clear explanation with practical examples",
  "examples": [
    "Example 1",
    "Example 2", 
    "Example 3"
  ],
  "keyPoints": [
    "Key point 1",
    "Key point 2",
    "Key point 3",
    "Key point 4"
  ],
  "detailedSteps": [
    "Step 1",
    "Step 2",
    "Step 3",
    "Step 4",
    "Step 5",
    "Step 6"
  ]
}
`);

module.exports = { questionAnswerPrompt, conceptExplainPrompt };