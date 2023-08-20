const menuContainer = document.querySelector(".header-container");

const loadMoviesPosters = async (list, size) => {
  console.log(list);
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

document.addEventListener("DOMContentLoaded", () => {
  LoadMovie("cooming")
    .then(($listMovies) => {
      _components.mountListMoviesComponent("componentListMovies", $listMovies);
    })
    .catch((error) => {
      _helpers.handleErrors(error);
    });
});
