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
// FILTERING LOGIC
// ============================================
// Active category state
let activeCategory = "all";

// Function to update button visual states
function updateButtonStates(activeBtn) {
  const buttons = document.querySelectorAll(".header-food-filter button");
  buttons.forEach((btn) => {
    btn.classList.remove("active");
  });
  if (activeBtn) {
    activeBtn.classList.add("active");
  }
}

// Filter function that accepts a category
function filterByCategory(category) {
  activeCategory = category;
  const columns = document.querySelectorAll(".column");

  columns.forEach((column) => {
    if (category === "all") {
      column.classList.remove("hidden");
    } else if (column.classList.contains(category)) {
      column.classList.remove("hidden");
    } else {
      column.classList.add("hidden");
    }
  });
}

// Show all items
function showAll() {
  filterByCategory("all");
  updateButtonStates(document.querySelector(".all"));
}

// Show weight gain items
function showGain() {
  filterByCategory("gain");
  updateButtonStates(document.querySelector(".gain"));
}

// Show weight loss items
function showLoss() {
  filterByCategory("loss");
  updateButtonStates(document.querySelector(".loss"));
}

// Show cereal items
function showCereal() {
  filterByCategory("cereal");
  updateButtonStates(document.querySelector(".cereal"));
}

// Show dietary items
function showDiet() {
  filterByCategory("diet");
  updateButtonStates(document.querySelector(".diet"));
}

document.addEventListener("DOMContentLoaded", () => {
  // Add click handlers for filter buttons
  document.querySelector(".all").addEventListener("click", showAll);
  document.querySelector(".gain").addEventListener("click", showGain);
  document.querySelector(".loss").addEventListener("click", showLoss);
  document.querySelector(".cereal").addEventListener("click", showCereal);
  document.querySelector(".diet").addEventListener("click", showDiet);

  const hearts = document.querySelectorAll(".ph-heart-straight");
  hearts.forEach((heart) => {
    heart.style.cursor = "pointer";
    heart.addEventListener("click", function (e) {
      heart.style.color = "#ff0000";
      e.stopPropagation();
      this.classList.toggle("icon-filled");
    });
  });

  // Set initial active state to "all"
  updateButtonStates(document.querySelector(".all"));
});
// Initially show all items
filterByCategory("all");
showAll();

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

// =============================================
// END OF SUGGESTIONS.JS
// ============================================
