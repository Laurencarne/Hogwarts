document.addEventListener("DOMContentLoaded", function() {
  fetchThenRenderWizards();
});
//////////////////////////////
const newWizard = document.querySelector("#new-wizard");
const wizardForm = document.querySelector(".container");
const filterForm = document.querySelector("#sort-dropdown");
const slytherinCrest = document.querySelector(".slytherinCrest");
const gryffindorCrest = document.querySelector(".gryffindorCrest");
const hufflepuffCrest = document.querySelector(".hufflepuffCrest");
const ravenclawCrest = document.querySelector(".ravenclawCrest");
const hogwartsHouses = ["Gryffindor", "Slytherin", "Hufflepuff", "Ravenclaw"];
let addWiz = false;

newWizard.addEventListener("click", () => {
  addWiz = !addWiz;
  if (addWiz) {
    wizardForm.style.display = "block";
    wizardForm.addEventListener("submit", makeWizard);
  } else {
    wizardForm.style.display = "none";
  }
});
//////////////////////////////
const baseURL = "http://localhost:3000/hogwarts/";
//////////////////////////////
function fetchWizards() {
  return fetch(baseURL).then(response => response.json());
}
//////////////////////////////
const theGreatHall = document.querySelector(".theGreatHall");
//////////////////////////////
function makeCard(wizard) {
  const div = document.createElement("div");
  div.className = "card";

  const h3 = document.createElement("h3");
  h3.innerHTML = wizard.name;
  div.appendChild(h3);

  const img = document.createElement("img");
  img.src = wizard.image;
  img.className = "wizardImg";
  div.appendChild(img);

  const h5 = document.createElement("h5");
  h5.innerHTML = wizard.house;
  div.appendChild(h5);

  const likeBtn = document.createElement("button");
  if (wizard.likes > 0) {
    likeBtn.innerText = wizard.likes;
  } else {
    likeBtn.innerText = "♡";
  }
  likeBtn.className = "likeBtn";
  div.appendChild(likeBtn);
  likeBtn.addEventListener("click", () => makeLike(wizard));

  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "X";
  deleteBtn.className = "deleteBtn";
  deleteBtn.dataset.id = wizard.id;
  div.appendChild(deleteBtn);
  deleteBtn.addEventListener("click", () => deleteWizard());

  if (wizard.house === "Gryffindor") {
    div.classList.add("gryffindor");
  }
  if (wizard.house === "Ravenclaw") {
    div.classList.add("ravenclaw");
  }
  if (wizard.house === "Slytherin") {
    div.classList.add("slytherin");
  }
  if (wizard.house === "Hufflepuff") {
    div.classList.add("hufflepuff");
  }
  return div;
}
//////////////////////////////
function renderWizards(json) {
  theGreatHall.innerHTML = "";
  json.forEach(function(wizard) {
    theGreatHall.appendChild(makeCard(wizard));
  });
}
//////////////////////////////
function fetchThenRenderWizards() {
  fetchWizards().then(renderWizards);
}
//////////////////////////////
function deleteWizard() {
  const parent = event.target.parentElement;
  deleteWizardFromServer(event.target.dataset.id).then(() => parent.remove());
}
//////////////////////////////
function deleteWizardFromServer(id) {
  return fetch(baseURL + id, {
    method: "DELETE"
  });
}
//////////////////////////////
function makeLike(wizard) {
  event.preventDefault();
  let newLikes = wizard.likes + 1;

  const wizardLikes = {
    likes: newLikes
  };

  updateLikesToServer(wizardLikes, wizard.id);
}

//////////////////////////////
function updateLikesToServer(wizardLikes, id) {
  return fetch(baseURL + id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify(wizardLikes)
  }).then(fetchThenRenderWizards);
}
//////////////////////////////
function makeWizard() {
  event.preventDefault();

  const newWizard = {
    name: event.target[0].value,
    house: hogwartsHouses[Math.floor(Math.random() * hogwartsHouses.length)],
    image: event.target[1].value,
    likes: 0
  };

  addWizardToServer(newWizard).then(addWizardToDOM(newWizard));

  event.target.reset();
}
//////////////////////////////
function addWizardToServer(wizard) {
  return fetch(baseURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(wizard)
  });
}
//////////////////////////////
function addWizardToDOM(wizard) {
  const wizardCard = makeCard(wizard);
  theGreatHall.appendChild(wizardCard);
}
//////////////////////////////
function sortPostData(value) {
  if (value === "House") {
    displayWizardsByHouse();
  } else if (value === "Likes") {
    displayWizardsByLikes();
  }
}
//////////////////////////////
function displayWizardsByHouse() {
  fetchWizards().then(json => {
    wizards = json.slice(0);
    wizards.sort(function(a, b) {
      let x = a.house.toLowerCase();
      let y = b.house.toLowerCase();
      return x < y ? -1 : x > y ? 1 : 0;
    });
    renderWizards(wizards);
  });
}
//////////////////////////////
function displayWizardsByLikes() {
  fetchWizards().then(json => {
    wizards = json.slice(0);
    wizards.sort(function(a, b) {
      let x = Number(a.likes);
      let y = Number(b.likes);
      return y < x ? -1 : y > x ? 1 : 0;
    });
    renderWizards(wizards);
  });
}
//////////////////////////////
function displayHouse(house) {
  fetchWizards().then(json => {
    wizards = json.slice(0);
    let filterWizards = wizards.filter(wizard => wizard.house === house);
    renderWizards(filterWizards);
  });
}
//////////////////////////////
ravenclawCrest.addEventListener("click", () => displayHouse("Ravenclaw"));
gryffindorCrest.addEventListener("click", () => displayHouse("Gryffindor"));
slytherinCrest.addEventListener("click", () => displayHouse("Slytherin"));
hufflepuffCrest.addEventListener("click", () => displayHouse("Hufflepuff"));
//////////////////////////////

//////////////////////////////
