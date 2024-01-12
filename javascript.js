document.addEventListener("DOMContentLoaded", function () {
// Funktion för startsidan (index.html)
function indexPageFunction() {
  console.log("This function is specific to index page of the quiz.");
}

// Funktion för spel-sidan (game.html)
function gamePageFunction() {
  console.log("This function is specific to game page of the quiz.");

  const questions = [
    {
      question: "What is the capital of France?",
      choice: ["Paris", "Berlin", "London", "Rome"],
      correctAnswer: 0,
    },
    {
      question: "Which planet is known as the Red Planet?",
      choice: ["Earth", "Mars", "Jupiter", "Saturn"],
      correctAnswer: 0,
    },
    {
      question: "What color is the sun?",
      choice: ["Blue", "Orange", "Yellow", "Black"],
      correctAnswer: 2,
    },
    {
      question: "What color is the sky?",
      choice: ["Blue", "Red", "Green", "Purple"],
      correctAnswer: 0,
    },
  ];

 
  const currentPage = window.location.pathname;
  const questionElement = document.getElementById("question");
  const choicesContainer = document.querySelectorAll(".choice-container");
  const scoreElement = document.getElementById("score");

  let currentQuestionIndex = 0;
  let score = 100;
  let gameEnded = false;

  function showNextQuestion() {
    const progressBar = document.getElementById("progressBarFull");
    const progressText = document.getElementById("progressText");
  
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
  
    const currentQuestion = questions[currentQuestionIndex];
  
    if (currentQuestion && questionElement) {
      questionElement.textContent = currentQuestion.question;
  
      for (let i = 0; i < choicesContainer.length; i++) {
        choicesContainer[i].querySelector(".choice-text").textContent =
          currentQuestion.choice[i];
      }
  
}}
   
  let countdown = 100; // Tiden 
const countdownInterval = setInterval(updateCountdown, 500); // Hur snabbt den räknar ner.

function updateCountdown() {
  if (countdown > 0 && !gameEnded) {
    countdown--; // Minskar nedräkningen

    // Uppdatera poängen med -1 för varje 1.5 sekund
    score -= 1;
    scoreElement.textContent = `${score}`;

      // Spara poängen i localStorage
      localStorage.setItem("finalScore", score);
  } else {
    // Stoppa när alla frågor är besvarade eller tiden har gått ut.
    clearInterval(countdownInterval);
    window.location.href = "end.html";
  }
}
    //För att säkerställa att quizet fungerat när jag klickat på svaren m.m har jag använt console.log
    

    function handleAnswerClick(choiceIndex) {
      if (currentQuestionIndex < questions.length && !gameEnded) {
        const currentQuestion = questions[currentQuestionIndex];
    
        if (choiceIndex === currentQuestion.correctAnswer) {
          score -= 0;
        } else {
          score -= 10;
        }
    
        currentQuestionIndex++;
    
        if (currentQuestionIndex < questions.length) {
          showNextQuestion();
        } else {
          // Sista frågan har besvarats, visa end.html
          gameEnded = true;
      // Uppdatera poängen innan du navigerar till end.html
      localStorage.setItem("finalScore", score);

      window.location.href = "end.html";
   
    
          // Inaktivera svarsalternativen efter sista frågan
          for (let i = 0; i < choicesContainer.length; i++) {
            choicesContainer[i].style.pointerEvents = "none";
          }
        }
    
        scoreElement.textContent = `${score}`;
      }
    }


  // Lyssnare för att hantera klick på svarsalternativen
  if (currentPage.includes("game.html")) {
    for (let i = 0; i < choicesContainer.length; i++) {
      choicesContainer[i].addEventListener("click", function () {
        handleAnswerClick(i);
      });
    }

    showNextQuestion();
  }

}



// Funktion för slut-sidan (end.html)
function endPageFunction() {
  console.log("This function is specific to end page of the quiz.");

  const finalScoreElement = document.getElementById("finalScore");
  const usernameInput = document.getElementById("username");
  const saveScoreBtn = document.getElementById("saveScoreBtn");
  const playAgainBtn = document.getElementById("playAgainBtn");
  const goHomeBtn = document.getElementById("goHomeBtn");
  const saveScoreForm = document.querySelector("form");

  
  let highscores = []


  const finalScore = localStorage.getItem("finalScore");

  // Använd poängen som du behöver, t.ex. visa det på sidan
 
  if (finalScoreElement && finalScore) {
    finalScoreElement.textContent = `Your final score is: ${finalScore}`;
  }

  // Tar bort poängen från localStorage efter att den har använts
  localStorage.removeItem("finalScore");


  // Aktiverar "Save" knappen när användaren skriver sitt namn
  usernameInput.addEventListener("input", function () {
    saveScoreBtn.disabled = usernameInput.value.trim() === "";
    saveScoreBtn.style.backgroundColor = usernameInput.value.trim() === "" ? "" : "green";
    
  });

  // Hanterar formulärets insändning
  saveScoreForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Förhindra standardformulärets beteende

    const playerName = usernameInput.value.trim();
    if (playerName !== "") {
      // Skapa ett highscore-objekt
      const highscore = {
        player: playerName,
        score: finalScore,
      };
      
      // Hämta befintliga highscores från localStorage
      let highscores = JSON.parse(localStorage.getItem("highscores")) || [];
      
      // Lägg till det nya highscore-objektet i arrayen
      highscores.push(highscore);
      
      // Spara highscores till localStorage
      localStorage.setItem("highscores", JSON.stringify(highscores));

      // Logga highscore för teständamål
      console.log("Highscore saved:", highscore);

      // Återställ formuläret om du behöver det
      saveScoreForm.reset();
 
      
      // Aktivera Play Again och Go Home knapparna, inaktivera Save knappen
      if (playAgainBtn) playAgainBtn.disabled = false;
      if (goHomeBtn) goHomeBtn.disabled = false;
      if (saveScoreBtn) saveScoreBtn.disabled = true;


      setTimeout(() => {
        saveScoreBtn.style.backgroundColor = "";
      }, 500);
    }
  });
}

// Funktion för highscore-sidan (highscore.html)
function highscorePageFunction() {
  console.log("This function is specific to highscore page of the quiz.");


 // Hämta highscores från localStorage
 let highscores = JSON.parse(localStorage.getItem("highscores")) || [];



  // Sortera highscores i fallande ordning baserat på poäng
  highscores.sort((a, b) => b.score - a.score);

  // Hitta elementet där du vill visa highscores
  const highscoreListElement = document.getElementById("highScoresList");

  // Loopa igenom highscores och visa dem på sidan
  highscores.forEach((highscore, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${index + 1}. ${highscore.player} - ${highscore.score} poäng`;
    highscoreListElement.appendChild(listItem);
  });

}



// Kontrollera vilken sida som laddas och kör relevanta funktioner

  const currentPage = window.location.pathname;

  if (currentPage.includes("index.html")) {
    indexPageFunction();
  } else if (currentPage.includes("game.html")) {

    gamePageFunction();
  } else if (currentPage.includes("end.html")) {

    endPageFunction();
  } else if (currentPage.includes("highscores.html")) {

    highscorePageFunction();
  }
})