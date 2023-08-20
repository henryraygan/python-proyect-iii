const _components = (() => {
  const components = {};

  components.mountHeaderComponent = (element, urlImage, alt = "") => {
    document.getElementById(
      element
    ).innerHTML = `<img class="movie-header__background"
    src="${urlImage}"
    alt="${alt}" loading="lazy">`;
  };

  components.mountCastListComponent = (element, cast) => {
    const el = document.getElementById(element);
    if (!cast || !Array.isArray(cast) || cast.length === 0) {
      return `<div class="movie-cast" id="castComponent">
                <h3 class="movie-description__subtitle">Cast</h3>
                <p>No cast information available.</p>
              </div>`;
    }

    const castHTML = cast
      .map(
        (actor) => `
      <div class="cast">
          <img class="cast-photo" src="${
            actor.image || "./assets/images/no-image.webp"
          }" alt="${actor.name}" loading="lazy">
          <p class="cast-name-actor">${actor.name}</p> as
          <span class="cast-name-character">${actor.character}</span>
      </div>`
      )
      .join("");

    el.innerHTML = `<div class="movie-cast" id="castComponent">
    <h3 class="movie-description__subtitle">Cast</h3>
    <div class="cast-list">${castHTML}</div>
  </div>`;
  };

  components.mountPosterComponent = (element, image, alt = "") => {
    document.getElementById(
      element
    ).innerHTML = `<img class="poster-image" src="${image}" alt="${alt}" loading="lazy">`;
  };

  components.mountDescriptionComponent = (
    element,
    {
      rating,
      certificate,
      description,
      authors: { director, writer },
      duration,
    }
  ) => {
    let html = "";
    if (certificate) {
      html += `
        <div class="movie-description__extra">
          <span class="movie-clasification">${certificate}</span>`;
      if (rating) {
        html += `
          <span class="movie-rating">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                class="ipc-icon ipc-icon--star sc-bde20123-4 ggvDm" viewBox="0 0 24 24"
                fill="currentColor" role="presentation">
                <path
                    d="M12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72 3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z">
                </path>
            </svg>
            ${rating} / 10
          </span>`;
      }
      html += `
        </div>`;
    }

    // Add director, writer, and duration if available
    if (director || writer || duration) {
      html += `
        <p id="authorComponent" class="movie-credits">`;
      if (director) {
        html += `
          <span>Director: <strong>${director}</strong></span><br>`;
      }
      if (writer) {
        html += `
          <span>Writer: <strong>${writer}</strong></span><br>`;
      }
      if (duration) {
        html += `
          <span>Duration: <strong>${duration}</strong></span>`;
      }
      html += `
        </p>`;
    }

    // Add description if available
    if (description) {
      html += `
        <p class="movie-paragraph">${description}</p>`;
    }

    document.getElementById(element).innerHTML = html;
  };

  components.mountHeadingComponent = (element, { title, year }) => {
    document.getElementById(
      element
    ).innerHTML = `<h1 class="movie-description__title">
    ${title} (${year})
  </h1>`;
  };

  components.mountVideoComponent = (element, video) => {
    const { cover, mimeType, playUrl } = video;

    document.getElementById(element).innerHTML = `
    <h3 class="movie-description__subtitle">Trailer</h3>
    <video
      class="video-trailer"
      controls
      preload="auto"
      poster="${cover}"
    >
      <source src="${playUrl}" type="${mimeType}" />
    </video>`;
  };

  components.mountListMoviesComponent = (element, movies) => {
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
        titleInfo += `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
        class="ipc-icon ipc-icon--star sc-bde20123-4 ggvDm" viewBox="0 0 24 24"
        fill="currentColor" role="presentation">
        <path
            d="M12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72 3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z">
        </path>
    </svg> ${chartRating}`;
      } else {
        titleInfo += `, ${year}`;
      }
      const movieHTML = `
        <div class="img-movie__container">
          <div>
            <img src="${url}" alt="${title}" class="img-movie__ticket"  loading="lazy"/>
          </div>
          <div class="img-movie__wrap">
            <div>
              <h3 class="img-movie__title">
               ${titleInfo}
              </h3>
              <p class="img-movie__text">
              ${_helpers.formatDuration(runningTimeInMinutes)}</p>
              <a href="movie.html?id=${
                id.split("/")[2]
              }" class="img-movie__link"><span class="icon-span"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="ipc-icon ipc-icon--play-arrow ipc-btn__icon ipc-btn__icon--pre" viewBox="0 0 24 24" fill="currentColor" role="presentation"><path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18a1 1 0 0 0 0-1.69L9.54 5.98A.998.998 0 0 0 8 6.82z" class="icon-img"></path></svg></span>Información</a>
            </div>
          </div>
        </div>
      `;
      document
        .getElementById(element)
        .insertAdjacentHTML("beforeend", movieHTML);
    });
  };

  components.mountListAutocomplete = (element, inputRef, items) => {
    const { d } = items;
    const containerResults = document.getElementById(element);
    const input = document.getElementById(inputRef);

    input.addEventListener("focus", () => {
      containerResults.classList.add("open");
    });

    const movieItems = d.filter((item) => item.qid === "movie");

    if (movieItems.length === 0) {
      containerResults.innerHTML = "No se encontraron películas.";
      return;
    }

    containerResults.classList.add("open");
    movieItems.forEach(({ i: imageUrl, l, s, y, id }) => {
      containerResults.innerHTML += `<li>
      <a href="movie.html?id=${id}">
      <div class="search-list-results__item">
      <img class="search-list-results__poster"
          src="${imageUrl.imageUrl}"
          alt="${l}">
        <span>
          <h2>${l}</h2>
          <p class="search-list-results__label">${s}, ${y}</p>
        </span>
      </div>
      </a>
    </li>`;
    });
  };

  components.mountListGenres = (element, items) => {
    items.forEach((item) => {
      document.getElementById(
        element
      ).innerHTML += `<p class="genre-item">${item}</p>`;
    });
  };
  components.showLoadingBar = () => {
    const loadingBar = document.getElementById("loadingBar");
    loadingBar.style.width = "0";
    loadingBar.style.opacity = "1";
  };

  components.hideLoadingBar = () => {
    const loadingBar = document.getElementById("loadingBar");
    loadingBar.style.width = "100%";
    loadingBar.style.opacity = "0";
  };

  return components;
})();
