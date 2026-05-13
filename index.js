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
    <a href="#selected">
    <img alt = "${player.name}" src "${player.ImageUrl}" />
    
    ${player.name}</a>
    
  `;
  $li.addEventListener("click", () => getPlayer(player.id));
  return $li;
}

/** A list of names of all parties */
function PlayersList() {
  const $ul = document.createElement("ul");
  $ul.classList.add("players");

  const $players = players.map(PlayerListItem);
  // replaces everything inside an element, and removes the other children previously
  $ul.replaceChildren(...$players);

  return $ul;
}

function selectedPlayer() {
  if (!selectedPlayer) {
    const $p = document.createElement("p");
    $p.textContent = "Please select a party to learn more.";
    return $p;
  }

  const $party = document.createElement("section");
  $party.innerHTML = `
    <h3>${selectedPlayer.name} #${selectedPlayer.id}</h3>
    <time datetime="${selectedPlayer.date}">
      ${selectedPlayer.date.slice(0, 10)}
    </time>
    <address>${selectedPlayer.location}</address>
    <p>${selectedPlayer.description}</p>
    <GuestList></GuestList>
    <button>Delete party</button>
    
  
  `;
  $player.querySelector("PlayerList").replaceWith(PlayerList());

  const $delete = $player.querySelector("button");
  $delete.addEventListener("click", () => deletePlayer(selectedPlayer.id));

  return $party;
}
function PlayerList() {
  const $ul = document.createElement("ul");
  const playersOnTeam = players.filter((player) =>
    rsvps.find(
      (roster) =>
        roster.playerId === player.id && roster.eventId === selectedPlayer.id,
    ),
  );
}
const $playerss = playersOnTeam.map((player) => {
  const $player = document.createElement("li");
  $player.textContent = player.name;
  return $player;
});
$ul.replaceChildren(...$players);

return $ul;

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
      <input name="status" type="Status" required />
    </label>
    <label>
      Imaage URL
      <input name="imageUrl" type="url" required />
    </label>
    <button>Add party</button>
  `;
  $form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData($form);
    const date = new Date(data.get("date")).toISOString();
    addParty({
      name: data.get("name"),
      breed: data.get("breed"),
      status,
      imageUrl: data.get("imageUrl"),
    });
  });

  return $form;
}
// -- Render
function render() {
  const $app = document.querySelector("#app");
  $app.innerHTML = `
    <h1>Party Planner</h1>
    <main>
      <section>
        <h2>Upcoming Parties</h2>
        <PartyList></PartyList>
        <h3>Add a new party</h3>
        <NewPartyForm></NewPartyForm>
      </section>
      <section id="selected">
        <h2>Party Details</h2>
        <SelectedParty></SelectedParty>
      </section>
    </main>
  `;

  $app.querySelector("PartyList").replaceWith(PartyList());
  $app.querySelector("NewPartyForm").replaceWith(NewPartyForm());
  $app.querySelector("SelectedParty").replaceWith(SelectedParty());
}

async function init() {
  await getParties();
  await getRsvps();
  await getGuests();
  render();
}

init();
