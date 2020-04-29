const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const timer = document.getElementById('timer');
const score = document.getElementById('score');
const pauseScreen = document.getElementById('pause-screen');

let mainInterval;
let time = 0;
let isRunning = false;
let isPaused = false;
let frames = 0;
const imgs = {
	background: 'https://pbs.twimg.com/media/ECbeOgkXYAAgJ-F.png',
	player1: 'https://opengameart.org/sites/default/files/pitrizzo-SpaceShip-gpl3-opengameart-96x96.png',
	meteor: 'https://imga.androidappsapk.co/zhZdXcmO9dgAcu27xEEIvf_tb7TMqxhqdrG5nI9ECl9NMtvJXR00_E4z4x8p7PTX_Ew=s100'
};

canvas.width = window.visualViewport.width;
canvas.height = window.visualViewport.height;

// instances
let board = new Board();
let player1 = new Player(canvas.width / 2, canvas.height / 2);

// Main Functions
function start() {
	isRunning = true;
	timer.style.top = '50px';
	score.style.display = 'block';
	timer.innerText = time;
	pauseScreen.style.display = 'none';

	mainInterval = setInterval(update, 10); // 100FPS
}

function update() {
	frames++;
	player1.score += 1;

	// 1 second
	if (frames % 100 == 0) {
		time++;
		timer.innerText = time;
	}
	// 0.01 second (fps speed)
	score.innerText = `Score: ${player1.score}`;

	//  erase current content
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	//  (Re) Draw new content
	board.draw();
	player1.draw();
}

function stop() {
	isRunning = false;
	pauseScreen.style.display = 'block';
	clearInterval(mainInterval);
}
