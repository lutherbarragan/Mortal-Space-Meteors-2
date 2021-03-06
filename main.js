const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const timer = document.getElementById('timer');
const score = document.getElementById('score');
const topScore = document.getElementById('topScore');
const xlgScore = document.getElementById('xlg');
const lgScore = document.getElementById('lg');
const mdScore = document.getElementById('md');
const smScore = document.getElementById('sm');
const meteorScores = document.getElementById('meteor-scores');
const pauseScreen = document.getElementById('pause-screen');

let mainInterval;
let meteorSpawner;
let time = 0;
let isRunning = false;
let frames = 0;
let spawnSpeed = 1000;
let savedData = {
	score: 0,
	time: 0,
	meteors: {
		xlg: 0,
		lg: 0,
		md: 0,
		sm: 0
	}
};
// let extraSpeed = 0;
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
const meteors = [];
const bullets = [];
const meteorScore = {
	sm: 0,
	md: 0,
	lg: 0,
	xlg: 0
};
const meteorTypes = [
	{
		width: 100,
		speed: 10,
		hp: 2,
		value: 1000,
		size: 'sm'
	},
	{
		width: 150,
		speed: 6,
		hp: 3,
		value: 2000,
		size: 'md'
	},
	{
		width: 200,
		speed: 4,
		hp: 4,
		value: 4000,
		size: 'lg'
	},
	{
		width: 250,
		speed: 2,
		hp: 5,
		value: 5000,
		size: 'xlg'
	}
];

// Aux Functions
function spawnMeteor() {
	const newMeteor = meteorTypes[Math.floor(Math.random() * 4)];
	meteors.push(new Meteor(newMeteor));
}

function checkMeteorsCollitions(unit) {
	meteors.forEach((meteor) => {
		if (meteor.hp > 0) {
			if (meteor.checkCollition(unit)) {
				if (unit.type == 'player') unit.y += 80;

				if (unit.type == 'bullet') {
					unit.allowToDraw = false;
					meteor.takeDamage(unit.damage);

					if (meteor.hp <= 0) {
						meteorScore[meteor.size]++;
						player1.score += meteor.value;
					}
				}
			}
		}
	});
}

// Main Functions
function start() {
	savedData = JSON.parse(localStorage.getItem('MSM2TopScore'));

	isRunning = true;
	timer.style.top = '50px';
	score.style.display = 'block';
	topScore.style.display = 'block';
	topScore.childNodes[3].innerText = savedData.score;
	meteorScores.style.display = 'block';
	timer.innerText = time;
	pauseScreen.style.display = 'none';

	meteorSpawner = setInterval(spawnMeteor, spawnSpeed);
	mainInterval = setInterval(update, 10); // 100FPS
}

function update() {
	frames++;
	player1.score += 1;

	if (savedData.score < player1.score) {
		savedData.score = player1.score;
		savedData.time = time;
		savedData.meteors = { ...meteorScore };

		topScore.childNodes[3].innerText = savedData.score;

		localStorage.setItem('MSM2TopScore', JSON.stringify(savedData));
	}

	// 1 second
	if (frames % 100 == 0) {
		time++;
		timer.innerText = time;
		if (spawnSpeed > 300) {
			clearInterval(meteorSpawner);
			spawnSpeed -= 7;
			meteorSpawner = setInterval(spawnMeteor, spawnSpeed);
			// console.log(spawnSpeed);
		}
	}
	// 10 seconds
	if (frames % 4000 == 0) {
		// more speed (?)
		// extraSpeed++;
		// console.log(extraSpeed);
		// meteorTypes.forEach((meteor) => (meteor.speed += extraSpeed));
	}

	// 0.01 second (fps speed)
	score.innerText = `Score: ${player1.score}`;
	xlgScore.childNodes[1].innerText = meteorScore.xlg;
	lgScore.childNodes[1].innerText = meteorScore.lg;
	mdScore.childNodes[1].innerText = meteorScore.md;
	smScore.childNodes[1].innerText = meteorScore.sm;

	//  erase current content
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	//  (Re) Draw new content
	board.draw();

	checkMeteorsCollitions(player1);

	player1.draw();

	bullets.forEach((bullet) => {
		if (bullet.allowToDraw) checkMeteorsCollitions(bullet);
	});

	meteors.forEach((meteor) => {
		if (meteor.y < canvas.height) meteor.draw();
	});

	bullets.forEach((bullet) => bullet.draw());

	if (player1.y > canvas.height) {
		stop();

		let gameOver = `
            <p>GAME OVER</p>
            <p>Refresh page to play again</p>
        `;
		pauseScreen.innerHTML = gameOver;
	}
}

function stop() {
	isRunning = false;
	pauseScreen.style.display = 'block';
	clearInterval(mainInterval);
	clearInterval(meteorSpawner);
}
