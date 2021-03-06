const Game = require('./game');
const GameView = require('./game_view');

document.addEventListener("DOMContentLoaded", function() {
  const canvasEl = document.getElementsByTagName("canvas")[0];

  canvasEl.width = Game.DIM_X;
  canvasEl.height = Game.DIM_Y;

  const context = canvasEl.getContext("2d");
  const game = new Game(context, canvasEl);
  new GameView(game, context).start();
});
