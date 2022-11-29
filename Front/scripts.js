/* API key = 47521ec4cb0fc520db13de6730790654 */
let movies = []

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

function getImg(source, size) {
    if (source === null) {
        return ""
    }
    const IMG_URL = 'https://image.tmdb.org/t/p/';
    let final = IMG_URL + size + source;
    return final;
}


function createCard(title, desc, position, img_path) {
    console.log(`creating card ${position}`)
    desc = abridge(desc)
    const cardPlace = 'card' + position;
    const newCard = document.createElement('div');
    let imgDone = getImg(img_path, "original")
    newCard.style.backgroundImage = `URL(${imgDone})`
    newCard.classList.add(cardPlace, 'vertical');
    newCard.innerHTML = `
    <h2 id="_title">${title}</h2>
    <p id="${cardPlace}_desc">${desc}</span>
    `

    return newCard;
}

function giveGenres(genrelist) {
    console.log('seting genres');
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

function abridge(message) {
    if (message.length > 84) {
      return message.slice(0,84) + " ...";
    } else {
      return message
    }
  }

const getMoviesData = async () => {
    const requestOptions = {
        method: "GET",
        redirect: "follow",
    };
    
    try {
        const res = await fetch(
            "https://api.themoviedb.org/3/movie/popular?api_key=47521ec4cb0fc520db13de6730790654&language=en-US&page=1/",
            requestOptions
        );
        const data = await res.json();

        return data
        
    } catch (error) {
        console.log(error)
    }
};

const setMovies = async () => {
    console.log('asingnig value to movies');
    const raw = await getMoviesData();
    
    movies = await raw.results;
    console.log('data assigned');
    return movies;
}

function setMain() {
    console.log('setting main movie');
    let mainMovie = movies[0];
    let title = mainMovie.original_title;
    let desc = mainMovie.overview;
    let genres = giveGenres(mainMovie.genre_ids).join(', ');
    const cont = document.getElementById('frontcont');
    let newEl = document.createElement('div');
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
    
    let background = document.getElementById('frontpreview')
    let img = getImg(mainMovie.backdrop_path, "original")
    background.style.backgroundImage = `URL(${img})`
}

const createList = async () => {
    console.log('starting create list');
    movies = await setMovies();
    console.log('data in create list');
    const recom = document.getElementById("recom")
    const menu3 = document.getElementById("menu3");
    const menu1 = document.getElementById("menu1");
    
    console.log(movies);
    console.log(movies.length)
    setMain();

    let count = 0

    for (i = 1; i < movies.length; i += 3){
        let pos = 1
        let plusGrid = document.createElement("div");
        plusGrid.classList.add("cards", "vertical");
        

        console.log(i)
        if (movies[i] != undefined) {
            var card1 = createCard(movies[i].original_title, movies[i].overview, pos, movies[i].backdrop_path);
        } else {
            console.log('skipping empty');
        };
        console.log(i + 1);
        if (movies[i + 1] != undefined) {
            var card2 = createCard(movies[i + 1].original_title, movies[i + 1].overview, pos + 1, movies[i + 1].backdrop_path);
        } else {
            console.log('skipping empty');
        };
        console.log(i + 2);
        if (movies[i + 2] != undefined) {
            var card3 = createCard(movies[i + 2].original_title, movies[i + 2].overview, pos + 2, movies[i + 2].backdrop_path);
        } else {
            console.log('skipping empty');
        };
        
        plusGrid.append(card1, card2, card3);
        console.log(plusGrid)
        recom.append(plusGrid)
        console.log(count)
        count++
    }
    console.log(count)

    menu1.addEventListener("click", function () {
        cont.classList.remove("vertical");
        cont.classList.add("horizontal");
        card1.classList.remove("vertical");
        card1.classList.add("horizontal");
        card2.classList.remove("vertical");
        card2.classList.add("horizontal");
        card3.classList.remove("vertical");
        card3.classList.add("horizontal");
    });
    menu3.addEventListener("click", function () {
        cont.classList.remove("horizontal");
        cont.classList.add("vertical");
        card1.classList.remove("horizontal");
        card1.classList.add("vertical");
        card2.classList.remove("horizontal");
        card2.classList.add("vertical");
        card3.classList.remove("horizontal");
        card3.classList.add("vertical");
    });
    
    console.log(card1);
}

window.onload = () => {
    const authKey = localStorage.getItem('auth')
    console.log(authKey)
    if (authKey === null) {
        window.location.href = '../Login/index.html'
    }
    createList()
}

