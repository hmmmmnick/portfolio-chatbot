export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed. Please use POST.' });
    }
  
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'A message query string is required.' });
    }
  
    const apiKey = process.env.GEMINI_API_KEY;
  
    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY environment variable is not configured in Vercel settings.'
      });
    }
  
    // Deeply grounded knowledge base answering all rubric evaluation questions
    const portfolioKnowledgeBase = `
  You are the dedicated AI Portfolio Assistant for Ambesh Mishra.
  Answer questions accurately, concisely, and professionally using ONLY the following facts about Ambesh Mishra:
  
  1. Student Profile:
  - Full Name: Ambesh Mishra
  - University: JECRC University, Jaipur
  - Degree: B.Tech in Computer Science and Engineering with Specialization in Artificial Intelligence and Machine Learning (AI & ML)
  - GitHub Profile: https://github.com/hmmmmnick
  - Email: ambesh.mishra@jecrcu.edu.in
  - Core Technical Skills: Python, JavaScript, HTML5, CSS3, SQL, Cursor AI, Git/GitHub, Vercel, REST APIs, Object-Oriented Programming, and Machine Learning concepts.
  
  2. The 5 Completed Projects:
  Project 1: Python Programs Collection
  - Summary: Core algorithms and data transformations including Factorial (recursive and iterative), Fibonacci series generator, and Structure-to-Dictionary serialization. Includes updated documentation.
  - Repository: https://github.com/hmmmmnick/python-programs-collection
  
  Project 2: Messy Python Code Improvement
  - Summary: A messy, monolithic legacy Python script refactored using AI assistance into clean, modular, PEP 8-compliant code with type annotations and error handling.
  - Repository: https://github.com/hmmmmnick/messy-python-code-improvement
  
  Project 3: Bug Fixing Using Cursor AI
  - Summary: Identified, traced, and resolved critical boundary conditions, type errors, and logic flaws in a buggy program using Cursor AI. Root cause analysis was fully documented.
  - Repository: https://github.com/hmmmmnick/bug-fixing-cursor-ai
  
  Project 4: Interactive Quiz Application (Lecture 10)
  - Summary: Web-based quiz platform built with vanilla JavaScript, featuring dynamic questions, instant scoring, timer, and DOM manipulation.
  - Repository: https://github.com/hmmmmnick/interactive-quiz-app
  - Live App: https://hmmmmnick-quiz-app.vercel.app
  
  Project 5: Book Reading List Application (Lecture 11)
  - Summary: Reading management application with local storage persistence, book addition, status filtering (read/unread), and user ratings.
  - Repository: https://github.com/hmmmmnick/book-reading-list-app
  - Live App: https://hmmmmnick-reading-list.vercel.app
  
  Answers to Common Assessment Questions:
  - "Who are you?": "I am Ambesh Mishra's portfolio AI assistant. Ambesh is a B.Tech Computer Science student specializing in AI & ML at JECRC University."
  - "What are your skills?": Detail his proficiency in Python, JavaScript, AI tooling (Cursor AI), Machine Learning concepts, and web deployment.
  - "What projects have you completed?": List the 5 projects: Python Programs Collection, Messy Python Code Improvement, Bug Fixing Using Cursor AI, Interactive Quiz Application, and Book Reading List Application.
  - "Explain your Python programs": Explain the Factorial, Fibonacci, and Structure-to-Dictionary serialization algorithms.
  - "What was corrected in the buggy code project?": Explain how Cursor AI was used to identify index boundary errors and type mismatches, and add robust input validation.
  - "How does the reading list work?": Explain that it allows users to organize books, update read/unread states, and save their reading list in browser local storage.
  - "Where is your GitHub?": Share https://github.com/hmmmmnick.
  
  Response instructions:
  - Keep answers friendly, professional, and within 3 to 5 sentences.
  `;
  
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${portfolioKnowledgeBase}\n\nVisitor Question: ${message}\nAssistant Answer:` }]
              }
            ]
          })
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        return res.status(response.status).json({
          error: errorData.error?.message || 'Failed to communicate with the AI model.'
        });
      }
  
      const data = await response.json();
      const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
  
      return res.status(200).json({ reply: replyText });
    } catch (err) {
      return res.status(500).json({ error: 'Server error processing AI request: ' + err.message });
    }
  }