document.addEventListener("DOMContentLoaded", () => {
    const welcomeScreen = document.getElementById("welcome-screen");
    const quizScreen = document.getElementById("quiz-screen");
    const resultScreen = document.getElementById("result-screen");
    const questionContainer = document.getElementById("question-container");
    const prevButton = document.getElementById("prevQuestion");
    const nextButton = document.getElementById("nextQuestion");
    const startButton = document.getElementById("startQuiz");
    const usernameInput = document.getElementById("username");
    const resultName = document.getElementById("result-name");
    const resultScore = document.getElementById("result-score");
    const restartButton = document.getElementById("restartQuiz");

    let questions = [];
    let currentQuestionIndex = 0;
    let userAnswers = {};
    let username = "";

    fetch("questions.json")
        .then(response => response.json())
        .then(data => {
            questions = data;
            loadQuestion();
        });

    startButton.addEventListener("click", () => {
        username = usernameInput.value.trim();
        if (username === "") {
            alert("Masukkan nama Anda terlebih dahulu.");
            return;
        }
        welcomeScreen.style.display = "none";
        quizScreen.style.display = "block";
        loadQuestion();
    });

    function loadQuestion() {
        const questionData = questions[currentQuestionIndex];
        questionContainer.innerHTML = `
            <h4>${questionData.question}</h4>
            <select id="answerSelect" class="styled-select">
                <option value="">Pilih Jawaban</option>
                ${questionData.options.map(option => `
                    <option value="${option}" ${userAnswers[currentQuestionIndex] === option ? "selected" : ""}>${option}</option>
                `).join('')}
            </select>
        `;
        updateButtons();
    }

    nextButton.addEventListener("click", () => {
        const selectedAnswer = document.getElementById("answerSelect").value;
        if (selectedAnswer === "") {
            alert("Pilih jawaban terlebih dahulu.");
            return;
        }
        userAnswers[currentQuestionIndex] = selectedAnswer;
        
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            loadQuestion();
        } else {
            calculateScore();
        }
    });

    prevButton.addEventListener("click", () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            loadQuestion();
        }
    });

    function updateButtons() {
        prevButton.style.display = currentQuestionIndex > 0 ? "block" : "none";
        nextButton.textContent = currentQuestionIndex === questions.length - 1 ? "Finish" : "Next";
    }

    function calculateScore() {
        let score = 0;
        questions.forEach((q, index) => {
            if (userAnswers[index] === q.answer) {
                score++;
            }
        });
        quizScreen.style.display = "none";
        resultScreen.style.display = "block";
        resultName.textContent = `Nama: ${username}`;
        resultScore.textContent = `Skor Anda: ${score} dari ${questions.length}`;
    }

    restartButton.addEventListener("click", () => {
        location.reload();
    });
});
