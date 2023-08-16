const $http = (() => {
  const api = {};
  const URL_BASE = "https://imdb8.p.rapidapi.com";
  const defaultOptions = {
    headers: {
      "X-RapidAPI-Key": "86f6096c8emsh78cdec81ef90c92p1ab232jsnafe9ec521eee",
      "X-RapidAPI-Host": "imdb8.p.rapidapi.com",
    },
  };

  api.request = (url, options, callback) => {
    const requestOptions = { ...defaultOptions, ...options };

    axios(url, requestOptions)
      .then((response) => {
        callback(response.data);
      })
      .catch((error) => {
        console.error("Error on =>", error);
      });
  };

  api.get = (url, data = {}) => {
    const options = {
      method: "GET",
      params: data,
    };

    return new Promise((resolve, reject) => {
      api.request(URL_BASE + url, options, (response) => {
        resolve(response);
      });
    });
  };

  api.post = (url, data) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    return new Promise((resolve, reject) => {
      api.request(URL_BASE + url, options, (response) => {
        resolve(response);
      });
    });
  };

  return api;
})();
