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

const getResults = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const q_param = urlParams.get("q");
  if (q_param) {
    console.log(q_param);
    const url = "https://imdb8.p.rapidapi.com/auto-complete?q=" + q_param;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "86f6096c8emsh78cdec81ef90c92p1ab232jsnafe9ec521eee",
        "X-RapidAPI-Host": "imdb8.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
};

function getItems() {}

getFindActor();
getResults();
