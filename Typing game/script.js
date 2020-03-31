const word = document.getElementById("word");
const text = document.getElementById("text");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const endgameEl = document.getElementById("end-game-container");
const settingsBtn = document.getElementById("settings-btn");
const settings = document.getElementById("settings");
const settingsForm = document.getElementById("settings-form");
const difficultySelect = document.getElementById("difficulty");

// List of words for game
const words = [
	"sigh",
	"tense",
	"airplane",
	"ball",
	"pies",
	"juice",
	"warlike",
	"bad",
	"north",
	"dependent",
	"steer",
	"silver",
	"highfalutin",
	"superficial",
	"quince",
	"eight",
	"feeble",
	"admit",
	"drag",
	"loving"
];

let randomWord;
let score = 0;
let time = 10;
let difficulty =
	localStorage.getItem("difficulty") !== null
		? localStorage.getItem("difficulty")
		: "medium";

difficultySelect.value = difficulty;

text.focus();

// Timer
const timeInterval = setInterval(updateTime, 1000);

function updateTime() {
	time--;

	if (time > 0) {
		timeEl.innerHTML = `${time}s`;
	} else {
		clearInterval(timeInterval);
		gameOver();
	}
}

function getRandomWord() {
	return words[Math.floor(Math.random() * words.length)];
}

function addWordToDOM() {
	randomWord = getRandomWord();
	word.innerHTML = randomWord;
}

function updateScore() {
	score += randomWord.length;
	scoreEl.innerHTML = score;
}

function gameOver() {
	endgameEl.innerHTML = `
		<h1>Time ran out</h1>
		<p>Your final score is ${score}</p>
		<button onclick="location.reload()">Reload</button>
	`;

	endgameEl.style.display = "flex";
}

addWordToDOM();

// Event listeners
text.addEventListener("input", e => {
	const insertedText = e.target.value;

	if (insertedText === randomWord) {
		updateScore();
		addWordToDOM();

		e.target.value = "";

		switch (difficulty) {
			case "hard":
				time += 2;
				break;
			case "medium":
				time += 3;
				break;
			case "easy":
				time += 4;
				break;
		}

		updateTime();
	}
});

settingsBtn.addEventListener("click", () => settings.classList.toggle("hide"));

settingsForm.addEventListener("change", e => {
	difficulty = e.target.value;
	localStorage.setItem("difficulty", difficulty);
	location.reload();
});
