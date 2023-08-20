const menuContainer = document.querySelector(".header-container");

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
    const data = await _httpClient.get(endpoint, params);
    localStorage.setItem(cacheKey, JSON.stringify(data));
    return data;
  } catch (error) {
    handleErrors(error);
  }
};

const API = {
  getResults: async (nm) => {
    return getFromLocalStorageOrApi(
      _httpClient.ENDPOINT.autoComplete,
      { q: q_param },
      "results"
    );
  },
  getTopCast: async () => {
    return getFromLocalStorageOrApi(
      _httpClient.ENDPOINT.title.popularMovies,
      {
        homeCountry: "US",
        purchaseCountry: "US",
        currentCountry: "MX",
      },
      "topcast"
    );
  },
  getCoomingSoon: async () => {
    return getFromLocalStorageOrApi(
      _httpClient.ENDPOINT.title.coomingMovies,
      {},
      "cooming"
    );
  },
  getMovieDetails: async (movieId) => {
    const params = { tconst: movieId };
    return await getFromLocalStorageOrApi(
      _httpClient.ENDPOINT.title.movieDetails,
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

const mountListMoviesComponent = (element, movies) => {
  movies.forEach((item) => {
    const {
      image: { url },
      title,
      id,
      year,
      runningTimeInMinutes,
    } = item;

    const movieHTML = `
      <div class="img-movie__container">
        <div>
          <img src="${url}" alt="${title}" class="img-movie__ticket" />
        </div>
        <div>
          <div>
            <h3 class="img-movie__title">${title}, ${year}</h3>
            <p class="img-movie__text">${_helpers.formatDuration(
              runningTimeInMinutes
            )}</p>
            <a href="movie.html?id=${
              id.split("/")[2]
            }" class="img-movie__link">Información</a>
          </div>
        </div>
      </div>
    `;

    document.getElementById(element).insertAdjacentHTML("beforeend", movieHTML);
  });
};

menuContainer.addEventListener("click", async (event) => {
  if (event.target.classList.contains("header-menu__link")) {
    const dataTriggerValue = event.target.getAttribute("data-trigger");
    try {
      const listMovies = await LoadMovie(dataTriggerValue);
      mountListMoviesComponent("componentListMovies", listMovies);
    } catch (error) {
      console.error(error);
    }
  }
});

async function LoadMovie(type = "cooming") {
  try {
    const list =
      type === "top100" ? await API.getTopCast() : await API.getCoomingSoon();
    const movies = await loadMoviesPosters(list, 9);
    return movies;
  } catch (error) {
    handleErrors(error);
  }
}

LoadMovie("cooming")
  .then(($listMovies) => {
    mountListMoviesComponent("componentListMovies", $listMovies);
  })
  .catch((error) => {
    console.error(error);
  });
