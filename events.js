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
		player1.x -= player1.width;
	}

	// RIGHT
	if (e.keyCode == 68) {
		player1.x += player1.width;
	}

	// UP
	if (e.keyCode == 87) {
		player1.y -= player1.height;
	}

	// DOWN
	if (e.keyCode == 83) {
		player1.y += player1.height;
	}
});
