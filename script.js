let secretWord = "";
let history = [];

function startGame() {
    const input = document.getElementById("secretInput");
    const word = input.value.toUpperCase();

    if (word.length !== 4) {
        alert("Word must be 4 letters.");
        return;
    }

    secretWord = word;
    localStorage.setItem("secretWord", secretWord);
    localStorage.setItem("history", JSON.stringify([]));

    document.getElementById("setup").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");
}

function submitGuess() {
    const guessInput = document.getElementById("guessInput");
    const guess = guessInput.value.toUpperCase();

    if (guess.length !== 4) {
        alert("Guess must be 4 letters.");
        return;
    }

    let revealed = "";

    for (let i = 0; i < 4; i++) {
        if (guess[i] === secretWord[i]) {
            revealed += guess[i];
        } else {
            revealed += "_";
        }
    }

    const entry = `${guess} (${revealed})`;
    history.push(entry);

    localStorage.setItem("history", JSON.stringify(history));
    renderHistory();

    guessInput.value = "";
}

function renderHistory() {
    const historyDiv = document.getElementById("history");
    historyDiv.innerHTML = "";

    history.forEach(item => {
        const row = document.createElement("div");
        row.className = "guess-row";
        row.textContent = item;
        historyDiv.appendChild(row);
    });
}

function resetGame() {
    localStorage.clear();
    location.reload();
}

window.onload = function() {
    const savedSecret = localStorage.getItem("secretWord");
    const savedHistory = localStorage.getItem("history");

    if (savedSecret) {
        secretWord = savedSecret;
        history = JSON.parse(savedHistory) || [];

        document.getElementById("setup").classList.add("hidden");
        document.getElementById("game").classList.remove("hidden");

        renderHistory();
    }
};
