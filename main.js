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
	playAgain: document.getElementById('playAgain'),
};
const STATE = {
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
};
const IMAGES = {
	background: 'src/background/space_horizon.png',
	player: {
		idle_sequence: [
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
const ITEMS_DATA = [
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
];
const METEORS_DATA = [
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
function spawnMeteor() {
	if (STATE.frames % STATE.spawnMeteorEvery === 0) {
		const newMeteor = METEORS_DATA[Math.floor(Math.random() * 3)];
		METEORS.push(new Meteor(newMeteor));
	}
	if (STATE.frames % STATE._1second === 0) {
		if (STATE.spawnMeteorEvery > STATE.spawnMeteorMax) STATE.spawnMeteorEvery -= 2;
	}
}
function spawnItem() {
	const i = Math.floor(Math.floor(Math.random() * ITEMS_DATA.length));
	const data = ITEMS_DATA[i];

	//Create a condition to not spawn an ITEM that's already active in the player

	STATE.currentItem.allowToDraw = true;
	STATE.currentItem.instance = new Item(data);
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
function updatePlayerScore(points) {
	PLAYER.score += points;
}
function updateTime() {
	STATE.time.totalSeconds++;
	STATE.time.inMinutes = Math.floor(STATE.time.totalSeconds / 60);
	STATE.time.inSeconds = STATE.time.totalSeconds % 60;

	DOM.timer.innerText = `${STATE.time.inMinutes}:${
		STATE.time.inSeconds < 10 ? `0${STATE.time.inSeconds}` : STATE.time.inSeconds
	}`;
}
function updateLocalData() {
	LOCAL_DATA.score = PLAYER.score; // [FEATURE] Add animation when top score is changing
	LOCAL_DATA.time = { ...STATE.time };
	LOCAL_DATA.meteors = { ...STATE.meteorScore };

	DOM.topScore.innerText = `${LOCAL_DATA.score.toLocaleString('en-US')}`;

	localStorage.setItem('MSM2TopScore', JSON.stringify(LOCAL_DATA));
}

// MAIN FUNCTIONS
function start() {
	LOCAL_DATA = JSON.parse(localStorage.getItem('MSM2TopScore'));
	updateDOM('start');
	updateSTATE('start');
	// [REVIEW]
	playerAnimationInterval = setInterval(PLAYER.framesInterval, 60);
}
function update() {
	STATE.frames++;
	checkCooldowns();
	if (STATE.frames % 10 == 0) updatePlayerScore(1); // 10 points per second
	if (LOCAL_DATA.score < PLAYER.score) updateLocalData();
	if (STATE.frames % STATE._1second == 0) updateTime();
	spawnMeteor();
	updateDOM('update');

	METEORS.forEach(meteor => {
		BULLETS.forEach(bullet => {
			if (bullet.allowToDraw) checkCollitionBetween(meteor, bullet);
		});
	});
	METEORS.forEach(meteor => checkCollitionBetween(PLAYER, meteor));
	if (STATE.currentItem.allowToDraw) checkCollitionBetween(PLAYER, STATE.currentItem.instance);

	// CHECK AND REMOVE METEORS
	METEORS.forEach(meteor => {
		if (meteor.y > DOM.canvas.height) meteor.hp = 0;
		else meteor.draw();
	});
	METEORS = METEORS.filter(meteor => meteor.hp > 0);

	// CHECK AND REMOVE BULLETS
	BULLETS.forEach(bullet => {
		if (bullet.y < 0) bullet.allowToDraw = false;
		else bullet.draw();
	});
	BULLETS = BULLETS.filter(bullet => bullet.allowToDraw);

	// if (STATE.frames % 6 == 0) PLAYER.framesInterval();
	PLAYER.draw();

	//FIX**
	if (STATE.frames % 500 == 0) spawnItem();
	if (STATE.currentItem.allowToDraw) STATE.currentItem.instance.draw();
	if (STATE.currentItem.instance.y > DOM.canvas.height) {
		STATE.currentItem.allowToDraw = false;
		STATE.currentItem.instance = {};
	}

	// [BUG] Possible bug: Should only substrack HALF of the player's total width
	if (PLAYER.y > DOM.canvas.height) {
		// stop(); // disabled while in develpment

		let gameOver = `
            <p>GAME OVER</p>
            <button id="playAgain">Play again</button>
        `;
		DOM.pauseScreen.innerHTML = gameOver;

		// DOM.playAgain.addEventListener('click', () => window.location.reload());
	}
}
function stop() {
	updateSTATE('stop');
	updateDOM('stop');
	clearInterval(playerAnimationInterval);
}
