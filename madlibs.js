
const blanks = [
  { type: "place", question: "Name a place, like a park or a zoo." },
  { type: "adjective", question: "Give me an adjective, like silly or big." },
  { type: "animal", question: "Name an animal, like a dog or elephant." },
  { type: "verb", question: "Say a verb, like run or jump." }
];

const template = "Today, I went to the [place] with my [adjective] [animal]. We decided to [verb] all afternoon!";

let responses = {};
let current = 0;

const promptEl = document.getElementById("prompt");
const storyEl = document.getElementById("story");

const synth = window.speechSynthesis;
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

function speak(text, callback) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.onend = callback;
  synth.speak(utter);
}

function askQuestion() {
  if (current < blanks.length) {
    const q = blanks[current].question;
    promptEl.textContent = q;
    speak(q, () => {
      recognition.start();
    });
  } else {
    createStory();
  }
}

recognition.onresult = function(event) {
  const word = event.results[0][0].transcript;
  const key = blanks[current].type;
  responses[key] = word;
  current++;
  askQuestion();
};

recognition.onerror = function(event) {
  speak("Oops, I didn't catch that. Let's try again.", askQuestion);
};

function createStory() {
  let story = template;
  for (let key in responses) {
    const regex = new RegExp(`\[${key}\]`, 'g');
    story = story.replace(regex, responses[key]);
  }
  promptEl.textContent = "Here's your story!";
  storyEl.textContent = story;
  speak(story, () => {});
}

function startMadLibs() {
  current = 0;
  responses = {};
  storyEl.textContent = "";
  askQuestion();
}
