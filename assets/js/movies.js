const getMovies = async () => {
  const data = {
    tconst: "tt0944947",
    limit: "25",
  };
  try {
    const response = await $http.get("/title/get-news", data);
    console.log("$http.get =>", response);
  } catch (error) {
    console.error("Error on =>", error);
  }
};
getMovies();
