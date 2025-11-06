// ============================================
// BEGINNER AUTHENTICATION JAVASCRIPT
// ============================================
// This file handles all the validation and authentication logic
// for the NutriTrack login form. Each function is explained below.

const validUsers = [
  {
    username: "Bakare",
    email: "victorbakare28@gmail.com",
    password: "password123",
    goal: "Muscle Enhancement",
  },
  {
    username: "Sarah",
    email: "sarahraheem05@gmail.com",
    password: "secure456",
    goal: "Weight Loss",
  },
  {
    username: "Mike",
    email: "mikejay1989@example.com",
    password: "mypass789",
    goal: "Maintenance",
  },
  {
    username: "Precious",
    email: "bryanprecious78@gmail.com",
    password: "fitness001",
    goal: "Weight Gain",
  },
];

// Step 1: Get the form element when the page loads
// The form element has the id "signupForm" from the HTML
const form = document.getElementById("signupForm");

// Get all the input fields we need to validate
const usernameInput = document.getElementById("Username");
const emailInput = document.getElementById("Email or Phone Number");
const passwordInput = document.getElementById("pwd1");
const confirmPasswordInput = document.getElementById("pwd2");
const goalSelect = document.getElementById("goal");

// Get error message elements
const usernameError = document.getElementById("usernameError");
const emailError = document.getElementById("emailError");
const pwd1Error = document.getElementById("pwd1Error");
const pwd2Error = document.getElementById("pwd2Error");
const goalError = document.getElementById("goalError");
const successMessage = document.getElementById("successMessage");

// ============================================
// VALIDATION FUNCTIONS
// ============================================

// Function 1: Check if username is valid
// Rules: Username must be at least 3 characters long
function validateUsername() {
  const username = usernameInput.value.trim(); // Remove extra spaces

  if (username.length === 0) {
    showError(usernameError, "Username is required");
    usernameInput.classList.add("error");
    return false;
  }

  if (username.length < 3) {
    showError(usernameError, "Username must be at least 3 characters");
    usernameInput.classList.add("error");
    return false;
  }

  // If everything is good, hide the error
  hideError(usernameError);
  usernameInput.classList.remove("error");
  return true;
}

// Function 2: Check if email is valid
// Rules: Must be a real email format or a phone number
function validateEmail() {
  const email = emailInput.value.trim();

  if (email.length === 0) {
    showError(emailError, "Email or phone number is required");
    emailInput.classList.add("error");
    return false;
  }

  // Check if it's an email format (has @ and .)
  const isEmail = email.includes("@") && email.includes(".");

  // Check if it's a phone number (only numbers and dashes)
  const isPhone = /^[\d\-+\s]+$/.test(email) && email.length >= 10;

  if (!isEmail && !isPhone) {
    showError(emailError, "Please enter a valid email or phone number");
    emailInput.classList.add("error");
    return false;
  }

  hideError(emailError);
  emailInput.classList.remove("error");
  return true;
}

// Function 3: Check if password is valid
// Rules: Password must be at least 6 characters
function validatePassword() {
  const password = passwordInput.value;

  if (password.length === 0) {
    showError(pwd1Error, "Password is required");
    passwordInput.classList.add("error");
    return false;
  }

  if (password.length < 6) {
    showError(pwd1Error, "Password must be at least 6 characters");
    passwordInput.classList.add("error");
    return false;
  }

  hideError(pwd1Error);
  passwordInput.classList.remove("error");
  return true;
}

// Function 4: Check if confirm password matches password
// Rules: Both passwords must be exactly the same
function validateConfirmPassword() {
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (confirmPassword.length === 0) {
    showError(pwd2Error, "Please confirm your password");
    confirmPasswordInput.classList.add("error");
    return false;
  }

  if (password !== confirmPassword) {
    showError(pwd2Error, "Passwords do not match");
    confirmPasswordInput.classList.add("error");
    return false;
  }

  hideError(pwd2Error);
  confirmPasswordInput.classList.remove("error");
  return true;
}

// Function 5: Check if a goal has been selected
// Rules: Goal cannot be "Options" (the placeholder)
function validateGoal() {
  const goal = goalSelect.value;

  if (goal === "Options") {
    showError(goalError, "Please select a goal");
    goalSelect.classList.add("error");
    return false;
  }

  hideError(goalError);
  goalSelect.classList.remove("error");
  return true;
}

function validateCredentials(username, email, password, goal) {
  // Check if the user exists in the validUsers array
  const user = validUsers.find(
    (u) =>
      u.username === username &&
      u.email === email &&
      u.password === password &&
      u.goal === goal
  );

  if (user) {
    return true; // User found, credentials are valid
  }

  return false; // User not found, credentials are invalid
}

// ============================================
// HELPER FUNCTIONS
// ============================================

// Function: Show error message
// This displays the error text and makes it visible
function showError(errorElement, message) {
  errorElement.textContent = message;
  errorElement.classList.add("show");
}

// Function: Hide error message
// This hides the error text
function hideError(errorElement) {
  errorElement.textContent = "";
  errorElement.classList.remove("show");
}

// Function: Show success message
// This displays a success message after successful submission
function showSuccess() {
  successMessage.textContent =
    "Account created successfully! Welcome to NutriTrack!";
  successMessage.classList.add("show");

  // Get the logged-in user data
  const username = usernameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;
  const goal = goalSelect.value;

  // Find the user in the validUsers array to get complete data
  const loggedInUser = validUsers.find(
    (u) =>
      u.username === username &&
      u.email === email &&
      u.password === password &&
      u.goal === goal
  );

  // Save user data to localStorage so the profile page can access it
  if (loggedInUser) {
    const userProfile = {
      username: loggedInUser.username,
      email: loggedInUser.email,
      goal: loggedInUser.goal,
      calories: 2000, // Default calorie value
      joinDate: new Date().toLocaleDateString("en-US"), // Today's date
    };

    // Save to localStorage
    localStorage.setItem("currentUser", JSON.stringify(userProfile));
    console.log("[v0] User data saved to localStorage:", userProfile);
  }

  setTimeout(() => {
    window.location.href = "../HOME SCREEN FOLDER/home.html"; //Redirect to home page after 2 seconds
    clearForm(); // Clear the form fields
  }, 2000);
}

// Function: Clear all form fields
// This empties all inputs after successful submission
function clearForm() {
  usernameInput.value = "";
  emailInput.value = "";
  passwordInput.value = "";
  confirmPasswordInput.value = "";
  goalSelect.value = "Options";
}

// ============================================
// FORM SUBMISSION
// ============================================

// This runs when the user clicks the "Login" button
form.addEventListener("submit", (event) => {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Clear all previous error messages
  hideError(usernameError);
  hideError(emailError);
  hideError(pwd1Error);
  hideError(pwd2Error);
  hideError(goalError);

  // Validate all fields
  const isUsernameValid = validateUsername();
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();
  const isConfirmPasswordValid = validateConfirmPassword();
  const isGoalValid = validateGoal();

  // If ALL validations pass (all are true), submit the form
  if (
    isUsernameValid &&
    isEmailValid &&
    isPasswordValid &&
    isConfirmPasswordValid &&
    isGoalValid
  ) {
    const username = usernameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const goal = goalSelect.value;

    if (validateCredentials(username, email, password, goal)) {
      console.log("Login successful! User:", username);
      showSuccess();
    } else {
      showError(
        pwd1Error,
        "Invalid username, email, or password. Please try again."
      );
      console.log("Login failed: Invalid credentials");
    }
  } else {
    // If any validation failed, show an alert
    console.log("Form has errors. Please fix them.");
  }
});

// ============================================
// REAL-TIME VALIDATION (Optional)
// ============================================
// These listeners validate as the user types, giving instant feedback

usernameInput.addEventListener("blur", validateUsername);
emailInput.addEventListener("blur", validateEmail);
passwordInput.addEventListener("blur", validatePassword);
confirmPasswordInput.addEventListener("blur", validateConfirmPassword);
goalSelect.addEventListener("change", validateGoal);
