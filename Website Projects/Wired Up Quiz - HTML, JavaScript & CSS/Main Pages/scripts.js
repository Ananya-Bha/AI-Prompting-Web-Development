const questions = [
  {
    question: "What will the alert box show?",
    info: "Predict What Happens",
    code: `let points = 10;
points = points + 5;
points = points * 2;
alert(points);`,
    choices: [
      { type: "text", label: "15" },
      { type: "text", label: "20" },
      { type: "text", label: "30" },
      { type: "text", label: "1052" },
    ],
    correctIndex: 2,
  },
  {
    question: "What should be changed inside the constructor?",
    info: "Choose the Correct Fix",
    code: `class Student {
  constructor(name, age) {
    name = this.name;
    age = this.age;
  }
}

let student1 = new Student("Ananya", 15);
alert(student1.name);`,
    choices: [
      { type: "code", label: `this.name = name;\nthis.age = age;` },
      { type: "code", label: `name.this = name;\nage.this = age;` },
      { type: "code", label: `Student.name = name;\nStudent.age = age;` },
      { type: "code", label: `let name = this.name;\nlet age = this.age;` },
    ],
    correctIndex: 0,
  },
  {
    question: "What is wrong with this HTML?",
    info: "Spot the Mistake",
    code: `<img href="puppy.png" alt="A puppy">`,
    choices: [
      { type: "text", label: "The <img> tag should use src, not href" },
      { type: "text", label: "The <img> tag must have a closing tag" },
      { type: "text", label: "The alt attribute should be removed" },
      { type: "text", label: "Nothing is wrong" },
    ],
    correctIndex: 0,
  },
  {
    question: "Which option correctly creates a form with an email input and a submit button?",
    info: "Choose the Best HTML Structure",
    code: `<form>\n  <input type="email" placeholder="Enter email">\n  <button type="submit">Submit</button>\n</form>`,
    choices: [
      {
        type: "code",
        label: `<form>\n  <input type="email" placeholder="Enter email">\n  <button type="submit">Submit</button>\n</form>`,
      },
      {
        type: "code",
        label: `<form>\n  <email>Enter email</email>\n  <button>Submit</button>\n</form>`,
      },
      {
        type: "code",
        label: `<input form="email">\n<button form="submit">Submit</button>`,
      },
      {
        type: "code",
        label: `<form>\n  <input type="text-email">\n  <submit>Submit</submit>\n</form>`,
      },
    ],
    correctIndex: 0,
  },
  {
    question: "What will the paragraph look like?",
    info: "Predict the Final Styling",
    code: `.text {\n  color: blue;\n  font-size: 16px;\n}\n\n.highlight {\n  color: green;\n  background-color: yellow;\n}\n\n#main-text {\n  color: purple;\n}\n\n<p class="text highlight" id="main-text">Welcome to my website!</p>`,
    choices: [
      { type: "text", label: "Blue text, 16px font size, no background colour" },
      { type: "text", label: "Green text, 16px font size, yellow background" },
      { type: "text", label: "Purple text, 16px font size, yellow background" },
      { type: "text", label: "Purple text, no font size, no background colour" },
    ],
    correctIndex: 2,
  },
  {
    question: "Which CSS correctly styles only the paragraph?",
    info: "Find the correct Selector",
    code: `<h1 id="main-title">Welcome</h1>\n<p class="intro">This is my website.</p>`,
    choices: [
      { type: "text", label: `#intro { color: blue; }` },
      { type: "text", label: `.intro { color: blue; }` },
      { type: "text", label: `main-title { color: blue; }` },
      { type: "text", label: `p intro { color: blue; }` },
    ],
    correctIndex: 1,
  },
  {
    question: "What happens when the button is clicked?",
    info: "Interactive Webpage Questions",
    code: `<p id="message">Hello!</p>\n<button onclick="changeText()">Click Me</button>\n\n<script>\n  function changeText() {\n    document.getElementById("message").textContent = "You clicked the button!";\n  }\n</script>`,
    choices: [
      { type: "text", label: `The paragraph changes to "You clicked the button!"` },
      { type: "text", label: "The button disappears" },
      { type: "text", label: "The page background changes colour" },
      { type: "text", label: "The code gives an error because JavaScript cannot change text" },
    ],
    correctIndex: 0,
  },
];

const howIMadeThisMarkdown = `# How I Made My Quiz

## Planning my screens
(<Assets/ExcaliDraw Mockup.png>)

For the planning aspect of my website, I created a mockup design on Excalidraw and used it as a reference for my first prompt. The reference included:
- START SCREEN
- QUESTION SCREEN
- RESULTS SCREEN

## Writing my questions
(<Assets/questions_screenshot.png>)

I chose my questions by reviewing similar HTML, CSS, and JavaScript quiz examples. I also used ChatGPT for ideas on the longer answer questions.

## My prompt
(<Assets/prompt.png>)

I sent my first prompt with the details shown above. It explained what my quiz does and how I wanted it to look.

## Fixing things up
Initially, I had issues with the quiz structure, layout, and style. I asked Copilot to correct several areas, including:
- page structure
- visual layout
- spacing and styling

(<Assets/Correction 1.png>)
(<Assets/Correction 2 (a).png>)
(<Assets/Correction 3.png>)
(<Assets/Correction 4.png>)
(<Assets/Correction 5.png>)
(<Assets/Correction 6.png>)
`;

function formatCode(code) {
  const fragment = document.createDocumentFragment();
  const tagPattern = /(<\/?)([a-zA-Z][a-zA-Z0-9-]*)([^>]*?)(>)/g;
  const keywordPattern = /\b(let|const|var|function|class|constructor|return|if|else|for|while|switch|case|break|default|new|document|getElementById|textContent|alert)\b/g;
  const tokenPattern = /(`(?:[^`\\]|\\.)*`|"(?:[^"\\]|\\.)*"|\'(?:[^'\\]|\\.)*\'|\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g;
  let lastIndex = 0;
  let match;

  function appendKeywordText(text) {
    const regex = new RegExp(keywordPattern.source, 'g');
    let index = 0;
    let keyMatch;
    while ((keyMatch = regex.exec(text)) !== null) {
      if (keyMatch.index > index) {
        fragment.appendChild(document.createTextNode(text.slice(index, keyMatch.index)));
      }
      const keywordSpan = document.createElement("span");
      keywordSpan.className = "token-keyword";
      keywordSpan.textContent = keyMatch[0];
      fragment.appendChild(keywordSpan);
      index = keyMatch.index + keyMatch[0].length;
    }
    if (index < text.length) {
      fragment.appendChild(document.createTextNode(text.slice(index)));
    }
  }

  function appendCssText(text) {
    const cssPattern = /(\.[\w-]+|#[\w-]+|\b[a-zA-Z-]+(?=\s*:))/g;
    let idx = 0;
    let cssMatch;
    while ((cssMatch = cssPattern.exec(text)) !== null) {
      if (cssMatch.index > idx) {
        appendKeywordText(text.slice(idx, cssMatch.index));
      }
      const token = cssMatch[0];
      const span = document.createElement("span");
      span.className = token.startsWith(".") || token.startsWith("#") ? "token-tag" : "token-attr";
      span.textContent = token;
      fragment.appendChild(span);
      idx = cssMatch.index + token.length;
    }
    if (idx < text.length) {
      appendKeywordText(text.slice(idx));
    }
  }

  function appendText(text) {
    let index = 0;
    let tokenMatch;
    while ((tokenMatch = tokenPattern.exec(text)) !== null) {
      if (tokenMatch.index > index) {
        appendCssText(text.slice(index, tokenMatch.index));
      }
      const tokenType = tokenMatch[0].startsWith("//") || tokenMatch[0].startsWith("/*") ? "token-comment" : "token-string";
      const tokenSpan = document.createElement("span");
      tokenSpan.className = tokenType;
      tokenSpan.textContent = tokenMatch[0];
      fragment.appendChild(tokenSpan);
      index = tokenMatch.index + tokenMatch[0].length;
    }
    if (index < text.length) {
      appendCssText(text.slice(index));
    }
  }

  function appendToken(type, text) {
    const span = document.createElement("span");
    span.className = type;
    span.textContent = text;
    fragment.appendChild(span);
  }

  function appendAttrs(attrs) {
    const attrPattern = /([a-zA-Z-]+)(=)("[^"]*"|'[^']*'|[^\s>]*)/g;
    let index = 0;
    let attrMatch;
    while ((attrMatch = attrPattern.exec(attrs)) !== null) {
      if (attrMatch.index > index) {
        fragment.appendChild(document.createTextNode(attrs.slice(index, attrMatch.index)));
      }
      appendToken("token-attr", attrMatch[1]);
      fragment.appendChild(document.createTextNode(attrMatch[2]));
      const stringSpan = document.createElement("span");
      stringSpan.className = "token-string";
      stringSpan.textContent = attrMatch[3];
      fragment.appendChild(stringSpan);
      index = attrMatch.index + attrMatch[0].length;
    }
    if (index < attrs.length) {
      fragment.appendChild(document.createTextNode(attrs.slice(index)));
    }
  }

  while ((match = tagPattern.exec(code)) !== null) {
    if (match.index > lastIndex) {
      appendText(code.slice(lastIndex, match.index));
    }
    appendToken("token-angle", match[1]);
    appendToken("token-tag", match[2]);
    appendAttrs(match[3]);
    appendToken("token-angle", match[4]);
    lastIndex = tagPattern.lastIndex;
  }

  if (lastIndex < code.length) {
    appendText(code.slice(lastIndex));
  }

  return fragment;
}

const startButton = document.getElementById("start-button");
const nextButton = document.getElementById("next-button");
const reviewButton = document.getElementById("review-button");
const homeButton = document.getElementById("home-button");
const tryAgainButton = document.getElementById("try-again-button");
const howMadeButton = document.getElementById("how-made-button");
const backResultsButton = document.getElementById("back-results-button");
const reviewHomeButton = document.getElementById("review-home-button");
const startScreen = document.getElementById("start-screen");
const questionScreen = document.getElementById("question-screen");
const resultsScreen = document.getElementById("results-screen");
const makeScreen = document.getElementById("make-screen");
const reviewScreen = document.getElementById("review-screen");
const questionPrompt = document.getElementById("question-prompt");
const progressFill = document.getElementById("question-progress-fill");
const progressLabel = document.getElementById("question-progress-label");
const codeSnippet = document.getElementById("code-snippet");
const questionCodePanel = document.querySelector(".question-code-panel");
const answerGrid = document.getElementById("answer-grid");
const scorePercentage = document.getElementById("score-percentage");
const scoreText = document.getElementById("score-text");
const markdownContent = document.getElementById("markdown-content");
const reviewList = document.getElementById("review-list");

let currentQuestion = 0;
let selectedAnswers = Array(questions.length).fill(null);
let selectedIndex = null;

function showScreen(screen) {
  [startScreen, questionScreen, resultsScreen, reviewScreen, makeScreen].forEach((section) => {
    section.classList.add("hidden");
  });
  screen.classList.remove("hidden");
}

function renderMarkdown(text) {
  markdownContent.innerHTML = "";
  const lines = text.replace(/\r/g, "").split("\n");
  let listElement = null;

  function closeList() {
    if (listElement) {
      markdownContent.appendChild(listElement);
      listElement = null;
    }
  }

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed === "") {
      closeList();
      return;
    }

    if (trimmed.startsWith("<!--") && trimmed.endsWith("-->") ) {
      return;
    }

    const imageMatch = trimmed.match(/^\(\s*<([^>]+)>\s*\)$/);
    if (imageMatch) {
      closeList();
      const figure = document.createElement("figure");
      figure.className = "markdown-image-figure";
      const img = document.createElement("img");
      img.src = imageMatch[1].trim();
      img.alt = imageMatch[1].split("/").pop();
      figure.appendChild(img);
      markdownContent.appendChild(figure);
      return;
    }

    const heading1 = trimmed.match(/^#\s+(.+)$/);
    const heading2 = trimmed.match(/^##\s+(.+)$/);
    const listItem = trimmed.match(/^[-*+]\s+(.+)$/);

    if (heading1) {
      closeList();
      const h1 = document.createElement("h1");
      h1.textContent = heading1[1];
      markdownContent.appendChild(h1);
      return;
    }

    if (heading2) {
      closeList();
      const h2 = document.createElement("h2");
      h2.textContent = heading2[1];
      markdownContent.appendChild(h2);
      return;
    }

    if (listItem) {
      if (!listElement) {
        listElement = document.createElement("ul");
      }
      const li = document.createElement("li");
      li.textContent = listItem[1];
      listElement.appendChild(li);
      return;
    }

    const inlineImageMatch = trimmed.match(/\((\s*<([^>]+)>\s*)\)/);
    if (inlineImageMatch) {
      closeList();
      const captionText = trimmed.replace(inlineImageMatch[0], "").trim();
      if (captionText) {
        const p = document.createElement("p");
        p.textContent = captionText;
        markdownContent.appendChild(p);
      }
      const figure = document.createElement("figure");
      figure.className = "markdown-image-figure";
      const img = document.createElement("img");
      img.src = inlineImageMatch[2].trim();
      img.alt = captionText || inlineImageMatch[2].split("/").pop();
      figure.appendChild(img);
      markdownContent.appendChild(figure);
      return;
    }

    closeList();
    const paragraph = document.createElement("p");
    paragraph.textContent = trimmed;
    markdownContent.appendChild(paragraph);
  });

  closeList();
}

function showHowIMadeThis() {
  markdownContent.innerHTML = "<p>Loading write-up...</p>";
  showScreen(makeScreen);
  renderMarkdown(howIMadeThisMarkdown);
}

function startQuiz() {
  currentQuestion = 0;
  selectedAnswers = Array(questions.length).fill(null);
  selectedIndex = null;
  renderQuestion();
  showScreen(questionScreen);
}

function renderQuestion() {
  const question = questions[currentQuestion];
  questionPrompt.textContent = question.question;
  progressFill.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  progressLabel.textContent = `${currentQuestion + 1}/${questions.length}`;
  if (currentQuestion === 3) {
    questionCodePanel.classList.add("hidden");
  } else {
    questionCodePanel.classList.remove("hidden");
    codeSnippet.innerHTML = "";
    codeSnippet.appendChild(formatCode(question.code));
  }
  answerGrid.innerHTML = "";
  selectedIndex = selectedAnswers[currentQuestion];

  question.choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.className = "answer-button";
    button.type = "button";
    button.classList.add(choice.type === "code" ? "code-answer" : "text-answer");

    const letter = document.createElement("span");
    letter.className = "choice-letter";
    letter.textContent = `${String.fromCharCode(65 + index)}.`;
    button.appendChild(letter);

    if (choice.type === "code") {
      const codeBlock = document.createElement("div");
      codeBlock.className = "choice-code";
      const pre = document.createElement("pre");
      const codeElement = document.createElement("code");
      codeElement.appendChild(formatCode(choice.label));
      pre.appendChild(codeElement);
      codeBlock.appendChild(pre);
      button.appendChild(codeBlock);
    } else {
      const textSpan = document.createElement("span");
      textSpan.className = "choice-text";
      textSpan.textContent = choice.label;
      button.appendChild(textSpan);
    }

    if (selectedIndex === index) {
      button.classList.add("selected");
    }
    button.addEventListener("click", () => selectAnswer(index));
    answerGrid.appendChild(button);
  });

  nextButton.textContent = currentQuestion === questions.length - 1 ? "Finish" : "Next";
}

function selectAnswer(index) {
  selectedIndex = index;
  selectedAnswers[currentQuestion] = index;
  const buttons = answerGrid.querySelectorAll("button");
  buttons.forEach((button, buttonIndex) => {
    button.classList.toggle("selected", buttonIndex === index);
  });
}
// Change function name
function NextQuestion() {
  if (selectedAnswers[currentQuestion] === null) {
    alert("Please choose an answer before moving on.");
    return;
  }

  if (currentQuestion < questions.length - 1) {
    currentQuestion += 1;
    renderQuestion();
  } else {
    showResults();
  }
}

function calculateScore() {
  return selectedAnswers.reduce((score, choice, index) => {
    return score + (choice === questions[index].correctIndex ? 1 : 0);
  }, 0);
}

function showResults() {
  const score = calculateScore();
  const percentage = Math.round((score / questions.length) * 100);
  scorePercentage.textContent = `${percentage}%`;
  scoreText.textContent = `${score} out of ${questions.length} correct`;
  showScreen(resultsScreen);
}

function showReview() {
  reviewList.innerHTML = "";

  questions.forEach((question, index) => {
    const reviewItem = document.createElement("article");
    reviewItem.className = "review-item";

    const title = document.createElement("h3");
    title.textContent = `Question ${index + 1}: ${question.question}`;

    const codeBlock = document.createElement("pre");
    const codeElement = document.createElement("code");
    codeElement.appendChild(formatCode(question.code));
    codeBlock.appendChild(codeElement);
    codeBlock.style.margin = "12px 0";

    const chosen = selectedAnswers[index] !== null ? question.choices[selectedAnswers[index]].label : "No answer selected";
    const correct = question.choices[question.correctIndex].label;

    const chosenText = document.createElement("p");
    chosenText.innerHTML = `<strong>Your answer:</strong> <span class="review-answer">${chosen.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')}</span>`;

    const correctText = document.createElement("p");
    correctText.innerHTML = `<strong>Correct answer:</strong> <span class="review-answer">${correct.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')}</span>`;

    const resultBadge = document.createElement("div");
    resultBadge.className = "review-badge";
    resultBadge.textContent = selectedAnswers[index] === question.correctIndex ? "Correct" : "Incorrect";
    if (selectedAnswers[index] === question.correctIndex) {
      resultBadge.style.background = "#e6fff1";
      resultBadge.style.borderColor = "#2e8e3c";
    } else {
      resultBadge.style.background = "#ffe5e5";
      resultBadge.style.borderColor = "#cf2f2f";
    }

    reviewItem.append(title, codeBlock, chosenText, correctText, resultBadge);
    reviewList.appendChild(reviewItem);
  });

  showScreen(reviewScreen);
}

function goHome() {
  showScreen(startScreen);
}

startButton.addEventListener("click", startQuiz);
//Change the EventListener to ensure it handles the correct/changed function 
nextButton.addEventListener("click", NextQuestion);
reviewButton.addEventListener("click", showReview);
homeButton.addEventListener("click", goHome);
tryAgainButton.addEventListener("click", startQuiz);
howMadeButton.addEventListener("click", showHowIMadeThis);
backResultsButton.addEventListener("click", () => showScreen(resultsScreen));
reviewHomeButton.addEventListener("click", goHome);
