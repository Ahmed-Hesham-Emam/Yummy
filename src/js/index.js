"use strict";

let id = "#meals";

// toggle nav menu
$(".btn-menu").on("click", function () {
  $(".navbar-menu , .open , .close").toggle(1000);
});

// get random meals function
async function getRandomMeals() {
  try {
    let http = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s`
    );
    let data = await http.json();
    displayMeals(data.meals, "#meals");
  } catch (error) {
    alert("Error fetching data");
  }
}

// call random meals function to display meals
getRandomMeals();

// display meals function
function displayMeals(meals, targetID) {
  let cartona = "";
  meals.forEach((mealData) => {
    cartona += `
        <div class="meal-container" data-id="${mealData.idMeal}">
          <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}" class="w-full h-full object-cover">
          <div class="overlay absolute text-black">
            <h2>${mealData.strMeal}</h2>
          </div>
        </div>`;
  });
  $(".loading").hide();
  $(targetID).html(cartona);

  $(".meal-container").on("click", function () {
    $(".loading").show();
    const idMeal = $(this).data("id");
    getMealDetails(idMeal);
  });
}

// get meal details function
async function getMealDetails(idMeal) {
  try {
    let http = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`
    );
    let data = await http.json();
    displayDetails(data.meals);
  } catch (error) {
    alert("Error fetching meal data");
  }
}

// display meal details function
function displayDetails(meals) {
  let cartona = "";
  let ingredients = "";

  meals.forEach((mealData) => {
    for (let i = 1; i <= 20; i++) {
      if (mealData[`strIngredient${i}`]) {
        ingredients += `<li class="text-white rounded-lg text-center text-sm px-2 py-1 bg-blue-600">${
          mealData[`strMeasure${i}`]
        } ${mealData[`strIngredient${i}`]}</li>`;
      }
    }

    let tags = mealData.strTags
      ? mealData.strTags
          .split(",")
          .map(
            (tag) =>
              `<span class="text-white rounded-lg text-center text-sm px-2 me-2 py-1 bg-blue-600">${tag}</span>`
          )
          .join("")
      : "No tags available";

    cartona = `
     <i id="close" class="fa-solid fa-x absolute end-5 top-5 cursor-pointer text-[25px] hover:text-red-600   transition-all duration-500"></i>
        <div class="col-span-5">
          <img class="mt-6 rounded-lg overflow-hidden" src="${mealData.strMealThumb}" alt="">
          <h2 class="text-xl font-semibold">${mealData.strMeal}</h2>
        </div>
        <div class="col-span-7">
          <h2 class="text-3xl mt-6">Instructions</h2>
          <p>${mealData.strInstructions}</p>
          <h2 class="text-3xl">Area: <span class="text-white rounded-lg text-center text-sm px-2 py-1 bg-blue-600">${mealData.strArea}</span></h2>
          <h2 class="text-3xl">Category: <span class="text-white rounded-lg text-center text-sm px-3 bg-blue-600">${mealData.strCategory}</span></h2>
          <h2 class="text-3xl mb-2">Recipes: <ul class="flex gap-2 flex-wrap">${ingredients}</ul></h2>
          <h2 class="mb-2 text-3xl">Tags: </h2>
          <p class="w-fit mb-8 ">${tags}</p>
          <div class="flex gap-5 mb-8">
          <a href="${mealData.strSource}" class="py-2 px-4 rounded-lg bg-green-800 text-white hover:bg-green-700 focus:bg-green-800 border border-green-400 transition-all duration-500" target="_blank">source</a>
          <a href="${mealData.strYoutube}" class="py-2 px-4 rounded-lg bg-red-800 text-white hover:bg-red-700 focus:bg-red-800 border border-red-400 transition-all duration-500" target="_blank">youtube</a>
          </div>
        </div>`;
  });
  $(
    ".loading ,#meals , #searchResults , #Categories , #Area , #Ingredients"
  ).hide();
  $("#details").html(cartona);
  $("#details").show();

  $("#close").on("click", function () {
    $("#searchResults").show();
    $("#details").hide();
    $(id).show();
  });
}

// to bring the search section into view
$("#btn-search").on("click", function () {
  $(".navbar-menu, .open, .close").toggle(1000);
  $("#meals ,#details , #Categories , #Area , #Ingredients , #Contact").hide();
  $("#search").show();
});

// eventlistner for the searchByName input
$("#searchByName").on("keyup", function () {
  $("#searchByFirstLetter").val("");
  let userSearch = $("#searchByName").val();
  if (userSearch == "") {
    $("#searchResults").html(`<p class="text-white">No results found</p>`);
  } else {
    searchByName(userSearch);
    $(".loading").show();
  }
});

// to search and view meal/s by name
async function searchByName(inputSearch) {
  try {
    let http = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${inputSearch}`
    );
    let data = await http.json();
    if (data.meals) {
      displayMeals(data.meals, "#searchResults");
      id = $("#searchResults");
    } else {
      $("#searchResults").html(`<p class="text-white">No results found</p>`);
    }
    $(".loading").hide();
  } catch (error) {
    alert("Error fetching data");
  }
}
// eventlistner for the searchFirstLetter input
$("#searchByFirstLetter").on("keyup", function () {
  $("#searchByName").val("");
  let userSearch = $("#searchByFirstLetter").val();
  if (userSearch == "") {
    $("#searchResults").html(`<p class="text-white">No results found</p>`);
  } else {
    searchByFirstLetter(userSearch);
    $(".loading").show();
  }
});

// to search and view meal/s by first letter
async function searchByFirstLetter(inputSearch) {
  try {
    let http = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?f=${inputSearch}`
    );
    let data = await http.json();
    if (data.meals) {
      displayMeals(data.meals, "#searchResults");
      id = $("#searchResults");
    } else {
      $("#searchResults").html(`<p class="text-white">No results found</p>`);
    }
    $(".loading").hide();
  } catch (error) {
    alert("Error fetching data");
  }
}

// to bring the categories sectiion into view
$("#btn-Categories").on("click", function () {
  $(".navbar-menu , .open , .close").toggle(1000);
  $("#meals , #search , #Area , #details , #Ingredients , #Contact").hide();
  $("#Categories").show();
  getCategories();
});

// to get catagory data
async function getCategories() {
  $(".loading").show();
  try {
    let http = await fetch(
      `https://www.themealdb.com/api/json/v1/1/categories.php`
    );
    let data = await http.json();
    displayCategories(data.categories);
  } catch (error) {
    alert("Error fetching data");
  }
}

// to display categories
function displayCategories(categories) {
  let cartona = "";
  categories.forEach((category) => {
    cartona += `
        <div class="meal-container" data-category="${category.strCategory}">
          <img src="${category.strCategoryThumb}" alt="${category.strCategory}" class="w-full h-full object-cover">
          <div class="overlay overflow-hidden absolute text-black">
            <h2>${category.strCategory}</h2>
            <p class="line-clamp-3">${category.strCategoryDescription}</p>
          </div>
        </div>`;
  });
  $(".loading").hide();
  $("#Categories").html(cartona);
  $(".meal-container").on("click", function () {
    const CategoryMeal = $(this).data("category");
    getCategoryDetails(CategoryMeal);
    let id = $("#Categories");
  });
}

// to get meals by a certain category then call the display function responsable for viewing meals
async function getCategoryDetails(CategoryMeal) {
  $(".loading").show();
  try {
    let http = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${CategoryMeal}`
    );
    let data = await http.json();
    displayMeals(data.meals, "#Categories");
    $(".loading").hide();
    id = $("#Categories");
  } catch (error) {
    alert("Error fetching data");
  }
}

// to get areas data
async function getAreas() {
  $(".loading").show();
  try {
    let http = await fetch(
      `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
    );
    let data = await http.json();

    displayAreas(data.meals);
  } catch (error) {
    alert("Error fetching data");
  }
}

// to display areas data
function displayAreas(area) {
  let cartona = "";
  area.forEach((Area) => {
    cartona += `
        <div class="area-container flex flex-col justify-center items-center relative overflow-hidden m-2 cursor-pointer" data-area="${Area.strArea}">
          <i class="fa-solid fa-house-laptop fa-4x text-white"></i>
          <h2 class="text-white">${Area.strArea}</h2>
        </div>`;
  });
  $(".loading").hide();
  $("#Area").html(cartona);
  $(".area-container").on("click", function () {
    const areaMeal = $(this).data("area");
    getAreaMeals(areaMeal);
    id = $("#Area");
  });
}

// to bring area section into view
$("#btn-Area").on("click", function () {
  $(".navbar-menu , .open , .close").toggle(1000);
  $(
    "#meals , #search , #Categories , #details , #Ingredients , #Contact"
  ).hide();
  $("#Area").show();
  getAreas();
});

// to get meals by a certain area then call the display function responsable for viewing meals
async function getAreaMeals(areaName) {
  $(".loading").show();
  try {
    let http = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaName}`
    );
    let data = await http.json();
    displayMeals(data.meals, "#Area");
    $(".loading").hide();
  } catch (error) {
    alert("Error fetching data");
  }
}

// to bring ingrediantes section into view
$("#btn-Ingredients").on("click", function () {
  $(".navbar-menu , .open , .close").toggle(1000);
  $("#meals , #search , #Categories , #Area , #details , #Contact").hide();
  $("#Ingredients").show();
  getIngredients();
});

// to get ingredients data
async function getIngredients() {
  $(".loading").show();
  try {
    let http = await fetch(
      `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
    );
    let data = await http.json();
    displayIngredients(data.meals);
  } catch (error) {
    alert("Error fetching data");
  }
}

// to display ingredients
function displayIngredients(Ingredients) {
  let cartona = "";
  Ingredients.forEach((Ingredient) => {
    cartona += `
        <div class="Ingredients-container flex flex-col justify-center items-center relative overflow-hidden m-2 cursor-pointer" data-ingredient="${Ingredient.strIngredient}">
          <i class="fa-solid fa-drumstick-bite fa-4x text-white"></i>
          <h2 class="text-white">${Ingredient.strIngredient}</h2>
          <p class="text-white line-clamp-3">${Ingredient.strDescription}</p>
        </div>`;
  });
  $(".loading").hide();
  $("#Ingredients").html(cartona);
  $(".Ingredients-container").on("click", function () {
    const ingredient = $(this).data("ingredient");
    getIngredientMeals(ingredient);
    id = $("#Ingredients");
  });
}

// to get meals by a certain ingrediant then call the display function responsable for viewing meals
async function getIngredientMeals(ingredient) {
  $(".loading").show();
  try {
    let http = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
    );
    let data = await http.json();
    displayMeals(data.meals, "#Ingredients");
    $(".loading").hide();
  } catch (error) {
    alert("Error fetching data");
  }
}
// to bting contact section into view
$("#btn-Contact").on("click", function () {
  $(".navbar-menu , .open , .close").toggle(1000);
  $("#meals , #search , #Area , #details , #Ingredients , #Categories").hide();
  $("#Contact").show();
  validateContactForm();
});

// form validation
function validateContactForm() {
  // regex
  const nameRegex = /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex =
    /^[\+]?[0-9]{0,3}(\W?\(?)?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  const ageRegex = /^(1[6-9]|[2-9]\d|\d{3,})$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // validate inputs individually
  $("#name").on("keyup", function () {
    const name = $("#name").val();
    if (nameRegex.test(name)) {
      $("#name").removeClass("border-red-500 focus:border-red-700");
      $("#name").addClass("border-green-500 focus:border-green-700");
      $("#nameText").addClass("hidden");
      $("#nameText").removeClass("block");
    } else {
      $("#name").removeClass("border-green-500 focus:border-green-700");
      $("#name").addClass("border-red-500 focus:border-red-700");
      $("#nameText").addClass("block");
      $("#nameText").removeClass("hidden");
    }
  });

  $("#email").on("keyup", function () {
    const email = $("#email").val();
    if (emailRegex.test(email)) {
      $("#email").removeClass("border-red-500 focus:border-red-700");
      $("#email").addClass("border-green-500 focus:border-green-700");
      $("#emailText").addClass("hidden");
      $("#emailText").removeClass("block");
    } else {
      $("#email").removeClass("border-green-500 focus:border-green-700");
      $("#email").addClass("border-red-500 focus:border-red-700");
      $("#emailText").addClass("block");
      $("#emailText").removeClass("hidden");
    }
  });

  $("#phone").on("keyup", function () {
    const phone = $("#phone").val();
    if (phoneRegex.test(phone)) {
      $("#phone").removeClass("border-red-500 focus:border-red-700");
      $("#phone").addClass("border-green-500 focus:border-green-700");
      $("#phoneText").addClass("hidden");
      $("#phoneText").removeClass("block");
    } else {
      $("#phone").removeClass("border-green-500 focus:border-green-700");
      $("#phone").addClass("border-red-500 focus:border-red-700");
      $("#phoneText").addClass("block");
      $("#phoneText").removeClass("hidden");
    }
  });

  $("#age").on("keyup", function () {
    const age = $("#age").val();
    if (ageRegex.test(age)) {
      $("#age").removeClass("border-red-500 focus:border-red-700");
      $("#age").addClass("border-green-500 focus:border-green-700");
      $("#ageText").addClass("hidden");
      $("#ageText").removeClass("block");
    } else {
      $("#age").removeClass("border-green-500 focus:border-green-700");
      $("#age").addClass("border-red-500 focus:border-red-700");
      $("#ageText").addClass("block");
      $("#ageText").removeClass("hidden");
    }
  });

  $("#password").on("keyup", function () {
    const password = $("#password").val();
    if (passwordRegex.test(password)) {
      $("#password").removeClass("border-red-500 focus:border-red-700");
      $("#password").addClass("border-green-500 focus:border-green-700");
      $("#passwordText").addClass("hidden");
      $("#passwordText").removeClass("block");
    } else {
      $("#password").removeClass("border-green-500 focus:border-green-700");
      $("#password").addClass("border-red-500 focus:border-red-700");
      $("#passwordText").addClass("block");
      $("#passwordText").removeClass("hidden");
    }

    validateConfirmPassword();
  });

  $("#confirmPassword").on("keyup", function () {
    validateConfirmPassword();
  });

  const validateConfirmPassword = () => {
    const confirmPassword = $("#confirmPassword").val();
    const password = $("#password").val();

    if (confirmPassword === password && confirmPassword !== "") {
      $("#confirmPassword").removeClass("border-red-500 focus:border-red-700");
      $("#confirmPassword").addClass("border-green-500 focus:border-green-700");
      $("#confirmPasswordText").addClass("hidden");
      $("#confirmPasswordText").removeClass("block");
    } else {
      $("#confirmPassword").removeClass(
        "border-green-500 focus:border-green-700"
      );
      $("#confirmPassword").addClass("border-red-500 focus:border-red-700");
      $("#confirmPasswordText").addClass("block");
      $("#confirmPasswordText").removeClass("hidden");
    }
  };

  $(window).on("keyup", function () {
    const nameInput = $("#name");
    const emailInput = $("#email");
    const phoneInput = $("#phone");
    const ageInput = $("#age");
    const passwordInput = $("#password");
    const cPasswordInput = $("#confirmPassword");
    if (
      nameInput.hasClass("border-green-500") &&
      emailInput.hasClass("border-green-500") &&
      phoneInput.hasClass("border-green-500") &&
      ageInput.hasClass("border-green-500") &&
      passwordInput.hasClass("border-green-500") &&
      cPasswordInput.hasClass("border-green-500")
    ) {
      $("#btn-submit").prop("disabled", false);
    } else {
      $("#btn-submit").prop("disabled", true);
    }
  });

  $("#btn-submit").on("click", function (e) {
    e.preventDefault();
    $("#name").val("");
    $("#email").val("");
    $("#phone").val("");
    $("#age").val("");
    $("#password").val("");
    $("#confirmPassword").val("");

    $(
      "#name , #email , #phone , #age , #password , #confirmPassword"
    ).removeClass("border-green-500 focus:border-green-700");
    $("#btn-submit").prop("disabled", true);
  });
}
