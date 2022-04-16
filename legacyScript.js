/* ---- BY ALAN HUANG ---- */

/* ---- Start & Stop ---- */
var progress = 0;
var guessCounter = 0;

var gamePlaying = false;
var tonePlaying = false;

function startGame() {
  progress = 0;
  gamePlaying = true;

  document.getElementById("strtBtn").classList.add("hidden");
  document.getElementById("endBtn").classList.remove("hidden");
  generatePattern();
  playClueSequence();
}
function stopGame() {
  if (progress == patLen) {
    alert("Game Over. You won!");
  } else {
    alert("Game Over. You lose.");
  }

  gamePlaying = false;
  document.getElementById("strtBtn").classList.remove("hidden");
  document.getElementById("endBtn").classList.add("hidden");
}

/* ---- Pattern ---- */
var pattern = [];
const patLen = 5;

function generatePattern() {
  for (let i = 0; i < patLen; i++) {
    pattern.push(Math.floor(Math.random() * 4) + 1);
  }
  console.log(pattern);
}

/* ---- Game Mechanics ---- */
const clueHoldTime = 1000;
const cluePauseTime = 333;
const nextClueWaitTime = 1000;

function guess(btn) {
  console.log("user guessed: " + btn);
  if (!gamePlaying) {
    return;
  }
  if (btn != pattern[guessCounter]) {
    stopGame();
  }
  if (guessCounter == progress) {
    if (progress == patLen) {
      stopGame();
    }
    progress++;
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
    setTimeout(playSingleClue, delay, pattern[i]); // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
}
function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

/* --- Volume Control --- */
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
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

/* ---- Tone ---- */
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
function lightButton(btn) {
  document.getElementById("btn" + btn).classList.add("lit");
}
function clearButton(btn) {
  document.getElementById("btn" + btn).classList.remove("lit");
}
