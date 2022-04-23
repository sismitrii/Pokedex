//-------------------------Variables------------------
let allPokemon = [];
let finalTabPokemon = []; // table with all the pokemon with the name in French and the wright image
const searchInput = document.querySelector(".search-pokemon input");
const pokemonList = document.querySelector(".pokemon-list");
let loader = document.querySelector('.loader');

const types = {
    grass: '#78c850',
	ground: '#E2BF65',
	dragon: '#6F35FC',
	fire: '#F58271',
	electric: '#F7D02C',
	fairy: '#D685AD',
	poison: '#966DA3',
	bug: '#B3F594',
	water: '#6390F0',
	normal: '#D9D5D8',
	psychic: '#F95587',
	flying: '#A98FF3',
	fighting: '#C25956',
    rock: '#B6A136',
    ghost: '#735797',
    ice: '#96D9D6'
};



//-------------------- Recupération des données de l'API ----------------------
function getThePokemonsList(){
    fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
        .then (result => result.json())
        .then((allPoke)=>{
          //console.log(allPoke);
          allPoke.results.forEach(pokemon => {
              getThePokemonCV(pokemon);
          });
        })
}

getThePokemonsList();


function getThePokemonCV(pokemon){

    let url = pokemon.url;
    let objectPokemon = {};
    

    fetch(url)
    .then(result => result.json())
    .then((pokemonCV)=> {
        
        objectPokemon.pic = pokemonCV.sprites.front_default;
        objectPokemon.type = pokemonCV.types[0].type.name;
        objectPokemon.id = pokemonCV.id;

        fetch(pokemonCV.species.url)
            .then(result => result.json())
            .then((data)=> {
                //info(data);// teeeeeest
                objectPokemon.name = data.names[4].name;
                allPokemon.push(objectPokemon);

                if (allPokemon.length === 151){
                    finalTabPokemon = allPokemon.sort(function(a,b){
                        return a.id - b.id;
                    });
                    //console.log(finalTabPokemon);
                }
               

                createCard(finalTabPokemon.slice(0,21));
                loader.style.display ="none";
            })
    })
}

// teeeeeest
/*function info(data){
    let url = data.evolution_chain.url;

    fetch(url)
    .then(result => result.json())
    .then((x)=> {
        console.log(x);
        let miniLvlEvo = x.chain.evolves_to[0].evolution_details[0].min_level;
        console.log(miniLvlEvo);
    })
}*/
//------------------- Création des cartes---------------

function createCard(pokemonTable){
    for (let i = 0; i < pokemonTable.length; i++){
        const cardPokemon = document.createElement('li');

        const cardPokemonInner = document.createElement('div');
        cardPokemonInner.classList.add('cardPokemon-inner');
        

        //face avant
        const frontPokemonCard = document.createElement('div');
        frontPokemonCard.classList.add('frontPokemonCard');
        frontPokemonCard.style.background = types[pokemonTable[i].type];
        cardPokemonInner.appendChild(frontPokemonCard);

        const namePokemonCard = document.createElement("h5");
        namePokemonCard.innerText = pokemonTable[i].name;

        const picPokemonCard = document.createElement("img");
        picPokemonCard.src = pokemonTable[i].pic;
       
        const idPokemonCard = document.createElement("p");
        idPokemonCard.innerText = `ID# ${pokemonTable[i].id}`;

        frontPokemonCard.appendChild(picPokemonCard);
        frontPokemonCard.appendChild(namePokemonCard);
        frontPokemonCard.appendChild(idPokemonCard);

        //face arriere
        const backPokemonCard = document.createElement('div');
        backPokemonCard.classList.add('backPokemonCard');
        backPokemonCard.style.background = types[pokemonTable[i].type];
        
        const backNamePokemonCard = document.createElement('p');
        backNamePokemonCard.innerText = pokemonTable[i].name;
        backPokemonCard.appendChild(backNamePokemonCard);

        cardPokemonInner.appendChild(backPokemonCard);

        // ajout dans la carte
        cardPokemon.appendChild(cardPokemonInner);
        pokemonList.appendChild(cardPokemon);
    }
}


//------------------Scroll Infini-----------------

window.addEventListener("scroll", function(){
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
    
    if (scrollTop + clientHeight >= scrollHeight){
        addPoke(6);
    }
})


let index = 21;

function addPoke(nbr){
    if (index >= 151){
        return ;
    } else {
        createCard(finalTabPokemon.slice(index, index + nbr));
        index += nbr ;
    }
}

// --------------------Recherche--------------------- 

searchInput.addEventListener("keyup", search);


function search(){
    if(index < 151){
        addPoke(130);
    }

    let scribed = searchInput.value.toUpperCase();
    let cardPokemon = document.querySelectorAll('li');
    let allTitle = document.querySelectorAll('h5');
    let titleValue = "";

    for (let i = 0; i < allTitle.length; i++){

        titleValue = allTitle[i].innerText.toUpperCase();
        
        if (titleValue.indexOf(scribed) == -1){
            cardPokemon[i].style.display = "none";
        } else {
            cardPokemon[i].style.display = "flex";
        }
    }
}


//In order to let the label on top on the input when they are text inside of it

searchInput.addEventListener('input', function(e){
    if(e.target.value !== ""){
        e.target.parentNode.classList.add("active-input");
    }else if (e.target.value === ""){
        e.target.parentNode.classList.remove("active-input");
    }
})