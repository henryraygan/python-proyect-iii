const RESOURCE_ENDPOINT = "/title";
const ENDPOINT_API = {
  full_credits: `${RESOURCE_ENDPOINT}/get-full-credits`,
  overview_details: `${RESOURCE_ENDPOINT}/get-overview-details`,
  movie_videos: `${RESOURCE_ENDPOINT}/get-hero-with-promoted-video`,
  video: `${RESOURCE_ENDPOINT}/get-video-playback`,
};

const URL_PARAMS = new URLSearchParams(window.location.search);
const _tconst = URL_PARAMS.get("id");

const formatDuration = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
};

const handleErrors = (error) => {
  console.error("An error occurred:", error);
};

const getAuthors = (crew) => {
  if (!crew) {
    return {};
  }
  const { writer, director } = crew;
  return {
    writer: writer[0]?.name || "N/A",
    director: director[0]?.name || "N/A",
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
    cast: getMainCast(cast) || {},
    authors: getAuthors(crew) || {},
  };
};

const getMovieData = (movieData) => {
  const {
    title: {
      title,
      image: { url },
      year,
    },
    certificates: {
      US: [{ certificate }],
    },
    ratings: { rating },
    genres,
    title: { runningTimeInMinutes: duration },
    plotOutline: { text },
  } = movieData;
  return {
    title,
    year,
    image: url || "",
    certificate,
    rating,
    genres,
    duration: formatDuration(duration),
    description: text,
  };
};

const getCoverMovie = (vi) => {
  const { heroImages } = vi;
  if (heroImages.length === 0) {
    return null;
  }
  const randomPosition = Math.floor(Math.random() * heroImages.length);
  return heroImages[randomPosition]?.url || null;
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
      if (
        !highestQualityVideo ||
        (video.definition && video.definition > highestQualityVideo.definition)
      ) {
        highestQualityVideo = video;
      }
    }
  }

  return highestQualityVideo;
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
  getMovie: async (nm) => {
    return getFromLocalStorageOrApi(
      ENDPOINT_API.overview_details,
      { tconst: nm },
      "movie"
    );
  },
  getMovieCredits: async (nm) => {
    return getFromLocalStorageOrApi(
      ENDPOINT_API.full_credits,
      { tconst: nm },
      "credits"
    );
  },
  getMovieVideos: async (nm) => {
    return getFromLocalStorageOrApi(
      ENDPOINT_API.movie_videos,
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
      return getFromLocalStorageOrApi(
        ENDPOINT_API.video,
        { viconst: vi_id },
        "videoLinks"
      );
    } catch (error) {
      console.error(error);
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
    handleErrors(error);
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

    mountHeaderComponent("headerComponent", cover);
    mountCastListComponent("castListComponent", cast);
    mountPosterComponent("posterComponent", image, video);
    mountDescriptionComponent("descriptionComponent", {
      title,
      year,
      rating,
      certificate,
      authors,
      duration,
      description,
    });

    console.log($movie);
  })
  .catch((error) => {
    console.error(error);
  });

const mountHeaderComponent = (element, urlImage, alt = "") => {
  document.getElementById(
    element
  ).innerHTML = `<img class="movie-header__background"
  src="${urlImage}"
  alt="${alt}">`;
};

const mountCastListComponent = (element, cast) => {
  const el = document.getElementById(element);
  cast.forEach((element) => {
    el.innerHTML += `
    <div class="cast">
        <img class="cast-photo" src="${
          element.image || "./assets/images/no-image.webp"
        }" alt="${element.name}">
        <p class="cast-name-actor">${element.name}</p> as
        <span class="cast-name-character">${element.character}</span>
    </div>`;
  });
};

const mountPosterComponent = (element, image, video, alt = "") => {
  const { cover, mimeType, playUrl } = video;
  document.getElementById(element).innerHTML = `
    <img class="poster-image" src="${image}" alt="${alt}">
    <h3 class="movie-description__subtitle">Trailer</h3>
    <video id="my-video" class="video-js movie-video" controls preload="auto"
                        poster="${cover}"
                        data-setup="{}">
                        <source
                            src="${playUrl}"
                            type="${mimeType}" />
                        <p class="vjs-no-js">
                            To view this video please enable JavaScript, and consider upgrading to a
                            web browser that
                            <a href="https://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
                        </p>
                    </video>
  `;
};

const mountDescriptionComponent = (element, data) => {
  const {
    title,
    year,
    rating,
    certificate,
    description,
    authors: { director, writer },
    duration,
  } = data;
  document.getElementById(element).innerHTML = `
    <h1 class="movie-description__title">
                                ${title} (${year})
                            </h1>
                            <div class="movie-description__extra">
                                <span class="movie-clasification">${certificate}</span>
                                <span class="movie-rating">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                        class="ipc-icon ipc-icon--star sc-bde20123-4 ggvDm" viewBox="0 0 24 24"
                                        fill="currentColor" role="presentation">
                                        <path
                                            d="M12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72 3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z">
                                        </path>
                                    </svg>
                                    ${rating} / 10
                                </span>
                            </div>
                            <p id="authorComponent" class="movie-credits">
                                <span>Director: <strong>${director}</strong></span>
                                <span>Writer: <strong>${writer}</strong></span>
                                <span>Duration: <strong>${duration}</strong></span>                                
                            </p>
                            <p class="movie-paragraph">
                                ${description}
                            </p>`;
};

const mountGendersComponent = (genders) => {};
