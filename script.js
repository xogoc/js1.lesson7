var FIELD_SIZE_X = 20;
var FIELD_SIZE_Y = 20;
var SNAKE_SPEED = 250;
var NEW_FOOD_TIME = 1000;

var isGameRunning = false;
var snakeTimer;
var snake = [];
var direction = 'x-';
var scoreCount = 0;
var obstacle = [];

function init() {
  var startButton = document.getElementById('snake-start');
  startButton.addEventListener('click', startGame);

  var renewButton = document.getElementById('snake-renew');
  renewButton.addEventListener('click', refreshGame);

  addEventListener('keydown', changeDirection);

  buildGameField();
}

function buildGameField() {
  var gameTable = document.createElement('table');
  gameTable.classList.add('game-table');

  for(var i = 0; i < FIELD_SIZE_X; i++) {
    var row = document.createElement('tr');
    row.classList.add('game-table-row');

    for(var j = 0; j < FIELD_SIZE_Y; j++) {
      var cell = document.createElement('td');
      cell.classList.add('game-table-cell');
      cell.classList.add('cell-' + i + "-" + j);

      row.appendChild(cell);
    }
    gameTable.appendChild(row);
  }

  document.getElementById('snake-field').appendChild(gameTable);
}

function changeDirection(event) {
  switch (event.keyCode) {
    case 37:
      if(direction != 'y+') {
        direction = 'y-';
      }
      break;
    case 38:
      if(direction != 'x+') {
        direction = 'x-';
      }
      break;
    case 39:
      if(direction != 'y-') {
        direction = 'y+';
      }
      break;
    case 40:
      if(direction != 'x-') {
        direction = 'x+';
      }
      break;

  }
}

function startGame() {
  if(!isGameRunning && !snake[0]) {
    respawn();
    isGameRunning = true;
    snakeTimer = setInterval(move, SNAKE_SPEED);
    setTimeout(createFood, NEW_FOOD_TIME);
  }
}

function respawn() {
  var startCoordX = Math.floor(FIELD_SIZE_X / 2);
  var startCoordY = Math.floor(FIELD_SIZE_Y / 2);

  var snakeHead
    = document.getElementsByClassName('cell-' + startCoordX + '-' + startCoordY)[0];
  snakeHead.classList.add('snake-unit');

  var snakeTail
    = document.getElementsByClassName('cell-' + (startCoordX - 1) + '-' + startCoordY)[0];

  snakeTail.classList.add('snake-unit');

  snake = [];

  snake.push(snakeHead);
  snake.push(snakeTail);
}

function move() {
  var snakeHeadClasses = snake[snake.length - 1].classList;

  var newUnit;
  var snakeCoords = snakeHeadClasses[1].split('-');
  var coordX = parseInt(snakeCoords[1]);
  var coordY = parseInt(snakeCoords[2]);

  switch(direction) {
    case 'x-':
      coordX = (coordX - 1 < 0 ? FIELD_SIZE_X - 1 : coordX - 1);
      break;
    case 'x+':
      coordX = (coordX + 1 >= FIELD_SIZE_X ? 0 : coordX + 1);
      break;
    case 'y-':
      coordY = (coordY - 1 < 0 ? FIELD_SIZE_Y - 1 : coordY - 1);
      break;
    case 'y+':
      coordY = (coordY + 1 >= FIELD_SIZE_Y ? 0 : coordY + 1);
      break;
  }
  newUnit = document.getElementsByClassName('cell-' + coordX + '-' + coordY)[0];

  if(newUnit !== undefined && !newUnit.classList.contains('snake-unit') && !newUnit.classList.contains('obstacle-unit')) {
    newUnit.classList.add('snake-unit');
    snake.push(newUnit);

    if(!newUnit.classList.contains('food-unit')) {
      var removed = snake.splice(0, 1)[0];
      removed.classList.remove('snake-unit');
    } else {
      newUnit.classList.remove('food-unit');
      createFood();
      score();
    }
  } else {
    finishGame();
  }
}

function score() {
  document.getElementById("score").innerText = "Счет: " + ++scoreCount;
}

function createFood() {
  var foodCreated = false;

  while(!foodCreated) {
    var foodX = Math.floor(Math.random() * FIELD_SIZE_X);
    var foodY = Math.floor(Math.random() * FIELD_SIZE_Y);

    var foodCell = document.getElementsByClassName('cell-' + foodX + '-' + foodY)[0];

    if(!foodCell.classList.contains('snake-unit') && !foodCell.classList.contains('obstacle-unit')) {
      foodCell.classList.add('food-unit');
      foodCreated = true;
    }
  }
  setTimeout(deleteObstacle, SNAKE_SPEED*2);
  setTimeout(createObstacle, SNAKE_SPEED*3);
}

function deleteObstacle() {
  var removed;
  while(obstacle.length) {
      removed = obstacle.splice(0, 1)[0];
      removed.classList.remove('obstacle-unit');
  }
}
function createObstacle() {
  deleteObstacle();
  var obstacleCreated = false;

  while(!obstacleCreated) {
      var obstacleX = Math.floor(Math.random() * FIELD_SIZE_X);
      var obstacleY = Math.floor(Math.random() * FIELD_SIZE_Y);

      var obstacleCell = document.getElementsByClassName('cell-' + obstacleX + '-' + obstacleY)[0];

      if(!obstacleCell.classList.contains('snake-unit') && !obstacleCell.classList.contains('food-unit')) {
          obstacleCell.classList.add('obstacle-unit');
          obstacle.push(obstacleCell);
          while(obstacle.length < scoreCount) {
            obstacleX = (Math.random() >= 0.5 ? (Math.random() >= 0.5 ? obstacleX + 1 : obstacleX) : (Math.random() >= 0.5 ? obstacleX - 1 : obstacleX));
            obstacleY = (Math.random() >= 0.5 ? (Math.random() >= 0.5 ? obstacleY + 1 : obstacleY) : (Math.random() >= 0.5 ? obstacleY - 1 : obstacleY));
            obstacleCell = document.getElementsByClassName('cell-' + obstacleX + '-' + obstacleY)[0];

            if(obstacleCell !== undefined && !obstacleCell.classList.contains('snake-unit') && !obstacleCell.classList.contains('food-unit')) {
                obstacleCell.classList.add('obstacle-unit');
                obstacle.push(obstacleCell);
            }
          }
          obstacleCreated = true;
      }
  }
}

function finishGame() {
  clearInterval(snakeTimer);
  isGameRunning = false;

  alert('GAME OVER');
}

function refreshGame() {
  location.reload();
}

window.onload = init;
