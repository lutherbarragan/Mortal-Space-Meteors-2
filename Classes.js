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

class Player {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.width = 50;
		this.height = 50;
		this.img = new Image();
		this.img.src = imgs.player1;
		this.img.onload = this.draw;
		this.gravity = 2;
		this.moveSpeed = 2;
		this.score = 0;
	}

	draw = () => {
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		this.y += this.gravity;
	};

	moveUp = () => {
		if (this.y - this.height < 0) return;

		this.gravity = 0;
		let distanceTravelled = 0;

		let moveUpIntr = setInterval(() => {
			this.y -= this.moveSpeed;
			distanceTravelled += this.moveSpeed;

			if (distanceTravelled >= this.height) {
				clearInterval(moveUpIntr);
				setTimeout(() => {
					this.gravity = 2;
				}, 25);
			}
		}, 1);
	};

	moveDown = () => {
		if (player1.y + player1.height >= canvas.height) return;

		let distanceTravelled = 0;
		let moveDownIntr = setInterval(() => {
			this.y += this.moveSpeed;
			distanceTravelled += this.moveSpeed;

			if (distanceTravelled >= this.height) {
				clearInterval(moveDownIntr);
			}
		}, 1);
	};

	moveLeft = () => {
		if (player1.x - player1.width < 0) return;

		let distanceTravelled = 0;
		let moveDownIntr = setInterval(() => {
			this.x -= this.moveSpeed;
			distanceTravelled += this.moveSpeed;

			if (distanceTravelled >= this.width) {
				clearInterval(moveDownIntr);
			}
		}, 1);
	};

	moveRight = () => {
		if (player1.x + player1.width >= canvas.width - player1.width) return;

		let distanceTravelled = 0;
		let moveDownIntr = setInterval(() => {
			this.x += this.moveSpeed;
			distanceTravelled += this.moveSpeed;

			if (distanceTravelled >= this.width) {
				clearInterval(moveDownIntr);
			}
		}, 1);
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
		this.img.src = imgs.meteor;
		this.img.onload = this.draw;
		this.speed = props.speed;
		this.hp = props.hp;
	}

	draw = () => {
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		this.y += this.speed;
	};

	checkCollition = (player) => {
		return (
			this.x < player.x + player.width &&
			this.x + this.width > player.x &&
			this.y < player.y + player.height &&
			this.y + this.height > player.y
		);
	};
}
