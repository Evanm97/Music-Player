const image = document.querySelector("img");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const music = document.querySelector("audio");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const progress = document.getElementById("progress");
const progressContainer = document.getElementById("progress-container");
const prevBtn = document.getElementById("prev");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const shuffleBtn = document.getElementById("shuffle");
const repeatBtn = document.getElementById("repeat");

// Booleans
let shuffle = false;
let repeat = false;
let playing = false;

let trackIndex = 0;
const apiUrl =
  "https://api.napster.com/v2.2/genres/g.398/tracks/top?apikey=MmU5NzI1NDctZWM0Zi00ZWVhLTg2YzMtNTIzNjNhNjRmMjI4";
let trackArray = [];

// Play
function playSong() {
  playing = true;
  playBtn.classList.replace("fa-play", "fa-pause");
  playBtn.setAttribute("title", "Pause");
  music.play();
}

// Pause
function pauseSong() {
  playing = false;
  playBtn.classList.replace("fa-pause", "fa-play");
  playBtn.setAttribute("title", "Play");
  music.pause();
}

// Update DOM
function loadSongFromApiData(trackData) {
  if (trackData) {
    console.log(trackData);

    if (trackData.name.length > 22 || trackData.artistName.length > 25) {
      reduceFontSize();
    } else {
      resetFontSize();
    }

    title.textContent = trackData.name;
    artist.textContent = trackData.artistName;

    music.src = trackData.previewURL;
    image.src = `http://direct.rhapsody.com/imageserver/v2/albums/${trackData.albumId}/images/300x300.jpg`;
  }
}

function reduceFontSize() {
  title.classList.add("long-title");
  artist.classList.add("long-artist");
}

function resetFontSize() {
  title.classList.remove("long-title");
  artist.classList.add("long-artist");
}

//fetch songs
async function fetchSongs(url) {
  let trackArr = [];
  try {
    const response = await fetch(url);
    trackArr = await response.json();
  } catch (error) {
    console.log("Error fetching data :" + error);
  }

  trackArray = trackArr.tracks;
  return trackArr.tracks;
}

// function for previous song
function prevSong() {
  trackIndex <= 0 ? (trackIndex = trackArray.length - 1) : trackIndex--;

  loadSongFromApiData(trackArray[trackIndex]);
  playSong();
}

function repeatSong() {
  loadSongFromApiData(trackArray[trackIndex]);
  playSong();
}

// Function for next song
function nextSong() {
  if (repeat) {
    repeatSong();
  } else {
    trackIndex < trackArray.length - 1 ? trackIndex++ : (trackIndex = 0);
    if (shuffle) {
      loadSongFromApiData(
        trackArray[Math.floor(Math.random() * trackArray.length)]
      );
    } else {
      loadSongFromApiData(trackArray[trackIndex]);
    }
    playSong();
  }
}

function shuffleBoolean() {
  if (shuffle) {
    shuffleBtn.setAttribute("style", "color: pink");
    shuffle = false;
  } else {
    shuffleBtn.setAttribute("style", "color: #1DB954");
    shuffle = true;
  }
}

function repeatBoolean() {
  if (repeat) {
    repeatBtn.setAttribute("style", "color: pink");
    repeat = false;
  } else {
    repeatBtn.setAttribute("style", "color: #1DB954");
    repeat = true;
  }
}

// On Load - Select First Song
trackArray = fetchSongs(apiUrl).then((trackArray) => {
  loadSongFromApiData(trackArray[0]);
});

// Update Progress Bar & Time
function updateProgressBar(e) {
  if (playing) {
    const { duration, currentTime } = e.srcElement;
    // Update progress bar width
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    // Calculate display for duration
    const durationMinutes = Math.floor(duration / 60);
    let durationSeconds = Math.floor(duration % 60);
    if (durationSeconds < 10) {
      durationSeconds = `0${durationSeconds}`;
    }
    // Delay switching duration Element to avoid NaN
    if (durationSeconds) {
      durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
    }
    // Calculate display for currentTime
    const currentMinutes = Math.floor(currentTime / 60);
    let currentSeconds = Math.floor(currentTime % 60);
    if (currentSeconds < 10) {
      currentSeconds = `0${currentSeconds}`;
    }
    currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
  }
}

// Set Progress Bar
function setProgressBar(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const { duration } = music;
  music.currentTime = (clickX / width) * duration;
}

// Event Listeners
music.addEventListener("ended", nextSong);
music.addEventListener("timeupdate", updateProgressBar);
progressContainer.addEventListener("click", setProgressBar);

playBtn.addEventListener("click", () => (playing ? pauseSong() : playSong()));
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);
shuffleBtn.addEventListener("click", shuffleBoolean);
repeatBtn.addEventListener("click", repeatBoolean);