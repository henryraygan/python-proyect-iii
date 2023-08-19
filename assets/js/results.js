const RESOURCE_ENDPOINT = "/title";
const ENDPOINT_API = {
  autoComplete: "/auto-complete",
  popularMovies: `${RESOURCE_ENDPOINT}/get-top-rated-movies`,
  movieDetails: `${RESOURCE_ENDPOINT}/get-details`,
};
const urlParams = new URLSearchParams(window.location.search);
const q_param = urlParams.get("q");
const movieshtml = document.getElementById("rmovies");

const handleErrors = (error) => {
  console.error("An error occurred:", error);
};

const getFromLocalStorageOrApi = async (endpoint, params, cacheType) => {
  const cacheKey = JSON.stringify(params) + cacheType;

  const cachedData = localStorage.getItem(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  try {
    const data = await _http.get(endpoint, params);
    localStorage.setItem(cacheKey, JSON.stringify(data));
    return data;
  } catch (error) {
    handleErrors(error);
  }
};

const API = {
  getResults: async (nm) => {
    return getFromLocalStorageOrApi(
      ENDPOINT_API.autoComplete,
      { q: q_param },
      "results"
    );
  },
  getTopCast: async () => {
    return getFromLocalStorageOrApi(
      ENDPOINT_API.popularMovies,
      {
        homeCountry: "US",
        purchaseCountry: "US",
        currentCountry: "MX",
      },
      "results"
    );
  },
};

async function LoadMovie() {
  try {
    const topCast = await API.getTopCast();

    const moviesArray = [];
    for (let index = 0; index < 10; index++) {
      const element = topCast[index];
      const movieId = element.id.split("/")[2];
      let movieDetails = getDetailsFromCacheOrLocalStorage(movieId);

      if (!movieDetails) {
        movieDetails = await getMovieDetails(movieId);
        localStorage.setItem(movieId, JSON.stringify(movieDetails));
      }

      moviesArray.push(movieDetails);
    }

    return {
      topCast,
      moviesArray,
    };
  } catch (error) {
    handleErrors(error);
  }
}

LoadMovie()
  .then(($result) => {
    console.log($result);

    const moviesArray = $result.moviesArray;

    moviesArray.forEach((movie) => {
      const movieHtml = makeMovie(movie);
      movieshtml.innerHTML += movieHtml;
    });
  })
  .catch((error) => {
    console.error(error);
  });

const getMovieDetails = async (movieId) => {
  const params = { tconst: movieId };
  return await _http.get(ENDPOINT_API.movieDetails, params);
};

const getDetailsFromCacheOrLocalStorage = (movieId) => {
  const cachedDetails = localStorage.getItem(movieId);
  if (cachedDetails) {
    return JSON.parse(cachedDetails);
  }
  return null;
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
