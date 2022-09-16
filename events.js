// listeners
window.addEventListener('load', () => {
	if (!localStorage.getItem('MSM2TopScore')) localStorage.setItem('MSM2TopScore', JSON.stringify(savedData));
});

addEventListener('keydown', e => {
	// GAME EVENTS
	if (e.keyCode == 13) {
		if (isRunning) stop();
		else start();
	}

	// PLAYER EVENTS
	if (isRunning) {
		if (e.keyCode == 65) player1.moveLeft();
		if (e.keyCode == 68) player1.moveRight();
		if (e.keyCode == 87) player1.moveUp();
		if (e.keyCode == 83) player1.moveDown();
		if (e.keyCode == 32) {
			if (player1.shooting.isReady) player1.shoot();
		}
	}
});
