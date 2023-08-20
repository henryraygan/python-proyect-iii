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

    // Add movie classification and rating if available
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
    <video
      class="video-js vjs-theme-city"
      controls
      preload="auto"
      width="640"
      height="264"
      poster="${cover}"
      data-setup="{}"
    >
      <source src="${playUrl}" type="${mimeType}" />
      <p class="vjs-no-js">
        To view this video please enable JavaScript, and consider upgrading to a
        web browser that
        <a href="https://videojs.com/html5-video-support/" target="_blank"
          >supports HTML5 video</a
        >
      </p>
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
      document
        .getElementById(element)
        .insertAdjacentHTML("beforeend", movieHTML);
    });
  };

  components.mountListAutocomplete = (element, items) => {
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

  return components;
})();
