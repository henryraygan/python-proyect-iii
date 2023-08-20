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
  const urlVideo = await _movieService.getVideosLinks(
    topVideos[0].id.split("/")[2]
  );
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

async function LoadMovie() {
  try {
    _components.showLoadingBar();
    const full_movie = await _movieService.getMovie(_tconst);
    const credits = await _movieService.getMovieCredits(_tconst);
    const videos = await _movieService.getMovieVideos(_tconst);
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
    _components.hideLoadingBar();

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
    _components.hideLoadingBar();
    _helpers.handleErrors(error);
  } finally {
    _components.hideLoadingBar();
  }
}

document.addEventListener("DOMContentLoaded", () => {
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

      _components.mountHeaderComponent("headerComponent", cover);
      _components.mountHeadingComponent("movieHeadComponent", { title, year });
      _components.mountCastListComponent("castComponent", cast);
      _components.mountPosterComponent("posterComponent", image);
      _components.mountVideoComponent("videoComponent", video);
      _components.mountListGenres("genresComponent", genres);
      _components.mountDescriptionComponent("descriptionComponent", {
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
});
