// listeners
window.addEventListener('load', () => {
	if (!localStorage.getItem('MSM2TopScore')) localStorage.setItem('MSM2TopScore', JSON.stringify(LOCAL_DATA));
});

addEventListener('keydown', e => {
	// GAME EVENTS
	if (e.keyCode == 13) {
		if (STATE.isRunning) {
			playFX('pause-in.wav');
			stop();
		} else {
			if (STATE.frames > 0) playFX('pause-out.wav');
			start();
		}
	}

	// PLAYER EVENTS
	if (STATE.isRunning) {
		if (e.keyCode == 65) PLAYER.moveLeft();
		if (e.keyCode == 68) PLAYER.moveRight();
		if (e.keyCode == 87) PLAYER.moveUp();
		if (e.keyCode == 83) PLAYER.moveDown();
		if (e.keyCode == 32) {
			if (PLAYER.weapon.isReady) PLAYER.shoot();
		}
	}
});
