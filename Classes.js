class Board {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.width = DOM.canvas.width;
		this.height = DOM.canvas.height;
		this.img = new Image();
		this.img.src = IMAGES.background;
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
		this.img.src = IMAGES.player.idle_sequence[this.frame];
		this.img.onload = this.draw;
		this.animation = 'idle';
		this.gravity = 2;
		this.moveSpeed = 3;
		this.moveDistance = 100;
		this.score = 0;
		this.type = 'player';
		this.weapon = {
			type: 'default',
			attackSpeed: 35,
			cooldownCount: 0,
			isReady: true,
		};
		this.defense = {
			type: 'none',
		};
	}

	devDraw = () => {
		//UNIT VISUAL
		ctx.fillStyle = 'rgba(0, 255, 47, 0.2)';
		ctx.fillRect(this.x, this.y, this.width, this.height);

		ctx.fillStyle = 'red';
		ctx.fillRect(this.hitbox.x, this.hitbox.y, this.hitbox.width, this.hitbox.height);
	};

	draw = () => {
		if (STATE.isRunning) {
			//HITBOX
			this.hitbox.x = this.x + this.width / 2 - this.hitbox.width / 2;
			this.hitbox.y = this.y + this.height / 2 - this.hitbox.height / 2 - 8;
			// this.devDraw();
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
			if (this.hitbox.y + this.moveSpeed >= DOM.canvas.height - this.hitbox.height) {
				this.y = DOM.canvas.height - this.hitbox.height * 1.5;
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
					this.x = DOM.canvas.width;
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

			if (this.hitbox.x + this.hitbox.width + this.moveSpeed > DOM.canvas.width) {
				if (this.hitbox.x >= DOM.canvas.width) {
					this.x = 0 - this.width;
				}
				distanceTravelled = 0;
			}
		}, 1);
	};

	framesInterval = () => {
		if (this.frame === IMAGES.player[`${this.animation}_sequence`].length - 1) {
			this.animation = 'idle';
			this.frame = 0;
		} else {
			this.frame++;
		}

		this.img.src = IMAGES.player[`${this.animation}_sequence`][this.frame];
	};

	updateAnimation = name => {
		this.animation = name;
		this.frame = 0;
	};

	getUpgrade = instance => {
		this.updateAnimation(instance.name);

		if (instance.category === 'weapon') {
			this[instance.category].type = instance.name;
			this[instance.category].attackSpeed = instance.attackSpeed;
		}
		if (instance.category === 'shield') {
			this[instance.category].type = instance.name;
		}
	};

	shoot = () => {
		const x = this.x + this.width / 2;
		const y = this.y + this.height / 3;

		if (this.weapon.type === 'default') BULLETS.push(new Bullet(x, y, 'default', 0));
		if (this.weapon.type === 'shotgun') {
			BULLETS.push(new Bullet(x, y, 'shotgun_01', 250));
			BULLETS.push(new Bullet(x, y, 'shotgun_02', 250));
			BULLETS.push(new Bullet(x, y, 'shotgun_03', 250));
			BULLETS.push(new Bullet(x, y, 'shotgun_04', 250));
		}

		this.weapon.isReady = false;
		this.weapon.cooldownCount = this.weapon.attackSpeed;
	};

	getPushedBack = pushback => {
		let log = 8;
		let moveDownIntr = setInterval(() => {
			this.y += pushback / log;
			log++;

			if (log >= 50) {
				clearInterval(moveDownIntr);
			}
		}, 1);
	};

	hasCollidedWith = target => {
		if (target.type === 'item') {
			this.getUpgrade(STATE.currentItem.instance);
			STATE.currentItem.allowToDraw = false;
			STATE.currentItem.instance = {};
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
		this.x = Math.floor(Math.random() * DOM.canvas.width);
		this.y = 0 - this.height;
		this.hitbox = {
			width: this.width,
			height: this.height,
			x: this.x,
			y: this.y,
		};
		this.img = new Image();
		this.img.src = IMAGES.meteor.default;
		this.img.onload = this.draw;
		this.speed = props.speed;
		this.hp = props.hp;
		this.value = props.value;
		this.pushback = props.pushback;
		this.size = props.size;
		this.allowToDraw = true;
		this.hitAnimationInstance = { allowToDraw: false };
	}

	draw = () => {
		if (STATE.isRunning) {
			if (this.y > DOM.canvas.height) {
				this.allowToDraw = false;
			} else {
				//HITBOX
				this.hitbox.x = this.x + this.width / 2 - this.hitbox.width / 2;
				this.hitbox.y = this.y + this.height / 2 - this.hitbox.height / 2;

				ctx.drawImage(this.img, this.x, this.y, this.width, this.height);

				if (this.hitAnimationInstance.allowToDraw) {
					this.hitAnimationInstance.draw(this.y + this.height);
				} else this.hitAnimationInstance.allowToDraw = false;
			}
		}

		this.y += this.speed;
	};

	hasCollidedWith = target => {
		if (target.type === 'bullet') this.takeDamage(target);
	};

	takeDamage = bullet => {
		this.hp -= bullet.damage;
		if (this.hp <= 0) this.allowToDraw = false;
		this.y -= 15;
		this.damageEffect(bullet);

		if (this.hp <= 0) {
			STATE.meteorScore[this.size]++;
			PLAYER.score += this.value;
		}

		bullet.allowToDraw = false;
	};

	damageEffect = bullet => {
		this.img.src = IMAGES.meteor.damage;
		setTimeout(() => {
			this.img.src = IMAGES.meteor.default;
		}, 25);

		this.hitAnimationInstance = new HitAnimation(bullet.x, this.y + this.height);
	};
}

class HitAnimation {
	constructor(x, y) {
		this.width = 36;
		this.height = 36;
		this.x = x;
		this.y = y;
		this.frame = 0;
		this.img = new Image();
		this.img.src = IMAGES.bullets.hit_sequence[this.frame];
		this.allowToDraw = true;
	}

	draw = y => {
		this.img.src = IMAGES.bullets.hit_sequence[this.frame];
		ctx.drawImage(this.img, this.x - this.width / 2, y - this.height / 2, this.width, this.height);

		if (this.frame >= IMAGES.bullets.hit_sequence.length - 1) {
			this.allowToDraw = false;
		} else {
			this.frame++;
		}
	};
}

class Bullet {
	constructor(x, y, name, limit) {
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
		this.img.src = IMAGES.bullets.default;
		this.img.onload = this.draw;
		this.frame = 0;
		this.damage = 1;
		this.allowToDraw = true;
		this.distanceTravelled = 0;
		this.distanceLimit = limit;
		this.name = name;
		this.type = 'bullet';
	}

	draw = () => {
		if (STATE.isRunning) {
			if (this.y < 0) this.allowToDraw = false;
			else {
				//HITBOX
				this.hitbox.x = this.x + this.width / 2 - this.hitbox.width / 2;
				this.hitbox.y = this.y + this.height / 2 - this.hitbox.height / 2;

				ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
				this.move();
			}
		}
	};

	move = () => {
		this.y -= 10;
		this.distanceTravelled += 10;

		if (PLAYER.weapon.type === 'shotgun') {
			if (this.name === 'shotgun_01') this.x -= 3;
			if (this.name === 'shotgun_02') this.x -= 1;
			if (this.name === 'shotgun_03') this.x += 1;
			if (this.name === 'shotgun_04') this.x += 3;
			if (this.distanceTravelled >= this.distanceLimit) this.allowToDraw = false;
		}
	};
}

class Item {
	constructor(data) {
		this.id = Date.now();
		this.type = 'item';
		this.category = data.category;
		this.name = data.name;
		this.width = 48;
		this.height = 48;
		this.x = Math.floor(Math.random() * DOM.canvas.width);
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
		this.attackSpeed = data.attackSpeed;
		// console.log(data);
	}
	draw = () => {
		if (this.y > DOM.canvas.height) {
			STATE.currentItem.allowToDraw = false;
			STATE.currentItem.instance = {};
		} else {
			//HITBOX
			this.hitbox.x = this.x + this.width / 2 - this.hitbox.width / 2;
			this.hitbox.y = this.y + this.height / 2 - this.hitbox.height / 2;

			ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
			this.y += this.speed;
		}
	};
}
