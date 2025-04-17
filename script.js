const myBtn = document.getElementById("myBtn");
const resetBtn = document.getElementById("resBtn");
const resultsDiv = document.getElementById("results");
const input = document.getElementById("myInput");
const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;
const prefersDark =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;
const savedTheme = localStorage.getItem("darkMode");

const loader = document.getElementById("loader");

myBtn.addEventListener("click", () => {
  const query = input.value.trim();
  if (query == "") {
    alert("Please enter an ingredient!");
    return;
  }

  loader.classList.remove("hidden");
  resultsDiv.innerHTML = "";

  const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${query}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("API Response:", data);
      loader.classList.add("hidden");

      if (!data.meals || data.meals.length === 0) {
        resultsDiv.innerHTML =
          "<p>No recipes found. Try different ingredients!</p>";
        return;
      }

      const recipesToShow = data.meals.slice(0, 8);
      displayRecipes(recipesToShow);
    })
    .catch((error) => {
      loader.classList.add("hidden");
      console.error("Error fetching data:", error);
      resultsDiv.innerHTML = `<p>Something went wrong: ${error.message}. Please try again!</p>`;
    });
});

resetBtn.addEventListener("click", () => {
  resultsDiv.innerHTML = "";
  input.value = "";
});

function displayRecipes(recipes) {
  resultsDiv.innerHTML = "";

  recipes.forEach((recipe) => {
    getRecipeDetails(recipe.idMeal)
      .then((detailedRecipe) => {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");

        recipeCard.innerHTML = `
          <img src="${detailedRecipe.strMealThumb}" alt="${detailedRecipe.strMeal}">
          <h3>${detailedRecipe.strMeal}</h3>
          <a href="#" class="view-recipe" data-id="${detailedRecipe.idMeal}">View Recipe</a>
        `;

        const viewButton = recipeCard.querySelector(".view-recipe");
        viewButton.addEventListener("click", (e) => {
          e.preventDefault();
          window.open(
            `https://www.themealdb.com/meal/${detailedRecipe.idMeal}`,
            "_blank"
          );
        });

        resultsDiv.appendChild(recipeCard);
      })
      .catch((error) => {
        console.error("Error fetching recipe details:", error);
      });
  });
}

function getRecipeDetails(mealId) {
  return fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch recipe details");
      }
      return response.json();
    })
    .then((data) => {
      if (!data.meals || !data.meals[0]) {
        throw new Error("No recipe details found");
      }
      return data.meals[0];
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
