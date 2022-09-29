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
		this.width = 54;
		this.height = 64;
		this.x = x - this.width / 2;
		this.y = y - this.height / 2;
		this.img = new Image();
		this.frame = 0;
		this.img.src = imgs.player1.idle[this.frame];
		this.img.onload = this.draw;
		this.currentAnimation = 'idle';
		this.previousAnimation = 'idle';
		this.gravity = 2;
		this.moveSpeed = 3;
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
			ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		}
	};

	animationInterval = () => {
		if (this.frame === imgs.player1[this.currentAnimation].length - 1) {
			this.currentAnimation = 'idle';
			this.frame = 0;
		} else {
			this.frame++;
		}

		this.img.src = imgs.player1[this.currentAnimation][this.frame];
	};

	updateAnimation = type => {
		this.currentAnimation = type;
		this.frame = 0;
	};

	moveUp = () => {
		if (this.y - this.height <= 0) return;

		let distanceTravelled = 0;

		let moveUpIntr = setInterval(() => {
			this.y -= this.moveSpeed;
			distanceTravelled += this.moveSpeed;

			if (distanceTravelled >= this.height) {
				if (this.y - this.height <= 0) this.y = 0;

				clearInterval(moveUpIntr);
			}
		}, 6);
	};

	moveDown = () => {
		if (this.y + this.height >= canvas.height) return;

		let distanceTravelled = 0;
		let moveDownIntr = setInterval(() => {
			this.y += this.moveSpeed;
			distanceTravelled += this.moveSpeed;

			if (distanceTravelled >= this.height) {
				if (this.y + this.height >= canvas.height) this.y = canvas.height - this.height;

				clearInterval(moveDownIntr);
			}
		}, 6);
	};

	moveLeft = () => {
		this.gravity = 0;
		let distanceTravelled = 0;
		let moveLeftIntr = setInterval(() => {
			this.x -= this.moveSpeed;
			distanceTravelled += this.moveSpeed;

			if (distanceTravelled >= this.moveDistance) {
				clearInterval(moveLeftIntr);
				if (this.x <= this.width / 2) this.x = canvas.width - this.width / 2;

				setTimeout(() => {
					this.gravity = 2;
				}, 25);
			}
		}, 6);
	};

	moveRight = () => {
		this.gravity = 0;
		let distanceTravelled = 0;
		let moveRightIntr = setInterval(() => {
			this.x += this.moveSpeed;
			distanceTravelled += this.moveSpeed;

			if (distanceTravelled >= this.moveDistance) {
				if (this.x + this.width / 2 >= canvas.width) this.x = 0 - this.width / 2;
				clearInterval(moveRightIntr);
				setTimeout(() => {
					this.gravity = 2;
				}, 25);
			}
		}, 6);
	};

	shoot = () => {
		const x = this.x + this.width / 2;
		const y = this.y + this.height * 0;

		bullets.push(new Bullet(x, y));

		this.weapon.isReady = false;
		this.weapon.cooldownCount = this.weapon.attackSpeed;
	};

	getPushedBack = pushback => (this.y += pushback);

	getUpgrade = instance => {
		this.frameAnimation(instance.name);

		//get attributes...
	};
}

class Meteor {
	constructor(props) {
		this.id = Date.now();
		this.width = props.width;
		this.height = props.width;
		this.x = Math.floor(Math.random() * canvas.width);
		this.y = 0 - this.height;
		this.img = new Image();
		this.img.src = imgs.meteor.default;
		this.img.onload = this.draw;
		this.speed = props.speed;
		this.hp = props.hp;
		this.value = props.value;
		this.pushback = props.pushback;
		this.size = props.size;
		this.type = 'obstacle';
	}

	draw = () => {
		if (this.hp > 0) {
			ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
			this.y += this.speed;
		}
	};

	checkCollition = unit => {
		return (
			this.x < unit.x + unit.width &&
			this.x + this.width > unit.x &&
			this.y < unit.y + unit.height &&
			this.y + this.height > unit.y
		);
	};

	takeDamage = damage => {
		this.hp -= damage;
		this.y -= 15;

		this.damageEffect();
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
		this.img = new Image();
		this.img.src = imgs.bullets.default;
		this.img.onload = this.draw;
		this.damage = 1;
		this.allowToDraw = true;
		this.type = 'bullet';
	}

	draw = () => {
		if (this.allowToDraw) {
			ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
			this.y -= 10;
		}
	};
}

//RENAME
class Upgrade {
	constructor(data) {
		// this.name = data.name;
		this.name = 'shield';
		this.id = Date.now();
		this.width = 48;
		this.height = 48;
		this.x = Math.floor(Math.random() * canvas.width);
		this.y = 0 - this.height;
		this.img = new Image();
		this.img.src = data.img;
		this.img.onload = this.draw;
		this.speed = 2;
		this.type = 'upgrade';
	}

	draw = () => {
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		this.y += this.speed;
	};

	checkCollition = unit => {
		return (
			this.x < unit.x + unit.width &&
			this.x + this.width > unit.x &&
			this.y < unit.y + unit.height &&
			this.y + this.height > unit.y
		);
	};
}
