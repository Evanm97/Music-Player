const image = document.getElementById("img");
const title = document.getElementById("track-title");
const artist = document.getElementById("artist");
const music = document.querySelector("audio");
const genre = document.getElementById("genre");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const progress = document.getElementById("progress");
const progressContainer = document.getElementById("progress-container");
const prevBtn = document.getElementById("prev");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const shuffleBtn = document.getElementById("shuffle");
const repeatBtn = document.getElementById("repeat");
const nextGenreBtn = document.getElementById("next-genre");
const prevGenreBtn = document.getElementById("prev-genre");

// Booleans
let shuffle = false;
let repeat = false;
let playing = false;
let muted = false;

let trackIndex = 0;
let genreIndex = 0;
let imageIndex = 0;

const numImages = 7;
const genreArray = ["Pop", "Electronic", "Indie-Pop", "Rock", "Pop-Punk", "Hip-Hop", "Alt-Punk"];
const genreIds = [115, 71, 398, 5, 397, 146, 33];

const apiKey = "MmU5NzI1NDctZWM0Zi00ZWVhLTg2YzMtNTIzNjNhNjRmMjI4";

let apiUrl = `https://api.napster.com/v2.2/genres/g.115/tracks/top?apikey=${apiKey}`;
let trackArray = [];

// Play
function playTrack() {
  playing = true;
  playBtn.classList.replace("fa-play", "fa-pause");
  playBtn.setAttribute("title", "Pause");
  music.play();
}

// Pause
function pauseTrack() {
  playing = false;
  playBtn.classList.replace("fa-pause", "fa-play");
  playBtn.setAttribute("title", "Play");
  music.pause();
}

// Update DOM
function loadTrackFromApiData(trackData) {
  if (trackData) {

    if (trackData.name.length > 20 || trackData.artistName.length > 25) {
      reduceFontSize(trackData);
    } else {
      resetFontSize();
    }

    title.textContent = trackData.name;
    artist.textContent = trackData.artistName;

    genre.textContent = genreArray[genreIndex];

    music.src = trackData.previewURL;
    image.src = `http://direct.rhapsody.com/imageserver/v2/albums/${trackData.albumId}/images/300x300.jpg`;

  }
}

// Replaces Null Images with a Default Image
function fixImage() {
  image.src = "images/no-music-cover.png"
}

// Reduces the Font Size for Titles/Artists that are Too Long
function reduceFontSize(trackData) {
  if (trackData.name.length > 25 || trackData.artistName.length > 35) {
    title.classList.add("xl-title");
    artist.classList.add("long-artist");
  } else {
    title.classList.add("long-title");
    artist.classList.add("long-artist");
  }
}

// Resets Font Size to the Default
function resetFontSize() {
  title.classList.remove("long-title");
  artist.classList.add("long-artist");
  title.classList.remove("xl-title");
  artist.classList.add("xl-artist");
}

// fetch tracks
async function fetchTracks(url) {
  let trackArr = [];
  try {
    const response = await fetch(url);
    trackArr = await response.json();
  } catch (error) {
  }

  trackArray = trackArr.tracks;
  return trackArr.tracks;
}

// function for previous track
function prevTrack() {
  trackIndex <= 0 ? (trackIndex = trackArray.length - 1) : trackIndex--;

  loadTrackFromApiData(trackArray[trackIndex]);
  playTrack();
}

function repeatTrack() {
  loadTrackFromApiData(trackArray[trackIndex]);
  playTrack();
}

// Function for next track
function nextTrack() {
  if (repeat) {
    repeatTrack();
  } else {
    trackIndex < trackArray.length - 1 ? trackIndex++ : (trackIndex = 0);
    if (shuffle) {
      loadTrackFromApiData(
        trackArray[Math.floor(Math.random() * trackArray.length)]
      );
    } else {
      loadTrackFromApiData(trackArray[trackIndex]);
    }
    playTrack();
  }
}

// Selects correct shuffle button to display
function shuffleBoolean() {
  if (shuffle) {
    shuffleBtn.setAttribute("style", "color: whitesmoke");
    shuffle = false;
  } else {
    shuffleBtn.setAttribute("style", "color: #1DB954");
    shuffle = true;
    repeatBtn.setAttribute("style", "color: whitesmoke");
    repeat = false;
  }
}

// Selects correct repeat button to display
function repeatBoolean() {
  if (repeat) {
    repeatBtn.setAttribute("style", "color: whitesmoke");
    repeat = false;
  } else {
    repeatBtn.setAttribute("style", "color: #1DB954");
    repeat = true;
    shuffleBtn.setAttribute("style", "color: whitesmoke");
    shuffle = false;
  }
}

// On Load - Select First Track
trackArray = fetchTracks(apiUrl).then((trackArray) => {
  loadTrackFromApiData(trackArray[0]);
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

// Selects next music genre 
function nextGenre() {
  genreIndex < genreArray.length - 1 ? genreIndex++ : (genreIndex = 0);
  apiUrl = `https://api.napster.com/v2.2/genres/g.${genreIds[genreIndex]}/tracks/top?apikey=${apiKey}`;

  trackArray = fetchTracks(apiUrl).then((trackArray) => {
    loadTrackFromApiData(trackArray[0]);
    playTrack();

    // Changes background image
    imageIndex < numImages - 1 ? imageIndex++ : (imageIndex = 0);
    body.style.backgroundImage = `url('images/${imageIndex}.png')`;
  });
}

// Selects the previous music genre
function prevGenre() {
  genreIndex <= 0 ? (genreIndex = genreArray.length - 1) : genreIndex--;
  apiUrl = `https://api.napster.com/v2.2/genres/g.${genreIds[genreIndex]}/tracks/top?apikey=${apiKey}`;

  trackArray = fetchTracks(apiUrl).then((trackArray) => {
    loadTrackFromApiData(trackArray[0]);
    playTrack();

    // Changes background image
    imageIndex <= 0 ? (imageIndex = numImages - 1) : imageIndex--;
    body.style.backgroundImage = `url('images/${imageIndex}.png')`;
  });
}


// Event Listeners
music.addEventListener("ended", nextTrack);
music.addEventListener("timeupdate", updateProgressBar);
progressContainer.addEventListener("click", setProgressBar);
image.addEventListener("error", fixImage);

// Button Event Listeners
playBtn.addEventListener("click", () => (playing ? pauseTrack() : playTrack()));
prevBtn.addEventListener("click", prevTrack);
nextBtn.addEventListener("click", nextTrack);
shuffleBtn.addEventListener("click", shuffleBoolean);
repeatBtn.addEventListener("click", repeatBoolean);
nextGenreBtn.addEventListener("click", nextGenre);
prevGenreBtn.addEventListener("click", prevGenre);
