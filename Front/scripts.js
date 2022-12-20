const authKey = localStorage.getItem("auth");

if (authKey === null) {
    // window.location.href = "../Login/index.html";
}

let lastSearches = [];
let fetchPage = 1;
let movies = [];
let moviesToAdd = [];
let languages = [];
let recomArr = [];
let genres = [];
let layout = "vertical";
const IMG_URL = "https://image.tmdb.org/t/p/";

function getLastSearches() {
    let previous = JSON.parse(sessionStorage.getItem("searches"));
    if (!previous === null) {
        console.log("no searches")
    } else {
        lastSearches = previous;
    }
    console.log(lastSearches);
}

async function search(searchValue) {
    const requestOptions = {
        method: "GET",
        redirect: "follow",
    };

    const searchMovies = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=47521ec4cb0fc520db13de6730790654&language=en-US&page=1&include_adult=false&query=${searchValue}`,
        requestOptions
    );
    const resultsJson = await searchMovies.json();
    return resultsJson.results;
}

async function getVideos(movie) {
    const requestOptions = {
        method: "GET",
        redirect: "follow",
    };
    const movieId = movie.id;

    const videosData = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=47521ec4cb0fc520db13de6730790654&language=en-US`,
        requestOptions
    );
    const videosJson = await videosData.json();

    const videosArr = videosJson.results;
    let videoKey = "";

    for (i = videosArr.length - 1; i >= 0; i--) {
        if (videosJson.results[i].type === "Trailer") {
            videoKey = videosJson.results[i].key;
            break;
        }
    }

    let trailer = document.querySelector(".trailer");
    trailer.innerHTML = "";
    let frame = document.createElement("iframe");
    let youtubeURL = "https://www.youtube.com/embed/";
    frame.src = youtubeURL + videoKey;
    trailer.append(frame);
    trailer.style.transition = "1s";
    trailer.style.left = "43%";
}

async function fetchLang() {
    const requestOptions = {
        method: "GET",
        redirect: "follow",
    };

    const langData = await fetch(
        "https://api.themoviedb.org/3/configuration/languages?api_key=47521ec4cb0fc520db13de6730790654",
        requestOptions
    );
    const langJson = langData.json();
    return langJson;
}

// gets genre information
async function fetchGenres() {
    const requestOptions = {
        method: "GET",
        redirect: "follow",
    };

    const genreData = await fetch(
        "https://api.themoviedb.org/3/genre/movie/list?api_key=47521ec4cb0fc520db13de6730790654&language=en-US",
        requestOptions
    );
    const gen = await genreData.json();

    return gen;
}

//returns genres from ids
async function giveGenres(genrelist) {
    let idArr = genres;

    res = [];

    idArr.forEach((element) => {
        genrelist.forEach((genre_id) => {
            if (element.id === genre_id) {
                res.push(element.name);
            }
        });
    });

    let endVar = res.join(", ");

    return endVar;
}

//fetch to get movie data. returns JSON.
async function getMoviesData(pageNum) {
    const requestOptions = {
        method: "GET",
        redirect: "follow",
    };

    try {
        const res = await fetch(
            `https://api.themoviedb.org/3/movie/popular?api_key=47521ec4cb0fc520db13de6730790654&language=en-US&page=${pageNum}`,
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
    const rawMovies = await getMoviesData(fetchPage);
    const rawGenres = await fetchGenres();
    const rawLang = await fetchLang();

    languages = await rawLang;

    genres = await rawGenres.genres;

    movies = await rawMovies.results;
}

//function that gets recommended movies based on id
async function getRecommended(id) {
    const requestOptions = {
        method: "GET",
        redirect: "follow",
    };

    const fetched = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/similar?api_key=47521ec4cb0fc520db13de6730790654&language=en-US&page=1`,
        requestOptions
    );
    const response = await fetched.json();

    return response.results;
}

//gets img based on source and desired size
function getImg(source, size) {
    if (source === null) {
        return "";
    }
    let final = IMG_URL + size + source;
    return final;
}

function setStars(score) {
    if (score < 2) {
        return "./src/1star.svg";
    } else if (score < 4) {
        return "./src/2star.svg";
    } else if (score < 6) {
        return "./src/3stars.svg";
    } else if (score < 8) {
        return "./src/4stars.svg";
    } else {
        return "./src/5stars.svg";
    }
}

//shroten msg for card
function abridge(message, length) {
    if (message.length > length) {
        return message.slice(0, length) + " ...";
    } else {
        return message;
    }
}

//creates a card for the display
function createCard(lay, movie, position) {
    let title = movie.title;
    let desc = movie.overview;
    let img_path = movie.backdrop_path;

    // if no backdrop use poster
    if (img_path === null) {
        img_path = movie.poster_path;
    }

    desc = abridge(desc, 150);
    const cardPlace = "card" + position;
    const newCard = document.createElement("div");
    let starsSVG = setStars(movie.vote_average);

    let imgDone = getImg(img_path, "original");
    newCard.classList.add(cardPlace, lay, "cardItem");
    newCard.innerHTML = `
    <div class="backgroundpic"></div>
    <div class="gradient">
    <div class="watchcont">
    <h3>WATCH</h3>
    </div>
    <h2 id="_title">${title}</h2>
    <img alt="stars rating" class="starsImg" src="${starsSVG}"></img>
    <p id="${cardPlace}_desc">${desc}</span>
    </div>
    `;

    let backgroundpic = newCard.firstElementChild;
    backgroundpic.style.backgroundImage = `url("${imgDone}")`;
    let gradient = backgroundpic.nextElementSibling;
    let watchcont = gradient.firstElementChild;

    gradient.style.background =
        "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%)";
    watchcont.style.opacity = 0;

    // change fade and show watch when hover
    newCard.addEventListener("mouseenter", function () {
        gradient.style.background =
            "linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%)";
        watchcont.style.opacity = 1;
        backgroundpic.style.transition = "0.5s";
        backgroundpic.style.transform = "scale(1.2)";
    });
    // change fade and hide watch when hover out
    newCard.addEventListener("mouseleave", function () {
        gradient.style.background =
            "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%)";
        watchcont.style.opacity = 0;
        backgroundpic.style.transition = "0.5s";
        backgroundpic.style.transform = "scale(1)";
    });

    newCard.addEventListener("click", function () {
        setModal(movie);
    });

    return newCard;
}

// populates the modal
async function setModal(movie) {
    const modalMain = document.querySelector(".modal");
    const background = document.querySelector(".modal__top");
    const modaltitle = document.querySelector(".modal__title");
    const modaldesc = document.querySelector(".modal__desc");
    const modallanguage = document.querySelector("#modal_language");
    const modalrelease = document.querySelector("#modal_releasedate");
    const modalgenres = document.querySelector("#modal_genres");
    const modalpopularity = document.querySelector("#modal_popularity");
    const ofuscator = document.querySelector(".ofuscator");
    const trailer = document.querySelector(".trailer");
    const close = document.querySelector("#modal__close");
    const button = document.querySelector(".modal__buttoncont");
    const buttontext = document.createElement("button");
    const body = document.querySelector("body");

    body.style.overflow = "hidden";

    buttontext.classList = "modal__button_in";
    buttontext.innerHTML = "Play Trailer";

    button.append(buttontext);

    let trailerBool = false;

    // give trailer button functionality
    buttontext.addEventListener("click", function () {
        if (trailerBool === false) {
            trailerBool = true;
            buttontext.textContent = "Hide Trailer";
            getVideos(movie);
        } else {
            trailerBool = false;

            buttontext.textContent = "Play Trailer";
            trailer.style.transition = "1s";
            trailer.style.left = "543%";
            trailer.innerHTML = "";
        }
    });

    modaltitle.textContent = movie.title;
    modaldesc.textContent = movie.overview;

    //add background validation
    let imgModal = getImg(movie.backdrop_path, "original");

    let genres = await giveGenres(movie.genre_ids);
    modalgenres.textContent = genres;
    modalrelease.textContent = movie.release_date;

    // add language getter
    let lang = "";

    modallanguage.textContent = movie.original_language;

    modalpopularity.textContent = `${(movie.vote_average * 0.5).toFixed(
        2
    )} / 5`;
    modalMain.style.display = "flex";
    ofuscator.style.display = "block";
    background.style.backgroundImage = `linear-gradient(359.32deg, #111111 0.53%, rgba(17, 17, 17, 0) 114.52%),url("${imgModal}")`;

    // click on background closes modal
    ofuscator.addEventListener("click", function () {
        trailer.innerHTML = "";
        button.innerHTML = "";
        trailer.style.left = "543%";
        modalMain.style.display = "none";
        ofuscator.style.display = "none";
        body.style.overflow = "auto";
    });

    // click on cross closes modal
    close.addEventListener("click", function () {
        trailer.innerHTML = "";
        button.innerHTML = "";
        trailer.style.left = "543%";
        modalMain.style.display = "none";
        ofuscator.style.display = "none";
        body.style.overflow = "auto";
    });

    let recomMovies = await getRecommended(movie.id);
    let modalrecoms = document.querySelector(".modal__similarmovies");
    modalrecoms.innerHTML = ``;
    recomMovies = recomMovies.slice(0, 4);

    for (let i = 0; i < recomMovies.length; i++) {
        if (recomMovies[i].title === movie.title) {
            recomMovies.splice(i, 1);
        }
    }

    let recom1 = document.createElement("div");
    recom1.classList = ("modal__similarmovie", "similar1");
    let recom2 = document.createElement("div");
    recom2.classList = ("modal__similarmovie", "similar2");
    let recom3 = document.createElement("div");
    recom3.classList = ("modal__similarmovie", "similar3");
    modalrecoms.append(recom1, recom2, recom3);

    if (recomMovies != []) {
        if (recomMovies[0].backdrop_path !== null) {
            pic1 = getImg(recomMovies[0].backdrop_path, "w300");
        } else {
            pic1 = getImg(recomMovies[0].poster_path, "w300");
        }
        if (recomMovies[1].backdrop_path !== null) {
            pic2 = getImg(recomMovies[1].backdrop_path, "w300");
        } else {
            pic2 = getImg(recomMovies[1].poster_path, "w300");
        }
        if (recomMovies[2].backdrop_path !== null) {
            pic3 = getImg(recomMovies[2].backdrop_path, "w300");
        } else {
            pic3 = getImg(recomMovies[2].poster_path, "w300");
        }
        recom1.style.backgroundImage = `url("${pic1}")`;
        recom2.style.backgroundImage = `url("${pic2}")`;
        recom3.style.backgroundImage = `url("${pic3}")`;

        recom1.removeEventListener("click", setModal);
        recom1.addEventListener("click", function () {
            let trailer = document.querySelector(".trailer");
            trailer.innerHTML = "";
            button.innerHTML = "";
            trailer.style.left = "543%";
            setModal(recomMovies[0]);
        });
        recom2.addEventListener("click", function () {
            let trailer = document.querySelector(".trailer");
            button.innerHTML = "";
            trailer.innerHTML = "";
            trailer.style.left = "543%";
            setModal(recomMovies[1]);
        });
        recom3.addEventListener("click", function () {
            let trailer = document.querySelector(".trailer");
            button.innerHTML = "";
            trailer.innerHTML = "";
            trailer.style.left = "543%";
            setModal(recomMovies[2]);
        });
    }
}

//populates the title card
async function setMain(mainMovie) {
    let title = mainMovie.title;
    let desc = mainMovie.overview;
    const genresNames = await giveGenres(mainMovie.genre_ids);
    const cont = document.getElementById("frontcont");
    let starSVG = setStars(mainMovie.vote_averge);
    let newEl = document.createElement("div");
    newEl.innerHTML = `
    <p class="genre" id="preview_genre">${genresNames}</p>
    <img src="${starSVG}" alt="stars rating" class="starsImgMain"></img>
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

    const playButton = document.querySelector(".watchnow");

    playButton.addEventListener("click", function () {
        setModal(mainMovie);
    });
}

//populates the list
function createList(movieArr) {
    moviesToAdd.forEach((element) => {
        movieArr.unshift(element);
    });

    moviesToAdd = [];

    const recom = document.getElementById("recom");

    // takes out exceding movies for next call
    let leftover = movieArr.length % 3;

    if (leftover > 0) {
        let leftmovies = movieArr.splice(-leftover);

        leftmovies.forEach((element) => {
            moviesToAdd.push(element);
        });
    }

    // for every 3 entries, create a grid
    for (let i = 0; i < movieArr.length; i += 3) {
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
                    "card" + j + " = createCard(layout,movieArr[fakei], pos);"
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

    //change to horizontal layout
    menu1.addEventListener("click", function () {
        // set new layout
        layout = "horizontal";

        //get all cards and change class
        let cards = document.querySelectorAll(".card1,.card2,.card3");
        cards.forEach((card) => {
            card.classList.remove("vertical");
            card.classList.add("horizontal");
        });

        //gets background pics and changes classes
        let backgrounds = document.querySelectorAll(".backgroundpic");
        backgrounds.forEach((element) => {
            element.classList.remove("vertical");
            element.classList.add("horizontal");
        });

        //gets all grids and changes classes
        let conts = document.querySelectorAll(".cards");
        conts.forEach((array) => {
            array.classList.remove("vertical");
            array.classList.add("horizontal");
        });

        //gets skeleton loader and changes classes
        let loader = document.querySelector(".loader");
        let loaderItems = document.querySelectorAll(".loaderItem");
        loader.classList.remove("vertical");
        loader.classList.add("horizontal");

        loaderItems.forEach((item) => {
            item.classList.remove("vertical");
            item.classList.add("horizontal");
        });
    });

    //change to vertical layout
    menu3.addEventListener("click", function () {
        // set new layout
        layout = "vertical";

        //get all cards and change class
        let cards = document.querySelectorAll(".card1,.card2,.card3");
        cards.forEach((card) => {
            card.classList.remove("horizontal");
            card.classList.add("vertical");
        });

        //gets background pics and changes classes
        let backgrounds = document.querySelectorAll(".backgroundpic");
        backgrounds.forEach((element) => {
            element.classList.remove("horizontal");
            element.classList.add("vertical");
        });

        //gets all grids and changes classes
        let conts = document.querySelectorAll(".cards");
        conts.forEach((array) => {
            array.classList.remove("horizontal");
            array.classList.add("vertical");
        });

        //gets skeleton loader and changes classes
        let loader = document.querySelector(".loader");
        let loaderItems = document.querySelectorAll(".loaderItem");
        loader.classList.remove("horizontal");
        loader.classList.add("vertical");

        loaderItems.forEach((item) => {
            item.classList.remove("horizontal");
            item.classList.add("vertical");
        });
    });
}

// basic debounce function
function debounce(func, timeout = 1000) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func(...args);
        }, timeout);
    };
}

// manages the break between inputs and searches
const debounceSearch = debounce((text) => {
    lastSearches.unshift(text);
    let lastSearchesJSON = JSON.stringify(lastSearches);
    sessionStorage.setItem("searches", lastSearchesJSON);

    renderSearches()


    getSearchResults(text);
});

function renderSearches() {
    console.log("rendering searches");
    let searchesCont = document.querySelector(".searchesCont");
    let searchBar = document.querySelector("#searchfield")
    searchesCont.innerHTML = '';

    for (let i = 0; i < 3; i++){
        if (lastSearches[i].length === 0) {
            
        } else {
            console.log(lastSearches[i]);
            let search = document.createElement("p")
            search.textContent = lastSearches[i]

            search.addEventListener("click", function () {
                searchBar.value = lastSearches[i]
                getSearchResults(lastSearches[i])
            })
            searchesCont.append(search)
        }
    }
}


function renderResults(results, starting = 0) {
    const searchResults = document.querySelector(".searchResults");
    searchResults.innerHTML = "";

    if (results[starting] === undefined) {
        noResult(1);
    } else {
        placeSearchMovie(results[starting], 1);
    }

    if (results[starting + 1] === undefined) {
        noResult(2);
    } else {
        placeSearchMovie(results[starting + 1], 2);
    }

    if (results[starting + 2] === undefined) {
        noResult(3);
    } else {
        placeSearchMovie(results[starting + 2], 3);
    }

    if (results[starting + 3] === undefined) {
        noResult(4);
    } else {
        placeSearchMovie(results[starting + 3], 4);
    }
}

//manages the search results and populates them.
async function getSearchResults(querry) {
    const searchDropDown = document.querySelector(".searchDropdown");
    const closeButton = document.querySelector(".searchButton2");
    const upButton = document.querySelector(".searchButton1");
    const downButton = document.querySelector(".searchButton3");

    let pageByFour = 0;
    let results;

    // if querry emptied, hide dropdown
    if (querry.length === 0) {
        searchDropDown.style.display = "none";
    } else {
        results = await search(querry);

        renderResults(results);
        searchDropDown.style.display = "flex";
    }

    upButton.addEventListener("click", function () {
        if (pageByFour > 0) {
            pageByFour -= 4;

            renderResults(results, pageByFour);
        }
    });
    downButton.addEventListener("click", function () {
        pageByFour += 4;

        renderResults(results, pageByFour);
    });

    closeButton.addEventListener("click", function () {
        searchDropDown.style.display = "none";
        document.querySelector("#searchfield").value = "";
    });
}

//returns an empty search result
function noResult(position) {
    const searchResults = document.querySelector(".searchResults");
    let newResult = document.createElement("div");
    newResult.classList.add(`result${position}`, "searchResults__Item");
    newResult.innerHTML = `
    <div class="searchResults__ItemImg searchImg${position}"></div>
    <div class="searchResults__DataCont dataCont${position}">
        <div class="searchResults__ItemDettails">
            <div class="searchResults__ItemDettailCont">
                <h2 class="search_title">No Result</h2>
            </div>
        </div>
    </div>
    `;
    searchResults.append(newResult);
}

//populates one of 4 search results
async function placeSearchMovie(movie, position) {
    const searchResults = document.querySelector(".searchResults");
    let newResult = document.createElement("div");
    let imgURL = getImg(movie.backdrop_path, "w500");

    newResult.classList.add(`result${position}`, "searchResults__Item");

    newResult.innerHTML = `
    <div
        class="searchResults__ItemImg searchImg${position}"
        style="background-image: url(${imgURL})"
    ></div>
    <div class="searchResults__DataCont dataCont${position}">
        <div class="searchResults__ItemDettails">
            <div class="searchResults__ItemDettailCont">
                <h2 class="search_title">${movie.title}</h2>
            </div>
            <div class="searchResults__ItemDettailCont">
                <p class="search_subtitle">Genres:</p>
                <p>${await giveGenres(movie.genre_ids)}</p>
            </div>
            <div class="searchResults__ItemDettailCont">
                <p class="search_subtitle">Rating:</p>
                <p>${movie.vote_average}</p>
            </div>
        </div>
        <div class="searchResults__ItemDescritption">
            <p>
                ${abridge(movie.overview, 200)}
            </p>
        </div>
    </div>
    `;

    newResult.addEventListener("click", function () {
        setModal(movie);
    });

    searchResults.append(newResult);
}

window.onload = async () => {
    await createPage();
    createList(movies);
    getLastSearches();
    renderSearches();

    const skeleton = document.querySelector(".loadercont");
    const observer = new IntersectionObserver(async (entries) => {
        let isvisible = entries[0].isIntersecting;

        if (isvisible) {
            fetchPage++;

            const data = await getMoviesData(fetchPage);
            const newMovies = data.results;

            createList(newMovies);
        }
    });

    observer.observe(skeleton);

    const searchbar = document.querySelector("#searchfield");
    searchbar.addEventListener("keyup", (e) => {
        debounceSearch(e.target.value);
    });
};
