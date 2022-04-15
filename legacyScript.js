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
  //generates 5 random patterns
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
  //ends game if the btn clicked is not equal to the
  //button in the pattern array at index guessCounter
  if (btn != pattern[guessCounter]) {
    stopGame();
  }
  //checks if turn is over
  if (guessCounter == progress) {
    //win game since its last in the sequence
    if (progress == patLen) {
      stopGame();
    }
    //if it is not last turn continue sequence
    progress++;
    playClueSequence();
  } else {
    //incr guessCounter counter
    guessCounter++;
  }
}
function playClueSequence() {
  guessCounter = 0;
  context.resume();
  let delay = nextClueWaitTime; //set delay to initial wait time
  for (let i = 0; i <= progress; i++) {
    // for each clue that is revealed so far
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
