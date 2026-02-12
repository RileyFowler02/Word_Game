let secretWord = "";
let gameActive = false;
let guessCount = 0;
let validWords = new Set();
let dictionaryLoaded = false;
let gameOver = false;

/* ------------------------------
   LOAD WORD LIST
------------------------------ */

fetch("words.txt")
    .then(response => response.text())
    .then(text => {
        const words = text.split("\n")
            .map(word => word.trim().toUpperCase())
            .filter(word => /^[A-Z]{4}$/.test(word));

        validWords = new Set(words);
        dictionaryLoaded = true;
        console.log(`Loaded ${validWords.size} words.`);
    });

/* ------------------------------
   TILE INPUT CREATION
------------------------------ */

function createTileInputs(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    for (let i = 0; i < 4; i++) {
        const input = document.createElement("input");
        input.maxLength = 1;

        input.addEventListener("input", (e) => {
            e.target.value = e.target.value.toUpperCase();
            if (e.target.value && e.target.nextElementSibling) {
                e.target.nextElementSibling.focus();
            }
        });

        input.addEventListener("keydown", (e) => {
            if (e.key === "Backspace") {
                if (!e.target.value && e.target.previousElementSibling) {
                    e.target.previousElementSibling.value = "";
                    e.target.previousElementSibling.focus();
                }
            }
        });

        container.appendChild(input);
    }
}

function getWord(containerId) {
    const inputs = document.querySelectorAll(`#${containerId} input`);
    return Array.from(inputs).map(i => i.value).join("");
}

function showMessage(text) {
    document.getElementById("message").textContent = text;
}

function clearMessage() {
    document.getElementById("message").textContent = "";
}

/* ------------------------------
   GAME LOGIC
------------------------------ */

function startGame() {
    if (!dictionaryLoaded) {
        showMessage("Dictionary still loading...");
        return;
    }

    const word = getWord("secretTiles");

    if (!validWords.has(word)) {
        showMessage("Enter a valid word.");
        return;
    }

    clearMessage();
    secretWord = word;
    gameActive = true;

    document.getElementById("setup").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");
}

function submitGuess() {
    if (!gameActive || gameOver) return;

    const guess = getWord("guessTiles");

    if (!validWords.has(guess)) {
        showMessage("Enter a valid word.");
        return;
    }

    clearMessage();
    guessCount++;
    let correctCount = 0;

    const row = document.createElement("div");
    row.className = "guess-row";

    const tilesDiv = document.createElement("div");
    tilesDiv.className = "tiles";

    for (let i = 0; i < 4; i++) {
        const tile = document.createElement("div");
        tile.className = "tile";
        tile.textContent = guess[i];

        if (guess[i] === secretWord[i]) {
            tile.classList.add("correct");
            correctCount++;
        }

        tilesDiv.appendChild(tile);
    }

    const countDiv = document.createElement("div");
    countDiv.className = "count";
    countDiv.textContent = `${correctCount} / 4 correct`;

    row.appendChild(tilesDiv);
    row.appendChild(countDiv);
    document.getElementById("guessBoard").appendChild(row);

    createTileInputs("guessTiles");

    if (correctCount === 4) {
        gameOver = true;
        gameActive = false;
        showResultScreen();
    }
}

function showResultScreen() {
    document.getElementById("game").classList.add("hidden");
    document.getElementById("resultScreen").classList.remove("hidden");

    document.getElementById("resultTitle").textContent =
        "They cracked your word.";

    document.getElementById("resultStats").textContent =
        `You lost in ${guessCount} guesses.`;
}

function viewGame() {
    document.getElementById("resultScreen").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");

    // Hide guess input section
    document.querySelector(".guess-input").classList.add("hidden");
}

function resetGame() {
    location.reload();
}

window.onload = function() {
    createTileInputs("secretTiles");
    createTileInputs("guessTiles");
};
