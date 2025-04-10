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
  const showLbButton = document.getElementById("showLb");
  const lb__data = document.getElementById("lb-data");
  const lbScreen = document.getElementById("lb-screen");
  const progressBar = document.getElementById("progress");
  const currentScoreDisplay = document.getElementById("current-score");

  let questions = [];
  let currentQuestionIndex = 0;
  let userAnswers = {};
  let username = "";

  fetch("questions.json")
    .then((response) => response.json())
    .then((data) => {
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
                ${questionData.options
                  .map(
                    (option) => `
                    <option value="${option}" ${
                      userAnswers[currentQuestionIndex] === option
                        ? "selected"
                        : ""
                    }>${option}</option>
                `
                  )
                  .join("")}
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

      // Progress Bar
      const progressPercentage =
        (currentQuestionIndex / questions.length) * 100;
      progressBar.style.width = `${progressPercentage}%`;
      console.log("???");

      currentScoreDisplay.textContent = calculateScore();
    } else {
      calculateScore();
      leaderboard();
    }
  });

  // Score Point
  // function updateScoreDisplay(score) {
  //   currentScoreDisplay.textContent = score;
  //   // finalScoreDisplay.textContent = score;
  // }

  prevButton.addEventListener("click", () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      loadQuestion();
    }
  });

  function updateButtons() {
    prevButton.style.display = currentQuestionIndex > 0 ? "block" : "none";
    nextButton.textContent =
      currentQuestionIndex === questions.length - 1 ? "Finish" : "Next";
  }

  // SCORE CALCULATION
  function calculateScore() {
    let score = 0;
    questions.forEach((q, index) => {
      if (userAnswers[index] === q.answer) {
        score++;
        // currentScoreDisplay.textContent = score;
      }
    });
    return score;
  }

  function leaderboard() {
    let score = calculateScore();
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

    // Save score data in local storage for user after finish the game
    const dataPemain = {
      nama: username,
      score: score,
      date: new Date().toISOString(),
    };

    leaderboard.push(dataPemain);

    leaderboard.sort((a, b) => b.score - a.score);

    let finalLeaderboard = leaderboard.slice(0, 10);

    localStorage.setItem("leaderboard", JSON.stringify(finalLeaderboard));

    quizScreen.style.display = "none";
    resultScreen.style.display = "block";
    resultName.textContent = `Nama: ${username}`;
    resultScore.textContent = `Skor Anda: ${score} dari ${questions.length}`;

    return score;
  }

  restartButton.addEventListener("click", () => {
    location.reload();
  });

  showLbButton.addEventListener("click", () => {
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

    lb__data.innerHTML = "";

    leaderboard.sort((a, b) => b.score - a.score);

    leaderboard.forEach((entry) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${entry.nama}</td>
        <td>${entry.score}</td>
        `;
      lb__data.appendChild(row);
    });
    resultScreen.style.display = "none";
    lbScreen.style.display = "block";
  });
});
