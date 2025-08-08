
const templates = {
  zoo: {
    blanks: [
      { type: "animal", question: "Name an animal, like a lion or giraffe." },
      { type: "adjective", question: "Give me an adjective, like loud or tall." },
      { type: "verb", question: "Say a verb, like run or climb." }
    ],
    template: "At the zoo, I saw a [adjective] [animal] trying to [verb] up a tree!"
  },
  space: {
    blanks: [
      { type: "planet", question: "Name a planet, like Mars or Jupiter." },
      { type: "noun", question: "Say a noun, like spaceship or robot." },
      { type: "verb", question: "Say a verb, like zoom or spin." }
    ],
    template: "We blasted off to [planet] in our [noun] and started to [verb] all over the galaxy!"
  },
  beach: {
    blanks: [
      { type: "adjective", question: "Give me an adjective, like sunny or breezy." },
      { type: "food", question: "Name a food, like sandwich or ice cream." },
      { type: "verb", question: "Say a verb, like swim or build." }
    ],
    template: "It was a [adjective] day at the beach. I ate a [food] and tried to [verb] the biggest sandcastle ever!"
  }
};

let blanks = [];
let template = "";
let responses = {};
let current = 0;

const promptEl = document.getElementById("prompt");
const storyEl = document.getElementById("story");
const imageEl = document.getElementById("story-image");

const synth = window.speechSynthesis;
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

let voices = [];

window.speechSynthesis.onvoiceschanged = () => {
  voices = speechSynthesis.getVoices();
};

function speak(text, callback) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = voices.find(v => v.name.includes('Google')) || voices[0];
  utterance.pitch = 1.2;
  utterance.rate = 1;
  utterance.onend = callback || (() => {});
  speechSynthesis.speak(utterance);
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
    const regex = new RegExp(`\\[${key}\\]`, 'g');
    story = story.replace(regex, responses[key]);
  }

  promptEl.textContent = "Here's your story!";
  storyEl.textContent = story;

  // Speak cleanly without non-speech characters
  const cleanStory = story.replace(/[^\w\s.,!?'-]/g, '');
  speak(cleanStory);
}


function startMadLibs() {
  const storyKey = document.getElementById("story-select").value;
  current = 0;
  responses = {};
  storyEl.textContent = "";
  imageEl.style.display = "none";
  blanks = templates[storyKey].blanks;
  template = templates[storyKey].template;
  askQuestion();
}
