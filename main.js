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
let _1second = 100;
let isRunning = false;
let frames = 0;
let spawnSpeed = 800;
let currentUpgrade = {
	allowToDraw: false,
	instance: {},
};

let global_data = {
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

const imgs = {
	background: 'src/background/space_horizon.png',
	player1: {
		idle: [
			'src/ship/idle/frame_01.png',
			'src/ship/idle/frame_02.png',
			'src/ship/idle/frame_01.png',
			'src/ship/idle/frame_02.png',
			'src/ship/idle/frame_03.png',
			'src/ship/idle/frame_01.png',
			'src/ship/idle/frame_02.png',
			'src/ship/idle/frame_01.png',
			'src/ship/idle/frame_02.png',
			'src/ship/idle/frame_03.png',
			'src/ship/idle/frame_00.png',
		],
		shield: [
			'src/ship/upgrades/shield/frame_00.png',
			'src/ship/upgrades/shield/frame_01.png',
			'src/ship/upgrades/shield/frame_02.png',
			'src/ship/upgrades/shield/frame_03.png',
			'src/ship/upgrades/shield/frame_04.png',
			'src/ship/upgrades/shield/frame_05.png',
			'src/ship/upgrades/shield/frame_06.png',
			'src/ship/upgrades/shield/frame_07.png',
			'src/ship/upgrades/shield/frame_08.png',
			'src/ship/upgrades/shield/frame_08.png',
			'src/ship/upgrades/shield/frame_08.png',
			'src/ship/upgrades/shield/frame_08.png',
		],
		shotgun: [
			'src/ship/upgrades/shotgun/frame_00.png',
			'src/ship/upgrades/shotgun/frame_01.png',
			'src/ship/upgrades/shotgun/frame_02.png',
			'src/ship/upgrades/shotgun/frame_03.png',
			'src/ship/upgrades/shotgun/frame_04.png',
			'src/ship/upgrades/shotgun/frame_05.png',
			'src/ship/upgrades/shotgun/frame_06.png',
			'src/ship/upgrades/shotgun/frame_07.png',
			'src/ship/upgrades/shotgun/frame_08.png',
			'src/ship/upgrades/shotgun/frame_08.png',
			'src/ship/upgrades/shotgun/frame_08.png',
			'src/ship/upgrades/shotgun/frame_08.png',
		],
	},
	meteor: {
		default: 'src/spawns/meteor/METEOR.png',
		white: 'src/spawns/meteor/METEOR_White_Frame.png',
		red: 'src/spawns/meteor/METEOR_Red_Frame.png',
		redTransparent: 'src/spawns/meteor/METEOR_Red_Transparent_Frame.png',
	},
	bullets: {
		default: 'src/ship/bullet.png',
	},
	grabbables: {
		shield: 'src/grabbables/shield_icon.png',
		shotgun: 'src/grabbables/shotgun_icon.png',
	},
};

const UPGRADES_DATA = [
	{
		name: 'shotgun',
		type: 'weapon',
		img: imgs.grabbables.shotgun,
		attackSpeed: 50,
		width: 24,
		height: 24,
	},
	{
		name: 'shield',
		type: 'defense',
		img: imgs.grabbables.shield,
	},
];

// instances
let board = new Board();
let player1 = new Player(canvas.width / 2, canvas.height / 2);
const UNITS = {
	meteors: [],
	bullets: [],
};

const meteorScore = {
	sm: 0,
	md: 0,
	lg: 0,
};
const meteorTypes = [
	{
		width: 100,
		speed: 6,
		hp: 2,
		value: 10,
		pushback: 50,
		size: 'sm',
	},
	{
		width: 150,
		speed: 4,
		hp: 3,
		value: 50,
		pushback: 80,
		size: 'md',
	},
	{
		width: 200,
		speed: 2,
		hp: 4,
		value: 100,
		pushback: 100,
		size: 'lg',
	},
];

// Aux Functions
function spawnMeteor() {
	const newMeteor = meteorTypes[Math.floor(Math.random() * 3)];
	UNITS.meteors.push(new Meteor(newMeteor));
}

//COLLITION BETWEEN PLAYR AND METEOR IS NOT BEING TRIGGERED, FIX!!!!
function checkCollitionBetween(unit, target) {
	if (
		unit.hitbox.x < target.hitbox.x + target.hitbox.width &&
		unit.hitbox.x + unit.hitbox.width > target.hitbox.x &&
		unit.hitbox.y < target.hitbox.y + target.hitbox.height &&
		unit.hitbox.y + unit.hitbox.height > target.hitbox.y
	) {
		console.log(unit, target);
		unit.hasCollidedWith(target);
	}
}

function checkCooldowns() {
	// All cooldowns
	if (!player1.weapon.isReady) reduceCooldownCount(player1, 'weapon');
}

function reduceCooldownCount(unit, action) {
	unit[action].cooldownCount--;

	if (unit[action].cooldownCount === 0) {
		unit[action].isReady = true;
	}
}

function spawnUpgrade() {
	const i = Math.floor(Math.floor(Math.random() * UPGRADES_DATA.length));
	const data = UPGRADES_DATA[i];

	//Create a condition to not spawn an UPGRADE that's already active in the player

	currentUpgrade.allowToDraw = true;
	currentUpgrade.instance = new Upgrade(data);
}

// Main Functions
function start() {
	global_data = JSON.parse(localStorage.getItem('MSM2TopScore'));

	isRunning = true;
	timer.style.top = '50px';
	scores.style.display = 'block';
	topScore.style.display = 'block';
	topScore.innerText = `${global_data.score.toLocaleString('en-US')}`;
	meteorScores.style.display = 'flex';
	timer.innerText = '0:00';
	pauseScreen.style.display = 'none';

	// meteorSpawner = setInterval(spawnMeteor, spawnSpeed);
	mainInterval = setInterval(update, 10); // 100FPS
	playerAnimationInterval = setInterval(player1.framesInterval, 60);
}

function update() {
	frames++;

	checkCooldowns();
	// ...

	// 10 points per second
	if (frames % 10 == 0) player1.score += 1;

	if (global_data.score < player1.score) {
		global_data.score = player1.score; // [FEATURE] Add animation when top score is changing
		global_data.time = time;
		global_data.meteors = { ...meteorScore };

		topScore.innerText = `${global_data.score.toLocaleString('en-US')}`;

		localStorage.setItem('MSM2TopScore', JSON.stringify(global_data));
	}

	// 1 second
	if (frames % _1second == 0) {
		time++;
		let mins = Math.floor(time / 60);
		let secs = time % 60;

		if (secs < 10) secs = `0${secs}`;

		timer.innerText = `${mins}:${secs}`;
		if (spawnSpeed > 400) {
			clearInterval(meteorSpawner);
			spawnSpeed -= 5;
			// meteorSpawner = setInterval(spawnMeteor, spawnSpeed);
		}
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

	UNITS.meteors.forEach(meteor => {
		UNITS.bullets.forEach(bullet => {
			if (bullet.allowToDraw) checkCollitionBetween(meteor, bullet);
		});
	});
	UNITS.meteors.forEach(meteor => checkCollitionBetween(player1, meteor));
	if (currentUpgrade.allowToDraw) checkCollitionBetween(player1, currentUpgrade.instance);

	// CHECK AND REMOVE METEORS
	UNITS.meteors.forEach(meteor => {
		if (meteor.y > canvas.height) meteor.hp = 0;
		else meteor.draw();
	});
	UNITS.meteors = UNITS.meteors.filter(meteor => meteor.hp > 0);

	// CHECK AND REMOVE BULLETS
	UNITS.bullets.forEach(bullet => {
		if (bullet.y < 0) bullet.allowToDraw = false;
		else bullet.draw();
	});
	UNITS.bullets = UNITS.bullets.filter(bullet => bullet.allowToDraw);

	player1.draw();

	//FIX**
	if (frames % 500 == 0) spawnUpgrade();
	if (currentUpgrade.allowToDraw) currentUpgrade.instance.draw();
	if (currentUpgrade.instance.y > canvas.height) {
		currentUpgrade.allowToDraw = false;
		currentUpgrade.instance = {};
		console.log(currentUpgrade);
	}

	// [BUG] Possible bug: Should only substrack HALF of the player's total width
	if (player1.y > canvas.height) {
		// stop(); // disabled while in develpment

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
	clearInterval(playerAnimationInterval);
}
