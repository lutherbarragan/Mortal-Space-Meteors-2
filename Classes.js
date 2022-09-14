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
		if (this.x <= -this.width) this.x = 0;

		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		ctx.drawImage(this.img, this.x + this.width, this.y, this.width, this.height);

		this.x -= 1;
	};
}

class Player {
	constructor(x, y) {
		this.width = 150;
		this.height = 50;
		this.x = x - this.width / 2;
		this.y = y - this.height / 2;
		this.img = new Image();
		this.img.src = imgs.player1;
		this.img.onload = this.draw;
		this.gravity = 2;
		this.moveSpeed = 2;
		this.moveDistance = 50;
		this.score = 0;
		this.weapon = 'default';
		this.type = 'player';
	}

	draw = () => {
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		// this.x -= this.gravity;
	};

	moveUp = () => {
		if (this.y - this.height < 0) return;

		let distanceTravelled = 0;

		let moveUpIntr = setInterval(() => {
			this.y -= this.moveSpeed;
			distanceTravelled += this.moveSpeed;

			if (distanceTravelled >= this.height) {
				clearInterval(moveUpIntr);
			}
		}, 6);
	};

	moveDown = () => {
		if (this.y + this.height * 2 >= canvas.height) return;

		let distanceTravelled = 0;
		let moveDownIntr = setInterval(() => {
			this.y += this.moveSpeed;
			distanceTravelled += this.moveSpeed;

			if (distanceTravelled >= this.height) {
				clearInterval(moveDownIntr);
			}
		}, 6);
	};

	moveLeft = () => {
		if (player1.x - player1.width <= 0) return;

		this.gravity = 0;
		let distanceTravelled = 0;
		let moveLeftIntr = setInterval(() => {
			this.x -= this.moveSpeed;
			distanceTravelled += this.moveSpeed;

			if (distanceTravelled >= this.moveDistance) {
				clearInterval(moveLeftIntr);
				setTimeout(() => {
					this.gravity = 2;
				}, 25);
			}
		}, 6);
	};

	moveRight = () => {
		if (player1.x + player1.width >= canvas.width - player1.width) return;

		this.gravity = 0;
		let distanceTravelled = 0;
		let moveRightIntr = setInterval(() => {
			this.x += this.moveSpeed;
			distanceTravelled += this.moveSpeed;

			if (distanceTravelled >= this.moveDistance) {
				clearInterval(moveRightIntr);
				setTimeout(() => {
					this.gravity = 2;
				}, 25);
			}
		}, 6);
	};

	shoot = () => {
		const x = this.x + this.width * 0.85;
		const y = this.y + this.height / 2;

		bullets.push(new Bullet(x, y));

		WEAPONS.default.isReady = false;
		WEAPONS.default.count = WEAPONS.default.attackSpeed;
	};

	getPushedBack = pushback => (this.x -= pushback);
}

class Meteor {
	constructor(props) {
		this.id = Date.now();
		this.width = props.width;
		this.height = props.width;
		this.x = canvas.width + this.width;
		this.y = Math.floor(Math.random() * canvas.height);
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
			this.x -= this.speed;
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
		this.x += 15;

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
		this.width = 18;
		this.height = 6;
		this.x = x;
		this.y = y + Math.random() * 10;
		this.damage = 1;
		this.allowToDraw = true;
		this.type = 'bullet';
	}

	draw = () => {
		if (this.allowToDraw) {
			ctx.fillStyle = `rgb(255, 255, 255)`;
			ctx.fillRect(this.x, this.y, this.width, this.height);
			this.x += 8;
		}
	};
}
