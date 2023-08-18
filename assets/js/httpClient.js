const _http = (() => {
  const api = {};

  const URL_BASE = "https://online-movie-database.p.rapidapi.com";
  const API_KEY_HR = "86f6096c8emsh78cdec81ef90c92p1ab232jsnafe9ec521eee";
  const API_KEY_CDL = "d0486531d8mshcf14f3a2f908ebbp180698jsn07816ebf8378";
  const API_HOST = "online-movie-database.p.rapidapi.com";
  const defaultHeaders = new Headers({
    "X-RapidAPI-Key": API_KEY_CDL,
    "X-RapidAPI-Host": API_HOST,
  });

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

  return api;
})();
