# OpenEduKit.js

> **Lightweight, Zero-Dependency Educational Exam Utilities for the Modern Software Ecosystem.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#contributing)

**OpenEduKit.js** is a plug-and-play JavaScript utility library designed for educators, coaching centers, and educational software platforms. It allows you to automate exam workflows, generate print-perfect OMR answer sheets, render digital interactive quizzes from simple JSON schemas, and calculate automated grading scorecard reports.

---

## 🌟 Key Features

*   **Low-Ink OMR Sheet Generator**: Output is strictly optimized for **A4 portrait printing**, completely black-and-white, using thin-bordered circles and transparent background fills for minimal ink consumption.
*   **JSON-Driven Quiz Module**: Renders interactive digital tests dynamically from JSON configuration files, saving answers in-memory and dispatching completion hooks.
*   **Response Grader & Analyzer**: Compares student responses against answer keys to generate summaries (score, incorrect questions count, percentage accuracy, and sections performance).
*   **Zero Dependencies**: Written in pure vanilla HTML5, CSS3, and modern Javascript. No heavy framework dependencies (React, Angular, Vue, or Tailwind) required.

---

## 📦 Installation

To use **OpenEduKit.js** in your web application, copy the source files from the `src/` directory into your project, or reference them in your HTML:

```html
<!-- Import the stylesheet for OMR and Quiz layouts -->
<link rel="stylesheet" href="path/to/openedukit.css">

<!-- Import the core script modules -->
<script src="path/to/omr-generator.js"></script>
<script src="path/to/quiz-engine.js"></script>
<script src="path/to/exam-analyzer.js"></script>
```

---

## 🚀 Quick Start & Integration Guides

### 1. Dynamic OMR Sheet Generator
Create a target container in your HTML:
```html
<div id="omr-sheet-mount"></div>
```
Initialize the OMR Generator with configuration options:
```javascript
OpenEduKit.generateOMR({
  containerId: 'omr-sheet-mount',
  title: 'ANNUAL SCIENCE EXAM 2026',
  totalQuestions: 90,
  optionsPerQuestion: 4, // Generates 'A', 'B', 'C', 'D'
  columns: 3,            // Organizes questions into 3 grid columns
  interactive: true      // Allows selection clicking in preview
});
```

### 2. JSON-Driven Interactive Quiz
Define your questions in JSON structure:
```json
{
  "quizTitle": "General Biology Quiz",
  "questions": [
    {
      "id": 1,
      "questionText": "What is the powerhouse of the cell?",
      "options": ["Nucleus", "Ribosome", "Mitochondria", "Lysosome"],
      "correctAnswerIndex": 2
    }
  ]
}
```
Mount the quiz using the interactive engine:
```javascript
const exam = new OpenEduKit.QuizEngine({
  containerId: 'quiz-mount',
  quizData: myQuizData,
  onComplete: (studentResponses) => {
    console.log("Exam submitted:", studentResponses);
  }
});

// Start the quiz lifecycle
exam.init();
```

### 3. Exam Grader & Analyzer
Verify responses and output reports:
```javascript
// Calculate grades
const report = OpenEduKit.analyzeExam(myQuizData.questions, studentResponses);

console.log(report.percentage); // Output score percentage (e.g. 85.5)
console.log(report.correct);    // Number of correct answers

// Render a beautiful analytical scorecard widget automatically
OpenEduKit.renderReportHTML('report-container', report);
```

---

## 🎨 A4 Print Optimization (Low-Ink Design)

The OMR sheet generator is strictly configured to conform to standard A4 page dimensions. When users click print or press `Ctrl + P`, the library applies custom `@media print` CSS overrides that:
*   Strips all website styling, headers, buttons, and navigation cards.
*   Enforces pure black-and-white print parameters.
*   Keeps grid dimensions stable, ensuring the sheet fits on a single page without bleeding or truncating rows.

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
