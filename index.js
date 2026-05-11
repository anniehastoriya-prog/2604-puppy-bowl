// === Constants ===
const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/2604-ANNIE"; // Make sure to change this!
const API = BASE + COHORT;
// Get all the players
// the Post Function to invite the new player
// Get the player by their ID
// Use the Delete Function to reove a player by ID
/**{
  "name": "Crumpet",
  "breed": "American Staffordshire Terrier",
  "status": "bench",
  "imageUrl": "http://r.ddmcdn.com/w_1012/s_f/o_1/cx_0/cy_0/cw_1012/ch_1518/APL/uploads/2019/12/Crumpet-PBXVI.jpg",
  "teamId": 456
}*/

//-- State
// declared three variables players, selectedPlayers and teams. Using declaration let because they variable values will change.
let players = [];
let selectedPlayers = [];
let teams = [];
// Updates the state with all the puppies from the API.
// using the async function because we want to make a request from the internet from the url.
//
async function getPlayers() {
  try {
    const response = await fetch(API + "/players");
    const result = await response.json();
    players = result.data;
    render();
  } catch (e) {
    console.error(e);
  }
}
///** Updates state with a single player from the API */
async function getPlayer(id) {
  try {
    const response = await fetch(API + "/players/" + id);
    const result = await response.json();
    selectedPlayers = result.data;
    render();
  } catch (e) {
    console.error(e);
  }
}

async function getTeams() {
  try {
    const response = await fetch(API + "/team");
    const result = await response.json();
    teams = result.data;
    render();
  } catch (e) {
    console.error(e);
  }
}
// for people to add info about the puppies.
async function addPlayer(player) {
  try {
    await fetch(API + "/players", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(player),
    });
    await getPlayers();
  } catch (e) {
    console.error(e);
  }
}

async function deletePlayer(id) {
  try {
    await fetch(API + "/player/" + id, {
      method: "DELETE",
    });
    selectedPlayer = undefined;
    await getPlayers();
  } catch (e) {
    console.error(e);
  }
}

//-- Componets

function PlayerListItem(player) {
  const $li = document.createElement("li");

  if (player.id === selectedPlayer?.id) {
    $li.classList.add("selected");
  }

  $li.innerHTML = `
    <a href="#selected">${player.name}</a>
  `;
  $li.addEventListener("click", () => getPlayer(player.id));
  return $li;
}
// -- Render
