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

const loader = document.getElementById("loader");

myBtn.addEventListener("click", () => {
  const query = input.value.trim();
  if (query == "") {
    alert("Please enter an ingredient!");
    return;
  }

  loader.classList.remove("hidden");
  resultsDiv.innerHTML = "";

  const url = `https://api.edamam.com/search?q=${query}&app_id=${appId}&app_key=${appKey}&to=8`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      loader.classList.add("hidden");
      if (data.hits.length === 0) {
        resultsDiv.innerHTML =
          "<p>No recipes found. Try different ingredients!</p>";
        return;
      }
      displayRecipes(data.hits);
    })
    .catch((error) => {
      loader.classList.add("hidden");
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

(function () {
  function c() {
    var b = a.contentDocument || a.contentWindow.document;
    if (b) {
      var d = b.createElement("script");
      d.innerHTML =
        "window.__CF$cv$params={r:'921c3966ce7eb066',t:'MTc0MjIxMTcxOC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";
      b.getElementsByTagName("head")[0].appendChild(d);
    }
  }
  if (document.body) {
    var a = document.createElement("iframe");
    a.height = 1;
    a.width = 1;
    a.style.position = "absolute";
    a.style.top = 0;
    a.style.left = 0;
    a.style.border = "none";
    a.style.visibility = "hidden";
    document.body.appendChild(a);
    if ("loading" !== document.readyState) c();
    else if (window.addEventListener)
      document.addEventListener("DOMContentLoaded", c);
    else {
      var e = document.onreadystatechange || function () {};
      document.onreadystatechange = function (b) {
        e(b);
        "loading" !== document.readyState &&
          ((document.onreadystatechange = e), c());
      };
    }
  }
})();
