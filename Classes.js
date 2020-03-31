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
	constructor() {
		this.x = canvas.width / 2;
		this.y = canvas.height / 2;
		this.width = 50;
		this.height = 50;
		this.img = new Image();
		this.img.src = imgs.player1;
		this.img.onload = this.draw;
		this.gravity = 4;
	}

	draw = () => {
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
	};
}
