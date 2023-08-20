const searchCache = {
  data: {},
  get: (key) => searchCache.data[key],
  set: (key, value) => {
    searchCache.data[key] = value;
    localStorage.setItem("searchCache", JSON.stringify(searchCache.data));
  },
  init: () => {
    const cachedData = localStorage.getItem("searchCache");
    if (cachedData) {
      searchCache.data = JSON.parse(cachedData);
    }
  },
};

searchCache.init();

const input = document.getElementById("inputSearch");

let typingTimer;
const doneTypingInterval = 1000;

const doneTyping = async () => {
  let items = [];

  const searchTerm = input.value;
  const cachedResult = searchCache.get(searchTerm);

  if (cachedResult) {
    items = cachedResult;
  } else {
    items = await _movieService.autoComplete(searchTerm);
    searchCache.set(searchTerm, items);
    result = cachedResult;
  }

  console.log(items);
  _components.mountListAutocomplete(
    "searchListComponent",
    "inputSearch",
    items
  );
};

input.addEventListener("input", () => {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(doneTyping, doneTypingInterval);
});
