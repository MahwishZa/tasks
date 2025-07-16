const quizData = {
    html: [
        {
            question: "What does HTML stand for?",
            a: "Hypertext Markup Language",
            b: "Hypertext Markdown Language",
            c: "Hyperloop Machine Language",
            d: "Helicopters Terminals Motorboats Lamborghinis",
            correct: "a",
        },
        {
            question: "What is the correct tag for a line break?",
            a: "<lb>",
            b: "<break>",
            c: "<br>",
            d: "<line>",
            correct: "c",
        }
    ],
    css: [
        {
            question: "What does CSS stand for?",
            a: "Central Style Sheets",
            b: "Cascading Style Sheets",
            c: "Cascading Simple Sheets",
            d: "Cars SUVs Sailboats",
            correct: "b",
        },
        {
            question: "Which CSS property controls text size?",
            a: "font-style",
            b: "text-size",
            c: "font-size",
            d: "text-style",
            correct: "c",
        }
    ],
    js: [
        {
            question: "Which language runs in a web browser?",
            a: "Java",
            b: "C",
            c: "Python",
            d: "JavaScript",
            correct: "d",
        },
        {
            question: "What year was JavaScript launched?",
            a: "1996",
            b: "1995",
            c: "1994",
            d: "None of the above",
            correct: "b",
        }
    ]
};

let currentQuiz = 0;
let score = 0;
let selectedCategory = null;
let selectedQuizData = [];
let answersLog = [];
let countdown;
const timePerQuestion = 30;

const startScreen = document.getElementById("startScreen");
const quizCard = document.getElementById("quizCard");
const quiz = document.getElementById("quiz");
const questionEl = document.getElementById("question");
const answerList = document.getElementById("answerList");
const submitBtn = document.getElementById("submit");
const feedbackEl = document.getElementById("feedback");
const progressBar = document.getElementById("progressBar");
const questionCounter = document.getElementById("questionCounter");
const timerDisplay = document.getElementById("timer");

function startSelectedQuiz() {
    const category = document.getElementById("categorySelect").value;
    selectedCategory = category;
    selectedQuizData = quizData[category];

    startScreen.classList.add("d-none");
    quizCard.classList.remove("d-none");

    currentQuiz = 0;
    score = 0;
    answersLog = [];

    fadeIn(quiz);
    loadQuiz();
}

function loadQuiz() {
    clearInterval(countdown);
    feedbackEl.innerHTML = "";
    deselectAnswers();
    submitBtn.disabled = false;

    const currentQuizData = selectedQuizData[currentQuiz];
    questionEl.innerText = currentQuizData.question;
    questionCounter.innerText = `Question ${currentQuiz + 1} of ${selectedQuizData.length}`;
    progressBar.style.width = `${(currentQuiz / selectedQuizData.length) * 100}%`;
    answerList.innerHTML = "";

    ["a", "b", "c", "d"].forEach(key => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex align-items-center";

        const input = document.createElement("input");
        input.type = "radio";
        input.name = "answer";
        input.id = key;
        input.className = "form-check-input me-2 answer";

        const label = document.createElement("label");
        label.htmlFor = key;
        label.className = "form-check-label";
        label.id = `${key}_text`;
        label.innerText = currentQuizData[key];

        li.appendChild(input);
        li.appendChild(label);
        answerList.appendChild(li);
    });

    fadeIn(quiz);
    startTimer();
}

function deselectAnswers() {
    document.querySelectorAll(".answer").forEach(input => input.checked = false);
}

function getSelected() {
    let selected = null;
    document.querySelectorAll(".answer").forEach(input => {
        if (input.checked) selected = input.id;
    });
    return selected;
}

function showFeedback(isCorrect, correctId) {
    feedbackEl.innerHTML = isCorrect
        ? `<span class="text-success">Correct!</span>`
        : `<span class="text-danger">Wrong! Correct answer: <strong>${selectedQuizData[currentQuiz][correctId]}</strong></span>`;

    document.querySelectorAll(".answer").forEach(input => {
        const label = input.nextElementSibling;
        label.classList.remove("text-danger", "text-success");

        if (input.id === correctId) label.classList.add("text-success");
        else if (input.checked) label.classList.add("text-danger");
    });
}

function startTimer() {
    let timeLeft = timePerQuestion;
    timerDisplay.innerText = timeLeft;

    countdown = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(countdown);
            submitAnswer(true);
        }
    }, 1000);
}

function submitAnswer(auto = false) {
    const answer = getSelected();
    if (!answer && !auto) return;

    clearInterval(countdown);
    submitBtn.disabled = true;

    const correctId = selectedQuizData[currentQuiz].correct;
    const isCorrect = answer === correctId;

    if (isCorrect) score++;

    answersLog.push({
        question: selectedQuizData[currentQuiz].question,
        selected: answer,
        correct: correctId,
    });

    showFeedback(isCorrect, correctId);

    setTimeout(() => {
        currentQuiz++;
        if (currentQuiz < selectedQuizData.length) {
            loadQuiz();
        } else {
            showResults();
        }
    }, 1500);
}

function showResults() {
    fadeIn(quiz);
    quiz.innerHTML = `
    <div class="text-center mb-4">
        <h3>You scored ${score} out of ${selectedQuizData.length}</h3>
    </div>
    <ul class="list-group mb-3">
        ${answersLog.map((entry, idx) => `
            <li class="list-group-item">
                <strong>Q${idx + 1}:</strong> ${entry.question}<br />
                ${entry.selected === entry.correct
            ? `<span class="text-success">✓ Your answer: ${selectedQuizData[idx][entry.correct]}</span>`
            : `<span class="text-danger">✗ Your answer: ${entry.selected ? selectedQuizData[idx][entry.selected] : 'No Answer'}<br />
                       Correct: ${selectedQuizData[idx][entry.correct]}</span>`
        }
            </li>
        `).join("")}
    </ul>
    <div class="d-grid">
        <button class="btn btn-success" onclick="location.reload()">Try Another Quiz</button>
    </div>
    `;
}
// Utility: fade-in effect
function fadeIn(element) {
    element.classList.remove("fade-in");
    void element.offsetWidth;
    element.classList.add("fade-in");
}

submitBtn.addEventListener("click", () => submitAnswer());