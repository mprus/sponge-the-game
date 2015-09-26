'use strict'

var game = function() {
	var gameBoard = $('#gameBoard');
	var player = {};
	var playerSpeed = 0;
	var endOfGame = false;
	var enemyCreationChance = 0.001;
	var enemySpeed = 3;
	var score = 0
	var start = function() {
		gameBoard.append("<div id='player'></div>")
		player = $('#player');
		$(document).keydown(function(event) {
			if (event.keyCode === 40) {
				playerSpeed = 5;
			} else if (event.keyCode === 38) {
				playerSpeed = -5
			}
		});
		$(document).keyup(function(event) {
			playerSpeed = 0;
		});
	}
	function gameLoop() {
		if (playerSpeed !== 0) {
			movePlayer();
		}
		if (Math.random() < enemyCreationChance) {
			createEnemy();
		}
		moveEnemies();
		detectCollision();
		updateScoreBoard();
	}

	function detectCollision() {
		$('.enemy')
				.each(
						function() {
							var thatQ = $(this);
							var positionOfEnemy = getPositionOf(thatQ);
							var positionOfPlayer = getPositionOf(player);
							if (positionOfEnemy.left > positionOfPlayer.left
									&& positionOfEnemy.right < positionOfPlayer.right
									&& positionOfEnemy.top > positionOfPlayer.top
									&& positionOfEnemy.bottom < positionOfPlayer.bottom) {
								endOfGame = true;
								player.css('background-color', 'red');
								clearInterval(gameIntervalId)
								clearInterval(dificultiIntervalId)
								alert('Looser! Your score is ' + score);
							}
						});
	}

	function moveEnemies() {
		$('.enemy').each(function() {
			var thatQ = $(this);
			var position = getPositionOf(thatQ);
			if (position.left < getPositionOf(gameBoard).left) {
				thatQ.remove();
				score++;
			} else {
				thatQ.css('left', position.left - enemySpeed);
			}
		});
	}

	function createEnemy() {
		var enemyId = generateEnemyId();
		gameBoard.append("<div id='" + enemyId + "' class='enemy'></div>")
		var enemyPositionFactor = Math.random();
		var gameBoardPos = getPositionOf(gameBoard);
		var enemyQ = $('#' + enemyId);
		enemyQ.css('top', enemyPositionFactor * gameBoardPos.height);
		enemyQ.css('left', gameBoardPos.right);

	}

	function generateEnemyId() {
		return Math.floor(Math.random() * 100000 + 1)
	}

	function updateScoreBoard() {
		$('#score').html('Score:' + score);
	}

	function movePlayer() {
		var playerPos = getPositionOf(player);
		var gameBoardPos = getPositionOf(gameBoard);
		var newBottom = playerPos.bottom + playerSpeed;
		var newTop = playerPos.top + playerSpeed;
		if (newTop < gameBoardPos.top) {
			player.css('top', gameBoardPos.top + 5);
		} else if (newBottom > gameBoardPos.bottom) {
			player.css('top', gameBoardPos.bottom - playerPos.height - 5);
		} else {
			player.css('top', newTop);
		}
	}

	function getPositionOf(element) {
		if (element === undefined) {
			return;
		}
		var pos = element.get(0).getBoundingClientRect();
		return pos;
	}

	function increaseDifficulty() {
		if (enemyCreationChance < 1) {
			enemyCreationChance += 0.001;
		} else {
			alert('Give up! It will be harder and harder!')
			enemySpeed += 1;
		}
	}

	return {
		gameLoop : gameLoop,
		start : start,
		increaseDifficulty : increaseDifficulty
	};
}
var spongeGame = game();

var gameIntervalId = setInterval(spongeGame.gameLoop, 10);
var dificultiIntervalId = setInterval(spongeGame.increaseDifficulty, 1000)