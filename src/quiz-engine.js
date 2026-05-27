/**
 * OpenEduKit.js - Interactive JSON-Driven Quiz Module
 * 
 * Zero-Base Developer Explanations:
 * - What is Class/State? "State" is the configuration or values of an application at any point in time.
 *   Here, state represents: (a) what question the student is viewing right now, (b) which answers they picked.
 * - Why use standard JS event handling? Attaching standard event listeners (.addEventListener) ensures
 *   compatibility across all browsers without adding heavy virtual-DOM layers like React.
 * - How we prevent memory leaks: Clean DOM event reference management prevents background browser threads
 *   from retaining old DOM nodes in memory after rebuilds.
 */

(function (global) {
  'use strict';

  class QuizEngine {
    /**
     * Initializes the Quiz Engine
     * @param {Object} config Configuration settings
     * @param {string} config.containerId DOM ID where quiz will render
     * @param {Object} config.quizData The JSON structure containing quizTitle, and questions array
     * @param {function} [config.onComplete] Callback when user submits quiz. Receives studentResponses.
     */
    constructor(config) {
      this.containerId = config.containerId;
      this.quizData = config.quizData;
      this.onComplete = config.onComplete || null;

      // Internal State
      this.currentQuestionIndex = 0;
      this.responses = {}; // Maps question ID or index to chosen option index

      this.container = document.getElementById(this.containerId);
      if (!this.container) {
        console.error(`OpenEduKit Quiz: Container with ID "${this.containerId}" was not found.`);
      }
    }

    /**
     * Initiates the rendering of the quiz interface
     */
    init() {
      if (!this.container) return;
      this.render();
    }

    /**
     * Renders the current state of the quiz into the container
     */
    render() {
      this.container.innerHTML = '';

      // Create Quiz Card Container
      const quizCard = document.createElement('div');
      quizCard.className = 'quiz-container';

      // 1. Header (Title & Progress Indicator)
      const header = document.createElement('div');
      header.className = 'quiz-header';

      const title = document.createElement('h2');
      title.style.margin = '0 0 10px 0';
      title.textContent = this.quizData.quizTitle || "Interactive Quiz";
      header.appendChild(title);

      // Progress Tracker Label (e.g. Question 3 of 10)
      const progressLabel = document.createElement('div');
      progressLabel.style.fontSize = '12px';
      progressLabel.style.color = 'var(--text-secondary)';
      const totalQ = this.quizData.questions.length;
      const currentNumber = this.currentQuestionIndex + 1;
      progressLabel.textContent = `Question ${currentNumber} of ${totalQ}`;
      header.appendChild(progressLabel);

      // Graphical Progress Bar
      const progressBarBg = document.createElement('div');
      progressBarBg.className = 'quiz-progress-bar-bg';
      const progressBarFill = document.createElement('div');
      progressBarFill.className = 'quiz-progress-bar-fill';
      const percentage = (currentNumber / totalQ) * 100;
      progressBarFill.style.width = `${percentage}%`;
      progressBarBg.appendChild(progressBarFill);
      header.appendChild(progressBarBg);

      quizCard.appendChild(header);

      // 2. Question Content Area
      const question = this.quizData.questions[this.currentQuestionIndex];
      const questionBox = document.createElement('div');
      questionBox.className = 'quiz-question-box';

      const questionText = document.createElement('h3');
      questionText.className = 'quiz-question-text';
      questionText.textContent = `${currentNumber}. ${question.questionText}`;
      questionBox.appendChild(questionText);

      // Option Lists
      const optionsList = document.createElement('div');
      optionsList.className = 'quiz-options-list';

      question.options.forEach((optionText, optIndex) => {
        const optionItem = document.createElement('div');
        optionItem.className = 'quiz-option-item';
        
        // Mark option as selected if matching response state
        const isSelected = this.responses[this.currentQuestionIndex] === optIndex;
        if (isSelected) {
          optionItem.classList.add('selected');
        }

        // Option prefix badge (A, B, C, D)
        const optionBadge = document.createElement('span');
        optionBadge.className = 'quiz-option-badge';
        optionBadge.textContent = String.fromCharCode(65 + optIndex);

        const textSpan = document.createElement('span');
        textSpan.textContent = optionText;

        optionItem.appendChild(optionBadge);
        optionItem.appendChild(textSpan);

        // Click handler to store answer selection
        optionItem.addEventListener('click', () => {
          this.responses[this.currentQuestionIndex] = optIndex;
          this.render(); // Re-render to update selected classes
        });

        optionsList.appendChild(optionItem);
      });

      questionBox.appendChild(optionsList);
      quizCard.appendChild(questionBox);

      // 3. Navigation Controls (Footer)
      const footer = document.createElement('div');
      footer.className = 'quiz-footer';

      // Prev Button
      const prevBtn = document.createElement('button');
      prevBtn.className = 'quiz-btn quiz-btn-secondary';
      prevBtn.textContent = "Previous";
      prevBtn.disabled = this.currentQuestionIndex === 0;
      prevBtn.addEventListener('click', () => {
        if (this.currentQuestionIndex > 0) {
          this.currentQuestionIndex--;
          this.render();
        }
      });
      footer.appendChild(prevBtn);

      // Next / Submit Button
      const nextBtn = document.createElement('button');
      nextBtn.className = 'quiz-btn quiz-btn-primary';

      const isLastQuestion = this.currentQuestionIndex === totalQ - 1;
      nextBtn.textContent = isLastQuestion ? "Submit Answers" : "Next Question";
      
      nextBtn.addEventListener('click', () => {
        if (isLastQuestion) {
          this.submitQuiz();
        } else {
          this.currentQuestionIndex++;
          this.render();
        }
      });
      footer.appendChild(nextBtn);

      quizCard.appendChild(footer);
      this.container.appendChild(quizCard);
    }

    /**
     * Submits quiz answers and triggers callback
     */
    submitQuiz() {
      // Build response array matching structure of the questions
      const finalResponses = this.quizData.questions.map((q, index) => {
        return {
          questionId: q.id,
          selectedAnswerIndex: this.responses[index] !== undefined ? this.responses[index] : null
        };
      });

      if (typeof this.onComplete === 'function') {
        this.onComplete(finalResponses);
      } else {
        alert("Exam submitted successfully! Connect custom `onComplete` logic to retrieve scores.");
      }
    }
  }

  // Export functions to window or node environment
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { QuizEngine };
  } else {
    global.OpenEduKit = global.OpenEduKit || {};
    global.OpenEduKit.QuizEngine = QuizEngine;
  }

})(typeof window !== 'undefined' ? window : this);
