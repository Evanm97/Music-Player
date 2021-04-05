const image = document.querySelector("img");
const title = document.getElementById("title");
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
// const soundBtn = document.getElementById("volume");
// const playlistBtn =document.getElementById("switch");
const nextGenButton = document.getElementById("nextGenre");
const prevGenButton = document.getElementById("prevGenre");

// Booleans
let shuffle = false;
let repeat = false;
let playing = false;
let muted = false;

let trackIndex = 0;

const API_KEY = "MmU5NzI1NDctZWM0Zi00ZWVhLTg2YzMtNTIzNjNhNjRmMjI4";

let genreIndex = 0;
const genreArray = ["Pop", "Electronic", "Indie-Pop", "Rock", "Pop-Punk", "Hip-Hop", "Alt-Punk"];
const genreIds = [115, 71, 398, 5, 397, 146, 33];

let apiUrl =
  `https://api.napster.com/v2.2/genres/g.115/tracks/top?apikey=${API_KEY}`;
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
    console.log("TRACK-DATA", trackData);

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

function fixImage() {
  console.log("shit image")
  image.src = "no-music-cover.png"
}

function reduceFontSize(trackData) {
  if (trackData.name.length > 25 || trackData.artistName.length > 35) {
    title.classList.add("xl-title");
    artist.classList.add("long-artist");
  } else {
    title.classList.add("long-title");
    artist.classList.add("long-artist");
  }
}

function resetFontSize() {
  title.classList.remove("long-title");
  artist.classList.add("long-artist");
  title.classList.remove("xl-title");
  artist.classList.add("xl-artist");
}

//fetch songs
async function fetchSongs(url) {
  let trackArr = [];
  console.log(trackArr)
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

// function muteSound() {
//   if (muted) {
//     music.volume = 1;
//     soundBtn.classList.replace("fa-volume-mute", "fa-volume-up");
//     soundBtn.setAttribute("title", "Mute");
//     muted = false;
//   } else {
//     music.volume = 0;
//     soundBtn.classList.replace("fa-volume-up", "fa-volume-mute");
//     soundBtn.setAttribute("title", "Unmute");
//     muted = true;
//   }
// }


function nextGenre() {
  genreIndex < genreArray.length - 1 ? genreIndex++ : (genreIndex = 0);
  apiUrl = `https://api.napster.com/v2.2/genres/g.${genreIds[genreIndex]}/tracks/top?apikey=${API_KEY}`;

  trackArray = fetchSongs(apiUrl).then((trackArray) => {
    loadSongFromApiData(trackArray[0]);
    playSong();
  });
}


function prevGenre() {
  genreIndex <= 0 ? (genreIndex = genreArray.length - 1) : genreIndex--;
  apiUrl = `https://api.napster.com/v2.2/genres/g.${genreIds[genreIndex]}/tracks/top?apikey=${API_KEY}`;

  trackArray = fetchSongs(apiUrl).then((trackArray) => {
    loadSongFromApiData(trackArray[0]);
    playSong();
  });
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

nextGenButton.addEventListener("click", nextGenre);
prevGenButton.addEventListener("click", prevGenre);