// ============================================
// SESSION PROTECTION
// ============================================
function checkUserSession() {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) {
    console.log(" No active session. Redirecting to login...");
    window.location.href = "../SIGN IN FOLDER/sign_in.html";
    return false;
  }

  try {
    const userData = JSON.parse(currentUser);
    if (!userData.username || !userData.email) {
      console.log("[v0] Invalid session data. Redirecting to login...");
      localStorage.removeItem("currentUser");
      window.location.href = "../SIGN IN FOLDER/sign_in.html";
      return false;
    }
    return true;
  } catch (error) {
    console.log(" Session data corrupted. Redirecting to login...");
    localStorage.removeItem("currentUser");
    window.location.href = "../SIGN IN FOLDER/sign_in.html";
    return false;
  }
}

// Check session immediately
checkUserSession();

// ============================================
// DOM ELEMENTS
// ============================================
const logoutBtn = document.getElementById("logoutBtn");
const addMealForm = document.getElementById("addMealForm");
const mealList = document.getElementById("mealList");
const totalCaloriesEl = document.getElementById("totalCalories");
const totalMealsEl = document.getElementById("totalMeals");
const calorieProgressEl = document.getElementById("calorieProgress");
const weeklyChartEl = document.getElementById("weeklyChart");
const currentDateEl = document.getElementById("currentDate");
const dashboardHeader = document.querySelector("h1");

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
// GET TODAY'S MEALS
// ============================================
function getTodaysMeals() {
  const today = new Date().toDateString();
  const userMealsKey = getUserMealsKey();
  const allMeals = JSON.parse(localStorage.getItem(userMealsKey)) || {};

  if (!allMeals[today]) {
    allMeals[today] = [];
  }

  return allMeals[today];
}

// ============================================
// SAVE MEAL TO LOCALSTORAGE
// ============================================
function saveMeal(meal) {
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
}

// ============================================
// DELETE MEAL FROM LOCALSTORAGE
// ============================================
function deleteMeal(mealId) {
  const today = new Date().toDateString();
  const userMealsKey = getUserMealsKey();
  const allMeals = JSON.parse(localStorage.getItem(userMealsKey)) || {};

  if (allMeals[today]) {
    allMeals[today] = allMeals[today].filter((meal) => meal.id !== mealId);
    localStorage.setItem(userMealsKey, JSON.stringify(allMeals));
  }

  renderDashboard();
}

// ============================================
// UPDATE DASHBOARD HEADER WITH USER NAME
// ============================================
function updateHeaderWithUserName() {
  const user = getCurrentUser();
  if (user && user.username) {
    dashboardHeader.textContent = `Welcome, ${user.username}!`;
  }
}

// ============================================
// UPDATE CURRENT DATE
// ============================================
function updateCurrentDate() {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const today = new Date().toLocaleDateString("en-US", options);
  currentDateEl.textContent = today;
}

// ============================================
// CALCULATE CALORIE STATS
// ============================================
function calculateCalorieStats() {
  const meals = getTodaysMeals();
  const totalCalories = meals.reduce(
    (sum, meal) => sum + Number.parseInt(meal.calories),
    0
  );
  const totalMeals = meals.length;

  return { totalCalories, totalMeals };
}

// ============================================
// RENDER TODAY'S MEALS LIST
// ============================================
function renderMealsList() {
  const meals = getTodaysMeals();

  if (meals.length === 0) {
    mealList.innerHTML =
      '<p class="empty-message">No meals added yet. Add your first meal below!</p>';
    return;
  }

  const mealsHTML = meals
    .map(
      (meal) => `
      <div class="meal-item">
        <div class="meal-info">
          <h4>${meal.mealType} - ${meal.name}</h4>
          <p class="meal-time">${new Date(meal.id).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}</p>
        </div>
        <div class="meal-actions">
          <span class="meal-calories">${meal.calories} cal</span>
          <button class="btn-delete" onclick="deleteMeal(${
            meal.id
          })">Delete</button>
        </div>
      </div>
    `
    )
    .join("");

  mealList.innerHTML = mealsHTML;
}

// ============================================
// RENDER CALORIE PROGRESS BAR
// ============================================
function renderCalorieProgress() {
  const user = getCurrentUser();
  const dailyGoal = user?.calories || 2000;
  const { totalCalories } = calculateCalorieStats();

  const progressPercentage = Math.min((totalCalories / dailyGoal) * 100, 100);

  calorieProgressEl.style.width = `${progressPercentage}%`;
  calorieProgressEl.textContent = `${Math.round(progressPercentage)}%`;
}

// ============================================
// GET WEEKLY CALORIE DATA
// ============================================
function getWeeklyCalorieData() {
  const weeklyData = [];
  const userMealsKey = getUserMealsKey();
  const allMeals = JSON.parse(localStorage.getItem(userMealsKey)) || {};

  // Get data for the last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toDateString();

    const dayMeals = allMeals[dateString] || [];
    const dayCalories = dayMeals.reduce(
      (sum, meal) => sum + Number.parseInt(meal.calories),
      0
    );
    weeklyData.push(dayCalories);
  }

  return weeklyData;
}

// ============================================
// RENDER WEEKLY CHART
// ============================================
// function renderWeeklyChart() {
//   const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
//   const weeklyData = getWeeklyCalorieData();
//   const user = getCurrentUser();
//   const dailyGoal = user?.calories || 2000;
//   const maxCalories = Math.max(...weeklyData, dailyGoal);

//   const chartHTML = weeklyData
//     .map((calories, index) => {
//       const height = maxCalories > 0 ? (calories / maxCalories) * 100 : 0;
//       return `
//         <div class="chart-bar-container">
//           <div class="chart-bar" style="height: ${height}%;" title="${calories} cal"></div>
//           <div class="chart-label">${days[index]}</div>
//         </div>
//       `;
//     })
//     .join("");

//   weeklyChartEl.innerHTML = chartHTML;
// }

// ============================================
// RENDER COMPLETE DASHBOARD
// ============================================
function renderDashboard() {
  updateHeaderWithUserName();
  updateCurrentDate();

  const { totalCalories, totalMeals } = calculateCalorieStats();
  const user = getCurrentUser();
  const dailyGoal = user?.calories || 2000;

  totalCaloriesEl.textContent = totalCalories;
  totalMealsEl.textContent = totalMeals;

  // Update goal text
  document.querySelector(
    ".goal-text"
  ).textContent = `Daily Goal: ${dailyGoal} cal`;

  renderMealsList();
  renderCalorieProgress();
  renderWeeklyChart();
}

// ============================================
// ADD MEAL FORM SUBMISSION
// ============================================
addMealForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const mealName = document.getElementById("mealName").value;
  const mealType = document.getElementById("mealType").value;
  const calories = document.getElementById("calories").value;

  if (!mealName || !mealType || !calories) {
    alert("Please fill in all fields");
    return;
  }

  const newMeal = {
    name: mealName,
    mealType: mealType,
    calories: Number.parseInt(calories),
  };

  saveMeal(newMeal);
  renderDashboard();

  // Clear form
  addMealForm.reset();

  console.log(" Meal added successfully");
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

// ============================================
// LISTEN FOR STORAGE CHANGES (Auto-update when data changes on other pages)
// ============================================
window.addEventListener("storage", (e) => {
  const userMealsKey = getUserMealsKey();
  if (e.key === userMealsKey || e.key === "currentUser") {
    console.log("Data changed on another page. Updating dashboard...");
    renderDashboard();
  }
});

// ============================================
// INITIALIZE DASHBOARD ON PAGE LOAD
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  console.log(" Dashboard initialized");
  renderDashboard();
});

// Make deleteMeal available globally for onclick handlers
window.deleteMeal = deleteMeal;
