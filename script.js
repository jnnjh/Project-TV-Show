//You can edit ALL of the code here
window.onload = () => {
    const rootElem = document.getElementById("root");
    rootElem.textContent = "Loading episodes, please wait...";

    async function fetchEpisodes() {
        try {
            const response = await fetch("https://api.tvmaze.com/shows/82/episodes");
            if (!response.ok) throw new Error("Network response was not ok");

            const episodes = await response.json();
            console.log("Episodes fetched:", episodes.length);
            rootElem.textContent = `Fetched ${episodes.length} episodes from API.`;
        } catch (error) {
            rootElem.textContent = "Error loading episodes. Please try again later.";
            console.error(error);
        }
    }
    fetchEpisodes();
}



/*function makePageForEpisodes(episodeList) {
  rootElem.innerHTML = "";
  episodeList.forEach((episode) => {
    const season = String(episode.season).padStart(2, "0");
    const number = String(episode.number).padStart(2, "0");
    const episodeCode = `S${season}E${number}`;
    
    const episodeDiv = document.createElement("div");
    episodeDiv.innerHTML = `
      <h2>${episode.name} - ${episodeCode}</h2>
      <img src="${episode.image?.medium || ''}" alt="${episode.name}">
      <p>${episode.summary || "No summary available."}</p>
    `;
    rootElem.appendChild(episodeDiv);
  });
}

async function fetchEpisodes() {
  try {
    const response = await fetch("https://api.tvmaze.com/shows/82/episodes");
    if (!response.ok) throw new Error("Network response was not ok");
    const episodes = await response.json();
    state.allEpisodes = episodes;
    makePageForEpisodes(state.allEpisodes);
  } catch (error) {
    rootElem.textContent = "Error loading episodes. Please try again later.";
    console.error(error);
  }
}

function render() {
  if (!state.allEpisodes || state.allEpisodes.length === 0) {
    rootElem.textContent = "Loading episodes, please wait...";
    return;
  }

  const filtered = state.allEpisodes.filter((episode) => {
    const name = episode.name ? episode.name.toLowerCase() : "";
    const summary = episode.summary ? episode.summary.toLowerCase() : "";
    const term = state.searchTerm.toLowerCase();
    return name.includes(term) || summary.includes(term);
  });

  makePageForEpisodes(filtered);
}

const searchBox = document.getElementById("search");
searchBox.addEventListener("input", (event) => {
  state.searchTerm = event.target.value;
  selectEpisode.value = "Select an episode";
  render();
});

const selectEpisode = document.getElementById("select");

function populateDropdown() {
  state.allEpisodes.forEach((episode, index) => {
    const season = String(episode.season).padStart(2, "0");
    const number = String(episode.number).padStart(2, "0");
    const episodeCode = `S${season}E${number}`;
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${episodeCode} - ${episode.name}`;
    selectEpisode.appendChild(option);
  });
}

selectEpisode.addEventListener("change", (event) => {
  const index = event.target.value;
  if (index === "") {
    render();
  } else {
    makePageForEpisodes([state.allEpisodes[index]]);
  }
});

state.allEpisodes = episodes;
populateDropdown();
makePageForEpisodes(state.allEpisodes);
*/

/*function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

/*function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;


}*/
/*const state={
  allEpisodes:getAllEpisodes(),
  searchTerm:""
}
const rootElem = document.getElementById("root");
const episodeAmount=document.querySelector("#episodeAmount")
const episodeSearch=document.querySelector(".episode-search")
const selectEpisode=document.querySelector("#select")

function makePageForEpisodes(episodeList) {
  episodeAmount.textContent=`Displaying ${episodeList.length}/${state.allEpisodes.length}`
  episodeSearch.append(episodeAmount)
  episodeList.forEach(episode => {
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
function render() {
  const filteredEpisodes = document.querySelector("#root");
  filteredEpisodes.innerHTML = "";
  const filtered = state.allEpisodes.filter((episode) =>
    episode.name.toLowerCase().includes(state.searchTerm.toLowerCase())||
    episode.summary.toLowerCase().includes(state.searchTerm.toLowerCase())
  );

  makePageForEpisodes(filtered);
}

const handleInput = (event) => {
  state.searchTerm = event.target.value;
  selectEpisode.value = "Select an episode"
  render();
};

const searchBox = document.getElementById("search");
searchBox.addEventListener("input", handleInput);

state.allEpisodes.forEach((episode,index) => {
    const season = String(episode.season).padStart(2, "0");
    const number = String(episode.number).padStart(2, "0");
    const episodeCode = `S${season}E${number}`;
    const option=document.createElement('option')
    option.value=index
    option.textContent=`${episodeCode} - ${episode.name}`
    selectEpisode.appendChild(option)
})
selectEpisode.addEventListener("change",(event)=>{
  const index = event.target.value;
  rootElem.innerHTML = "";
  makePageForEpisodes([state.allEpisodes[index]]);
});

window.onload = setup;
*/
