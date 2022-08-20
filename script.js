import axios from "axios";

let END = 100;
let START = 1;

const hamburgerBtn = document.querySelector("#hamburger");
const overlay = document.querySelector(".overlay");
const sideBarlist = document.querySelector(".sidebar ul");
const sidebar = document.querySelector(".sidebar");
const searchByType = document.querySelector(".type-search");
const home = document.querySelector(".home");
const pokeSection = document.querySelector("main");
const searchInput = document.querySelector("#searchBox");
const searchBtn = document.querySelector("#searchBtn");
const randomPoke = document.querySelector(".random-pokemon");
const loader = document.querySelector(".loader");
const loading = document.querySelector(".loading");
const searchList = document.querySelector(".search-list");


const pokeTypes = ["all",
    "Bug",
    "Fire",
    "Grass",
    "Electric",
    "Water",
    "Rock",
    "Fighting",
    "Flying",
    "Ground",
    "Poison",
    "Dragon",
    "Ice",
    "normal",
    "Ghost",
    "Psychic",
    "dark",
    "steel",
    "fairy"];

const sideBarItems = pokeTypes.map(item => `<li>${item}</li>`).join("");
sideBarlist.innerHTML = sideBarItems;

const colors = {
    fire: '#F08030',
    grass: '#78c850',
    electric: '#F8D030',
    water: '#6890F0',
    ground: '#e0c068',
    rock: '#b8a038',
    fairy: '#ee99ac',
    poison: '#a040a0',
    bug: '#A8B820',
    dragon: '#703858',
    psychic: '#F85888',
    flying: '#a890f0',
    fighting: '#c03028',
    normal: '#a8a878',
    ice: '#98d8d8',
    ghost: '#705898',
    dark: '#705848',
    steel: '#B8B8D0',
};
const types = Object.keys(colors);



fetchPokemon();

hamburgerBtn.addEventListener("click", navtoggle);
searchByType.addEventListener("click", (e) => {
    navtoggle();
    e.preventDefault();
});


home.addEventListener("click", () => {
    scrollTo(0, 0);
    pokeSection.innerHTML = "";
    fetchPokemon(START = 1, END = 300);
    document.body.classList.remove("stop-scrolling");
});

searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    searchPokemon();
    document.body.classList.add("stop-scrolling");
    scrollTo(0, 0);
})
// searchBtn.addEventListener("keypress", (e) => {
//     if (e.key === 'Enter') {
//         searchPokemon();
//       }
// })

randomPoke.addEventListener("click", () => {
    scrollTo(0, 0);
    randomPokemon();
    document.body.classList.add("stop-scrolling");
});

window.addEventListener("load", () => {
    loader.style.display = "none";
})

window.addEventListener("scroll", () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement
    if (clientHeight + scrollTop >= scrollHeight - 5) {
        showLoading();
    }
})

searchInput.addEventListener('input', showSearchList);

window.addEventListener("click", (e) => {
    if (e.target === searchInput) {
        searchList.classList.remove("off")
    }
    else {
        searchList.classList.add("off")
    }
})



const pokearr = [];
search();

function showLoading() {
    loading.classList.add('show');
    START += 100;
    END += 100;
    setTimeout(fetchPokemon, 1000);
}

function navtoggle() {
    hamburgerBtn.classList.toggle("change");
    overlay.classList.toggle("show");
    document.body.classList.toggle("stop-scrolling");
    sidebar.classList.toggle("toggle");
}

function fetchPokemon() {
    for (let id = START; id <= END; id++) {
        const promises = [];
        const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
        promises.push(axios(url).then((res) => res.data));
        Promise.all(promises).then((results) => {
            const pokemon = results.map((data) => ({
                name: data.name,
                id: data.id,
                img: data.sprites.other.dream_world.front_default,
                type: data.types.map((type) => type.type.name).join(" • "),
            }));
            showPokemon(pokemon);
        });
    }
}


function showPokemon(pokemon) {
    const pokeCard = document.createElement("div");
    pokeCard.classList.add("card");

    const pokeType = pokemon[0].type.split(" ")[0];
    const type = types.find(type => pokeType.indexOf(type) > -1);
    const color = colors[type];
    pokeCard.style.backgroundColor = color;

    const pokemonHTML = pokemon
        .map(
            (pokeman) =>
                `   <div class="poke-id">#${pokeman.id.toString().padStart(3, "0")}</div>
                    <div class="poke-img">
                        <img src="${pokeman.img}" loading="lazy" alt=${pokeman.name} />
                    </div>
                    <div class="poke-name">${pokeman.name}</div>
                    <div class="poke-type">${pokeman.type}</div>
    `
        )
        .join(" ");
    pokeCard.innerHTML = pokemonHTML;
    pokeSection.appendChild(pokeCard);
    loading.classList.remove("show");
}


function searchPokemon() {
    if (searchInput.value === "") return;
    let url = "";

    let reg = new RegExp('^[0-9]$');
    if (reg.test(searchInput.value)) {
        url = `https://pokeapi.co/api/v2/pokemon/${searchInput.value}`;
    }
    else {
        url = `https://pokeapi.co/api/v2/pokemon/${searchInput.value.toLowerCase()}`;
    }

    fetch(url).then((res) => {
        if (res.ok) return res.json()
    })
        .then((data) => {
            const pokemon = {
                name: data.name,
                id: data.id,
                img: data.sprites.other.dream_world.front_default,
                type: data.types.map((type) => type.type.name).join(" • "),
            };
            showSinglePokemon(pokemon);
        })
        .catch((err) => {
            pokeSection.innerHTML = "";
            searchInput.value = "";
            pokeSection.innerHTML = "TRY TO SEARCH FOR DIFFERENT POKEMON";
            return err;
        })
}

function showSinglePokemon(pokemon) {
    const pokeCard = document.createElement("div");
    pokeCard.classList.add("card");

    const pokeType = pokemon.type.split(" ")[0];
    const type = types.find(type => pokeType.indexOf(type) > -1);
    const color = colors[type];
    pokeCard.style.backgroundColor = color;

    const pokemonHTML =
        `   <div class="poke-id">#${pokemon.id.toString().padStart(3, "0")}</div>
                    <div class="poke-img">
                        <img src="${pokemon.img}" loading="lazy" alt=${pokemon.name} />
                    </div>
                    <div class="poke-name">${pokemon.name}</div>
                    <div class="poke-type">${pokemon.type}</div>
                `;
    pokeCard.innerHTML = pokemonHTML;
    pokeSection.innerHTML = "";
    searchInput.value = "";
    pokeSection.appendChild(pokeCard);
}


function randomPokemon() {
    let randPokeId = Math.ceil(Math.random() * 600);
    const url = `https://pokeapi.co/api/v2/pokemon/${randPokeId}`;

    fetch(url).then((res) => {
        if (res.ok) return res.json()
    })
        .then((data) => {
            const pokemon = {
                name: data.name,
                id: data.id,
                img: data.sprites.other.dream_world.front_default,
                type: data.types.map((type) => type.type.name).join(" • "),
            };
            showSinglePokemon(pokemon);
        })
        .catch((err) => {
            pokeSection.innerHTML = "";
            searchInput.value = "";
            pokeSection.innerHTML = "TRY TO SEARCH FOR DIFFERENT POKEMON";
            return err;
        })

}

const sideBarListItem = document.querySelectorAll(".sidebar ul li");

sideBarListItem.forEach(item => {
    item.addEventListener("click", () => {
        navtoggle();
        scrollTo(0, 0);
        document.body.classList.remove("stop-scrolling");
        pokeSection.innerHTML = "";
        if (item.innerText === "ALL") {
            home.click();
            return;
        }
        const promises = [];

        const url = `https://pokeapi.co/api/v2/type/${item.innerText.toLowerCase()}`;

        promises.push(axios(url).then((res) => res.data));
        Promise.all(promises).then((results) => {
            const pokeArray = results[0].pokemon;
            const pokeUrlArray = [];
            pokeArray.forEach(pokeElem => {
                pokeUrlArray.push(pokeElem.pokemon.url);
            })
            FetchPokemonByType(pokeUrlArray);
        });
    });
})

function FetchPokemonByType(pokemonUrlArray) {
    pokemonUrlArray.forEach(pokemonUrl => {
        const promises = [];
        const url = `${pokemonUrl}`;
        promises.push(axios(url).then((res) => res.data));
        Promise.all(promises).then((results) => {
            const pokemon = results.map((data) => ({
                name: data.name,
                id: data.id,
                img: data.sprites.other.dream_world.front_default,
                type: data.types.map((type) => type.type.name).join(" • "),
            }));
            showPokemon(pokemon);
        });
    })
}


function showSearchList() {
    searchList.innerHTML = "";
    const val = searchInput.value;
    if (val.length === 0) {
        searchList.classList.add("off");
        return;
    } else {
        searchList.classList.remove("off");
    }

    pokearr.forEach(poke => {
        if (poke.includes(val) || (pokearr.indexOf(poke) + 1).toString().padStart(3, "0").includes(val)) {
            const searchListItem = document.createElement('li');
            searchListItem.classList.add('search-list-item');
            searchListItem.innerText = (pokearr.indexOf(poke) + 1).toString().padStart(3, "0") + ".".padEnd(3, " ") + poke;
            searchList.appendChild(searchListItem);
            searchListItem.addEventListener("click", (e) => {
                // trying to highlight last clicked item
                // console.log(e);
                // let prevTarget = null;
                // if(prevTarget != e.target){
                //     e.target.classList.add("active");
                //     prevTarget = e.target;
                // }
                // else{
                //     e.target.classList.remove("active");
                // }
                searchInput.value = e.target.innerText.split(".")[1].trim();
                scrollTo(0, 0);
                document.body.classList.add("stop-scrolling");
                searchPokemon();
                searchInput.value = "";
            })
        }
        // make a e\message appear if name doesnt match
    })
}


function search() {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0").then((res) => res.json()).then((data) => {
        const obj = data.results;
        obj.forEach((p) => {
            pokearr.push(p.name);
        })
    });
}

