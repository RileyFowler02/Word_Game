let secretWord = "";
let gameActive = false;

function createTileInputs(containerId, isSecret=false) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    for (let i = 0; i < 4; i++) {
        const input = document.createElement("input");
        input.maxLength = 1;

        if (isSecret) {
            input.type = "password";
        }

        input.addEventListener("input", (e) => {
            e.target.value = e.target.value.toUpperCase();
            if (e.target.value && e.target.nextElementSibling) {
                e.target.nextElementSibling.focus();
            }
        });

        container.appendChild(input);
    }
}

function getWordFromTiles(containerId) {
    const inputs = document.querySelectorAll(`#${containerId} input`);
    return Array.from(inputs).map(i => i.value).join("");
}

function startGame() {
    const word = getWordFromTiles("secretTiles");

    if (word.length !== 4) {
        alert("Enter 4 letters.");
        return;
    }

    secretWord = word;
    gameActive = true;

    document.getElementById("setup").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");
}

function submitGuess() {
    if (!gameActive) return;

    const guess = getWordFromTiles("guessTiles");

    if (guess.length !== 4) {
        alert("Enter 4 letters.");
        return;
    }

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

    if (correctCount === 4) {
        gameActive = false;
        document.getElementById("winMessage").classList.remove("hidden");
    }

    createTileInputs("guessTiles");
}

function resetGame() {
    location.reload();
}

window.onload = function() {
    createTileInputs("secretTiles", true);
    createTileInputs("guessTiles");
};
