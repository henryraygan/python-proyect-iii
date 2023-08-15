const getFindActor = () => {
  const btn_search = document.getElementById("searchbtn");
  const query_search = document.getElementById("query");
  if (btn_search) {
    btn_search.addEventListener("click", () => {
      const url = `results.html?q=${query_search.value}`;
      window.location.href = url;
    });
  }
};
getFindActor();
