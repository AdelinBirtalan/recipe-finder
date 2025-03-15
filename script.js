const myBtn = document.getElementById("myBtn");
const resetBtn = document.getElementById("resBtn");
const resultsDiv = document.getElementById("results");
const input = document.getElementById("myInput");
const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;
const appId = "f14c4d41";
const appKey = "87e7dff1da8d99744844e892d58f5709";
const prefersDark =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;
const savedTheme = localStorage.getItem("darkMode");

myBtn.addEventListener("click", () => {
  const query = input.value.trim();
  if (query == "") {
    alert("Please enter an ingredient!");
    return;
  }
  const url = `https://api.edamam.com/search?q=${query}&app_id=${appId}&app_key=${appKey}&to=8`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.hits.length === 0) {
        resultsDiv.innerHTML =
          "<p>No recipes found. Try different ingredients!</p>";
        return;
      }
      displayRecipes(data.hits);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      resultsDiv.innerHTML = "<p>Something went wrong. Please try again!</p>";
    });
});

resetBtn.addEventListener("click", () => {
  resultsDiv.innerHTML = "";
  input.value = "";
});

function displayRecipes(recipes) {
  resultsDiv.innerHTML = "";
  recipes.forEach((recipe) => {
    const recipeCard = document.createElement("div");
    recipeCard.classList.add("recipe-card");
    recipeCard.innerHTML = `
    <img src="${recipe.recipe.image}" alt="${recipe.recipe.label}">
    <h3>${recipe.recipe.label}</h3>
    <a href="${recipe.recipe.url}" target="_blank">View Recipe </a>
    `;
    resultsDiv.appendChild(recipeCard);
  });
}

if (savedTheme === "true" || (savedTheme === null && prefersDark)) {
  body.classList.add("dark-mode");
  darkModeToggle.checked = true;
}

darkModeToggle.addEventListener("change", function () {
  if (this.checked) {
    body.classList.add("dark-mode");
    localStorage.setItem("darkMode", "true");
  } else {
    body.classList.remove("dark-mode");
    localStorage.setItem("darkMode", "false");
  }
});
