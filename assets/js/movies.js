const ENDPOINT_API = {
  title_cast: "/title/get-top-cast",
  actors_bio: "/actors/get-bio",
};

const urlParams = new URLSearchParams(window.location.search);
const _tconst = urlParams.get("id");

const getCover = (id) => {};

const getCharacter = async (nm) => {
  try {
    const response = await _http.get(ENDPOINT_API.actors_bio, { nconst: nm });
    if (response) {
      console.log(response);
    }
  } catch (error) {
    console.error("Error on =>", error);
  }
};

const getListCast = async (id) => {
  try {
    const response = await _http.get(ENDPOINT_API.title_cast, { tconst: id });
    if (response) {
      const outputArray = response.map((item) =>
        item
          .split("/")
          .filter((part) => part !== "")
          .pop()
      );
      return outputArray;
    }
  } catch (error) {
    console.error("Error on =>", error);
  }
};

const getListDetailsOfCast = () => {
  actors = [];
  getListCast(_tconst)
    .then((e) => e)
    .then((element) => {
      actors.push(getCharacter(element));
    });
  return actors;
};

console.log(getListDetailsOfCast());
