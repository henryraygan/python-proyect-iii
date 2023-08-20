const _movieService = (() => {
  const API = {};
  API.getMovie = async (nm) => {
    return _httpClient.cache(
      _httpClient.ENDPOINT.title.overview_details,
      { tconst: nm },
      "movie"
    );
  };
  API.getMovieCredits = async (nm) => {
    return _httpClient.cache(
      _httpClient.ENDPOINT.title.full_credits,
      { tconst: nm },
      "credits"
    );
  };
  API.getMovieVideos = async (nm) => {
    return _httpClient.cache(
      _httpClient.ENDPOINT.title.movie_videos,
      {
        tconst: nm,
        currentCountry: "US",
        purchaseCountry: "US",
      },
      "movieVideos"
    );
  };
  API.getVideosLinks = async (vi_id) => {
    try {
      return _httpClient.cache(
        _httpClient.ENDPOINT.title.video,
        { viconst: vi_id },
        "videoLinks"
      );
    } catch (error) {
      _helpers.handleErrors(error);
    }
  };
  API.autoComplete = async (nm) => {
    return _httpClient.cache(
      _httpClient.ENDPOINT.autoComplete,
      { q: nm },
      "results"
    );
  };
  API.getTopCast = async () => {
    return _httpClient.cache(
      _httpClient.ENDPOINT.title.popularMovies,
      {
        homeCountry: "US",
        purchaseCountry: "US",
        currentCountry: "MX",
      },
      "topcast"
    );
  };
  API.getCoomingSoon = async () => {
    return _httpClient.cache(
      _httpClient.ENDPOINT.title.coomingMovies,
      {},
      "cooming"
    );
  };
  API.getMovieDetails = async (movieId) => {
    const params = { tconst: movieId };
    return await _httpClient.cache(
      _httpClient.ENDPOINT.title.movieDetails,
      params,
      "moviedetail"
    );
  };
  return API;
})();
