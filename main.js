const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const timer = document.getElementById('timer');

let mainInterval;
let timerInterval;
let time = 0;
let isRunning = false;
let frames = 0;
const imgs = {
	background: 'https://pbs.twimg.com/media/ECbeOgkXYAAgJ-F.png'
};

canvas.width = window.visualViewport.width;
canvas.height = window.visualViewport.height;

// instances
let board = new Board();
let player1 = new Player();

// Main Functions
function start() {
	isRunning = true;
	mainInterval = setInterval(update, 1000 / 60);
	timerInterval = setInterval(() => {
		timer.innerText = time;
		time++;
	}, 1000);
}

function update() {
	frames++;
	//  erase current content
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	//  (Re) Draw new content
	board.draw();
}

function stop() {
	isRunning = false;
	clearInterval(mainInterval);
	clearInterval(timerInterval);
}

// listeners
addEventListener('keydown', (e) => {
	if (e.keyCode == 13) {
		if (isRunning) stop();
		else start();
	}
});
