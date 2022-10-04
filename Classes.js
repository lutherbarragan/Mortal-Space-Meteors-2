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
		if (this.y >= this.height) this.y = 0;

		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		ctx.drawImage(this.img, this.x, this.y - this.height, this.width, this.height);

		this.y += 1;
	};
}

class Player {
	constructor(x, y) {
		this.width = 183;
		this.height = 241;
		this.x = x - this.width / 2;
		this.y = y - this.height / 2;
		this.hitbox = {
			width: 105,
			height: 111,
			x: this.x + this.width / 2 - 105 / 2,
			y: this.y + this.height / 2 - 111 / 2 - 8,
		};
		this.img = new Image();
		this.frame = 0;
		this.img.src = imgs.player1.idle[this.frame];
		this.img.onload = this.draw;
		this.animation = 'idle';
		this.animationInterval;
		this.gravity = 2;
		this.moveSpeed = 2;
		this.moveDistance = 100;
		this.weapon = {
			type: 'default',
			attackSpeed: 35,
			cooldownCount: 0,
			isReady: true,
		};
		this.defense = {
			type: 'none',
		};
		this.score = 0;
		this.type = 'player';
	}

	draw = () => {
		if (isRunning) {
			//UNIT VISUAL
			ctx.fillStyle = 'rgba(0, 255, 47, 0.2)';
			ctx.fillRect(this.x, this.y, this.width, this.height);

			//HITBOX
			this.hitbox.x = this.x + this.width / 2 - this.hitbox.width / 2;
			this.hitbox.y = this.y + this.height / 2 - this.hitbox.height / 2 - 8;
			ctx.fillStyle = 'red';
			ctx.fillRect(this.hitbox.x, this.hitbox.y, this.hitbox.width, this.hitbox.height);

			ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		}
	};

	moveUp = () => {
		let distanceTravelled = 0;

		let moveUpIntr = setInterval(() => {
			this.y -= this.moveSpeed;
			distanceTravelled += this.moveSpeed;

			if (distanceTravelled >= this.hitbox.height) {
				clearInterval(moveUpIntr);
			}
			if (this.hitbox.y - this.moveSpeed <= 0) {
				this.y = 0 - this.hitbox.height / 2;
				clearInterval(moveUpIntr);
			}
		}, 1);
	};

	moveDown = () => {
		let distanceTravelled = 0;

		let moveDownIntr = setInterval(() => {
			this.y += this.moveSpeed;
			distanceTravelled += this.moveSpeed;

			if (distanceTravelled >= this.hitbox.height) {
				clearInterval(moveDownIntr);
			}
			if (this.hitbox.y + this.moveSpeed >= canvas.height - this.hitbox.height) {
				this.y = canvas.height - this.hitbox.height * 1.5;
				clearInterval(moveDownIntr);
			}
		}, 1);
	};

	moveLeft = () => {
		let distanceTravelled = 0;

		let moveLeftIntr = setInterval(() => {
			this.x -= this.moveSpeed;
			distanceTravelled += this.moveSpeed;

			if (distanceTravelled >= this.hitbox.width) {
				clearInterval(moveLeftIntr);
			}

			if (this.hitbox.x - this.hitbox.width - this.moveSpeed < 0) {
				if (this.hitbox.x <= 0 - this.hitbox.width) {
					this.x = canvas.width;
				}
				distanceTravelled = 0;
			}
		}, 1);
	};

	moveRight = () => {
		let distanceTravelled = 0;

		let moveRightIntr = setInterval(() => {
			this.x += this.moveSpeed;
			distanceTravelled += this.moveSpeed;

			if (distanceTravelled >= this.hitbox.width) {
				clearInterval(moveRightIntr);
			}

			if (this.hitbox.x + this.hitbox.width + this.moveSpeed > canvas.width) {
				if (this.hitbox.x >= canvas.width) {
					this.x = 0 - this.width;
				}
				distanceTravelled = 0;
			}
		}, 1);
	};

	framesInterval = () => {
		if (this.frame === imgs.player1[this.animation].length - 1) {
			this.animation = 'idle';
			this.frame = 0;
		}
		this.img.src = imgs.player1[this.animation][this.frame];
		this.frame++;
	};

	updateAnimation = name => {
		this.animation = 'shield'; // name here
		this.frame = 0;
		console.log('[Player.updateAnimation]', this.animation, this.frame);
		// this.framesInterval();
	};

	getUpgrade = instance => {
		this.updateAnimation(instance.name);

		//get attributes...
	};

	shoot = () => {
		const x = this.x + this.width / 2;
		const y = this.y + this.height / 3;

		UNITS.bullets.push(new Bullet(x, y));

		this.weapon.isReady = false;
		this.weapon.cooldownCount = this.weapon.attackSpeed;
	};

	getPushedBack = pushback => {
		this.y += pushback;
	};

	hasCollidedWith = target => {
		if (target.type === 'upgrade') {
			this.updateAnimation(currentUpgrade.instance.name);
			currentUpgrade.allowToDraw = false;
			currentUpgrade.instance = {};
		} else if (target.type === 'meteor') {
			this.getPushedBack(target.pushback);
		}
	};
}

class Meteor {
	constructor(props) {
		this.id = Date.now();
		this.type = 'meteor';
		this.width = props.width;
		this.height = props.width;
		this.x = Math.floor(Math.random() * canvas.width);
		this.y = 0 - this.height;
		this.hitbox = {
			width: this.width,
			height: this.height,
			x: this.x,
			y: this.y,
		};
		this.img = new Image();
		this.img.src = imgs.meteor.default;
		this.img.onload = this.draw;
		this.speed = props.speed;
		this.hp = props.hp;
		this.value = props.value;
		this.pushback = props.pushback;
		this.size = props.size;
	}

	draw = () => {
		if (isRunning) {
			//HITBOX
			this.hitbox.x = this.x + this.width / 2 - this.hitbox.width / 2;
			this.hitbox.y = this.y + this.height / 2 - this.hitbox.height / 2;

			ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
			this.y += this.speed;
		}
	};

	hasCollidedWith = target => {
		if (target.type === 'bullet') this.takeDamage(target);
	};

	takeDamage = bullet => {
		bullet.allowToDraw = false;
		this.hp -= bullet.damage;
		this.y -= 15;

		this.damageEffect();

		if (this.hp <= 0) {
			meteorScore[this.size]++;
			player1.score += this.value;
		}
	};

	damageEffect = () => {
		this.img.src = imgs.meteor.white;

		setTimeout(() => {
			this.img.src = imgs.meteor.red;
		}, 15);

		setTimeout(() => {
			this.img.src = imgs.meteor.redTransparent;
		}, 25);

		setTimeout(() => {
			this.img.src = imgs.meteor.default;
		}, 80);
	};
}

class Bullet {
	constructor(x, y) {
		this.id = Date.now();
		this.width = 12;
		this.height = 12;
		this.x = x - this.width / 2;
		this.y = y;
		this.hitbox = {
			width: this.width,
			height: this.height,
			x: this.x,
			y: this.y,
		};
		this.img = new Image();
		this.img.src = imgs.bullets.default;
		this.img.onload = this.draw;
		this.damage = 1;
		this.allowToDraw = true;
		this.type = 'bullet';
	}

	draw = () => {
		if (isRunning) {
			//HITBOX
			this.hitbox.x = this.x + this.width / 2 - this.hitbox.width / 2;
			this.hitbox.y = this.y + this.height / 2 - this.hitbox.height / 2;

			ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
			this.y -= 10;
		}
	};
}

//RENAME
class Upgrade {
	constructor(data) {
		this.name = data.name;
		this.type = 'upgrade';
		this.id = Date.now();
		this.width = 48;
		this.height = 48;
		this.x = Math.floor(Math.random() * canvas.width);
		this.y = 0 - this.height;
		this.hitbox = {
			width: this.width,
			height: this.height,
			x: this.x,
			y: this.y,
		};
		this.img = new Image();
		this.img.src = data.img;
		this.img.onload = this.draw;
		this.speed = 2;
	}

	draw = () => {
		//HITBOX
		this.hitbox.x = this.x + this.width / 2 - this.hitbox.width / 2;
		this.hitbox.y = this.y + this.height / 2 - this.hitbox.height / 2;

		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		this.y += this.speed;
	};
}
