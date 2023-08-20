const menuContainer = document.querySelector(".header-container");

const loadMoviesPosters = async (list, size) => {
  const listMovies = await Promise.all(
    list.slice(0, size).map(async (e) => {
      const id = e.id.split("/")[2];
      const movie = await _movieService.getMovieDetails(id);
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

menuContainer.addEventListener("click", async (event) => {
  if (event.target.classList.contains("header-menu__link")) {
    const dataTriggerValue = event.target.getAttribute("data-trigger");
    try {
      const listMovies = await LoadMovie(dataTriggerValue);
      _components.mountListMoviesComponent("componentListMovies", listMovies);
    } catch (error) {
      _helpers.handleErrors(error);
    }
  }
});

async function LoadMovie(type = "cooming") {
  try {
    const list =
      type === "top100"
        ? await _movieService.getTopCast()
        : await _movieService.getCoomingSoon();
    const movies = await loadMoviesPosters(list, 9);
    return movies;
  } catch (error) {
    _helpers.handleErrors(error);
  }
}

LoadMovie("cooming")
  .then(($listMovies) => {
    _components.mountListMoviesComponent("componentListMovies", $listMovies);
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
    items = await _movieService.autoComplete(searchTerm);
    searchCache.set(searchTerm, items);
    result = cachedResult;
  }

  _components.mountListAutocomplete("searchListComponent", items);
};

input.addEventListener("input", () => {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(doneTyping, doneTypingInterval);
});
