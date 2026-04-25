//You can edit ALL of the code here
// function setup() {
//   const allEpisodes = getAllEpisodes();
//   makePageForEpisodes(allEpisodes);
// }

const state = {
  allEpisodes:[],
  searchTerm: "",
  showSearchTerm: "",
  cache: {}, // 🔥 store fetched data (requirement #6)
};
const rootElem = document.getElementById("root");
const episodeAmount = document.querySelector("#episodeAmount");
const episodeSearch = document.querySelector(".episode-search");
const selectEpisode = document.querySelector("#episode-select");
const selectShow = document.querySelector("#selectShow");
const showAllBtn = document.querySelector(".showAllBtn");
const searchBox = document.getElementById("search");

// NEW
const showSearchBox = document.getElementById("showSearch");
const backBtn = document.getElementById("backBtn");

// ---------------- FETCH WITH CACHE ----------------
const getData = async (url) => {
  if (state.cache[url]) return state.cache[url];

  const response = await fetch(url);
  const data = await response.json();
  state.cache[url] = data;
  return data;
};

// ---------------- SHOW LISTING ----------------
function makePageForShows(showList) {
  rootElem.innerHTML = "";

  showList.forEach((show) => {
    const div = document.createElement("div");

    div.innerHTML = `
      <h2 class="show-title">${show.name}</h2>
      <img src="${show.image?.medium || ""}">
      <p>${show.summary || ""}</p>
      <p><b>Genres:</b> ${show.genres.join(", ")}</p>
      <p><b>Status:</b> ${show.status}</p>
      <p><b>Rating:</b> ${show.rating.average || "N/A"}</p>
      <p><b>Runtime:</b> ${show.runtime || "?"} mins</p>
    `;

    div.querySelector(".show-title").addEventListener("click", () => {
      loadEpisodes(show.id);
    });

    rootElem.appendChild(div);
  });
}

// ---------------- EPISODES ----------------
function makePageForEpisodes(episodeList) {
  rootElem.innerHTML = ""; 
  episodeAmount.textContent = `Displaying ${episodeList.length}/${state.allEpisodes.length}`;
  episodeSearch.append(episodeAmount);
  episodeList.forEach((episode) => {
    // to create zero-padded episode code
    const season = String(episode.season).padStart(2, "0");
    const number = String(episode.number).padStart(2, "0");
    const episodeCode = `S${season}E${number}`;

    // to create episode container
    const episodeDiv = document.createElement("div");

    episodeDiv.innerHTML = `
      <h2>${episode.name} - ${episodeCode}</h2>
      <img src="${episode.image.medium}" alt="${episode.name}">
      <p>${episode.summary}</p>
    `;

    rootElem.appendChild(episodeDiv);
  });
}

// ---------------- LOAD EPISODES ----------------
async function loadEpisodes(showId) {
  const url = `https://api.tvmaze.com/shows/${showId}/episodes`;

  const episodeList = await getData(url);

  state.allEpisodes = episodeList;

  makePageForEpisodes(episodeList);
  populateEpisodeSelect(episodeList);

  // show episode UI
  episodeSearch.style.display = "grid";
  backBtn.style.display = "block";
  showAllBtn.innerHTML = "";
}

// ---------------- EPISODE SEARCH ----------------
function renderEpisodes() {
  const filtered = state.allEpisodes.filter(
    (episode) =>
      episode.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      episode.summary.toLowerCase().includes(state.searchTerm.toLowerCase()),
  );

  makePageForEpisodes(filtered);
   if (filtered.length<state.allEpisodes.length) {
    showAllButton(state.allEpisodes)
  }
 
}

const handleInput = (event) => {
  state.searchTerm = event.target.value;
  selectEpisode.value = "Select an episode";
  render();
};

// ---------------- EPISODE SELECT ----------------
function populateEpisodeSelect(list) {
  selectEpisode.innerHTML = `<option>Select an episode</option>`;

  list.forEach((ep, index) => {
    const season = String(ep.season).padStart(2, "0");
    const number = String(ep.number).padStart(2, "0");
    const code = `S${season}E${number}`;

    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${code} - ${ep.name}`;

    selectEpisode.appendChild(option);
  });

selectEpisode.addEventListener("change", (event) => {
  searchBox.value="";
  const index = event.target.value;
  makePageForEpisodes([episodeList[index]]);
  showAllButton(episodeList);
});}

// ---------------- SHOW ALL BUTTON ----------------
function showAllButton(list) {
  showAllBtn.innerHTML = "";

  const btn = document.createElement("button");
  btn.textContent = "Show all episodes";

  btn.addEventListener("click", () => {
    makePageForEpisodes(list);
    showAllBtn.innerHTML = "";
    selectEpisode.value = "";
    searchBox.value = "";
  });

  showAllBtn.append(btn);
}

// ---------------- SHOW SEARCH ----------------
showSearchBox.addEventListener("input", (e) => {
  state.showSearchTerm = e.target.value.toLowerCase();

  const filtered = state.allShows.filter((show) =>
    show.name.toLowerCase().includes(state.showSearchTerm) ||
    show.genres.join(" ").toLowerCase().includes(state.showSearchTerm) ||
    (show.summary || "").toLowerCase().includes(state.showSearchTerm)
  );

  makePageForShows(filtered);
});

// ---------------- BACK BUTTON ----------------
backBtn.addEventListener("click", () => {
  makePageForShows(state.allShows);

  episodeSearch.style.display = "none";
  backBtn.style.display = "none";
  showAllBtn.innerHTML = "";
});

// ---------------- INIT ----------------
async function init() {
  const shows = await getData("https://api.tvmaze.com/shows");

  shows.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );

  state.allShows = shows;

  makePageForShows(shows);

  // hide episode UI initially
  episodeSearch.style.display = "none";
  backBtn.style.display = "none";
}

init();