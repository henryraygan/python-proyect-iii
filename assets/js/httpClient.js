const _httpClient = (() => {
  const api = {};
  const URL_BASE = "https://online-movie-database.p.rapidapi.com";
  const API_KEY_HOLA = "f3c6a13161msh989af510ef88749p146258jsn6836805cdb25";
  const API_KEY_JDEV = "868ecb7370msh9014ccdf69ea8bcp1ab96cjsn45b67ec41e52";
  const API_HOST = "online-movie-database.p.rapidapi.com";
  const defaultHeaders = new Headers({
    "X-RapidAPI-Key": API_KEY_HOLA,
    "X-RapidAPI-Host": API_HOST,
  });

  api.ENDPOINT = {
    autoComplete: "/auto-complete",
    title: {
      coomingMovies: "/title/get-coming-soon-movies",
      popularMovies: "/title/get-top-rated-movies",
      movieDetails: "/title/get-details",
      full_credits: "/title/get-full-credits",
      overview_details: "/title/get-overview-details",
      movie_videos: "/title/get-hero-with-promoted-video",
      video: "/title/get-video-playback",
    },
  };

  api.request = async (url, options, callback) => {
    const requestOptions = {
      headers: defaultHeaders,
      ...options,
    };

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      callback(data);
    } catch (error) {
      console.error("Error on =>", error);
    }
  };

  api.get = (url, data = {}) => {
    const queryParams = new URLSearchParams(data);
    const options = {
      method: "GET",
    };

    return new Promise((resolve, reject) => {
      api.request(
        `${URL_BASE}${url}?${queryParams.toString()}`,
        options,
        (response) => {
          resolve(response);
        }
      );
    });
  };

  api.post = (url, data) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    return new Promise((resolve, reject) => {
      api.request(URL_BASE + url, options, (response) => {
        resolve(response);
      });
    });
  };

  api.cache = async (endpoint, params, cacheType) => {
    const cacheKey = JSON.stringify(params) + cacheType;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    try {
      const data = await api.get(endpoint, params); // Cambio aquí
      localStorage.setItem(cacheKey, JSON.stringify(data));
      return data;
    } catch (error) {
      handleErrors(error);
    }
  };

  return api;
})();
