/* API key = 47521ec4cb0fc520db13de6730790654 */

function getImg(source, size) {
    const IMG_URL = 'https://image.tmdb.org/t/p/';
    let final = IMG_URL + size + source;
    return final;
}

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

function createCard(title, desc, position, img_path) {
    console.log(`creating card ${position}`)
    desc = abridge(desc)
    const cardPlace = 'card' + position;
    const newCard = document.createElement('div');
    let imgDone = getImg(img_path, "original")
    console.log(imgDone);
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
    console.log('shortening msg');
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

const setMovies = async () => {
    console.log('asingnig value to movies');
    const raw = await getMoviesData();
    
    movies = await raw.results;
    console.log('data assigned');
    return movies;
}
const createList = async () => {
    console.log('starting create list');
    movies = await setMovies();
    console.log('data in create list');
    const cont = document.getElementById("cont");
    const menu3 = document.getElementById("menu3");
    const menu1 = document.getElementById("menu1");

    console.log(movies);

    let card1 = createCard(movies[1].original_title, movies[1].overview, 1, movies[1].backdrop_path)
    let card2 = createCard(movies[2].original_title, movies[2].overview, 2, movies[2].backdrop_path)
    let card3 = createCard(movies[3].original_title, movies[3].overview, 3, movies[3].backdrop_path)

    cont.append(card1);
    cont.append(card2);
    cont.append(card3);
    
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
    setMain();
}

window.onload = () => {
    const authKey = localStorage.getItem('auth')
    console.log(authKey)
    if (authKey === null) {
        window.location.href = '../Login/index.html'
    }
    createList()
}

