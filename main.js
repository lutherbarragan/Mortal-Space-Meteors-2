const BODY = document.querySelector('body');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const timer = document.getElementById('timer');
const scores = document.getElementById('scores');
const topScore = document.getElementById('topScore');
const lgScore = document.getElementById('lg');
const mdScore = document.getElementById('md');
const smScore = document.getElementById('sm');
const meteorScores = document.getElementById('meteor-scores');
const pauseScreen = document.getElementById('pause-screen');
const playAgain = document.getElementById('playAgain');

let mainInterval;
let meteorSpawner;
let time = 0;
let isRunning = false;
let frames = 0;
let spawnSpeed = 800;
let savedData = {
	score: 0,
	time: 0,
	meteors: {
		lg: 0,
		md: 0,
		sm: 0,
	},
};

canvas.width = BODY.offsetWidth;
canvas.height = BODY.offsetHeight;

// let extraSpeed = 0;
const imgs = {
	background: 'src/SPACE_HORIZON.png',
	player1: 'src/SHIP1/Spaceship.png',
	meteor: {
		default: 'src/Meteor/METEOR.png',
		white: 'src/Meteor/METEOR_White_Frame.png',
		red: 'src/Meteor/METEOR_Red_Frame.png',
		redTransparent: 'src/Meteor/METEOR_Red_Transparent_Frame.png',
	},
};

// instances
let board = new Board();
let player1 = new Player(canvas.width / 2, canvas.height / 2);
const meteors = [];
const bullets = [];
const meteorScore = {
	sm: 0,
	md: 0,
	lg: 0,
};
const meteorTypes = [
	{
		width: 150,
		speed: 8,
		hp: 2,
		value: 10,
		pushback: 50,
		size: 'sm',
	},
	{
		width: 250,
		speed: 5,
		hp: 4,
		value: 50,
		pushback: 80,
		size: 'md',
	},
	{
		width: 350,
		speed: 2,
		hp: 8,
		value: 100,
		pushback: 100,
		size: 'lg',
	},
];

// Aux Functions
function spawnMeteor() {
	const newMeteor = meteorTypes[Math.floor(Math.random() * 3)];
	meteors.push(new Meteor(newMeteor));
}

function checkMeteorsCollitions(unit) {
	meteors.forEach(meteor => {
		if (meteor.hp > 0) {
			if (meteor.checkCollition(unit)) {
				if (unit.type == 'player') {
					unit.getPushedBack(meteor.pushback);
				}

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
	scores.style.display = 'block';
	topScore.style.display = 'block';
	topScore.innerText = `${savedData.score.toLocaleString('en-US')}`;
	meteorScores.style.display = 'flex';
	timer.innerText = time;
	pauseScreen.style.display = 'none';

	meteorSpawner = setInterval(spawnMeteor, spawnSpeed);
	mainInterval = setInterval(update, 10); // 100FPS
}

function update() {
	frames++;

	// 10 points per second
	if (frames % 10 == 0) player1.score += 1;

	if (savedData.score < player1.score) {
		savedData.score = player1.score; // [FEATURE] Add animation when top score is changing
		savedData.time = time;
		savedData.meteors = { ...meteorScore };

		topScore.innerText = `${savedData.score.toLocaleString('en-US')}`;

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
	score.innerText = `${player1.score.toLocaleString('en-US')}`;
	lgScore.childNodes[1].innerText = meteorScore.lg;
	mdScore.childNodes[1].innerText = meteorScore.md;
	smScore.childNodes[1].innerText = meteorScore.sm;

	//  erase current content
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	//  (Re) Draw new content
	board.draw();

	// [FEATURE] Add life score
	checkMeteorsCollitions(player1);

	player1.draw();

	bullets.forEach(bullet => {
		if (bullet.allowToDraw) checkMeteorsCollitions(bullet);
	});

	meteors.forEach(meteor => {
		if (meteor.y < canvas.height) meteor.draw();
	});

	bullets.forEach(bullet => bullet.draw());

	// [BUG] Possible bug: Should only substrack HALF of the player's total width
	if (player1.x < 0 - player1.width) {
		// stop(); disabled while in develpment

		let gameOver = `
            <p>GAME OVER</p>
            <button id="playAgain">Play again</button>
        `;
		pauseScreen.innerHTML = gameOver;

		const playAgain = document.getElementById('playAgain');
		playAgain.addEventListener('click', () => window.location.reload());
	}
}

function stop() {
	isRunning = false;
	pauseScreen.style.display = 'block';
	clearInterval(mainInterval);
	clearInterval(meteorSpawner);
}
