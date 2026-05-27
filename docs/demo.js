/**
 * Docs Demo Controller - OpenEduKit.js Playground
 */

// Tab Management
function switchTab(tabName) {
  // Hide all panels
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  
  // Show target panel
  const targetPanel = document.getElementById(`panel-${tabName}`);
  if (targetPanel) {
    targetPanel.classList.add('active');
  }
  
  // Mark button as active
  // Zero-base Explanation: We scan buttons to match text/onclick attributes, setting the selected tab's class.
  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(btn => {
    if (btn.getAttribute('onclick').includes(tabName)) {
      btn.classList.add('active');
    }
  });

  // If entering quiz tab, auto-load/reset quiz
  if (tabName === 'quiz') {
    resetPlaygroundQuiz();
  }
}

// 1. OMR Playground Generator
function buildPlaygroundOMR() {
  const title = document.getElementById('p-title').value;
  const totalQuestions = parseInt(document.getElementById('p-qs').value, 10) || 50;
  const optionsPerQuestion = parseInt(document.getElementById('p-opts').value, 10) || 4;
  const columns = parseInt(document.getElementById('p-cols').value, 10) || 3;

  window.OpenEduKit.generateOMR({
    containerId: 'playground-omr-output',
    title: title,
    totalQuestions: totalQuestions,
    optionsPerQuestion: optionsPerQuestion,
    columns: columns,
    interactive: true
  });
}

// 2. Quiz Playground Loader
const playgroundQuizData = {
  quizTitle: "OpenEduKit Ecosystem Test",
  questions: [
    {
      id: 1,
      questionText: "Which architecture pattern fits OpenEduKit.js?",
      options: ["Heavy framework dependency", "Vanilla JS with zero external dependencies", "Server-only PHP engine", "React/Redux complex single-page-app"],
      correctAnswerIndex: 1
    },
    {
      id: 2,
      questionText: "What is the primary optimization goal of OpenEduKit's OMR generator?",
      options: ["High ink usage and colored themes", "Dark-mode backgrounds for printers", "Completely black-and-white low-ink A4 printing format", "3D gradient styling"],
      correctAnswerIndex: 2
    },
    {
      id: 3,
      questionText: "Which format is used to configure exams and questions?",
      options: ["XML Data stream", "JSON Configuration schema", "YAML Configuration files", "CSV raw lists"],
      correctAnswerIndex: 1
    }
  ]
};

function resetPlaygroundQuiz() {
  const quizOutput = document.getElementById('playground-quiz-output');
  const analyzerOutput = document.getElementById('playground-analyzer-output');

  if (quizOutput && analyzerOutput) {
    quizOutput.style.display = 'block';
    analyzerOutput.style.display = 'none';

    const engine = new window.OpenEduKit.QuizEngine({
      containerId: 'playground-quiz-output',
      quizData: playgroundQuizData,
      onComplete: (studentResponses) => {
        const report = window.OpenEduKit.analyzeExam(playgroundQuizData.questions, studentResponses);
        
        quizOutput.style.display = 'none';
        analyzerOutput.style.display = 'block';
        
        window.OpenEduKit.renderReportHTML('playground-analyzer-output', report);
      }
    });

    engine.init();
  }
}

// Init playground on DOM load
document.addEventListener('DOMContentLoaded', () => {
  buildPlaygroundOMR();
});
