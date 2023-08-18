const API_ENDPOINT = {
  autoComplete: "/auto-complete",
  popularMovies: "/title/get-top-rated-movies",
  movieDetails: "/title/get-details",
};
const urlParams = new URLSearchParams(window.location.search);
const q_param = urlParams.get("q");
const movieshtml = document.getElementById("rmovies");

const getResults = async () => {
  const data = { q: q_param };
  try {
    const response = await _http.get("/auto-complete", data);
    const { d } = response;
    for (let i = 1; i < d.length; i++) {
      movieshtml.innerHTML += makeActor(d[i]);
    }
  } catch (error) {
    console.error("Error on =>", error);
  }
};

const makeActor = (actor) => {
  const { i, id, l, s } = actor;
  return `<div class="img-movie__container">
  <div>
    <img
      src="${i.imageUrl}"
      alt=""
      class="img-movie__ticket"
    />
  </div>
  <div>
    <div>
      <h3 class="img-movie__title">${l}</h3>
      <p class="img-movie__text">${s}</p>
      <a href="actor.html?id=${id}" class="img-movie__link">Información</a>
    </div>
  </div>
</div>`;
};

const makeMovie = (movie) => {
  const { image, title, id, year } = movie;
  let newId = id.split("/")[2];

  return `<div class="img-movie__container">
  <div>
    <img
      src="${image.url}"
      alt=""
      class="img-movie__ticket"
    />
  </div>
  <div>
    <div>
      <h3 class="img-movie__title">${title}</h3>
      <p class="img-movie__text"> ${year}</p>
      <a href="movie.html?id=${newId}" class="img-movie__link">Información</a>
    </div>
  </div>
</div>`;
};

const getTopCast = async () => {
  try {
    const data = {
      homeCountry: "US",
      purchaseCountry: "US",
      currentCountry: "MX",
    };

    const response = await _http.get(API_ENDPOINT.popularMovies, data);
    if (response) {
      const moviesArray = await getDetails(response, 9);
      movieshtml.innerHTML = "";
      moviesArray.forEach((element) => {
        movieshtml.innerHTML += makeMovie(element);
      });
    }
  } catch (error) {
    console.error("Error on =>", error);
  }
};

const getDetails = async (elements, quantity) => {
  const moviesArray = [];
  for (let index = 0; index < quantity; index++) {
    const element = elements[index];
    const params = { tconst: element.id.split("/")[2] };
    const movie = await _http.get(API_ENDPOINT.movieDetails, params);
    if (movie) {
      moviesArray.push(movie);
    }
  }
  return moviesArray;
};

// if (q_param) {
//   getResults();
// } else {
//   getTopCast();
// }
