const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const timer = document.getElementById('timer');

let interval;
let timerInterval;
let time = 0;
let frames = 0;
const imgs = {
	background: 'https://pbs.twimg.com/media/ECbeOgkXYAAgJ-F.png'
};

canvas.width = window.visualViewport.width;
canvas.height = window.visualViewport.height;

// Classes
class Board {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.width = canvas.width;
		this.height = canvas.height;
		this.img = new Image();
		this.img.src = imgs.background;
		this.img.onload = this.draw;
	}

	draw = () => {
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
	};
}

// instances
let board = new Board();

// Main Functions
function start() {
	interval = setInterval(update, 1000 / 60);
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

function stop() {}

// listeners
addEventListener('keydown', (e) => {
	if (e.keyCode == 13) start();
});
