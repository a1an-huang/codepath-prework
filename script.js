/* ---- BY ALAN HUANG ---- */

var allScores = [];
var totalLoses = 0;
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

function startGame() {
  mistakesMade = 0;
  gamePlaying = true;
  startDefault();
  timeOut = setInterval(timeCounter, 1000);
  generatePattern();
  playClueSequence();
}

/* ---- Difficulty Buttons ---- */
function chooseDifficulty() {
  stopGame();
  diffMenuDefault();
}
function easy() {
  clueHoldTime = 850;
  patLength = 5;
  timer = 45;
  patSize = 4;
  counter = timer * 1000;
  mistakes = 4;
  document.getElementById("gameArea").style.width = "375px";
  startGame();
}
function med() {
  clueHoldTime = 800;
  patLength = 7;
  timer = 60;
  patSize = 6;
  counter = timer * 1000;
  mistakes = 3;
  document.getElementById("medDiff").classList.remove("hidden");
  document.getElementById("gameArea").style.width = "535px";
  startGame();
}
function hard() {
  clueHoldTime = 750;
  patLength = 10;
  timer = 80;
  patSize = 8;
  counter = timer * 1000;
  mistakes = 2;
  document.getElementById("medDiff").classList.remove("hidden");
  document.getElementById("hardDiff").classList.remove("hidden");
  document.getElementById("gameArea").style.width = "710px";
  startGame();
}
function speed() {
  patLength = 6;
  timer = 10;
  patSize = 6;
  counter = timer * 1000;
  mistakes = 1;
  document.getElementById("medDiff").classList.remove("hidden");
  document.getElementById("gameArea").style.width = "535px";
  startSpeedGame();
}
function startSpeedGame() {
  speedDefault();
  mistakesMade = 0;
  progress = 0;
  gamePlaying = true;
  progress = pattern.length - 2;
  clueHoldTime = 500;

  document.getElementById("sTime").innerHTML = timer;
  timeOut = setInterval(timeCounter, 1000);
  generatePattern();
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
  if (progress == pattern.length - 1) {
    totalWins++;
    document.getElementById("wonGame").classList.remove("hidden");
  } else {
    totalLoses++;
    document.getElementById("lostGame").classList.remove("hidden");
  }
  allScores.push([progress, mistakesMade, timer, totalWins, totalLoses]);
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
  //Can use this to implement a scoreboard with all values in the future
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
  document.getElementById("startPage").classList.remove("hidden");
  document.getElementById("startBar").classList.remove("hidden");
  document.getElementById("demo").classList.remove("hidden");
  document.getElementById("strtBtn").classList.remove("hidden");
  document.getElementById("legacy").classList.remove("hidden");

  document.getElementById("welcoming").classList.add("hidden");
  document.getElementById("diffMenu").classList.add("hidden");
}
function diffMenuDefault() {
  document.getElementById("welcoming").classList.remove("hidden");
  document.getElementById("diffMenu").classList.remove("hidden");
  document.getElementById("leftPaw").classList.remove("hidden");
  document.getElementById("rightPaw").classList.remove("hidden");

  document.getElementById("legacy").classList.add("hidden");
  document.getElementById("startPage").classList.add("hidden");
  document.getElementById("strtBtn").classList.add("hidden");
  document.getElementById("demo").classList.add("hidden");
  document.getElementById("speedTimer").classList.add("hidden");
  document.getElementById("controlBar").classList.add("hidden");
  document.getElementById("countBar").classList.add("hidden");
  document.getElementById("medDiff").classList.add("hidden");
  document.getElementById("hardDiff").classList.add("hidden");
  document.getElementById("gameButtons").classList.add("hidden");
  document.getElementById("returnMenu").classList.add("hidden");
  document.getElementById("wonGame").classList.add("hidden");
  document.getElementById("lostGame").classList.add("hidden");
}
function startDefault() {
  document.getElementById("returnMenu").classList.remove("hidden");
  document.getElementById("gameButtons").classList.remove("hidden");
  document.getElementById("controlBar").classList.remove("hidden");
  document.getElementById("countBar").classList.remove("hidden");
  document.getElementById("endBtn").classList.remove("hidden");
  document.getElementById("timer").classList.remove("hidden");
  
  document.getElementById("wonGame").classList.add("hidden");
  document.getElementById("lostGame").classList.add("hidden");
  document.getElementById("startBar").classList.add("hidden");
  document.getElementById("welcoming").classList.add("hidden");
  document.getElementById("diffMenu").classList.add("hidden");
  document.getElementById("demo").classList.add("hidden");

  document.getElementById("goal").innerHTML = patLength;
  document.getElementById("progCount").innerHTML = progress;
  document.getElementById("totalMis").innerHTML = mistakes - 1;
  document.getElementById("missCount").innerHTML = mistakesMade;
  document.getElementById("goal").innerHTML = patLength;
  document.getElementById("time").innerHTML = timer;
}
function speedDefault() {
  document.getElementById("returnMenu").classList.remove("hidden");
  document.getElementById("gameButtons").classList.remove("hidden");
  document.getElementById("controlBar").classList.remove("hidden");
  document.getElementById("speedTimer").classList.remove("hidden");
  document.getElementById("endBtn").classList.remove("hidden");

  document.getElementById("startBar").classList.add("hidden");
  document.getElementById("welcoming").classList.add("hidden");
  document.getElementById("diffMenu").classList.add("hidden");
  document.getElementById("demo").classList.add("hidden");

  document.getElementById("goal").innerHTML = patLength;
  document.getElementById("progCount").innerHTML = progress;
  document.getElementById("totalMis").innerHTML = mistakes - 1;
  document.getElementById("missCount").innerHTML = mistakesMade;
  document.getElementById("goal").innerHTML = patLength;
  document.getElementById("time").innerHTML = timer;
}
function stopDefault() {
  document.getElementById("scoreValues").classList.add("hidden");
  document.getElementById("endBtn").classList.add("hidden");
  document.getElementById("countBar").classList.add("hidden");
}
function lightButton(btn) {
  document.getElementById("btn" + btn).classList.add("lit");
}

function clearButton(btn) {
  document.getElementById("btn" + btn).classList.remove("lit");
}
