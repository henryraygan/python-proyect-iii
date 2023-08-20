const RESOURCE_ENDPOINT = "/title";
const ENDPOINT_API = {
  autoComplete: "/auto-complete",
  coomingMovies: `${RESOURCE_ENDPOINT}/get-coming-soon-movies`,
  popularMovies: `${RESOURCE_ENDPOINT}/get-top-rated-movies`,
  movieDetails: `${RESOURCE_ENDPOINT}/get-details`,
};
const urlParams = new URLSearchParams(window.location.search);
const q_param = urlParams.get("list");
const movieshtml = document.getElementById("rmovies");

const handleErrors = (error) => {
  console.error("An error occurred:", error);
};

const formatDuration = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
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

const getDetailsFromCacheOrLocalStorage = (movieId) => {
  const cachedDetails = localStorage.getItem(movieId);
  if (cachedDetails) {
    return JSON.parse(cachedDetails);
  }
  return null;
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
      "topcast"
    );
  },
  getCoomingSoon: async () => {
    return getFromLocalStorageOrApi(ENDPOINT_API.coomingMovies, {}, "cooming");
  },
  getMovieDetails: async (movieId) => {
    const params = { tconst: movieId };
    return await getFromLocalStorageOrApi(
      ENDPOINT_API.movieDetails,
      params,
      "moviedetail"
    );
  },
};

const loadMoviesPosters = async (list, size) => {
  const listMovies = await Promise.all(
    list.slice(0, size).map(async (e) => {
      const id = e.id.split("/")[2];
      const movie = await API.getMovieDetails(id);
      return movie;
    })
  );
  return listMovies;
};

async function LoadMovie(type = "cooming") {
  try {
    const list =
      type === "top100" ? await getTopCast : await API.getCoomingSoon();
    const movies = await loadMoviesPosters(list, 9);
    return movies;
  } catch (error) {
    handleErrors(error);
  }
}

LoadMovie()
  .then(($listMovies) => {
    mountListMoviesComponent("componentListMovies", $listMovies);
  })
  .catch((error) => {
    console.error(error);
  });

const mountListMoviesComponent = (element, movies) => {
  console.log(movies);
  movies.forEach((item) => {
    const {
      image: { url },
      title,
      id,
      year,
      runningTimeInMinutes,
    } = item;

    document.getElementById(element).innerHTML += `
    <div class="img-movie__container">
  <div>
    <img
      src="${url}"
      alt="${title}"
      class="img-movie__ticket"
    />
  </div>
  <div>
    <div>
      <h3 class="img-movie__title">${title}, ${year}</h3>
      <p class="img-movie__text">${formatDuration(runningTimeInMinutes)}</p>
      <a href="movie.html?id=${
        id.split("/")[2]
      }" class="img-movie__link">Información</a>
    </div>
  </div>
</div>`;
  });
};
