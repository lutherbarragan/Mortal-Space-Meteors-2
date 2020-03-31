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
		this.x = 0;
		this.y = 0;
		this.width = 32;
		this.height = 32;
		this.img = new Image();
		this.img.src = '';
		this.img.onload = this.draw;
	}

	draw = () => {
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
	};
}
