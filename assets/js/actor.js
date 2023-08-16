const getResults = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const q_param = urlParams.get("id");
  if (q_param) {
    const data = { nconst: q_param };
    try {
      const response = await _http.get("/actors/get-bio", data);
      console.log(response);
    } catch (error) {
      console.error("Error on =>", error);
    }
  }
};

getResults();
