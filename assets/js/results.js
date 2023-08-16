const getResults = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const q_param = urlParams.get("q");
  if (q_param) {
    const data = { q: q_param };
    try {
      const response = await $http.get("/auto-complete", data);
      const { d } = response;
      console.log("$http.get =>", d);
    } catch (error) {
      console.error("Error on =>", error);
    }
  }
};
getResults();
