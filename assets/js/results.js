const getResults = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const q_param = urlParams.get("q");
  const movieshtml = document.getElementById("rmovies");

  if (q_param) {
    const data = { q: q_param };
    try {
      const response = await _http.get("/auto-complete", data);
      const { d } = response;
      for (let i = 1; i < d.length; i++) {
        console.log(makeMovie(d[i]));
        movieshtml.innerHTML += makeMovie(d[i]);
      }
      console.log("$http.get =>", d);
    } catch (error) {
      console.error("Error on =>", error);
    }
  }
};
getResults();

const makeMovie = (movie) => {
  const { i, id, l, s } = movie;
  return `<div class="img-movie__container">
  <div>
    <img
      src="${i.imageUrl}"
      alt=""
      class="img-movie__ticket"
    />
  </div>
  <div>
    <div>
      <h3 class="img-movie__title">${l}</h3>
      <p class="img-movie__text">${s}</p>
      <a href="actor.html?id=${id}" class="img-movie__link">Información</a>
    </div>
  </div>
</div>`;
};
