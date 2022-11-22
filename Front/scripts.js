/* API key = 47521ec4cb0fc520db13de6730790654 */
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

let movies = [];

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
    desc = abridge(desc)
    const cardPlace = 'card' + position;
    const newCard = document.createElement('div');
    let imgDone = IMG_URL + img_path
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

var requestOptions = {
    method: "GET",
    redirect: "follow",
};

function abridge(message){
    if (message.length > 84) {
      return message.slice(0,84) + " ...";
    } else {
      return message
    }
  }

const getMoviesData = async () => {
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
    const raw = await getMoviesData();

    movies = await raw.results;
}

const createList = async () => {
    await setMovies();
    var cont = document.getElementById("cont");
    var menu3 = document.getElementById("menu3");
    var menu1 = document.getElementById("menu1");

    console.log(movies);

    let card1 = createCard(movies[1].original_title, movies[1].overview, 1, movies[1].poster_path)
    let card2 = createCard(movies[2].original_title, movies[2].overview, 2, movies[2].poster_path)
    let card3 = createCard(movies[3].original_title, movies[3].overview, 3, movies[3].poster_path)



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
}

createList()


window.onload = function () {
    let fronttitle = document.getElementById("preview_title");
    let frontdesc = document.getElementById("preview_desc");
    let frontgenre = document.getElementById("preview_genre");
    
    //Front page movie
    fronttitle.innerHTML = movies[0].original_title;

    frontdesc.innerHTML = movies[0].overview;
    
    frontgenre.innerHTML = giveGenres(movies[0].genre_ids).join(", ")

};


