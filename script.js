/* ---- BY ALAN HUANG ---- */

var allScores = [];
var totalWins = 0;

/* ---- Home Page ---- */
function home() {
  homeDefault();
}

/* ---- Start ---- */
var gamePlaying = false;
var tonePlaying = false;

var mistakes;
var progress = 0;

var guessCounter = 0;
var mistakesMade = 0;

const millisec = 1000;

function startGame(diffVals) {
  patLength = diffVals[0];
  patSize = diffVals[1];
  mistakes = diffVals[2];
  timer = diffVals[3];
  clueHoldTime = diffVals[4];

  mistakesMade = 0;
  gamePlaying = true;
  counter = timer * millisec;
  timeOut = setInterval(timeCounter, millisec);
  
  startDefault();
  gameArea();
  generatePattern();
  playClueSequence();
}
function startSpeedGame(speedVals) {
  patLength = speedVals[0];
  patSize = speedVals[1];
  mistakes = speedVals[2];
  timer = speedVals[3];
  progress = speedVals[4];
  clueHoldTime = speedVals[5];

  mistakesMade = 0;
  gamePlaying = true;
  counter = timer * millisec;
  document.getElementById("sTime").innerHTML = timer;
  timeOut = setInterval(timeCounter, millisec);

  speedDefault();
  gameArea();
  generatePattern();
  playClueSequence();
}

/* ---- Difficulty Buttons ---- */
var cstmVals = [];
var isCustom = false;

function chooseDifficulty() {
  stopGame();
  diffMenuDefault();
}
function easy() {
  isCustom = false;
  
  startGame([5, 4, 4, 45, 850]);
}
function med() {
  isCustom = false;

  startGame([7, 6, 3, 60, 800]);
}
function hard() {
  isCustom = false;

  startGame([10, 8, 2, 80, 750]);
}
function speed() {
  isCustom = false;

  startSpeedGame([6, 6, 1, 8, patSize - 2, 450]);
}
function custom() {
  const elems = ["Score", "Size", "Mist", "Time", "Speed"];
  cstmVals= [];
  
  for (var i = 0; i < elems.length; i++) {
    cstmVals.push(document.getElementById("c" + elems[i]).value);
  }
  console.log(cstmVals);
  
  isCustom = true;
  
  console.log(clueHoldTime);
  startGame(cstmVals);
}

/* ---- Pattern ---- */
var pattern = [];
var patLength = 5;
var patSize = 8;

function generatePattern() {
  for (let i = 0; i < patLength; i++) {
    pattern.push(Math.floor(Math.random() * patSize) + 1);
  }
  console.log(pattern);
}

/* ---- Timer ---- */
var timeOut;
var timer;
var counter;

function timeCounter() {
  clearInterval(timeOut);
  timer -= 1;

  document.getElementById("time").innerHTML = timer;
  document.getElementById("sTime").innerHTML = timer;

  if (timer == 0) {
    stopGame();
  }

  timeOut = setInterval(timeCounter, millisec);
}

/* ---- Game Controls ----*/
function stopGame() {
  if (progress == pattern.length - 1) {
    totalWins++;
    document.getElementById("winVal").innerHTML = totalWins;
    document.getElementById("lostGame").classList.add("hidden");
    document.getElementById("wonGame").classList.remove("hidden");
  } else {
    document.getElementById("wonGame").classList.add("hidden");
    document.getElementById("lostGame").classList.remove("hidden");
  }

  allScores.push([progress, mistakesMade, timer, totalWins]);
  console.log(allScores);
  clearInterval(timeOut);

  gamePlaying = false;
  pattern = [];
  progress = 0;
  mistakesMade = 0;
  guessCounter = 0;
  clueHoldTime = 850;
  stopDefault();
}
function prevDiff() {
  stopGame();
  if (isCustom) {
    startGame(cstmVals);
  } else if (mistakes == 1) {
    speed();
  } else if (patSize == 4) {
    easy();
  } else if (patSize == 6) {
    med();
  } else {
    hard();
  }
}
function showScores() {
  //Can use this to implement a scoreboard with all values in the future
  document.getElementsByClassName("score")[0].style.display = "inline";
  for (let i = 0; i < allScores.length; i++) {
    var scores = allScores[i];
    document.getElementById("progScore").innerHTML = scores[0];
    document.getElementById("misScore").innerHTML = scores[1];
    document.getElementById("timeScore").innerHTML = scores[2];
  }
}

/* ---- Game Mechanics ----*/
var clueHoldTime;
const cluePauseTime = 333;
var nextClueWaitTime = millisec;

function guess(btn) {
  console.log("user guessed: " + btn);
  if (!gamePlaying) {
    return;
  }
  if (btn != pattern[guessCounter]) {
    mistakesMade += 1;
    document.getElementById("missCount").innerHTML = mistakesMade;
    if (mistakes == mistakesMade) {
      stopGame();
    }
    return;
  }
  if (guessCounter == progress) {
    if (progress == pattern.length - 1) {
      stopGame();
    }
    progress++;
    document.getElementById("progCount").innerHTML = progress;
    playClueSequence();
  } else {
    guessCounter++;
  }
}
function playClueSequence() {
  guessCounter = 0;
  context.resume();
  let delay = nextClueWaitTime;
  for (let i = 0; i <= progress; i++) {
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]);

    delay += clueHoldTime;
    delay += cluePauseTime;
    clueHoldTime -= 50;
  }
}
function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

/* ---- Tone ----*/
const freqMap = {
  1: 283.6,
  2: 308.5,
  3: 333.2,
  4: 356.4,
  5: 392.3,
  6: 417.9,
  7: 445.4,
  8: 479.2,
};
var volume = 0.5;
var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();

g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);

function startTone(btn) {
  if (!tonePlaying) {
    context.resume();
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    context.resume();
    tonePlaying = true;
  }
}
function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  context.resume();
  tonePlaying = true;
  setTimeout(function () {
    stopTone();
  }, len);
}
function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

/* ---- HTML ---- */
function homeDefault() {
  var homeShow = document.getElementsByClassName("splash");
  for (var i = 0; i < homeShow.length; i++) {
    homeShow[i].style.display = "inline";
  }
  var homeHide = document.getElementsByClassName("splashHide");
  for (var i = 0; i < homeHide.length; i++) {
    homeHide[i].style.display = "none";
  }
}
function diffMenuDefault() {
  var menuShow = document.getElementsByClassName("menu");
  for (var i = 0; i < menuShow.length; i++) {
    menuShow[i].style.display = "block";
  }
  var menuHide = document.getElementsByClassName("menuHide");
  for (var i = 0; i < menuHide.length; i++) {
    menuHide[i].style.display = "none";
  }
}
function gameArea() {
  if (patSize == 4) {
    document.getElementById("gameArea").style.width = "375px";
  } else if (patSize == 6) {
    document.getElementsByClassName("med")[0].style.display = "inline";
    document.getElementById("gameArea").style.width = "535px";
  } else {
    document.getElementsByClassName("med")[0].style.display = "inline";
    document.getElementsByClassName("hard")[0].style.display = "inline";
    document.getElementById("gameArea").style.width = "710px";
  }
}
function startDefault() {
  var startShow = document.getElementsByClassName("start");
  for (var i = 0; i < startShow.length; i++) {
    startShow[i].style.display = "inline";
  }

  var startHide = document.getElementsByClassName("startHide");
  for (var i = 0; i < startHide.length; i++) {
    startHide[i].style.display = "none";
  }

  const elems = ["goal", "progCount", "totalMis", "missCount", "goal", "time"];
  var vals = [
    patLength,
    progress,
    mistakes - 1,
    mistakesMade,
    patLength,
    timer,
  ];

  for (var i = 0; i < elems.length; i++) {
    document.getElementById(elems[i]).innerHTML = vals[i];
  }
}
function speedDefault() {
  document.getElementById("sTime").innerHTML = timer;
  var speedShow = document.getElementsByClassName("speed");
  for (var i = 0; i < speedShow.length; i++) {
    speedShow[i].style.display = "inline";
  }

  var speedHide = document.getElementsByClassName("speedHide");
  for (var i = 0; i < speedHide.length; i++) {
    speedHide[i].style.display = "none";
  }
}
function stopDefault() {
  var stop = document.getElementsByClassName("stop");
  for (var i = 0; i < stop.length; i++) {
    stop[i].style.display = "none";
  }

  var stopShow = document.getElementsByClassName("stopShow");
  for (var i = 0; i < stopShow.length; i++) {
    stopShow[i].style.display = "inline";
  }
}
function lightButton(btn) {
  document.getElementById("btn" + btn).classList.add("lit");
}
function clearButton(btn) {
  document.getElementById("btn" + btn).classList.remove("lit");
}
