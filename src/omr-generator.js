/**
 * OpenEduKit.js - Dynamic High-Fidelity OMR Sheet Generator
 * 
 * Generates an authentic crimson-red style printed OMR sheet matching the layout 
 * of professional state examination boards (such as WB JECA).
 */

(function (global) {
  'use strict';

  /**
   * Generates the High-Fidelity OMR Sheet HTML and injects it into a container.
   * @param {Object} options Configuration parameters
   * @param {string} options.containerId The DOM ID of the target container
   * @param {string} [options.boardTitle] Board title (e.g., "WEST BENGAL JOINT ENTRANCE EXAMINATIONS BOARD")
   * @param {string} [options.examTitle] Exam name (e.g., "OMR ANSWER SHEET — JECA ENTRANCE EXAMINATION")
   * @param {number} [options.totalQuestions] Total number of questions. Defaults to 100.
   * @param {number} [options.optionsPerQuestion] Options count. Defaults to 4.
   * @param {number} [options.columns] Number of grid columns for questions. Defaults to 5 (20 per column for 100 Qs).
   * @param {string} [options.seriesLetter] Exam series letter. Defaults to 'A'.
   * @param {boolean} [options.interactive] Enable bubble toggling on screen. Defaults to false.
   */
  function generateOMR(options) {
    const config = Object.assign({
      boardTitle: "WEST BENGAL JOINT ENTRANCE EXAMINATIONS BOARD",
      examTitle: "OMR ANSWER SHEET — JECA ENTRANCE EXAMINATION",
      totalQuestions: 100,
      optionsPerQuestion: 4,
      columns: 5,
      seriesLetter: "A",
      interactive: false
    }, options);

    const container = document.getElementById(config.containerId);
    if (!container) {
      console.error(`OpenEduKit: Container with ID "${config.containerId}" was not found.`);
      return;
    }

    container.innerHTML = '';

    // Create main OMR sheet wrapper
    const omrWrapper = document.createElement('div');
    omrWrapper.className = 'omr-sheet-container';

    // 1. Header (Logo space, Board Title, Exam Title, Series Block)
    const header = document.createElement('div');
    header.className = 'omr-header';

    // Left Circular Logo Placeholder
    const logoPlaceholder = document.createElement('div');
    logoPlaceholder.style.width = '55px';
    logoPlaceholder.style.height = '55px';
    logoPlaceholder.style.border = '2px solid var(--omr-theme-color)';
    logoPlaceholder.style.borderRadius = '50%';
    logoPlaceholder.style.display = 'flex';
    logoPlaceholder.style.alignItems = 'center';
    logoPlaceholder.style.justifyContent = 'center';
    logoPlaceholder.style.fontWeight = 'bold';
    logoPlaceholder.style.fontSize = '8pt';
    logoPlaceholder.textContent = "LOGO";
    header.appendChild(logoPlaceholder);

    // Center Title Text
    const headerText = document.createElement('div');
    headerText.className = 'omr-header-text';
    const boardTitleEl = document.createElement('h2');
    boardTitleEl.textContent = config.boardTitle;
    const examTitleEl = document.createElement('h4');
    examTitleEl.textContent = config.examTitle;
    headerText.appendChild(boardTitleEl);
    headerText.appendChild(examTitleEl);
    header.appendChild(headerText);

    // Right Series Block
    const seriesBox = document.createElement('div');
    seriesBox.className = 'omr-series-box';
    seriesBox.innerHTML = `Series <span class="omr-series-value">${config.seriesLetter}</span>`;
    header.appendChild(seriesBox);

    omrWrapper.appendChild(header);

    // 2. Main Top Grid (Left Info inputs & Methods, Right Coding blocks)
    const mainTop = document.createElement('div');
    mainTop.className = 'omr-main-top';

    // Left Column: Candidate Info and Methods
    const leftColumn = document.createElement('div');
    leftColumn.className = 'omr-left-column';

    // Name input box
    const nameBox = document.createElement('div');
    nameBox.className = 'omr-input-group';
    nameBox.innerHTML = `
      <span class="omr-label">Candidate's Name (In Block Letters)</span>
      <div class="omr-input-line"></div>
    `;
    leftColumn.appendChild(nameBox);

    // Center input box
    const centerBox = document.createElement('div');
    centerBox.className = 'omr-input-group';
    centerBox.innerHTML = `
      <span class="omr-label">Name of the Examination Centre (In Block Letters)</span>
      <div class="omr-input-line"></div>
    `;
    leftColumn.appendChild(centerBox);

    // Instructions Box (Correct/Wrong Methods) and Barcode Block
    const bottomRow = document.createElement('div');
    bottomRow.style.display = 'grid';
    bottomRow.style.gridTemplateColumns = '1.2fr 1fr';
    bottomRow.style.gap = '10px';
    bottomRow.style.alignItems = 'center';

    const methodsBox = document.createElement('div');
    methodsBox.className = 'omr-methods-box';
    methodsBox.innerHTML = `
      <div class="omr-method-row">
        <span style="font-weight: bold; text-transform: uppercase;">Correct Method</span>
        <div class="omr-method-visuals">
          <div class="omr-method-dot"></div>
          <div class="omr-method-dot"></div>
          <div class="omr-method-dot filled"></div>
          <div class="omr-method-dot"></div>
        </div>
      </div>
      <div class="omr-method-row wrong">
        <span style="font-weight: bold; text-transform: uppercase;">Wrong Method</span>
        <div class="omr-method-visuals">
          <div class="omr-method-dot" style="display: flex; align-items: center; justify-content: center; font-size: 5pt; font-family: sans-serif; font-weight: bold; color: #000;">✕</div>
          <div class="omr-method-dot"></div>
          <div class="omr-method-dot" style="display: flex; align-items: center; justify-content: center; font-size: 6pt; font-family: sans-serif; font-weight: bold; line-height: 1; color: #000;">✓</div>
          <div class="omr-method-dot" style="background: linear-gradient(90deg, #000 50%, transparent 50%);"></div>
        </div>
      </div>
    `;
    bottomRow.appendChild(methodsBox);

    // Barcode rendering container
    const barcodeBox = document.createElement('div');
    barcodeBox.className = 'omr-barcode-box';
    bottomRow.appendChild(barcodeBox);

    leftColumn.appendChild(bottomRow);
    mainTop.appendChild(leftColumn);

    // Right Column: Roll Number, Booklet Number, Series selection
    const rightColumn = document.createElement('div');
    rightColumn.className = 'omr-right-column';

    // Helper function to build 10-column digit bubble grids
    function createCodingGrid(titleText, colsCount) {
      const grid = document.createElement('div');
      grid.className = 'omr-coding-grid';
      const span = document.createElement('span');
      span.textContent = titleText;
      grid.appendChild(span);

      const columnsDiv = document.createElement('div');
      columnsDiv.className = 'omr-coding-columns';

      for (let i = 0; i < colsCount; i++) {
        const col = document.createElement('div');
        col.className = 'omr-coding-col';

        // Top writing square cell
        const cell = document.createElement('div');
        cell.className = 'omr-coding-cell';
        col.appendChild(cell);

        // 0 to 9 bubbles
        for (let digit = 0; digit <= 9; digit++) {
          const bubble = document.createElement('div');
          bubble.className = 'omr-coding-bubble';
          bubble.textContent = digit;
          if (config.interactive) {
            bubble.addEventListener('click', () => {
              const sisterBubbles = col.querySelectorAll('.omr-coding-bubble');
              const wasFilled = bubble.classList.contains('filled');
              sisterBubbles.forEach(sb => sb.classList.remove('filled'));
              if (!wasFilled) {
                bubble.classList.add('filled');
              }
            });
          }
          col.appendChild(bubble);
        }
        columnsDiv.appendChild(col);
      }
      grid.appendChild(columnsDiv);
      return grid;
    }

    rightColumn.appendChild(createCodingGrid("Roll Number", 10));
    rightColumn.appendChild(createCodingGrid("Booklet No.", 10));

    // Vertical Series selector grid (A, B, C, D)
    const verticalSeries = document.createElement('div');
    verticalSeries.className = 'omr-coding-grid';
    verticalSeries.style.display = 'flex';
    verticalSeries.style.flexDirection = 'column';
    verticalSeries.style.justifyContent = 'space-between';
    verticalSeries.style.minWidth = '42px';
    verticalSeries.innerHTML = `<span style="font-size: 7pt;">Series</span>`;

    const seriesBubbleWrapper = document.createElement('div');
    seriesBubbleWrapper.style.display = 'flex';
    seriesBubbleWrapper.style.flexDirection = 'column';
    seriesBubbleWrapper.style.gap = '15px';
    seriesBubbleWrapper.style.alignItems = 'center';
    seriesBubbleWrapper.style.justifyContent = 'center';
    seriesBubbleWrapper.style.flex = '1';

    ["A", "B", "C", "D"].forEach(letter => {
      const bubble = document.createElement('div');
      bubble.className = 'omr-coding-bubble';
      bubble.style.width = '14px';
      bubble.style.height = '14px';
      bubble.style.fontSize = '7pt';
      bubble.textContent = letter;
      
      if (config.interactive) {
        bubble.addEventListener('click', () => {
          const sisterBubbles = seriesBubbleWrapper.querySelectorAll('.omr-coding-bubble');
          const wasFilled = bubble.classList.contains('filled');
          sisterBubbles.forEach(sb => sb.classList.remove('filled'));
          if (!wasFilled) {
            bubble.classList.add('filled');
          }
        });
      }
      seriesBubbleWrapper.appendChild(bubble);
    });

    verticalSeries.appendChild(seriesBubbleWrapper);
    rightColumn.appendChild(verticalSeries);

    mainTop.appendChild(rightColumn);
    omrWrapper.appendChild(mainTop);

    // 3. Question Bubbles Grid
    const bubblesGrid = document.createElement('div');
    bubblesGrid.className = 'omr-bubble-grid-container';

    const bubblesPerColumn = Math.ceil(config.totalQuestions / config.columns);
    const labels = Array.from({ length: config.optionsPerQuestion }, (_, i) => String.fromCharCode(65 + i));

    for (let c = 0; c < config.columns; c++) {
      const colDiv = document.createElement('div');
      colDiv.className = 'omr-bubble-col';

      const startQ = c * bubblesPerColumn + 1;
      const endQ = Math.min((c + 1) * bubblesPerColumn, config.totalQuestions);

      for (let q = startQ; q <= endQ; q++) {
        const row = document.createElement('div');
        row.className = 'omr-bubble-row';

        const numLabel = document.createElement('span');
        numLabel.className = 'omr-qnum';
        numLabel.textContent = `${q}.`;
        row.appendChild(numLabel);

        const bubbleGroup = document.createElement('div');
        bubbleGroup.className = 'omr-bubbles';

        labels.forEach((optionChar, optIndex) => {
          const bubble = document.createElement('div');
          bubble.className = 'omr-bubble';
          bubble.textContent = optionChar;
          bubble.dataset.question = q;
          bubble.dataset.optionIndex = optIndex;

          if (config.interactive) {
            bubble.addEventListener('click', () => {
              const sisterBubbles = bubbleGroup.querySelectorAll('.omr-bubble');
              const wasFilled = bubble.classList.contains('filled');
              sisterBubbles.forEach(sb => sb.classList.remove('filled'));
              if (!wasFilled) {
                bubble.classList.add('filled');
              }
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
      bubblesGrid.appendChild(colDiv);
    }

    omrWrapper.appendChild(bubblesGrid);

    // 4. Footer section (Signatures)
    const footer = document.createElement('div');
    footer.className = 'omr-footer';
    footer.innerHTML = `
      <div>Signature of the Candidate: _____________________________________</div>
      <div>Signature of the Invigilator: _____________________________________</div>
      <div style="font-size: 8pt;">openedukit.org</div>
    `;
    omrWrapper.appendChild(footer);

    container.appendChild(omrWrapper);

    // Render Barcode dynamically inside the barcode box
    renderDynamicBarcode(barcodeBox);
  }

  /**
   * Helper function to render a clean procedural pseudo-barcode representing current date
   */
  function renderDynamicBarcode(container) {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const dateString = `${day}-${month}-${year}`;

    const barsDiv = document.createElement('div');
    barsDiv.style.display = 'flex';
    barsDiv.style.height = '24px';
    barsDiv.style.alignItems = 'stretch';
    barsDiv.style.justifyContent = 'center';
    barsDiv.style.width = '100px';

    let binStr = '101001101101'; // start guard
    for (let i = 0; i < dateString.length; i++) {
      const char = dateString[i];
      if (char === '-') binStr += '100110101101';
      else {
        const num = parseInt(char) || 0;
        const encodings = [
          '101001101101', '110100101011', '101100101011', '110110010101',
          '101001101101', '110100110101', '101100110101', '101001100111',
          '110100110011', '101100110011'
        ];
        binStr += encodings[num];
      }
      binStr += '0';
    }
    binStr += '101001101101'; // end guard

    for (let i = 0; i < binStr.length; i++) {
      const bar = document.createElement('div');
      bar.style.width = '1.2px';
      bar.style.backgroundColor = binStr[i] === '1' ? '#000000' : 'transparent';
      barsDiv.appendChild(bar);
    }

    container.appendChild(barsDiv);

    const label = document.createElement('span');
    label.style.fontSize = '6.5pt';
    label.style.fontFamily = 'monospace';
    label.style.color = '#000000';
    label.style.fontWeight = 'bold';
    label.innerText = '*' + dateString + '*';
    container.appendChild(label);
  }

  // Export functions to window or node environment
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateOMR };
  } else {
    global.OpenEduKit = global.OpenEduKit || {};
    global.OpenEduKit.generateOMR = generateOMR;
  }

})(typeof window !== 'undefined' ? window : this);
