//You can edit ALL of the code here
// function setup() {
//   const allEpisodes = getAllEpisodes();
//   makePageForEpisodes(allEpisodes);
// }

const state = {
  allEpisodes:[],
  searchTerm: "",
};
const rootElem = document.getElementById("root");
const episodeAmount = document.querySelector("#episodeAmount");
const episodeSearch = document.querySelector(".episode-search");
const selectEpisode = document.querySelector("#episode-select");
const searchShow = document.querySelector("#selectShow");
const showAllBtn=document.querySelector(".showAllBtn")

//make a card for each episode and append to the page
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

//show searched episodes
function render() {
  const filteredEpisodes = document.querySelector("#root");
  filteredEpisodes.innerHTML = "";
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

//get the input value
const searchBox = document.getElementById("search");
searchBox.addEventListener("input", handleInput);

//make an select bar for episodes
function selectAnEpisode (episodeList){
 episodeList.forEach((episode, index) => {
  const season = String(episode.season).padStart(2, "0");
  const number = String(episode.number).padStart(2, "0");
  const episodeCode = `S${season}E${number}`;
  const option = document.createElement("option");
  option.value = index;
  option.textContent = `${episodeCode} - ${episode.name}`;
  selectEpisode.appendChild(option);
 });

selectEpisode.addEventListener("change", (event) => {
  searchBox.value="";
  const index = event.target.value;
  makePageForEpisodes([episodeList[index]]);
  showAllButton(episodeList);
});}

//make a show all episode button
function showAllButton(episodeList) {
  showAllBtn.innerHTML="";
  const showAll = document.createElement("button");
  showAll.textContent = "Show all episodes";
  showAllBtn.append(showAll);
  showAll.addEventListener("click", () => {
    makePageForEpisodes(episodeList);
    showAllBtn.innerHTML="";
    selectEpisode.value = "Select an episode";
    searchBox.value="";
  });
}

//fetch data from url
const getData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch failed:", error);
  }
};

//make a select for all the shows
let showUrl=[];
getData("https://api.tvmaze.com/shows").then((showList) => {
  showList.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  showList.forEach((show, index) =>{
    const option = document.createElement("option");
    option.textContent = show.name;
    option.value = show.id;;
    selectShow.append(option);
    const episodeUrl = `https://api.tvmaze.com/shows/${show.id}/episodes`;
    showUrl.push(episodeUrl);
  })
  if (showUrl.length > 0) {
    getData(showUrl[0]).then((episodeList) => {
      state.allEpisodes = episodeList;
      makePageForEpisodes(episodeList);
      selectAnEpisode(episodeList);
    });
  }
});


//when select a show,make a new page
selectShow.addEventListener("change", (event) => {
  selectEpisode.value="";
  const index = Number(event.target.value);
  rootElem.innerHTML = "";
  getData(showUrl[index]).then((episodeList)=>{
    state.allEpisodes = episodeList;
    makePageForEpisodes(episodeList);
    selectAnEpisode(episodeList);
  })

});


// window.onload = setup;
