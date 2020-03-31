// listeners
addEventListener('keydown', (e) => {
	// GAME EVENTS
	if (e.keyCode == 13) {
		if (isRunning) stop();
		else start();
	}

	// PLAYER EVENTS

	// LEFT
	if (e.keyCode == 65) {
		if (player1.x - player1.width < 0) return;
		player1.x -= player1.width;
	}

	// RIGHT
	if (e.keyCode == 68) {
		if (player1.x + player1.width >= canvas.width - player1.width) return;
		player1.x += player1.width;
	}

	// UP
	if (e.keyCode == 87) {
		if (player1.y - player1.height < 0) return;
		player1.y -= player1.height;
	}

	// DOWN
	if (e.keyCode == 83) {
		if (player1.y + player1.height >= canvas.height) return;
		player1.y += player1.height;
	}
});
