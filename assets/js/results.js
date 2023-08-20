const menuContainer = document.querySelector(".header-container");

const API = {
  autoComplete: async (nm) => {
    return _httpClient.cache(
      _httpClient.ENDPOINT.autoComplete,
      { q: nm },
      "results"
    );
  },
  getTopCast: async () => {
    return _httpClient.cache(
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
    return _httpClient.cache(
      _httpClient.ENDPOINT.title.coomingMovies,
      {},
      "cooming"
    );
  },
  getMovieDetails: async (movieId) => {
    const params = { tconst: movieId };
    return await _httpClient.cache(
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
      if (e?.chartRating) {
        movie.chartRating = e.chartRating;
      }
      if (e?.releaseDate) {
        movie.releaseDate = e.releaseDate;
      }
      return movie;
    })
  );
  return listMovies;
};

const mountListMoviesComponent = (element, movies) => {
  document.getElementById(element).innerHTML = "";
  movies.forEach((item) => {
    const {
      image: { url },
      title,
      id,
      releaseDate,
      chartRating,
      year,
      runningTimeInMinutes,
    } = item;
    let titleInfo = title;
    if (releaseDate) {
      titleInfo += `, ${_helpers.formatDate(releaseDate)}`;
    } else if (chartRating) {
      titleInfo += `, ${chartRating}`;
    } else {
      titleInfo += `, ${year}`;
    }
    const movieHTML = `
      <div class="img-movie__container">
        <div>
          <img src="${url}" alt="${title}" class="img-movie__ticket"  loading="lazy"/>
        </div>
        <div>
          <div>
            <h3 class="img-movie__title">
             ${titleInfo}
            </h3>
            <p class="img-movie__text">
            ${_helpers.formatDuration(runningTimeInMinutes)}</p>
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

const mountListAutocomplete = (element, items) => {
  const { d } = items;
  const u = document.getElementById(element);

  // Filtrar elementos con qid igual a "movie"
  const movieItems = d.filter((item) => item.qid === "movie");

  if (movieItems.length === 0) {
    u.innerHTML = "No se encontraron películas.";
    return;
  }

  movieItems.forEach(({ i: imageUrl, s, y, id }) => {
    u.innerHTML += `<li class="search-list-results__item">
    <a href="movie.html?id=${id}">
      <img class="search-list-results__poster"
        src="${imageUrl.imageUrl}"
        alt="">
      <p class="search-list-results__label">
        ${s}, ${y}
      </p>
    </a>
  </li>`;
  });
};

menuContainer.addEventListener("click", async (event) => {
  if (event.target.classList.contains("header-menu__link")) {
    const dataTriggerValue = event.target.getAttribute("data-trigger");
    try {
      const listMovies = await LoadMovie(dataTriggerValue);
      mountListMoviesComponent("componentListMovies", listMovies);
    } catch (error) {
      _helpers.handleErrors(error);
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
    _helpers.handleErrors(error);
  }
}

LoadMovie("cooming")
  .then(($listMovies) => {
    mountListMoviesComponent("componentListMovies", $listMovies);
  })
  .catch((error) => {
    _helpers.handleErrors(error);
  });

const searchCache = {
  data: {},
  get: (key) => searchCache.data[key],
  set: (key, value) => {
    searchCache.data[key] = value;
    localStorage.setItem("searchCache", JSON.stringify(searchCache.data));
  },
  init: () => {
    const cachedData = localStorage.getItem("searchCache");
    if (cachedData) {
      searchCache.data = JSON.parse(cachedData);
    }
  },
};

searchCache.init();

const input = document.getElementById("inputSearch");
const message = document.getElementById("searchListComponent");
let typingTimer;
const doneTypingInterval = 1000;

const doneTyping = async () => {
  let items = [];

  const searchTerm = input.value;
  const cachedResult = searchCache.get(searchTerm);

  if (cachedResult) {
    items = cachedResult;
  } else {
    items = await API.autoComplete(searchTerm);
    searchCache.set(searchTerm, items);
    result = cachedResult;
  }

  mountListAutocomplete("searchListComponent", items);
};

input.addEventListener("input", () => {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(doneTyping, doneTypingInterval);
});
