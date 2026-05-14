// === Constants ===
const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/2406-ANNIE";
const API = BASE + COHORT;

// ~State
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

// Declared three variables players, selectedPlayers and teams.
// Using declaration let because they variable values will change.
// In the state we start with the async function because we are calling or needing to talk to the open soucre that is the API.
// Since we don't know how long the API will take to respond we use the async/await. This includes the fetch .. catch. fetches
// information from the API and catches to protect it from getting errors.
let players = [];
let selectedPlayer;
let teams = [];

// Updates state with all players  from the API

async function getPlayers() {
  try {
    const response = await fetch(API + "/players");
    const result = await response.json();
    players = result.data.players;
    render();
  } catch (e) {
    console.error(e);
  }
}
// Updates state with a single player from the API

async function getPlayer(id) {
  try {
    const response = await fetch(API + "/players/" + id);
    const result = await response.json();

    selectedPlayer = result.data.player;

    render();
  } catch (e) {
    console.error(e);
  }
}
// Updates state with all Teams from the API
async function getTeams() {
  try {
    const response = await fetch(API + "/teams");
    const result = await response.json();
    teams = result.data.teams;
    render();
  } catch (e) {
    console.log(e);
  }
}
// Fetching to the API to create a player
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
// Allows to delete the player with the given ID with the info fetching from the API
async function deletePlayer(id) {
  try {
    await fetch(API + "/players/" + id, {
      method: "DELETE",
    });
    selectedPlayer = undefined;
    await getPlayers();
  } catch (e) {
    console.error(e);
  }
}

// ~Components

// Building a single player list item. With this function it will check if the player is selected. The player's id should
// Match with the selectedPlayer's ID. Then we have the HTML element li to make the list for the selectedPlayers
// addEventListener is used for the user to click for the user details.
function PlayerListItem(player) {
  const $li = document.createElement("li");

  if (player.id === selectedPlayer?.id) {
    $li.classList.add("selected");
  }

  $li.innerHTML = `
    <a href="#selected">
        <img alt="${player.name}" src="${player.imageUrl}" width=25 />
        ${player.name}</a>
    `;
  $li.addEventListener("click", () => getPlayer(player.id));
  return $li;
}
// When the player is clicked it will show more details aboout the individual player.
function PlayerList() {
  const $ul = document.createElement("ul");
  $ul.classList.add("players");

  const $players = players.map(PlayerListItem);
  $ul.replaceChildren(...$players);

  return $ul;
}
//This will show detailed information about the selected players,
// it will present the line "Select a player to learn about them" with the created HTML element <p>
function SelectedPlayer() {
  if (!selectedPlayer) {
    const $p = document.createElement("p");
    $p.textContent = "Select a player to learn more about them.";
    return $p;
  }
  // This section here will show on the side for the Player Details, user will see the image at the top and rest of the info below
  // The last part will be a button to delete the player.
  const $player = document.createElement("section");

  $player.innerHTML = `
  <img
    src="${selectedPlayer.imageUrl}"
    alt="${selectedPlayer.name}"
    width="250"
  />

  <h3>${selectedPlayer.name}</h3>

  <p><strong>ID:</strong> ${selectedPlayer.id}</p>

  <p><strong>Breed:</strong> ${selectedPlayer.breed}</p>

  <p><strong>Status:</strong> ${selectedPlayer.status}</p>

  <button id="delete-player">
    Delete Player
  </button>
`;
  // Added an addEventListerner for the user to click on the button to make the player deleted.
  const $delete = $player.querySelector("#delete-player");

  $delete.addEventListener("click", async () => {
    await deletePlayer(selectedPlayer.id);
  });

  return $player;
}
// Let the user put in all the information about the player
// The HTML Element form is created where boxes of Name, Breed, Status, and Image are labeled.
function NewPlayerForm() {
  const $form = document.createElement("form");
  $form.innerHTML = `
    <label>
      Name
      <input name="name" required />
    </label>
    <label>
      Breed
      <input name="breed" required />
    </label>
    <label>
      Status
      <input name="status" required />
    </label>
    <label>
      Image URL
      <input name="imageUrl" type="url" required />
    </label>
    <button>Add Player</button>
  `;
  // Once user has put the info this lets them submit the form with the addEventListener with Submit event.
  // Also includes the list of item they are submiting.
  $form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData($form);
    addPlayer({
      name: data.get("name"),
      breed: data.get("breed"),
      status: data.get("status"),
      imageUrl: data.get("imageUrl"),
    });
  });

  return $form;
}

// ~Render
// shows what the final page will look like with Puppy Bowl text at the top for h1
// then shows the different sections, the Players and the Player Details
// Then the Player list with the puppies showing and to the right of it
// the selected puppy with the image and their info included.
function render() {
  const $app = document.querySelector("#app");
  $app.innerHTML = `
    <h1>Puppy Bowl</h1>
    <main>
      <section>
        <h2>Players</h2>
        <PlayerList></PlayerList>
        <h3>Add a new player</h3>
        <NewPlayerForm></NewPlayerForm>
      </section>
      <section id="selected">
        <h2>Player Details</h2>
        <SelectedPlayer></SelectedPlayer>
      </section>
    </main>
  `;
  //

  $app.querySelector("PlayerList").replaceWith(PlayerList());
  $app.querySelector("NewPlayerForm").replaceWith(NewPlayerForm());
  $app.querySelector("SelectedPlayer").replaceWith(SelectedPlayer());
}

async function init() {
  await getPlayers();
  await getTeams();
  render();
}

init();
