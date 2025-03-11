const but = document.querySelector(".but");
const aud = document.querySelector(".audio");
const meme = document.querySelector(".meme");

let joke = "";

const randomIndex = Math.floor(Math.random() * 9) + 1;
let index = randomIndex;

function memegenerator() {
  // console.log("Random Index:", randomIndex);
  meme.src = `assets/m${index % 10}.gif`;
  index++;
}

//converting voice to joke

//getting a joke
async function getjoke() {
  const jokeurl =
    "https://v2.jokeapi.dev/joke/Programming,Miscellaneous,Dark,Pun,Spooky,Christmas?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&idRange=0-318";
  try {
    const response = await fetch(jokeurl);
    const data = await response.json();
    // joke defineing
    if (data["setup"]) {
      joke = `${data["setup"]} ........  ${data["delivery"]}`;
    } else {
      joke = data["joke"];
    }

    const audio = await getAudio(joke);
    aud.src = audio;
    aud.play();
    // but.disabled = false;

    console.log("voice done");

    console.log(joke);
  } catch (error) {
    console.log("error is[line 22] :" + error);
  }
}

//getting converting the text to audio using api
const API_BASE_URL = "https://api.sws.speechify.com";

const API_KEY = "BE9QhPykqJIR_3jPBgSktq4K-8prsDbo1lQfkXV1who=";

const VOICE_ID = "george";

async function getAudio(text) {
  const res = await fetch(`${API_BASE_URL}/v1/audio/speech`, {
    method: "POST",
    body: JSON.stringify({
      input: `<speak>${text}</speak>`,
      voice_id: VOICE_ID,
      audio_format: "mp3",
    }),
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "content-type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}\n${await res.text()}`);
  }

  const responseData = await res.json();

  // Convert Base64 to binary data
  const byteCharacters = atob(responseData.audio_data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  // Create a Blob and generate an object URL  <impt as the audio elemnt requires ulr not an binary data>
  const blob = new Blob([byteArray], { type: "audio/mp3" });
  return URL.createObjectURL(blob);
}

but.addEventListener("click", () => {
  but.disabled = true;
  getjoke();
  memegenerator();
});

aud.addEventListener("play", () => {
  meme.hidden = false;
});

aud.addEventListener("ended", () => {
  but.disabled = false;
  meme.hidden = true;
});
