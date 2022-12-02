const authKey = localStorage.getItem("auth");

if (authKey === null) {
    // window.location.href = "../Login/index.html";
}

let fetchPage = 1;
/* API key = 47521ec4cb0fc520db13de6730790654 */
let movies = [];
let moviesToAdd = [];
let layout = "vertical"
const IMG_URL = "https://image.tmdb.org/t/p/";



let genres = [
    {
        id: 28,
        name: "Action",
    },
    {
        id: 12,
        name: "Adventure",
    },
    {
        id: 16,
        name: "Animation",
    },
    {
        id: 35,
        name: "Comedy",
    },
    {
        id: 80,
        name: "Crime",
    },
    {
        id: 99,
        name: "Documentary",
    },
    {
        id: 18,
        name: "Drama",
    },
    {
        id: 10751,
        name: "Family",
    },
    {
        id: 14,
        name: "Fantasy",
    },
    {
        id: 36,
        name: "History",
    },
    {
        id: 27,
        name: "Horror",
    },
    {
        id: 10402,
        name: "Music",
    },
    {
        id: 9648,
        name: "Mystery",
    },
    {
        id: 10749,
        name: "Romance",
    },
    {
        id: 878,
        name: "Science Fiction",
    },
    {
        id: 10770,
        name: "TV Movie",
    },
    {
        id: 53,
        name: "Thriller",
    },
    {
        id: 10752,
        name: "War",
    },
    {
        id: 37,
        name: "Western",
    },
];

//gets img based on source and desired size
function getImg(source, size) {
    if (source === null) {
        return "";
    }
    let final = IMG_URL + size + source;
    return final;
}

//shroten msg for card
function abridge(message) {
    if (message.length > 84) {
        return message.slice(0, 150) + " ...";
    } else {
        return message;
    }
}

//creates a card for the display
function createCard(lay, movie, position) {
    let title = movie.original_title
    let desc = movie.overview
    let img_path = movie.backdrop_path;
    

    // if no backdrop use poster
    if (img_path === null) {
         img_path = movie.poster_path;
    }

    desc = abridge(desc);
    const cardPlace = "card" + position;
    const newCard = document.createElement("div");
    let imgDone = getImg(img_path, "original");
    newCard.classList.add(cardPlace, lay, "cardItem");
    newCard.innerHTML = `
    <div class="backgroundpic"></div>
    <div class="gradient">
    <div class="watchcont">
    <h3>WATCH</h3>
    </div>
    <h2 id="_title">${title}</h2>
    <p id="${cardPlace}_desc">${desc}</span>
    </div>
    `;

    let backgroundpic = newCard.firstElementChild
    backgroundpic.style.backgroundImage = `url("${imgDone}")`;
    let gradient = backgroundpic.nextElementSibling
    let watchcont = gradient.firstElementChild

    gradient.style.background = "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%)"
    watchcont.style.opacity = 0
    
    // change fade and show watch when hover
    newCard.addEventListener("mouseenter", function () {
        gradient.style.background = "linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%)"
        watchcont.style.opacity = 1
        backgroundpic.style.transition = ("0.5s")
        backgroundpic.style.transform = ("scale(1.2)")
    });
    // change fade and hide watch when hover out
    newCard.addEventListener("mouseleave", function () {
        gradient.style.background = "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%)"
        watchcont.style.opacity = 0
        backgroundpic.style.transition = ("0.5s")
        backgroundpic.style.transform = ("scale(1)")
    });

    newCard.addEventListener("click", function () {
        console.log("click")
        setModal(movie);
    })
    
    return newCard;
}

//returns genres from ids
function giveGenres(genrelist) {
    res = [];

    genrelist.forEach((genre_id) => {
        genres.forEach((element) => {
            if (element.id === genre_id) {
                res.push(element.name);
            }
        });
    });

    return res;
}

//fetch to get movie data. returns JSON.
async function getMoviesData(pageNum) {

    const requestOptions = {
        method: "GET",
        redirect: "follow",
    };

    try {
        const res = await fetch(
            `https://api.themoviedb.org/3/movie/popular?api_key=47521ec4cb0fc520db13de6730790654&language=en-US&page=${pageNum}/`,
            requestOptions
        );
        const data = await res.json();

        return data;
    } catch (error) {
        console.log(error);
    }
}
// assign movies to variable
async function setMovies() {

    const raw = await getMoviesData(fetchPage);

    movies = await raw.results;

    return movies;
}

function setModal(movie) {
    console.log("calling set modal");
    console.log(movie);

    const modalMain = document.querySelector(".modal");
    const background = document.querySelector(".backgroundpart");
    const modaltitle = document.querySelector(".modalTitle");
    const modaldesc = document.querySelector(".modaldesc");
    const modallanguage = document.querySelector("#modal_language");
    const modalrelease = document.querySelector("#modal_releasedate");
    const modalgenres = document.querySelector("#modal_genres");
    const modalpopularity = document.querySelector("#modal_popularity");
    const ofuscator = document.querySelector(".ofuscator");

    
    
    modaltitle.textContent = movie.original_title;
    modaldesc.textContent = movie.overview;
    
    //add background validation
    let imgModal = getImg(movie.backdrop_path, "original");
    console.log(imgModal);
    
    let genres = giveGenres(movie.genre_ids).join(", ");
    modalgenres.textContent = genres;
    modalrelease.textContent = movie.release_date;
    
    // add language getter    
    modallanguage.textContent = movie.original_language;
    
    //add proper syntax
    modalpopularity.textContent = movie.vote_average;
    modalMain.style.display = "flex";
    ofuscator.style.display = "block";
    background.style.backgroundImage = `linear-gradient(359.32deg, #111111 0.53%, rgba(17, 17, 17, 0) 114.52%),url("${imgModal}")`;
    
    ofuscator.addEventListener("click", function () {
        modalMain.style.display = "none";
        ofuscator.style.display = "none";
    })
}

//populates the title card
function setMain(mainMovie) {

    let title = mainMovie.original_title;
    let desc = mainMovie.overview;
    let genres = giveGenres(mainMovie.genre_ids).join(", ");
    const cont = document.getElementById("frontcont");
    let newEl = document.createElement("div");
    newEl.innerHTML = `
    <p class="genre" id="preview_genre">${genres}</p>
    <h2 class="movietitle" id="preview_title">${title}</h2>
    <div class="descriptioncont">
    <p class="description" id="preview_desc">
    ${desc}
    </p>
    </div>
    `;
    cont.append(newEl);

    let background = document.getElementById("frontpreview");
    let img = getImg(mainMovie.backdrop_path, "original");
    background.style.backgroundImage = `linear-gradient(90deg, #080E20 0%, rgba(29, 29, 29, 0) 65.46%), URL(${img})`;
}

//populates the list
function createList(movieArr) {
    const recom = document.getElementById("recom");

    // takes out exceding movies for next call
    let leftover = movieArr.length % 3;
    moviesToAdd.push(movieArr.splice(-leftover));
    // for every 3 entries, create a grid
    for (i = 0; i < movieArr.length; i += 3) {
        let pos = 1;
        let plusGrid = document.createElement("div");
        plusGrid.classList.add("cards", layout);

        // alternative variable so as to not alter previous count
        let fakei = i;

        // for every entry, create a card
        for (j = 1; j < 4; j += 1) {
            // if for some reason the card is undefined, skip it
            if (movieArr[fakei] != undefined) {
                eval(
                    "card" +
                        j +
                        " = createCard(layout,movieArr[fakei], pos);"
                );
                eval("plusGrid.append(card" + j + ");");
            }
            pos += 1;
            fakei += 1;
        }
        // add grid to list
        recom.append(plusGrid);
    }
}

//creates card array
async function createPage() {
    
    await setMovies();

    const menu3 = document.getElementById("menu3");
    const menu1 = document.getElementById("menu1");

    const movieToMain = movies.shift();
    setMain(movieToMain);
    

    createList(movies)

    //change to horizontal layout
    menu1.addEventListener("click", function () {
        // set new layout
        layout = "horizontal"
        
        //get all cards and change class
        let cards = document.querySelectorAll(".card1,.card2,.card3")
        cards.forEach(card => {
            card.classList.remove("vertical")    
            card.classList.add("horizontal")    
        });

        //gets background pics and changes classes
        let backgrounds = document.querySelectorAll(".backgroundpic")
        backgrounds.forEach(element => {
            element.classList.remove("vertical")    
            element.classList.add("horizontal")
        });


        //gets all grids and changes classes
        let conts = document.querySelectorAll(".cards")
        conts.forEach(array => {
            array.classList.remove("vertical")
            array.classList.add("horizontal")
        });
        
        //gets skeleton loader and changes classes
        let loader = document.querySelector(".loader");
        let loaderItems = document.querySelectorAll(".loaderItem");
        loader.classList.remove("vertical");
        loader.classList.add("horizontal");
        
        loaderItems.forEach(item => {
            item.classList.remove("vertical")
            item.classList.add("horizontal")
        });
    });

    //change to vertical layout
    menu3.addEventListener("click", function () {
        // set new layout
        layout = "vertical"

        //get all cards and change class
        let cards = document.querySelectorAll(".card1,.card2,.card3")
        cards.forEach(card => {
            card.classList.remove("horizontal")    
            card.classList.add("vertical")    
        });

        //gets background pics and changes classes
        let backgrounds = document.querySelectorAll(".backgroundpic")
        backgrounds.forEach(element => {
            element.classList.remove("horizontal")    
            element.classList.add("vertical")
        });
        
        //gets all grids and changes classes
        let conts = document.querySelectorAll(".cards")
        conts.forEach(array => {
            array.classList.remove("horizontal")
            array.classList.add("vertical")
        });
        
        //gets skeleton loader and changes classes
        let loader = document.querySelector(".loader");
        let loaderItems = document.querySelectorAll(".loaderItem");
        loader.classList.remove("horizontal");
        loader.classList.add("vertical");

        loaderItems.forEach(item => {
            item.classList.remove("horizontal")
            item.classList.add("vertical")
        });
    });


}

window.onload = () => {
    
    createPage();
};
