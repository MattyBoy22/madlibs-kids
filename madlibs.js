
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
  },
  princessTea: {
  blanks: [
    { type: "name", question: "Give me a name for the princess." },
    { type: "color", question: "Name a color, like pink or lavender." },
    { type: "animal", question: "Name a cute animal, like bunny or kitten." },
    { type: "adjective", question: "Say an adjective, like sparkling or royal." },
    { type: "treat", question: "Name a sweet treat, like cupcake or macaron." },
    { type: "verb", question: "Say a verb, like twirl or sip." },
    { type: "emotion", question: "How did she feel? Happy, excited, etc." },
    { type: "magicalItem", question: "Name a magical object, like wand or crown." },
    { type: "place", question: "Name a magical place, like garden or tower." }
  ],
  template: `Princess [name] woke up in her [color] castle surrounded by singing [animal]s. It was the day of the royal tea party, and everything had to be just [adjective]. She picked out her favorite [treat]-shaped gown and got ready to [verb] down the grand staircase.

Down in the glittering tea room, guests from all over the kingdom had arrived. The air smelled like warm [treat]s, and tiny fairies sprinkled sparkles on everything. Princess [name] smiled with [emotion] as she waved her [magicalItem] and made rainbow tea pour from the sky.

Suddenly, a loud giggle echoed through the castle. It was her best friend, the Queen of the [place], arriving on a flying teacup. They danced, sipped tea, and told stories until the stars twinkled in the sky.

As the party ended, Princess [name] looked around and knew this was the most magical tea party ever. She curled up with her [animal] and dreamed of more [adjective] adventures to come.`
},
  fashionShow: {
  blanks: [
    { type: "name", question: "What's a girl's name?" },
    { type: "clothing", question: "Name a type of clothing, like dress or jacket." },
    { type: "adjective", question: "Say an adjective, like sparkly or fabulous." },
    { type: "celebrity", question: "Name a celebrity or famous person." },
    { type: "color", question: "Say a color, like gold or silver." },
    { type: "place", question: "Name a glamorous place, like Paris or Milan." },
    { type: "verb", question: "Say a verb, like strut or pose." },
    { type: "emotion", question: "How do they feel? Nervous, thrilled, etc." },
    { type: "accessory", question: "Name an accessory, like purse or sunglasses." }
  ],
  template: `[name] stood behind the velvet curtain, adjusting her [clothing]. It was her first time walking in the big [place] fashion show, and her heart raced with [emotion]. The lights flashed, the music started, and it was time to shine.

She stepped onto the runway wearing a [adjective], [color] outfit that sparkled like stardust. Cameras flashed and people gasped — even [celebrity] clapped from the front row. [name] [verb]ed down the catwalk with confidence and grace.

Backstage, the other models surrounded her in awe. Her [accessory] had become the talk of the town! Designers asked for photos, and stylists wanted to book her for their next show in [place].

By the end of the night, [name] was a star. She smiled wide, hugged her [accessory], and knew that this was only the beginning of her stylish journey.`
},
  jungleAdventure: {
  blanks: [
    { type: "explorerName", question: "Give me a name for the explorer." },
    { type: "animal", question: "Name a jungle animal, like jaguar or monkey." },
    { type: "tool", question: "Name a tool, like compass or rope." },
    { type: "verb", question: "Say a verb, like swing or run." },
    { type: "adjective", question: "Say an adjective, like wild or slippery." },
    { type: "treasure", question: "Name a treasure, like ruby or crown." },
    { type: "emotion", question: "How did they feel? Excited, nervous, etc." },
    { type: "place", question: "Name a place, like cave or waterfall." },
    { type: "sound", question: "Name a sound, like roar or splash." }
  ],
  template: `Deep in the jungle, Explorer [explorerName] crept through thick vines, eyes wide for signs of the legendary treasure. A [animal] screeched in the distance as [explorerName] clutched their trusty [tool] and prepared to [verb] across a gap in the path.

The trail was [adjective], with muddy rocks and tangled roots. Suddenly, they stumbled upon a hidden map carved into a tree — the final clue to the ancient [treasure]! With a [emotion] gasp, [explorerName] dashed toward the glowing entrance of the forgotten [place].

Inside, everything was quiet… too quiet. Then — *[sound]* — something moved! With quick thinking and a steady grip on the [tool], [explorerName] navigated the traps and dodged danger to finally reach a glittering room filled with gold.

The treasure sparkled under the beams of sunlight. Explorer [explorerName] had made it! They held up the [treasure] in triumph, already dreaming of their next big adventure.`
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

function loadVoices(callback) {
  voices = speechSynthesis.getVoices();

  if (voices.length) {
    callback();
  } else {
    // Try again once voices are loaded
    speechSynthesis.onvoiceschanged = () => {
      voices = speechSynthesis.getVoices();
      callback();
    };
  }
}

function speak(text, callback) {
  // Stop any ongoing speech
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
  }

  loadVoices(() => {
    const utterance = new SpeechSynthesisUtterance(text);

    const preferredVoice = voices.find(v => v.name.includes("Google US English")) ||
                           voices.find(v => v.name.includes("Samantha")) ||
                           voices.find(v => v.name.includes("Daniel")) ||
                           voices.find(v => v.name.includes("Karen")) ||
                           voices[0];

    utterance.voice = preferredVoice;
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      // Only trigger callback after speech is fully done
      if (typeof callback === "function") callback();
    };

    speechSynthesis.speak(utterance);
    console.log("🗣️ Using voice:", preferredVoice ? preferredVoice.name : "Default");
  });
}

function askQuestion() {
  if (current < blanks.length) {
    const q = blanks[current].question;
    promptEl.textContent = q;

    // Ensure recognition isn't already running
    if (recognition && recognition.abort) recognition.abort();

    speak(q, () => {
      try {
        recognition.start();
      } catch (e) {
        console.warn("Speech recognition already started:", e);
      }
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
