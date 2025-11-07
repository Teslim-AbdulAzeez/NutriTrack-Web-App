// ============================================
// SESSION CHECK
// ============================================
function checkUserSession() {
  const storedUser = localStorage.getItem("currentUser");
  if (!storedUser) {
    console.log("No user session found. Redirecting to login page.");
    window.location.href = "../SIGN IN FOLDER/sign_in.html";
  }
}
checkUserSession();

const logoutBtn = document.getElementById("logoutBtn");
// ============================================
// GET USER DATA FROM LOCALSTORAGE
// ============================================
function getCurrentUser() {
  const userData = JSON.parse(localStorage.getItem("currentUser"));
  return userData;
}

// ============================================
// GET USER-SPECIFIC STORAGE KEY
// ============================================
function getUserMealsKey() {
  const user = getCurrentUser();
  return user ? `meals_${user.username}` : "allMeals";
}

// ============================================
// LOG MEAL PAGE SCRIPT
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  const foodDatabase = {
    "Jollof Rice": { meal: "lunch", cal: 380, pro: 7, carb: 65, fat: 10 },
    "Egusi Soup": { meal: "dinner", cal: 330, pro: 15, carb: 10, fat: 25 },
    "Pepper Soup": { meal: "dinner", cal: 150, pro: 18, carb: 5, fat: 6 },
    Fufu: { meal: "dinner", cal: 200, pro: 1, carb: 48, fat: 1 },
    "Moi Moi": { meal: "breakfast", cal: 150, pro: 10, carb: 18, fat: 5 },
    Akara: { meal: "breakfast", cal: 180, pro: 8, carb: 20, fat: 8 },
    Suya: { meal: "snacks", cal: 220, pro: 25, carb: 3, fat: 12 },
    "Pounded Yam": { meal: "lunch", cal: 220, pro: 1, carb: 50, fat: 1 },
    "Garri & Soup": { meal: "dinner", cal: 500, pro: 10, carb: 70, fat: 20 },
    "Beans & Plantain": { meal: "lunch", cal: 450, pro: 15, carb: 75, fat: 10 },
    "Chin Chin": { meal: "snacks", cal: 400, pro: 6, carb: 55, fat: 18 },
    "Meat Pie": { meal: "snacks", cal: 300, pro: 10, carb: 30, fat: 16 },
    "Okra Soup": { meal: "dinner", cal: 100, pro: 5, carb: 10, fat: 5 },
    Amala: { meal: "lunch", cal: 170, pro: 1, carb: 40, fat: 1 },
  };

  const form = document.querySelector(".meal-form");

  const mealNameInput = document.getElementById("meal-name");
  const mealTypeInput = document.getElementById("meal-type");
  const caloriesInput = document.getElementById("calories");
  const proteinInput = document.getElementById("protein");
  const carbsInput = document.getElementById("carbs");
  const fatsInput = document.getElementById("fats");

  const loggedMealContainer = document.querySelector(".logged-meal-stat");
  const noMealsMessage = document.querySelector(".logged-meals");
  const mealCountParagraph = document.querySelector(".logged-paragraph");

  const suggestions = document.querySelectorAll(".suggested-food");

  function saveMealToLocalStorage(meal) {
    const today = new Date().toDateString();
    const userMealsKey = getUserMealsKey();
    const allMeals = JSON.parse(localStorage.getItem(userMealsKey)) || {};

    if (!allMeals[today]) {
      allMeals[today] = [];
    }

    // Add unique ID to meal
    meal.id = Date.now();
    allMeals[today].push(meal);

    localStorage.setItem(userMealsKey, JSON.stringify(allMeals));
    console.log("✓ Meal saved to localStorage:", meal);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const meal = {
      name: mealNameInput.value,
      mealType: mealTypeInput.value,
      calories: caloriesInput.value,
      protein: proteinInput.value,
      carbs: carbsInput.value,
      fats: fatsInput.value,
    };

    if (!meal.name) {
      console.error("Meal name is required!");
      return;
    }

    addMealToDOM(meal);
    saveMealToLocalStorage(meal);
    resetForm();
    updateMealCount();
  });

  suggestions.forEach((suggestion) => {
    suggestion.addEventListener("click", () => {
      const foodName = suggestion.querySelector(".food-suggested").textContent;
      const foodData = foodDatabase[foodName];

      if (foodData) {
        mealNameInput.value = foodName;
        mealTypeInput.value = foodData.meal;
        caloriesInput.value = foodData.cal;
        proteinInput.value = foodData.pro;
        carbsInput.value = foodData.carb;
        fatsInput.value = foodData.fat;
      }
    });
  });

  loggedMealContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-btn")) {
      const mealCard = event.target.closest(".logged-meal-card");
      const mealId = mealCard.getAttribute("data-meal-id");
      if (mealId) {
        deleteMealFromLocalStorage(Number.parseInt(mealId));
      }
      mealCard.remove();
      updateMealCount();
    }
  });

  function deleteMealFromLocalStorage(mealId) {
    const today = new Date().toDateString();
    const userMealsKey = getUserMealsKey();
    const allMeals = JSON.parse(localStorage.getItem(userMealsKey)) || {};

    if (allMeals[today]) {
      allMeals[today] = allMeals[today].filter((meal) => meal.id !== mealId);
      localStorage.setItem(userMealsKey, JSON.stringify(allMeals));
      console.log("✓ Meal deleted from localStorage");
    }
  }

  function addMealToDOM(meal) {
    const mealCard = document.createElement("div");
    mealCard.classList.add("logged-meal-card");
    mealCard.setAttribute("data-meal-id", Date.now());

    mealCard.style.display = "flex";
    mealCard.style.justifyContent = "space-between";
    mealCard.style.alignItems = "center";
    mealCard.style.backgroundColor = "rgb(245, 245, 245)";
    mealCard.style.padding = "1.5rem";
    mealCard.style.borderRadius = "1.5rem";
    mealCard.style.marginBottom = "1.5rem";
    mealCard.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
    mealCard.style.transition = "transform 0.2s";
    mealCard.style.fontSize = "1rem";

    const textDiv = document.createElement("div");
    textDiv.style.flex = "1";
    textDiv.style.textAlign = "left";

    const mealTypeName =
      mealTypeInput.options[mealTypeInput.selectedIndex].text;

    textDiv.innerHTML = `
            <h4 style="margin: 0; font-size: 1.5rem; color: #333;">${meal.name}</h4>
            <p style="font-size: 1rem; color: #555; text-transform: capitalize; margin: 0.5rem 0;">${mealTypeName}</p>
            <p style="font-size: 0.9rem; color: #333; margin: 0;">
                ${meal.calories} cal • ${meal.protein}g pro • ${meal.carbs}g carb • ${meal.fats}g fat
            </p>
        `;

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.textContent = "Delete";

    deleteButton.style.padding = "8px 12px";
    deleteButton.style.backgroundColor = "#ff4d4d";
    deleteButton.style.color = "white";
    deleteButton.style.border = "none";
    deleteButton.style.borderRadius = "15px";
    deleteButton.style.cursor = "pointer";
    deleteButton.style.marginLeft = "15px";

    deleteButton.addEventListener("mouseenter", () => {
      deleteButton.style.backgroundColor = "#cc0000";
    });
    deleteButton.addEventListener("mouseleave", () => {
      deleteButton.style.backgroundColor = "#ff4d4d";
    });

    mealCard.appendChild(textDiv);
    mealCard.appendChild(deleteButton);

    loggedMealContainer.appendChild(mealCard);
  }

  function resetForm() {
    form.reset();
    caloriesInput.value = 0;
    proteinInput.value = 0;
    carbsInput.value = 0;
    fatsInput.value = 0;
  }

  function updateMealCount() {
    const mealCount =
      loggedMealContainer.querySelectorAll(".logged-meal-card").length;

    if (mealCount === 0) {
      noMealsMessage.style.display = "block";
      mealCountParagraph.textContent = "0 meals logged";
    } else {
      noMealsMessage.style.display = "none";
      mealCountParagraph.textContent = `${mealCount} meal${
        mealCount > 1 ? "s" : ""
      } logged`;
    }
  }

  updateMealCount();
});

// ============================================
// LOGOUT FUNCTIONALITY
// ============================================
logoutBtn.onclick = () => {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("selectedCheckInDate");
  sessionStorage.clear();

  console.log(" User logged out. All session data cleared.");

  // Redirect to login page
  window.location.href = "../SIGN IN FOLDER/sign_in.html";
};
