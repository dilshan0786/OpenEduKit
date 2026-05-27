/**
 * OpenEduKit.js - Dynamic OMR Sheet Generator
 * 
 * Zero-Base Developer Explanations:
 * - What is a DOM? DOM stands for Document Object Model. It is the browser's internal tree structure
 *   representing the HTML.
 * - Why dynamic DOM? Creating elements via document.createElement() or template literals avoids
 *   "layout thrashing" and ensures correct nesting.
 * - How we columnize: If we have 100 questions, displaying them in a single long list would waste paper.
 *   We partition them into sections (e.g. 4 columns of 25 questions).
 */

(function (global) {
  'use strict';

  /**
   * Generates the OMR Sheet HTML and injects it into a container element.
   * @param {Object} options Configuration parameters
   * @param {string} options.containerId The DOM ID of the container where the OMR sheet will render
   * @param {string} options.title The title of the exam (e.g., "Biology Final Exam")
   * @param {number} options.totalQuestions Total number of questions to render (e.g., 90 or 100)
   * @param {number} options.optionsPerQuestion Number of option bubbles per question (usually 4 or 5)
   * @param {string[]} [options.optionLabels] Array of labels like ['A','B','C','D']. Defaults to alphabetical list.
   * @param {number} [options.columns] Number of columns to organize questions on page. Defaults to 3.
   * @param {boolean} [options.interactive] If true, clicking circles toggles "filled" (useful for digital previews)
   */
  function generateOMR(options) {
    const config = Object.assign({
      title: "OMR ANSWER SHEET",
      totalQuestions: 100,
      optionsPerQuestion: 4,
      optionLabels: null,
      columns: 3,
      interactive: false
    }, options);

    const container = document.getElementById(config.containerId);
    if (!container) {
      console.error(`OpenEduKit: Container with ID "${config.containerId}" was not found.`);
      return;
    }

    // Resolve Option Letters (e.g., [1, 2, 3, 4] -> ['A', 'B', 'C', 'D'])
    // Zero-base Explanation: CharCode 65 is 'A'. Adding index (0, 1, 2...) lets us get 'B', 'C', 'D' sequentially.
    const labels = config.optionLabels || Array.from({ length: config.optionsPerQuestion }, (_, i) => String.fromCharCode(65 + i));

    // Clear previous contents of the container
    container.innerHTML = '';

    // Create the Main Wrapper
    const omrWrapper = document.createElement('div');
    omrWrapper.className = 'omr-sheet-container';

    // 1. Header Section (Title & Student Registration Info)
    const header = document.createElement('div');
    header.className = 'omr-header';

    const titleEl = document.createElement('h1');
    titleEl.className = 'omr-title';
    titleEl.textContent = config.title;
    header.appendChild(titleEl);

    // Standard school fields (Name, Roll No, Signature)
    const metaGrid = document.createElement('div');
    metaGrid.className = 'omr-meta-grid';

    const fields = [
      "Student Name", "Roll / Registration No",
      "Exam Centre Code", "Candidate Signature"
    ];

    fields.forEach(fieldName => {
      const field = document.createElement('div');
      field.className = 'omr-meta-field';
      
      const label = document.createElement('label');
      label.textContent = fieldName + ":";
      
      const line = document.createElement('div');
      line.className = 'line';

      field.appendChild(label);
      field.appendChild(line);
      metaGrid.appendChild(field);
    });

    header.appendChild(metaGrid);
    omrWrapper.appendChild(header);

    // 2. Question Columns
    // Zero-base Explanation: We slice questions into equal-sized columns so the OMR fits on a single sheet.
    // E.g., 90 questions with 3 columns = 30 questions per column.
    const grid = document.createElement('div');
    grid.className = 'omr-grid';

    const questionsPerCol = Math.ceil(config.totalQuestions / config.columns);

    for (let c = 0; c < config.columns; c++) {
      const colDiv = document.createElement('div');
      colDiv.className = 'omr-column';

      const startQ = c * questionsPerCol + 1;
      const endQ = Math.min((c + 1) * questionsPerCol, config.totalQuestions);

      for (let q = startQ; q <= endQ; q++) {
        const row = document.createElement('div');
        row.className = 'omr-row';
        row.dataset.questionIndex = q;

        // Question Number Label
        const numLabel = document.createElement('span');
        numLabel.className = 'omr-q-num';
        numLabel.textContent = `${q}.`;
        row.appendChild(numLabel);

        // Bubble Group
        const bubbleGroup = document.createElement('div');
        bubbleGroup.className = 'omr-bubbles';

        labels.forEach((optionChar, optIndex) => {
          const bubble = document.createElement('div');
          bubble.className = 'omr-bubble';
          bubble.textContent = optionChar;
          bubble.dataset.question = q;
          bubble.dataset.optionIndex = optIndex;
          bubble.dataset.optionLabel = optionChar;

          // If interactive mode is enabled, let user select bubbles by clicking
          if (config.interactive) {
            bubble.addEventListener('click', function () {
              // Standard OMR only allows one choice per row.
              // We find and remove 'filled' from all bubbles in this specific row first.
              const sisterBubbles = bubbleGroup.querySelectorAll('.omr-bubble');
              const wasFilled = bubble.classList.contains('filled');
              
              sisterBubbles.forEach(sb => sb.classList.remove('filled'));
              
              if (!wasFilled) {
                bubble.classList.add('filled');
              }
              
              // Custom hook trigger if provided
              if (typeof config.onBubbleSelect === 'function') {
                const selectedOption = bubble.classList.contains('filled') ? optIndex : null;
                config.onBubbleSelect(q, selectedOption);
              }
            });
          }

          bubbleGroup.appendChild(bubble);
        });

        row.appendChild(bubbleGroup);
        colDiv.appendChild(row);
      }

      grid.appendChild(colDiv);
    }

    omrWrapper.appendChild(grid);
    container.appendChild(omrWrapper);
  }

  // Export functions to window or node environment
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateOMR };
  } else {
    global.OpenEduKit = global.OpenEduKit || {};
    global.OpenEduKit.generateOMR = generateOMR;
  }

})(typeof window !== 'undefined' ? window : this);
