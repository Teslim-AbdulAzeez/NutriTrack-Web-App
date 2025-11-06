// This will automatically populate the profile with logged-in user information

function checkUserSession() {
  const storedUser = localStorage.getItem("currentUser");
  if (!storedUser) {
    console.log("No user session found. Redirecting to login page.");
    window.location.href = "../SIGN IN FOLDER/sign_in.html";
  }
}
checkUserSession();

function getTodaysDate() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
}

const editBtn = document.getElementById("editBtn");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const logoutBtn = document.getElementById("logoutBtn");

const displayMode = document.getElementById("displayMode");
const editMode = document.getElementById("editMode");

const displayName = document.getElementById("displayName");
const displayEmail = document.getElementById("displayEmail");
const displayGoal = document.getElementById("displayGoal");
const displayCalories = document.getElementById("displayCalories");
const memberSince = document.getElementById("memberSince");

const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const goalInput = document.getElementById("goalInput");
const calorieInput = document.getElementById("calorieInput");

function loadUserProfile() {
  // Get the stored user data from localStorage
  const storedUser = localStorage.getItem("currentUser");

  if (storedUser) {
    try {
      // Parse the JSON data
      const userData = JSON.parse(storedUser);
      console.log(" User data loaded from localStorage:", userData);

      // Update the profile display with user data
      displayName.innerText = userData.username;
      displayEmail.innerText = userData.email;
      displayGoal.innerText = userData.goal;
      displayCalories.innerText = userData.calories;

      memberSince.innerText = getTodaysDate();
    } catch (error) {
      console.log(" Error loading user data:", error);
    }
  } else {
    console.log(" No user data found. User may not be logged in.");
  }
}

// Call the function when the page loads
loadUserProfile();

editBtn.onclick = () => {
  nameInput.value = displayName.innerText.trim();
  emailInput.value = displayEmail.innerText.trim();
  calorieInput.value = displayCalories.innerText.trim();
  goalInput.value = displayGoal.innerText.trim();

  displayMode.style.display = "none";
  editMode.style.display = "block";
};

saveBtn.onclick = () => {
  displayName.innerText = nameInput.value;
  displayEmail.innerText = emailInput.value;
  displayGoal.innerText = goalInput.value;
  displayCalories.innerText = calorieInput.value;

  const updatedUser = {
    username: nameInput.value,
    email: emailInput.value,
    goal: goalInput.value,
    calories: calorieInput.value,
    joinDate: getTodaysDate(),
  };
  localStorage.setItem("currentUser", JSON.stringify(updatedUser));
  console.log("Profile updated and saved to localStorage");

  displayMode.style.display = "block";
  editMode.style.display = "none";
};

cancelBtn.onclick = () => {
  displayMode.style.display = "block";
  editMode.style.display = "none";
};

logoutBtn.onclick = () => {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("selectedCheckInDate");
  sessionStorage.clear();

  console.log("User logged out. All session data cleared.");

  // Redirect to login page
  window.location.href = "../SIGN IN FOLDER/sign_in.html";
};
