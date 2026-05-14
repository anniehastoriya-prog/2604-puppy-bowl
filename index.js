// === Constants ===
const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/2406-ANNIE";
const API = BASE + COHORT;

// ===STATE===
// Since we are going to be changing their values later, the declaration needed is let
let players = [];
let selectedPlayer;
let teams = [];

// Updates the state with all the puppies from the API
// Because we are making a request that takes time to respond, our function must be asynchronous
async function getPlayers() {
  // Since we are working with a Promise, we have to try making the request
  try {
    // The term `await` means wait for the promise to resolve
    // The term `fetch` means make GET request to specified path
    const response = await fetch(API + "/players");
    // After the resoponse comes back, I have parse the JSON into an actual object
    const result = await response.json();
    players = result.data.players;
    render();
  } catch (e) {
    console.error(e);
  }
}

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
    await fetch(API + "/players/" + id, {
      method: "DELETE",
    });
    selectedPlayer = undefined;
    await getPlayers();
  } catch (e) {
    console.error(e);
  }
}

// ===COMPONENTS===

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

function PlayerList() {
  const $ul = document.createElement("ul");
  $ul.classList.add("players");

  const $players = players.map(PlayerListItem);
  $ul.replaceChildren(...$players);

  return $ul;
}

function SelectedPlayer() {
  if (!selectedPlayer) {
    const $p = document.createElement("p");
    $p.textContent = "Select a player to learn more about them.";
    return $p;
  }

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

  const $delete = $player.querySelector("#delete-player");

  $delete.addEventListener("click", async () => {
    await deletePlayer(selectedPlayer.id);
  });

  return $player;
}

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

// ===RENDER===
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
