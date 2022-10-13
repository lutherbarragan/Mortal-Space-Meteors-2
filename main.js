const DOM = {
	canvas: document.querySelector('canvas'),
	BODY: document.querySelector('body'),
	timer: document.getElementById('timer'),
	scores: document.getElementById('scores'),
	topScore: document.getElementById('topScore'),
	meteorScoreDisplay: document.getElementById('meteor-scores'),
	lgScore: document.getElementById('lg'),
	mdScore: document.getElementById('md'),
	smScore: document.getElementById('sm'),
	pauseScreen: document.getElementById('pause-screen'),
};
const STATE = {
	playerAnimationInterval: undefined,
	mainInterval: undefined,
	meteorSpawner: undefined,
	time: {
		totalSeconds: 0,
		inMinutes: 0,
		inSeconds: 0,
	},
	_1second: 100,
	isRunning: false,
	frames: 0,
	meteorScore: { lg: 0, md: 0, sm: 0 },
	spawnMeteorEvery: 100,
	spawnMeteorMax: 40,
	currentItem: {
		allowToDraw: false,
		instance: {},
	},
	spawnItemEvery: 500,
};
const IMAGES = {
	background: 'src/background/space_horizon.png',
	player: {
		idle_sequence: [
			'src/ship/idle/frame_01.png',
			'src/ship/idle/frame_01.png',
			'src/ship/idle/frame_02.png',
			'src/ship/idle/frame_02.png',
			'src/ship/idle/frame_01.png',
			'src/ship/idle/frame_01.png',
			'src/ship/idle/frame_02.png',
			'src/ship/idle/frame_02.png',
			'src/ship/idle/frame_03.png',
			'src/ship/idle/frame_03.png',
			'src/ship/idle/frame_01.png',
			'src/ship/idle/frame_01.png',
			'src/ship/idle/frame_02.png',
			'src/ship/idle/frame_02.png',
			'src/ship/idle/frame_01.png',
			'src/ship/idle/frame_01.png',
			'src/ship/idle/frame_02.png',
			'src/ship/idle/frame_02.png',
			'src/ship/idle/frame_03.png',
			'src/ship/idle/frame_03.png',
			'src/ship/idle/frame_00.png',
			'src/ship/idle/frame_00.png',
		],
		shield_sequence: [
			'src/ship/items/shield/frame_00.png',
			'src/ship/items/shield/frame_01.png',
			'src/ship/items/shield/frame_02.png',
			'src/ship/items/shield/frame_03.png',
			'src/ship/items/shield/frame_04.png',
			'src/ship/items/shield/frame_05.png',
			'src/ship/items/shield/frame_06.png',
			'src/ship/items/shield/frame_07.png',
			'src/ship/items/shield/frame_08.png',
			'src/ship/items/shield/frame_08.png',
			'src/ship/items/shield/frame_08.png',
			'src/ship/items/shield/frame_08.png',
		],
		shotgun_sequence: [
			'src/ship/items/shotgun/frame_00.png',
			'src/ship/items/shotgun/frame_01.png',
			'src/ship/items/shotgun/frame_02.png',
			'src/ship/items/shotgun/frame_03.png',
			'src/ship/items/shotgun/frame_04.png',
			'src/ship/items/shotgun/frame_05.png',
			'src/ship/items/shotgun/frame_06.png',
			'src/ship/items/shotgun/frame_07.png',
			'src/ship/items/shotgun/frame_08.png',
			'src/ship/items/shotgun/frame_08.png',
			'src/ship/items/shotgun/frame_08.png',
			'src/ship/items/shotgun/frame_08.png',
		],
	},
	meteor: {
		default: 'src/spawns/meteor/meteor_default.png',
		damage: 'src/spawns/meteor/meteor_white.png',
	},
	bullets: {
		default: 'src/projectiles/default/bullet.png',
		hit_sequence: [
			'src/projectiles/default/hit/frame_00.png',
			'src/projectiles/default/hit/frame_00.png',
			'src/projectiles/default/hit/frame_00.png',
			'src/projectiles/default/hit/frame_00.png',
			'src/projectiles/default/hit/frame_01.png',
			'src/projectiles/default/hit/frame_01.png',
			'src/projectiles/default/hit/frame_01.png',
			'src/projectiles/default/hit/frame_01.png',
			'src/projectiles/default/hit/frame_02.png',
			'src/projectiles/default/hit/frame_02.png',
			'src/projectiles/default/hit/frame_02.png',
			'src/projectiles/default/hit/frame_02.png',
		],
	},
	item_icons: {
		shield: 'src/grabbables/shield_icon.png',
		shotgun: 'src/grabbables/shotgun_icon.png',
	},
};
const PROPERTIES = {
	items: [
		{
			name: 'shotgun',
			type: 'weapon',
			img: IMAGES.item_icons.shotgun,
			attackSpeed: 50,
			width: 24,
			height: 24,
		},
		{
			name: 'shield',
			type: 'defense',
			img: IMAGES.item_icons.shield,
		},
	],
	meteors: [
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
	],
};
let LOCAL_DATA = {
	score: 0,
	time: {
		totalSeconds: 0,
		inMinutes: 0,
		inSeconds: 0,
	},
	meteors: {},
};

const ctx = DOM.canvas.getContext('2d');
DOM.canvas.width = DOM.BODY.offsetWidth;
DOM.canvas.height = DOM.BODY.offsetHeight;

// INSTANCES
const BOARD = new Board();
const PLAYER = new Player(DOM.canvas.width / 2, DOM.canvas.height / 2);
let METEORS = [];
let BULLETS = [];

// AUX FUNCTIONS
function fetchLocalData() {
	LOCAL_DATA = JSON.parse(localStorage.getItem('MSM2TopScore'));
}
function updateDOM(action) {
	if (action === 'start') {
		DOM.timer.style.top = '50px';
		DOM.scores.style.display = 'block';
		DOM.topScore.style.display = 'block';
		DOM.topScore.innerText = `${LOCAL_DATA.score.toLocaleString('en-US')}`;
		DOM.meteorScoreDisplay.style.display = 'flex';
		DOM.timer.innerText = `${STATE.time.inMinutes}:${
			STATE.time.inSeconds < 10 ? `0${STATE.time.inSeconds}` : STATE.time.inSeconds
		}`;
		DOM.pauseScreen.style.display = 'none';
	}
	if (action === 'update') {
		// 0.01 second (fps speed)
		score.innerText = `${PLAYER.score.toLocaleString('en-US')}`;
		DOM.lgScore.childNodes[1].innerText = STATE.meteorScore.lg;
		DOM.mdScore.childNodes[1].innerText = STATE.meteorScore.md;
		DOM.smScore.childNodes[1].innerText = STATE.meteorScore.sm;
		//  erase current content
		ctx.clearRect(0, 0, DOM.canvas.width, DOM.canvas.height);
		//  (Re) Draw new content
		BOARD.draw();
	}
	if (action === 'stop') {
		DOM.pauseScreen.style.display = 'block';
	}
}
function updateSTATE(action) {
	if (action === 'start') {
		STATE.isRunning = true;
		STATE.mainInterval = setInterval(update, 10); // 100FPS change it ot 16? -> (60 FPS)
	}
	if (action === 'stop') {
		STATE.isRunning = false;
		clearInterval(STATE.mainInterval);
	}
}
function updateAnimationIntervals(action) {
	if (action === 'start') {
		STATE.playerAnimationInterval = setInterval(PLAYER.framesInterval, 60);
	}
	if (action === 'stop') {
		clearInterval(STATE.playerAnimationInterval);
		STATE.playerAnimationInterval = undefined;
	}
}
function updatePlayerScore(points) {
	PLAYER.score += points;
}
function updateLocalData() {
	LOCAL_DATA.score = PLAYER.score; // [FEATURE] Add animation when top score is changing
	LOCAL_DATA.time = { ...STATE.time };
	LOCAL_DATA.meteors = { ...STATE.meteorScore };

	DOM.topScore.innerText = `${LOCAL_DATA.score.toLocaleString('en-US')}`;

	localStorage.setItem('MSM2TopScore', JSON.stringify(LOCAL_DATA));
}
function updateTime() {
	STATE.time.totalSeconds++;
	STATE.time.inMinutes = Math.floor(STATE.time.totalSeconds / 60);
	STATE.time.inSeconds = STATE.time.totalSeconds % 60;

	DOM.timer.innerText = `${STATE.time.inMinutes}:${
		STATE.time.inSeconds < 10 ? `0${STATE.time.inSeconds}` : STATE.time.inSeconds
	}`;
}
function spawnMeteor() {
	const newMeteor = PROPERTIES.meteors[Math.floor(Math.random() * 3)];
	METEORS.push(new Meteor(newMeteor));
}
function increaseMeteorSpawnSpeed() {
	if (STATE.spawnMeteorEvery > STATE.spawnMeteorMax) STATE.spawnMeteorEvery -= 2;
}
function spawnItem() {
	const i = Math.floor(Math.floor(Math.random() * PROPERTIES.items.length));
	const data = PROPERTIES.items[i];

	//Create a condition to not spawn an ITEM that's already active in the player

	STATE.currentItem.allowToDraw = true;
	STATE.currentItem.instance = new Item(data);
}
function checkCooldowns() {
	// All cooldowns
	if (!PLAYER.weapon.isReady) reduceCooldownCount(PLAYER, 'weapon');
}
function reduceCooldownCount(unit, action) {
	unit[action].cooldownCount--;

	if (unit[action].cooldownCount === 0) {
		unit[action].isReady = true;
	}
}
function checkCollitionBetween(unit, target) {
	if (
		unit.hitbox.x < target.hitbox.x + target.hitbox.width &&
		unit.hitbox.x + unit.hitbox.width > target.hitbox.x &&
		unit.hitbox.y < target.hitbox.y + target.hitbox.height &&
		unit.hitbox.y + unit.hitbox.height > target.hitbox.y
	) {
		unit.hasCollidedWith(target);
	}
}
function endGame() {
	stop(); // disabled while in develpment

	let gameOver = `
		<p>GAME OVER</p>
		<button id="playAgain">Play again</button>
	`;
	DOM.pauseScreen.innerHTML = gameOver;

	document.getElementById('playAgain').addEventListener('click', () => window.location.reload());
}

// MAIN FUNCTIONS
function start() {
	fetchLocalData();
	updateDOM('start');
	updateSTATE('start');
	updateAnimationIntervals('start');
}
function update() {
	updateDOM('update');
	STATE.frames++;

	if (STATE.frames % 10 == 0) updatePlayerScore(1); // 10 points per second
	if (LOCAL_DATA.score < PLAYER.score) updateLocalData();
	if (STATE.frames % STATE._1second == 0) updateTime();
	if (STATE.frames % STATE.spawnMeteorEvery === 0) spawnMeteor();
	if (STATE.frames % STATE._1second === 0) increaseMeteorSpawnSpeed();
	if (STATE.frames % 500 === 0) spawnItem();

	checkCooldowns();

	METEORS = METEORS.filter(meteor => meteor.allowToDraw);
	BULLETS = BULLETS.filter(bullet => bullet.allowToDraw);

	PLAYER.draw();
	METEORS.forEach(meteor => meteor.draw());
	BULLETS.forEach(bullet => bullet.draw());
	if (STATE.currentItem.allowToDraw) STATE.currentItem.instance.draw();

	METEORS.forEach(meteor => checkCollitionBetween(PLAYER, meteor));
	METEORS.forEach(meteor => {
		BULLETS.forEach(bullet => {
			if (bullet.allowToDraw) checkCollitionBetween(meteor, bullet);
		});
	});
	if (STATE.currentItem.allowToDraw) checkCollitionBetween(PLAYER, STATE.currentItem.instance);

	if (PLAYER.y > DOM.canvas.height) endGame();
}
function stop() {
	updateSTATE('stop');
	updateDOM('stop');
	updateAnimationIntervals('stop');
}
