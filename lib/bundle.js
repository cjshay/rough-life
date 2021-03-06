/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1);
	const GameView = __webpack_require__(5);
	
	document.addEventListener("DOMContentLoaded", function() {
	  const canvasEl = document.getElementsByTagName("canvas")[0];
	
	  canvasEl.width = Game.DIM_X;
	  canvasEl.height = Game.DIM_Y;
	
	  const context = canvasEl.getContext("2d");
	  const game = new Game(context, canvasEl);
	  new GameView(game, context).start();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	
	const Square = __webpack_require__(2);
	const Util = __webpack_require__(3);
	const LifeObject = __webpack_require__(6);
	
	class Game {
	  constructor(context, canvas) {
	    this.check = false;
	    this.context = context;
	    this.canvas = canvas;
	    this.color = "white";
	    this.percentLiving = 10;
	    this.fill = false;
	    this.onlySquares = true;
	    this.followPath = false;
	    this.randomColors = false;
	    this.rainbowStep = false;
	    this.bindButtons();
	    this.random = true;
	    // only squares has precedent
	    this.step = false;
	    this.squares = {};
	    this.addSquares();
	    this.addLiveCount();
	
	  }
	
	
	
	  addSquares() {
	    Game.ALLPOSITIONS.forEach((position) => {
	      const options = {
	        pos: position,
	        canvasPosition: Util.canvasPosition(position, Game.RECTWIDTH, Game.RECTHEIGHT),
	        width: Game.RECTWIDTH,
	        height: Game.RECTHEIGHT,
	        game: this
	      };
	      this.squares[position] = new Square(options);
	
	    });
	  }
	
	  placeRandomObjectsRandomly(number) {
	    for (let i = 0; i < number; i++) {
	      this.placerandomObjectRandomly();
	    }
	  }
	
	  constantize(string) {
	    let constant;
	    return eval("LifeObject." + string);
	  }
	
	  placerandomObjectRandomly() {
	    const randomObjectName = Game.OBJECTNAMES[Math.floor(Math.random() * Game.OBJECTNAMES.length)];
	
	    const findDist = this.constantize(`${randomObjectName}Dist`);
	    const dist = findDist();
	    const randTries = 50;
	
	    for (let i = 0; i < randTries; i++) {
	      const randX = Math.floor(Math.random() * (Game.NUMSQUARESX));
	      const randY = Math.floor(Math.random() * (Game.NUMSQUARESY));
	      if (this.placeObject([randX, randY], randomObjectName)) {
	        return null;
	      }
	    }
	  }
	
	  isAllDead(pos, objectDist) {
	    const startingX = pos[0];
	    let startingY = pos[1] - objectDist;
	    const furthestX = pos[0] + objectDist;
	    let furthestY = startingY + objectDist;
	
	    if (objectDist === LifeObject.gosperGliderGunDist()) {
	      startingY = pos[1] - 12;
	      furthestY = pos[1] + 12;
	    }
	    for (let i = startingX; i < furthestX; i++) {
	      for (let j = startingY; j < furthestY; j++) {
	        if (this.squares[[i, j]] && this.squares[[i,j]].live) {
	          return false;
	        }
	      }
	    }
	    return true;
	  }
	
	  placeObject(startingPos, objectName) {
	    const place = this.constantize(objectName);
	    const positionList = place(startingPos);
	    const findDist = this.constantize(`${objectName}Dist`);
	    const distBetween = findDist();
	    if (this.isAllDead(startingPos, distBetween)) {
	      positionList.forEach((position) => {
	        if (position[0] < Util.NUMSQUARESX && position[1] < Game.NUMSQUARESY && position[0] > 0 && position[1] > 0) {
	          this.squares[position].live = true;
	        }
	      });
	
	      return true;
	    }
	  }
	
	  placeObjects(objectName, count) {
	    let objCount = count;
	    if (objectName === "gosperGliderGun" && count >= 8) {
	      objCount = 10;
	    }
	    const findDist = this.constantize(`${objectName}Dist`);
	    const distBetween = findDist();
	
	    let offset = 0;
	
	    const shipsCountX = Math.floor(Math.sqrt(objCount));
	    const shipsCountY = Math.floor(Math.sqrt(objCount)) + 1;
	
	    const paddingX = Math.floor(Game.NUMSQUARESX / (shipsCountX + 1));
	    const paddingY = Math.floor(Game.NUMSQUARESY / (shipsCountY + 1));
	
	    let placedCount = 0;
	    for (let i = 0; i < shipsCountX; i++) {
	      for (let j = 0; j < shipsCountY; j++) {
	        if (i !== 0 && paddingX < distBetween) {
	          offset = distBetween - paddingX;
	        }
	        const xPos = 5 + paddingX * (i + 1) - Math.floor(distBetween / 2) + offset;
	        const yPos = paddingY * (j + 1) - Math.floor(distBetween / 2) + Math.floor(distBetween / 2);
	        if ((this.placeObject([xPos, yPos], objectName) &&
	          ++placedCount === objCount)) {
	            return null;
	        }
	      }
	    }
	  }
	
	  objectAttack(objectName) {
	    const findDist = this.constantize(`${objectName}Dist`);
	    const distBetween = findDist();
	    const startingY = 4;
	    const startingX = 4;
	
	    const shipsCountX = Math.floor((Game.NUMSQUARESX - distBetween) / distBetween);
	    const shipsCountY = Math.floor((Game.NUMSQUARESY - distBetween) / distBetween);
	    for (let i = 0; i < shipsCountX; i++) {
	      for (let j = 0; j < shipsCountY; j++) {
	        this.placeObject([i * distBetween + startingX, (j * distBetween) + distBetween ], objectName);
	
	      }
	    }
	  }
	
	
	  addLiveCount() {
	    Game.ALLPOSITIONS.forEach((position) => {
	      this.squares[position].surroundingLivesCount = this.howManyLive(position);
	    });
	  }
	
	  surroundingSquares(pos) {
	    const surrounds = Util.surroundingPositions(pos).map(squarepos => {
	      return this.squares[squarepos];
	    });
	    return surrounds;
	  }
	
	  howManyLive(pos) {
	    const squares = this.surroundingSquares(pos);
	    const liveCount = squares.reduce((accum, square) => {
	      if (square !== undefined && square.live) {
	        return accum + 1;
	      } else {
	        return accum;
	      }
	    }, 0);
	    return liveCount;
	  }
	
	  changeSquares() {
	    this.addLiveCount();
	    Game.ALLPOSITIONS.forEach((position) => {
	      return this.squares[position].change(this.squares[position].surroundingLivesCount);
	    });
	  }
	
	  draw(context) {
	    if (!this.onlySquares) {
	      if (!this.fill) {
	        context.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
	        context.fillStyle = Game.BG_COLOR;
	        context.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
	      }
	    }
	    Game.ALLPOSITIONS.forEach((position) => {
	      if (this.squares[position].live) {
	      }
	      this.squares[position].draw(context);
	    });
	  }
	
	//
	  bindButtons() {
	    this.squareClick();
	    this.stepOnOffButton();
	    this.stepButton();
	    this.displayButton();
	    this.changeColorButton();
	    this.startButton();
	    this.objectNameButton();
	    this.countButton();
	  }
	
	  startButton() {
	    const start = document.getElementById("start");
	    start.addEventListener("click", this.start.bind(this));
	  }
	
	  start() {
	    this.random = true;
	    this.squares = {};
	    this.addSquares();
	    this.addLiveCount();
	  }
	
	  displayButton() {
	    const displayButton = document.getElementById("display-option");
	    displayButton.addEventListener("change", this.changeDisplay.bind(this));
	  }
	
	  changeDisplay(e) {
	    const option = e.currentTarget.value;
	    if (option ==="default") {
	      this.followPath = false;
	      this.fill = false;
	    } else if (option === "grid") {
	      this.toggleFollowPath();
	    } else if (option === "fill"){
	      this.toggleFillPath();
	    }
	  }
	
	  changeColorButton() {
	    const changeColor = document.getElementById("change-colors");
	    changeColor.addEventListener("change", this.changeColor.bind(this));
	  }
	
	  changeColor(e) {
	    this.randomColors = false;
	    this.rainbowStep = false;
	    const type = e.currentTarget.value;
	    if (type == "random-color") {
	      this.randomColors = true;
	    } else if (type == "rainbow-color"){
	      this.rainbowStep = true;
	    }
	  }
	
	  squareClick() {
	    const canvas = this.canvas;
	    canvas.addEventListener("click", this.giveSquareLife.bind(this));
	  }
	
	  giveSquareLife(event) {
	    const xPos = Math.floor(event.layerX / Util.rectSize());
	    const yPos = Math.floor(event.layerY / Util.rectSize());
	    const square = this.squares[[xPos, yPos]];
	    if (square.live) {
	      square.live = false;
	      if (this.followPath) {
	        this.context.clearRect(square.canvasPosition[0], square.canvasPosition[1], square.width, square.height);
	        this.context.fillStyle = square.pathColor;
	        this.context.fillRect(square.canvasPosition[0], square.canvasPosition[1], square.width, square.height);
	      } else {
	        this.context.clearRect(square.canvasPosition[0], square.canvasPosition[1], square.width, square.height);
	      }
	    } else {
	      square.live = true;
	      this.context.fillStyle = square.color;
	      this.context.fillRect(square.canvasPosition[0], square.canvasPosition[1], square.width, square.height);
	    }
	  }
	
	  stepOnOffButton() {
	    const stepOnOff = document.getElementById("step-on-off");
	    this.addPause(stepOnOff);
	    const step = document.getElementById("step");
	    step.style.display = "none";
	    stepOnOff.addEventListener("click", this.toggleStep.bind(this));
	  }
	
	  addPause(node) {
	    const i = document.createElement("i");
	    i.classList.add("fa", "fa-pause", "fa-lg");
	    const ariaHidden = document.createAttribute("aria-hidden");
	    ariaHidden.value = "true";
	    i.setAttributeNode(ariaHidden);
	    node.appendChild(i);
	  }
	
	  addPlay(node) {
	    const i = document.createElement("i");
	    i.classList.add("fa", "fa-play", "fa-lg");
	    const ariaHidden = document.createAttribute("aria-hidden");
	    ariaHidden.value = "true";
	    i.setAttributeNode(ariaHidden);
	    node.appendChild(i);
	  }
	
	  toggleStep(e) {
	    const step = document.getElementById("step");
	    if (this.step) {
	      this.step = false;
	      const play = document.getElementsByClassName("fa-play")[0];
	      e.currentTarget.removeChild(play);
	      this.addPause(e.currentTarget);
	      step.style.display = "none";
	      return this.step;
	    }
	    const pause = document.getElementsByClassName("fa-pause")[0];
	    e.currentTarget.removeChild(pause);
	    this.addPlay(e.currentTarget);
	    step.style.display = "";
	    this.step = true;
	  }
	
	
	  stepButton() {
	    const step = document.getElementById("step");
	    step.addEventListener("click", this.step.bind(this));
	  }
	
	  step() {
	    this.changeSquares();
	    this.draw(this.context);
	  }
	
	  toggleFollowPath() {
	    this.followPath = true;
	  }
	
	  toggleFillPath() {
	    this.followPath = false;
	    this.fill = true;
	  }
	
	  objectAttackClick(objectName) {
	    Game.RANDOMOBJECTS = false;
	    Game.PLACEOBJECTS = false;
	    Game.OBJECTATTACK = true;
	    this.random = false;
	    this.squares = {};
	    this.addSquares();
	    if (objectName === "random") {
	      this.randomObjectsClick(100);
	    } else {
	      this.objectAttack(objectName);
	    }
	    this.addLiveCount();
	  }
	
	  countButton() {
	    const count = document.getElementById("object-place-count-input");
	    count.addEventListener("change", this.objectPlaceClick.bind(this));
	  }
	
	  objectNameButton() {
	    const objectName = document.getElementById("object-place-input");
	    objectName.addEventListener("change", this.objectPlaceClick.bind(this));
	  }
	
	  objectPlaceClick() {
	    Game.RANDOMOBJECTS = false;
	    Game.PLACEOBJECTS = true;
	    Game.OBJECTATTACK = false;
	    this.random = false;
	
	    const count = document.getElementById("object-place-count-input").value;
	    const objectName = document.getElementById("object-place-input").value;
	    if (count === "fill") {
	      this.objectAttackClick(objectName);
	    } else {
	      if (objectName === "random") {
	        this.randomObjectsClick(count);
	      } else {
	        this.squares = {};
	        this.addSquares();
	        this.placeObjects(objectName, parseInt(count));
	        this.addLiveCount();
	      }
	    }
	  }
	
	  randomObjectsClick(count) {
	    Game.RANDOMOBJECTS = true;
	    Game.PLACEOBJECTS = false;
	    Game.OBJECTATTACK = false;
	    this.random = false;
	
	    this.squares = {};
	    this.addSquares();
	
	    this.placeRandomObjectsRandomly(count);
	    this.addLiveCount();
	  }
	}
	
	Game.RANGE = [[0,0], [Util.NUMSQUARESX, Util.NUMSQUARESY]];
	Game.STATICOBJECTNAMES = ["block", "beehive", "loaf", "boat", "tub"];
	Game.OSCILLATINGOBJECTNAMES = ["blinker", "toad", "beacon",
	"pulsar", "pentadecathlon", "clock"];
	Game.OBJECTNAMES =
	  ["block", "beehive", "loaf", "boat", "tub", "blinker", "toad", "beacon",
	  "pulsar", "pentadecathlon", "glider", "lightWeightSpaceship", "clock", "benchmark", "gosperGliderGun"];
	
	
	Game.OBJECTATTACK = false;
	Game.RANDOMOBJECTS = false;
	Game.PLACEOBJECTS = false;
	Game.RANDOMOBJECTSCOUNT = 10;
	Game.CANVASWIDTH = Util.CANVASWIDTH;
	Game.CANVASHEIGHT = Util.CANVASHEIGHT;
	Game.NUMSQUARESY = Util.NUMSQUARESY;
	Game.NUMSQUARESX = Util.NUMSQUARESX;
	Game.RECTHEIGHT = Game.CANVASHEIGHT / Game.NUMSQUARESY;
	Game.RECTWIDTH = Game.CANVASHEIGHT / Game.NUMSQUARESY;
	
	Game.DIM_X = Game.CANVASWIDTH;
	Game.DIM_Y = Game.CANVASHEIGHT;
	Game.BG_COLOR = "#424949";
	Game.ALLPOSITIONS = Util.allPositions();
	
	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3);
	
	
	class Square {
	  constructor(options) {
	    this.game = options.game;
	    this.pos = options.pos;
	    this.canvasPosition = options.canvasPosition;
	    this.width = options.width;
	    this.height = options.height;
	    this.color = this.assignColor();
	    this.assignLive();
	
	    this.pathColor = "#424949";
	    this.surroundingLivesCount = null;
	  }
	
	  random() {
	    if (Math.floor(Math.random() * 100) < this.game.percentLiving) {
	      this.live = true;
	    } else {
	      this.live = false;
	    }
	  }
	
	
	  assignLive() {
	    if (this.game.random) {
	      this.random();
	    }
	  }
	  killCell() {
	    this.live = false;
	  }
	
	  raiseCell() {
	    this.color = this.assignColor();
	    this.live = true;
	  }
	
	  change(surroundLiveCount) {
	    if (this.live) {
	      if (surroundLiveCount < 2 || surroundLiveCount > 3) {
	        this.killCell();
	        this.pathColor = "#000000";
	      }
	    } else {
	      if (surroundLiveCount === 3) {
	        this.raiseCell();
	      }
	    }
	  }
	
	
	
	  draw(context) {
	    if (this.live) {
	      context.fillStyle = this.color;
	      context.fillRect(this.canvasPosition[0], this.canvasPosition[1], this.width, this.height);
	    } else {
	      if (this.game.onlySquares) {
	        if (!this.game.fill) {
	          context.clearRect(this.canvasPosition[0], this.canvasPosition[1], this.width, this.height);
	        }
	        if (this.game.followPath) {
	          context.clearRect(this.canvasPosition[0], this.canvasPosition[1], this.width, this.height);
	          context.fillStyle = this.pathColor;
	          context.fillRect(this.canvasPosition[0], this.canvasPosition[1], this.width, this.height);
	        }
	      }
	    }
	  }
	
	  assignColor() {
	    if (this.game.randomColors) {
	      return this.randomColor();
	    } else if (this.game.rainbowStep){
	      return this.stepColor();
	    } else {
	      return this.game.color;
	    }
	  }
	
	  stepColor() {
	    return Square.COLORS[(Square.COLORS.indexOf(this.color) + 1) % Square.COLORS.length];
	  }
	
	  randomColor() {
	    return Square.COLORS[Math.floor(Math.random() * Square.COLORS.length)];
	  }
	
	}
	Square.COLORS = [
	  "red",
	  "orange",
	  "yellow",
	  "green",
	  "blue",
	  "indigo",
	  "violet"
	];
	
	
	
	module.exports = Square;


/***/ },
/* 3 */
/***/ function(module, exports) {

	const Util = {
	  canvasPosition(position, width, height) {
	    return [width * position[0], height * position[1]];
	  },
	  surroundingPositions(pos) {
	    return [
	      [1 + pos[0], 1 + pos[1]],
	      [pos[0], 1 + pos[1]],
	      [-1 + pos[0], 1 + pos[1]],
	      [1 + pos[0], pos[1]],
	      [1 + pos[0], -1 + pos[1]],
	      [pos[0], -1 + pos[1]],
	      [-1 + pos[0], pos[1]],
	      [-1 + pos[0], -1 + pos[1]],
	    ];
	  },
	  allPositions() {
	    const positions = [];
	    for (let i = 0; i < Util.NUMSQUARESX; i++) {
	      for (let j = 0; j < Util.NUMSQUARESY; j++) {
	        positions.push([i, j]);
	      }
	    }
	    return positions;
	  },
	  numSquaresX() {
	    return Util.NUMSQUARESX;
	  },
	  numSquaresY() {
	    return Util.NUMSQUARESY;
	  },
	  rectSize() {
	    return Util.RECTHEIGHT;
	  }
	};
	
	Util.CANVASWIDTHMULTIPLIER = 1;
	Util.CANVASHEIGHTMULTIPLIER = 1;
	Util.CANVASWIDTH = 1000 * Util.CANVASWIDTHMULTIPLIER;
	Util.CANVASHEIGHT = 600 * Util.CANVASHEIGHTMULTIPLIER;
	Util.SQUAREMULTIPLIER = 1;
	Util.NUMSQUARESX = 120 * Util.SQUAREMULTIPLIER;
	Util.NUMSQUARESY = 80 * Util.SQUAREMULTIPLIER;
	Util.RECTWIDTH = Util.CANVASHEIGHT / Util.NUMSQUARESY;
	Util.RECTHEIGHT = Util.CANVASHEIGHT / Util.NUMSQUARESY;
	
	module.exports = Util;


/***/ },
/* 4 */,
/* 5 */
/***/ function(module, exports) {

	class GameView {
	  constructor(game, context) {
	    this.game = game;
	    this.context = context;
	  }
	
	  start() {
	    requestAnimationFrame(this.animate.bind(this));
	  }
	
	  animate() {
	    if (!this.game.step) {
	      if (this.game.check) {
	      }
	      this.game.changeSquares();
	      this.game.draw(this.context);
	    }
	    requestAnimationFrame(this.animate.bind(this));
	  }
	}
	//
	module.exports = GameView;


/***/ },
/* 6 */
/***/ function(module, exports) {

	const LifeObject = {
	  block(startingPos) {
	    const posX = startingPos[0];
	    const posY = startingPos[1];
	    return [[posX, posY], [posX + 1, posY - 1], [posX, posY - 1], [posX + 1, posY]];
	  },
	
	  blockDist() {
	    return 4;
	  },
	
	  beehive(startingPos) {
	    const posX = startingPos[0];
	    const posY = startingPos[1];
	
	    return [[posX, posY], [posX + 1, posY - 1], [posX + 2, posY - 1], [posX + 3, posY], [posX + 2, posY + 1], [posX + 1, posY + 1]];
	  },
	
	  beehiveDist() {
	    return 6;
	  },
	
	  loaf(startingPos) {
	    const posX = startingPos[0];
	    const posY = startingPos[1];
	
	    return [[posX, posY], [posX + 1, posY - 1], [posX + 2, posY - 1], [posX + 3, posY], [posX + 3, posY + 1], [posX + 2, posY + 2], [posX + 1, posY + 1]];
	  },
	
	  loafDist() {
	    return 5;
	  },
	
	  boat(startingPos) {
	    const posX = startingPos[0];
	    const posY = startingPos[1];
	
	    return [[posX, posY], [posX, posY - 1], [posX + 1, posY - 1], [posX + 2, posY], [posX + 1, posY + 1]];
	  },
	
	  boatDist() {
	    return 5;
	  },
	
	  tub(startingPos) {
	    const posX = startingPos[0];
	    const posY = startingPos[1];
	
	    return [[posX, posY], [posX + 1, posY - 1], [posX + 2, posY], [posX + 1, posY + 1]];
	  },
	
	  tubDist() {
	    return 5;
	  },
	
	  blinker(startingPos) {
	    const posX = startingPos[0];
	    const posY = startingPos[1];
	
	    return [[posX, posY], [posX + 1, posY], [posX + 2, posY]];
	  },
	
	  blinkerDist() {
	    return 5;
	  },
	
	  toad(startingPos) {
	    const posX = startingPos[0];
	    const posY = startingPos[1];
	
	    return [[posX, posY], [posX + 1, posY - 1], [posX + 2, posY - 1], [posX + 3, posY - 1], [posX + 2, posY], [posX + 1, posY]];
	  },
	
	  toadDist() {
	    return 6;
	  },
	
	  beacon(startingPos) {
	    const posX = startingPos[0];
	    const posY = startingPos[1];
	
	    return [[posX, posY], [posX + 1, posY - 1], [posX, posY - 1], [posX + 1, posY], [posX + 2, posY + 1], [posX + 3, posY + 2], [posX + 2, posY + 2], [posX + 3, posY + 1]];
	  },
	
	  beaconDist() {
	    return 6;
	  },
	
	  clock(startingPos) {
	    const posX = startingPos[0];
	    const posY = startingPos[1];
	
	    return [[posX, posY], [posX + 2, posY], [posX + 2, posY - 1], [posX + 1, posY + 1], [posX + 3, posY + 1], [posX + 1, posY + 2]];
	  },
	
	  clockDist() {
	    return 6;
	  },
	
	  pulsar(startingPos) {
	    const posX = startingPos[0];
	    const posY = startingPos[1];
	
	    return [[posX + 2, posY - 10], [posX + 3, posY - 10], [posX + 4, posY - 10], [posX + 8, posY - 10], [posX + 9, posY - 10], [posX + 10, posY - 10],
	    [posX, posY - 8], [posX + 5, posY - 8], [posX + 7, posY - 8], [posX + 12, posY - 8],
	    [posX, posY - 7], [posX + 5, posY - 7], [posX + 7, posY - 7], [posX + 12, posY - 7],
	    [posX, posY - 6], [posX + 5, posY - 6], [posX + 7, posY - 6], [posX + 12, posY - 6],
	    [posX + 2, posY - 5], [posX + 3, posY - 5], [posX + 4, posY - 5], [posX + 8, posY - 5], [posX + 9, posY - 5], [posX + 10, posY - 5],
	    [posX + 2, posY - 3], [posX + 3, posY - 3], [posX + 4, posY - 3], [posX + 8, posY - 3], [posX + 9, posY - 3], [posX + 10, posY - 3],
	    [posX, posY - 2], [posX + 5, posY - 2], [posX + 7, posY - 2], [posX + 12, posY - 2],
	    [posX, posY - 1], [posX + 5, posY - 1], [posX + 7, posY - 1], [posX + 12, posY - 1],
	    [posX, posY], [posX + 5, posY], [posX + 7, posY], [posX + 12, posY],
	    [posX + 2, posY + 2], [posX + 3, posY + 2], [posX + 4, posY + 2], [posX + 8, posY + 2], [posX + 9, posY + 2], [posX + 10, posY + 2]];
	  },
	
	  pulsarDist() {
	    return 12;
	  },
	
	  pentadecathlon(startingPos) {
	    const posX = startingPos[0];
	    const posY = startingPos[1];
	
	    return [[posX, posY], [posX + 1, posY], [posX + 2, posY - 1], [posX + 2, posY + 1], [posX + 3, posY], [posX + 4, posY],
	    [posX + 5, posY], [posX + 6, posY], [posX + 7, posY - 1], [posX + 7, posY + 1], [posX + 8, posY], [posX + 9, posY]];
	  },
	
	  pentadecathlonDist() {
	    return 20;
	  },
	
	  glider(startingPos) {
	    const posX = startingPos[0];
	    const posY = startingPos[1];
	
	    return [[posX, posY], [posX + 1, posY], [posX + 2, posY], [posX + 2, posY - 1], [posX + 1, posY - 2]];
	  },
	
	  gliderDist() {
	    return 6;
	  },
	
	  lightWeightSpaceship(startingPos) {
	    const posX = startingPos[0];
	    const posY = startingPos[1] + 2;
	
	    return [[posX, posY], [posX + 1, posY - 3], [posX + 2, posY - 3], [posX + 3, posY - 3], [posX + 4, posY - 3], [posX + 4, posY - 2], [posX + 4, posY - 1], [posX + 3, posY], [posX, posY - 2]];
	  },
	
	  lightWeightSpaceshipDist() {
	    return 8;
	  },
	
	  benchmark(startingPos) {
	    const posX = startingPos[0];
	    const posY = startingPos[1];
	
	    return[
	      [posX, posY], [posX + 1, posY], [posX + 2, posY], [posX + 3, posY],
	      [posX + 4, posY], [posX + 5, posY], [posX+ 6, posY], [posX + 7, posY],
	      [posX + 8, posY], [posX + 9, posY], [posX + 10, posY], [posX + 11, posY],
	      [posX + 12, posY],[posX + 13, posY],[posX + 14, posY]];
	  },
	
	  benchmarkDist() {
	    return 16;
	  },
	
	  gosperGliderGun(startingPos) {
	    const posX = startingPos[0];
	    const posY = startingPos[1];
	
	    return[
	      [posX, posY], [posX, posY - 1], [posX + 1, posY], [posX + 1, posY - 1],
	
	      [posX + 10, posY], [posX + 10, posY + 1], [posX + 10, posY - 1],
	      [posX + 11, posY + 2], [posX + 12, posY + 3], [posX + 13, posY + 3], [posX + 15, posY + 2],
	      [posX + 16, posY + 1], [posX + 16, posY], [posX + 16, posY - 1],
	      [posX + 17, posY], [posX + 14, posY], [posX + 11, posY - 2], [posX + 12, posY - 3],
	      [posX + 13, posY - 3], [posX + 15, posY - 2],
	
	      [posX + 20, posY - 1], [posX + 20, posY - 2], [posX + 20, posY - 3],
	      [posX + 21, posY - 3], [posX + 21, posY - 2], [posX + 21, posY - 1], [posX + 22, posY],
	      [posX + 24, posY], [posX + 24, posY + 1], [posX + 22, posY - 4], [posX + 24, posY - 4], [posX + 24, posY - 5],
	
	      [posX + 34, posY - 2], [posX + 34, posY - 3], [posX + 35, posY - 2], [posX + 35, posY - 3]];
	  },
	
	  gosperGliderGunDist() {
	    return 40;
	  }
	};
	
	module.exports = LifeObject;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map