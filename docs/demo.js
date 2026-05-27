/**
 * Docs Demo Controller - OpenEduKit.js Playground
 */

let playgroundLogoBase64 = "";

// Tab Management
function switchTab(tabName) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  
  const targetPanel = document.getElementById(`panel-${tabName}`);
  if (targetPanel) {
    targetPanel.classList.add('active');
  }
  
  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(btn => {
    if (btn.getAttribute('onclick').includes(tabName)) {
      btn.classList.add('active');
    }
  });

  if (tabName === 'quiz') {
    resetPlaygroundQuiz();
  }
}

// OMR Playground Generator
function buildPlaygroundOMR() {
  const boardTitle = document.getElementById('p-board').value;
  const examTitle = document.getElementById('p-title').value;
  
  const rawMeta = document.getElementById('p-meta').value;
  const metaFields = rawMeta.split(',').map(f => f.trim()).filter(f => f.length > 0);

  const showRollNumber = document.getElementById('p-show-roll').checked;
  const rollNumberDigits = parseInt(document.getElementById('p-roll-digits').value, 10) || 10;

  const showBookletNumber = document.getElementById('p-show-booklet').checked;
  const bookletNumberDigits = parseInt(document.getElementById('p-booklet-digits').value, 10) || 10;

  const showBarcode = document.getElementById('p-show-barcode').checked;
  const showSeries = document.getElementById('p-show-series').checked;

  const rawSeries = document.getElementById('p-series-list').value;
  const seriesList = rawSeries.split(',').map(s => s.trim().toUpperCase()).filter(s => s.length > 0);
  const seriesLetter = document.getElementById('p-series-val').value.trim().toUpperCase();

  const totalQuestions = parseInt(document.getElementById('p-qs').value, 10) || 100;
  const optionsPerQuestion = parseInt(document.getElementById('p-opts').value, 10) || 4;
  const columns = parseInt(document.getElementById('p-cols').value, 10) || 5;

  window.OpenEduKit.generateOMR({
    containerId: 'playground-omr-output',
    boardTitle: boardTitle,
    examTitle: examTitle,
    logoUrl: playgroundLogoBase64,
    metaFields: metaFields,
    showRollNumber: showRollNumber,
    rollNumberDigits: rollNumberDigits,
    showBookletNumber: showBookletNumber,
    bookletNumberDigits: bookletNumberDigits,
    showBarcode: showBarcode,
    showSeries: showSeries,
    seriesList: seriesList,
    seriesLetter: seriesLetter,
    totalQuestions: totalQuestions,
    optionsPerQuestion: optionsPerQuestion,
    columns: columns,
    interactive: true
  });
}

// Quiz Playground Loader
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

// Bind live customization triggers and inputs on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  // Bind input display toggles
  const showRollCheck = document.getElementById('p-show-roll');
  if (showRollCheck) {
    showRollCheck.addEventListener('change', (e) => {
      document.getElementById('p-roll-opt').style.display = e.target.checked ? 'flex' : 'none';
    });
  }

  const showBookletCheck = document.getElementById('p-show-booklet');
  if (showBookletCheck) {
    showBookletCheck.addEventListener('change', (e) => {
      document.getElementById('p-booklet-opt').style.display = e.target.checked ? 'flex' : 'none';
    });
  }

  const showSeriesCheck = document.getElementById('p-show-series');
  if (showSeriesCheck) {
    showSeriesCheck.addEventListener('change', (e) => {
      document.getElementById('p-series-opt').style.display = e.target.checked ? 'flex' : 'none';
    });
  }

  // Bind logo file uploader
  const logoFileEl = document.getElementById('p-logo-file');
  if (logoFileEl) {
    logoFileEl.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          playgroundLogoBase64 = evt.target.result;
          buildPlaygroundOMR(); // Re-render preview
        };
        reader.readAsDataURL(file);
      }
    });
  }

  buildPlaygroundOMR();
});
