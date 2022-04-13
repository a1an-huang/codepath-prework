/* ---- BY ALAN HUANG ---- */

var allScores = [];

/* ---- Home Page ---- */
function home() {
  homeShow();
  homeHide();
}

/* ---- Start ---- */
var gamePlaying = false;
var tonePlaying = false;

var mistakes;
var progress = 0;

var guessCounter = 0;
var mistakesMade = 0;

function startGame() {
  mistakesMade = 0;
  gamePlaying = true;
  startGameShow();
  startGameHide();
  startGameCounters();
  timeOut = setInterval(timeCounter, 1000);
  generatePattern();
  playClueSequence();
}

/* ---- Difficulty Buttons ---- */
function chooseDifficulty() {
  stopGame();
  diffHide();
  diffShow();
}
function easy() {
  clueHoldTime = 850;
  patLength = 5;
  timer = 45;
  patSize = 4;
  counter = timer * 1000;
  mistakes = 4;
  easySetting();

  startGame();
}
function med() {
  clueHoldTime = 800;
  patLength = 7;
  timer = 60;
  patSize = 6;
  counter = timer * 1000;
  mistakes = 3;
  medSetting();
  startGame();
}
function hard() {
  clueHoldTime = 750;
  patLength = 10;
  timer = 80;
  patSize = 8;
  counter = timer * 1000;
  mistakes = 2;
  hardSetting();
  startGame();
}
function speed() {
  clueHoldTime = 800;
  patLength = 6;
  timer = 10;
  patSize = 6;
  counter = timer * 1000;
  mistakes = 1;

  speedControls();
  startSpeedGame();
}
function startSpeedGame() {
  mistakesMade = 0;
  progress = 0;
  gamePlaying = true;
  speedGameShow();
  speedGameHide();
  document.getElementById("sTime").innerHTML = timer;
  timeOut = setInterval(timeCounter, 1000);
  generatePattern();
  speedGame();
}
function speedGame() {
  progress = pattern.length - 2;
  clueHoldTime = 600;
  playClueSequence();
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
  timeOut = setInterval(timeCounter, 1000);
}

/* ---- Game Controls ----*/
function stopGame() {
  allScores.push([progress, mistakesMade, timer]);
  console.log(allScores);
  clearInterval(timeOut);
  if (progress == pattern.length - 1) {
    document.getElementById("wonGame").classList.remove("hidden");
  } else {
    document.getElementById("lostGame").classList.remove("hidden");
  }
  gamePlaying = false;
  pattern = [];
  progress = 0;
  mistakesMade = 0;
  guessCounter = 0;
  clueHoldTime = 850;
  stopGameHide();
}
function prevDiff() {
  stopGame();
  if (mistakes == 1) {
    speed();
  } else if (patSize == 8) {
    hard();
  } else if (patSize == 6) {
    med();
  } else {
    easy();
  }
}
function showScores() {
  //Can use this to implement a scoreboard in the future
  document.getElementById("scoreValues").classList.remove("hidden");
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
var nextClueWaitTime = 1000;

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
    clueHoldTime -= 25;
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
function homeShow() {
  document.getElementById("demo").classList.remove("hidden");
  document.getElementById("strtBtn").classList.remove("hidden");
  document.getElementById("leftPaw").classList.remove("hidden");
  document.getElementById("rightPaw").classList.remove("hidden");
  document.getElementById("startPage").classList.remove("hidden");
  document.getElementById("legacy").classList.remove("hidden");
}
function homeHide() {
  document.getElementById("scoreValues").classList.add("hidden");
  document.getElementById("welcoming").classList.add("hidden");
  document.getElementById("speedTimer").classList.add("hidden");
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("replay").classList.add("hidden");
  document.getElementById("gameMenu").classList.add("hidden");
  document.getElementById("wonGame").classList.add("hidden");
  document.getElementById("lostGame").classList.add("hidden");
  document.getElementById("gameArea").classList.add("hidden");
  document.getElementById("endBtn").classList.add("hidden");
  document.getElementById("countArea").classList.add("hidden");
  document.getElementById("easyDiff").classList.add("hidden");
  document.getElementById("midDiff").classList.add("hidden");
  document.getElementById("hardDiff").classList.add("hidden");
  document.getElementById("prevScores").classList.add("hidden");
  document.getElementById("timerBar").classList.add("hidden");
}
function diffHide() {
  document.getElementById("scoreValues").classList.add("hidden");
  document.getElementById("speedTimer").classList.add("hidden");
  document.getElementById("strtBtn").classList.add("hidden");
  document.getElementById("gameArea").classList.add("hidden");
  document.getElementById("wonGame").classList.add("hidden");
  document.getElementById("lostGame").classList.add("hidden");
  document.getElementById("startPage").classList.add("hidden");
  document.getElementById("demo").classList.add("hidden");
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("replay").classList.add("hidden");
  document.getElementById("endBtn").classList.add("hidden");
  document.getElementById("countArea").classList.add("hidden");
  document.getElementById("legacy").classList.add("hidden");
  document.getElementById("prevScores").classList.add("hidden");
}
function diffShow() {
  document.getElementById("leftPaw").classList.remove("hidden");
  document.getElementById("rightPaw").classList.remove("hidden");
  document.getElementById("welcoming").classList.remove("hidden");
  document.getElementById("gameMenu").classList.remove("hidden");
}

function startGameShow() {
  document.getElementById("prevScores").classList.remove("hidden");
  document.getElementById("gameArea").classList.remove("hidden");
  document.getElementById("endBtn").classList.remove("hidden");
  document.getElementById("countArea").classList.remove("hidden");
  document.getElementById("menu").classList.remove("hidden");
  document.getElementById("replay").classList.remove("hidden");
}
function startGameHide() {
  document.getElementById("scoreValues").classList.add("hidden");
  document.getElementById("welcoming").classList.add("hidden");
  document.getElementById("gameMenu").classList.add("hidden");
  document.getElementById("strtBtn").classList.add("hidden");
  document.getElementById("wonGame").classList.add("hidden");
  document.getElementById("lostGame").classList.add("hidden");
  document.getElementById("leftPaw").classList.add("hidden");
  document.getElementById("rightPaw").classList.add("hidden");
}
function startGameCounters() {
  document.getElementById("goal").innerHTML = patLength;
  document.getElementById("progCount").innerHTML = progress;
  document.getElementById("totalMis").innerHTML = mistakes - 1;
  document.getElementById("missCount").innerHTML = mistakesMade;
  document.getElementById("goal").innerHTML = patLength;
  document.getElementById("time").innerHTML = timer;
}
function easySetting() {
  document.getElementById("medDiff").classList.add("hidden");
  document.getElementById("hardDiff").classList.add("hidden");
  document.getElementById("scoreValues").classList.add("hidden");

  document.getElementById("gameArea").style.width = "375px";
}
function medSetting() {
  document.getElementById("hardDiff").classList.add("hidden");
  document.getElementById("scoreValues").classList.add("hidden");
  document.getElementById("medDiff").classList.remove("hidden");

  document.getElementById("gameArea").style.width = "535px";
}
function hardSetting() {
  document.getElementById("scoreValues").classList.add("hidden");
  document.getElementById("medDiff").classList.remove("hidden");
  document.getElementById("hardDiff").classList.remove("hidden");
  document.getElementById("prevScores").classList.remove("hidden");

  document.getElementById("gameArea").style.width = "710px";
}
function speedControls() {
  document.getElementById("scoreValues").classList.add("hidden");
  document.getElementById("countArea").classList.add("hidden");
  document.getElementById("hardDiff").classList.add("hidden");

  document.getElementById("medDiff").classList.remove("hidden");
  document.getElementById("speedTimer").classList.remove("hidden");

  document.getElementById("gameArea").style.width = "535px";
}

function speedGameShow() {
  document.getElementById("gameArea").classList.remove("hidden");
  document.getElementById("endBtn").classList.remove("hidden");
  document.getElementById("menu").classList.remove("hidden");
  document.getElementById("speedTimer").classList.remove("hidden");
}
function speedGameHide() {
  document.getElementById("scoreValues").classList.add("hidden");
  document.getElementById("welcoming").classList.add("hidden");
  document.getElementById("gameMenu").classList.add("hidden");
  document.getElementById("strtBtn").classList.add("hidden");
  document.getElementById("wonGame").classList.add("hidden");
  document.getElementById("lostGame").classList.add("hidden");
  document.getElementById("leftPaw").classList.add("hidden");
  document.getElementById("rightPaw").classList.add("hidden");
  document.getElementById("countArea").classList.add("hidden");
  document.getElementById("prevScores").classList.add("hidden");
  document.getElementById("replay").classList.add("hidden");
}
function stopGameHide() {
  document.getElementById("scoreValues").classList.add("hidden");
  document.getElementById("speedTimer").classList.add("hidden");
  document.getElementById("countArea").classList.add("hidden");
  document.getElementById("countArea").classList.add("hidden");
  document.getElementById("endBtn").classList.add("hidden");
  document.getElementById("replay").classList.remove("hidden");
}
//buttons
function lightButton(btn) {
  document.getElementById("btn" + btn).classList.add("lit");
}

function clearButton(btn) {
  document.getElementById("btn" + btn).classList.remove("lit");
}
