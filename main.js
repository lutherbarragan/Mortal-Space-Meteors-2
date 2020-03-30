const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let interval;
let frames = 0;
const imgs = {
	background: ''
};

canvas.width = window.visualViewport.width;
canvas.height = window.visualViewport.height;

// Main Functions
function start() {
	interval = setInterval(update, 1000 / 60);
}

function update() {
	frames++;
	console.log(frames);
}

function stop() {}

// listeners
addEventListener('keydown', (e) => {
	if (e.keyCode == 13) start();
});
