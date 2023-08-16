const getResults = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const q_param = urlParams.get("q");
  if (q_param) {
    const movieshtml = document.getElementById("rmovies")
    const data = { q: q_param };
    try {
      const response = await _http.get("/auto-complete", data);
      const { d } = response;
      for (let i=1; i > d.length; i++) {
        movieshtml.innerHTML += makeMovie(d[i])
      }
      console.log("$http.get =>", d);
    } catch (error) {
      console.error("Error on =>", error);
    }
  }
};
getResults();

const makeMovie=(args) => {
  const {i:imageUrl, l, s} = args;
  return `<div class="img-movie__container">
  <div>
    <img
      src="${imageUrl}"
      alt=""
      class="img-movie__ticket"
    />
  </div>
  <div>
    <div>
      <h3 class="img-movie__title">${l}</h3>
      <p class="img-movie__text">${s}</p>
      <a href="#" class="img-movie__link">Streaming Link</a>
    </div>
  </div>
</div>  `;
}
