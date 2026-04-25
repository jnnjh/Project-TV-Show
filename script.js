const state = {
  allEpisodes: [],
  allShows: [],
  searchTerm: "",
  cache: {},
};

const rootElem = document.getElementById("root");
const episodeAmount = document.querySelector("#episodeAmount");
const episodeSearch = document.querySelector(".episode-search");
const selectEpisode = document.querySelector("#episode-select");
const showAllBtn = document.querySelector(".showAllBtn");
const searchBox = document.getElementById("search");

const showSearchBox = document.getElementById("showSearch");
const backBtn = document.getElementById("backBtn");

// -------- FETCH WITH CACHE --------
const getData = async (url) => {
  if (state.cache[url]) return state.cache[url];

  const res = await fetch(url);
  const data = await res.json();
  state.cache[url] = data;
  return data;
};

// -------- SHOWS --------
function makePageForShows(showList) {
  rootElem.innerHTML = "";
  rootElem.classList.remove("episodes-view");

  showList.forEach((show) => {
    const div = document.createElement("div");
    div.className = "show-card";

    div.innerHTML = `
      <h2 class="show-title">${show.name}</h2>

      <div class="show-content">
        <img src="${show.image?.medium || ""}" class="show-img">

        <div class="show-summary">
          ${show.summary || ""}
        </div>

        <div class="show-info">
          <p><b>Rated:</b> ${show.rating.average || "N/A"}</p>
          <p><b>Genres:</b> ${show.genres.join(" | ")}</p>
          <p><b>Status:</b> ${show.status}</p>
          <p><b>Runtime:</b> ${show.runtime || "?"}</p>
        </div>
      </div>
    `;

    div.querySelector(".show-title").addEventListener("click", () => {
      loadEpisodes(show.id);
    });

    rootElem.appendChild(div);
  });
}

// -------- EPISODES --------
function makePageForEpisodes(list) {
  rootElem.innerHTML = "";
  rootElem.classList.add("episodes-view");

  episodeAmount.textContent = `Displaying ${list.length}/${state.allEpisodes.length}`;

  list.forEach((ep) => {
    const s = String(ep.season).padStart(2, "0");
    const n = String(ep.number).padStart(2, "0");

    const div = document.createElement("div");

    div.innerHTML = `
      <h2>${ep.name} - S${s}E${n}</h2>
      <img src="${ep.image?.medium || ""}">
      <p>${ep.summary || ""}</p>
    `;

    rootElem.appendChild(div);
  });
}

// -------- LOAD EPISODES --------
async function loadEpisodes(showId) {
  const url = `https://api.tvmaze.com/shows/${showId}/episodes`;
  const episodes = await getData(url);

  state.allEpisodes = episodes;

  makePageForEpisodes(episodes);
  populateEpisodeSelect(episodes);

  episodeSearch.style.display = "grid";
  backBtn.style.display = "block";
}

// -------- EPISODE SEARCH --------
function renderEpisodes() {
  const filtered = state.allEpisodes.filter(
    (ep) =>
      ep.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      ep.summary.toLowerCase().includes(state.searchTerm.toLowerCase())
  );

  makePageForEpisodes(filtered);

  if (filtered.length < state.allEpisodes.length) {
    showAllButton(state.allEpisodes);
  }
}

searchBox.addEventListener("input", (e) => {
  state.searchTerm = e.target.value;
  selectEpisode.value = "";
  renderEpisodes();
});

// -------- EPISODE SELECT --------
function populateEpisodeSelect(list) {
  selectEpisode.innerHTML = `<option>Select an episode</option>`;

  list.forEach((ep, i) => {
    const s = String(ep.season).padStart(2, "0");
    const n = String(ep.number).padStart(2, "0");

    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `S${s}E${n} - ${ep.name}`;

    selectEpisode.appendChild(opt);
  });

  selectEpisode.onchange = (e) => {
    searchBox.value = "";
    makePageForEpisodes([list[e.target.value]]);
    showAllButton(list);
  };
}

// -------- SHOW ALL --------
function showAllButton(list) {
  showAllBtn.innerHTML = "";

  const btn = document.createElement("button");
  btn.textContent = "Show all episodes";

  btn.onclick = () => {
    makePageForEpisodes(list);
    showAllBtn.innerHTML = "";
    selectEpisode.value = "";
    searchBox.value = "";
  };

  showAllBtn.append(btn);
}

// -------- SHOW SEARCH --------
showSearchBox.addEventListener("input", (e) => {
  const term = e.target.value.toLowerCase();

  const filtered = state.allShows.filter((show) =>
    show.name.toLowerCase().includes(term) ||
    show.genres.join(" ").toLowerCase().includes(term) ||
    (show.summary || "").toLowerCase().includes(term)
  );

  makePageForShows(filtered);
});

// -------- BACK --------
backBtn.onclick = () => {
  makePageForShows(state.allShows);

  episodeSearch.style.display = "none";
  backBtn.style.display = "none";
  showAllBtn.innerHTML = "";
};

// -------- INIT --------
async function init() {
  const shows = await getData("https://api.tvmaze.com/shows");

  shows.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );

  state.allShows = shows;

  makePageForShows(shows);
}

init();