const RESOURCE_ENDPOINT = "/title";

const ENDPOINT_API = {
  full_credits: `${RESOURCE_ENDPOINT}/get-full-credits`,
  get_meta_data: `${RESOURCE_ENDPOINT}/get-meta-data`,
  overview_details: `${RESOURCE_ENDPOINT}/get-overview-details`,
  movie_videos: `${RESOURCE_ENDPOINT}/get-hero-with-promoted-video`,
  video: `${RESOURCE_ENDPOINT}/get-video-playback`,
};
const URL_PARAMS = new URLSearchParams(window.location.search);
const _tconst = URL_PARAMS.get("id");

function formatDuration(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

const handleErrors = (error) => {
  console.error("Error:", error);
};

const getMovie = async (nm) => {
  try {
    const movie = await _http.get(ENDPOINT_API.get_meta_data, {
      ids: nm,
    });
    return movie;
  } catch (error) {
    handleErrors(error);
  }
};
const getMovieCredits = async (nm) => {
  try {
    const movie = await _http.get(ENDPOINT_API.full_credits, {
      tconst: nm,
    });
    return movie;
  } catch (error) {
    handleErrors(error);
  }
};

const getMovieVideos = async (nm) => {
  try {
    const videos = await _http.get(ENDPOINT_API.movie_videos, {
      tconst: nm,
      currentCountry: "US",
      purchaseCountry: "US",
    });
    return videos;
  } catch (error) {
    handleErrors(error);
  }
};

const getVideosLinks = async (vi) => {
  const { topVideos } = vi;
  const videosUrl = [];

  try {
    await Promise.all(
      topVideos.map(async (element) => {
        const vi_id = element.id.split("/")[2];
        try {
          const result = await _http.get(ENDPOINT_API.video, {
            viconst: vi_id,
          });
          const { resource } = result;
          const filteredData = resource.encodings.filter(
            (item) => item.mimeType === "video/mp4"
          );
          const playUrls = filteredData.map((item) => item.playUrl);
          videosUrl.push(playUrls);
        } catch (error) {
          console.error(error);
        }
      })
    );

    return videosUrl;
  } catch (error) {
    handleErrors(error);
  }
};

const getAuthors = (crew) => {
  const { writer, director } = crew;
  return {
    writer: writer[0].name,
    director: director[0].name,
  };
};

const getMainCast = (cast) => {
  const castList = [];
  for (let index = 0; index < 5; index++) {
    const { name, characters } = cast[index];
    castList.push({ name, character: characters[0] });
  }
  return castList;
};

const getInfoCredits = (credits) => {
  const { cast, crew } = credits;
  return {
    cast: getMainCast(cast),
    authors: getAuthors(crew),
  };
};

const getMovieData = (m) => {
  const {
    certificate,
    genres,
    ratings: { rating },
    title: {
      title,
      year,
      runningTimeInMinutes,
      image: { url },
    },
  } = m;

  return {
    title,
    year,
    image: url,
    certificate,
    rating,
    genres,
    duration: formatDuration(runningTimeInMinutes),
  };
};

const getCoverMovie = (vi) => {
  const { heroImages } = vi;
  if (heroImages.length === 0) {
    return null;
  }
  const randomPosition = Math.floor(Math.random() * heroImages.length);
  return heroImages[randomPosition].url;
};

async function LoadMovie() {
  try {
    const full_movie = await getMovie(_tconst);
    const credits = await getMovieCredits(_tconst);
    const { authors, cast } = getInfoCredits(credits);
    const videos = await getMovieVideos(_tconst);
    const cover = getCoverMovie(videos);
    const videoLinks = await getVideosLinks(videos);

    const { certificate, duration, genres, image, rating, title, year } =
      getMovieData(full_movie[_tconst]);

    return {
      title,
      certificate,
      duration,
      genres,
      image,
      rating,
      year,
      authors,
      cover,
      cast,
      videos: videoLinks,
    };
  } catch (error) {
    handleErrors(error);
  }
}

LoadMovie()
  .then((results) => {
    console.log("Movie:", results);
  })
  .catch((error) => {
    console.error(error);
  });
