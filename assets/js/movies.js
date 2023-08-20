const URL_PARAMS = new URLSearchParams(window.location.search);
const _tconst = URL_PARAMS.get("id");

const getAuthors = (crew) => {
  if (!crew) {
    return {
      writer: null,
      director: null,
    };
  }

  const { writer, director } = crew;

  const writerName = writer && writer.length > 0 ? writer[0].name : null;
  const directorName =
    director && director.length > 0 ? director[0].name : null;

  return {
    writer: writerName,
    director: directorName,
  };
};

const getMainCast = (cast) => {
  if (!cast) {
    return {};
  }
  return cast.slice(0, 9).map(({ name, characters, image }) => ({
    name,
    image: image?.url || "",
    character: characters?.[0] || "N/A",
  }));
};

const getInfoCredits = (credits) => {
  if (!credits) {
    return {};
  }
  const { cast, crew } = credits;
  return {
    cast: getMainCast(cast) || null,
    authors: getAuthors(crew) || null,
  };
};

const getMovieData = (movieData) => {
  const {
    title: {
      title = null,
      image: { url } = {},
      year = null,
      runningTimeInMinutes: duration = null,
    } = {},
    certificates: { US: [{ certificate } = {}] = [] } = {},
    ratings: { rating } = {},
    genres = [],
    plotOutline: { text } = {},
  } = movieData;

  return {
    title,
    year,
    image: url || "",
    certificate: certificate || null,
    rating: rating || null,
    genres,
    duration: _helpers.formatDuration(duration),
    description: text || "",
  };
};

const getCoverMovie = (vi) => {
  const { heroImages } = vi;
  if (heroImages.length === 0) {
    return "./assets/images/no-cover.jpg";
  }
  const randomPosition = Math.floor(Math.random() * heroImages.length);
  return heroImages[randomPosition]?.url || "./assets/images/no-cover.jpg";
};

const getTopVideo = async (videos) => {
  const { topVideos } = videos;
  const urlVideo = await API.getVideosLinks(topVideos[0].id.split("/")[2]);
  const { definition, mimeType, playUrl } = getHighestQualityVideo(
    urlVideo.resource.encodings
  );
  return {
    cover: topVideos[0].image.url,
    definition,
    mimeType,
    playUrl,
  };
};

const getHighestQualityVideo = (videoArray) => {
  let highestQualityVideo = null;

  for (const video of videoArray) {
    if (video.mimeType === "video/mp4") {
      const definition = video.definition.split("p")[0];
      const definitionValue = isNaN(definition)
        ? definition === "SD"
          ? 480
          : definition === "HD"
          ? 720
          : 1080
        : parseInt(definition);

      if (
        !highestQualityVideo ||
        definitionValue > highestQualityVideo.definition
      ) {
        highestQualityVideo = video;
      }
    }
  }

  return highestQualityVideo;
};

const API = {
  getMovie: async (nm) => {
    return _httpClient.cache(
      _httpClient.ENDPOINT.title.overview_details,
      { tconst: nm },
      "movie"
    );
  },
  getMovieCredits: async (nm) => {
    return _httpClient.cache(
      _httpClient.ENDPOINT.title.full_credits,
      { tconst: nm },
      "credits"
    );
  },
  getMovieVideos: async (nm) => {
    return _httpClient.cache(
      _httpClient.ENDPOINT.title.movie_videos,
      {
        tconst: nm,
        currentCountry: "US",
        purchaseCountry: "US",
      },
      "movieVideos"
    );
  },
  getVideosLinks: async (vi_id) => {
    try {
      return _httpClient.cache(
        _httpClient.ENDPOINT.title.video,
        { viconst: vi_id },
        "videoLinks"
      );
    } catch (error) {
      _helpers.handleErrors(error);
    }
  },
};

async function LoadMovie() {
  try {
    const full_movie = await API.getMovie(_tconst);
    const credits = await API.getMovieCredits(_tconst);
    const videos = await API.getMovieVideos(_tconst);
    const topVideo = await getTopVideo(videos);
    const cover = getCoverMovie(videos);
    const { authors, cast } = getInfoCredits(credits);

    const {
      title,
      year,
      image,
      certificate,
      rating,
      genres,
      duration,
      description,
    } = getMovieData(full_movie);

    return {
      title,
      year,
      image,
      certificate,
      rating,
      genres,
      duration,
      description,
      authors,
      cover,
      cast,
      video: topVideo,
    };
  } catch (error) {
    _helpers.handleErrors(error);
  }
}

LoadMovie()
  .then(($movie) => {
    const {
      title,
      certificate,
      duration,
      description,
      genres,
      image,
      rating,
      year,
      authors,
      cover,
      cast,
      video,
    } = $movie;

    document.title = title;

    mountHeaderComponent("headerComponent", cover);
    mountHeadingComponent("movieHeadComponent", { title, year });
    mountCastListComponent("castComponent", cast);
    mountPosterComponent("posterComponent", image);
    mountVideoComponent("videoComponent", video);
    mountDescriptionComponent("descriptionComponent", {
      rating,
      certificate,
      authors,
      duration,
      description,
    });
  })
  .catch((error) => {
    _helpers.handleErrors(error);
  });

const mountHeaderComponent = (element, urlImage, alt = "") => {
  document.getElementById(
    element
  ).innerHTML = `<img class="movie-header__background"
  src="${urlImage}"
  alt="${alt}" loading="lazy">`;
};

const mountCastListComponent = (element, cast) => {
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

const mountPosterComponent = (element, image, alt = "") => {
  document.getElementById(element).innerHTML = `
    <img class="poster-image" src="${image}" alt="${alt}" loading="lazy">`;
};

const mountDescriptionComponent = (
  element,
  { rating, certificate, description, authors: { director, writer }, duration }
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

const mountHeadingComponent = (element, { title, year }) => {
  document.getElementById(
    element
  ).innerHTML = `<h1 class="movie-description__title">
  ${title} (${year})
</h1>`;
};

const mountVideoComponent = (element, video) => {
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
