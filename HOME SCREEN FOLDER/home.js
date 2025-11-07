// ============================================
// HOME PAGE - USER DATA & DAILY CHECK-IN
// ============================================

function getTodaysDate() {
  const today = new Date();
  const options = { day: "numeric", month: "long", year: "numeric" };
  return today.toLocaleDateString("en-US", options);
}

function checkUserSession() {
  // Check if user session is valid
  const userData = JSON.parse(localStorage.getItem("currentUser"));
  if (!userData || !userData.username) {
    window.location.href = "sign_in.html";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  checkUserSession();

  // Get the logged-in user's data from localStorage
  const userData = JSON.parse(localStorage.getItem("currentUser"));

  // If user is logged in, update the greeting with their name
  if (userData && userData.username) {
    const greetingHeading = document.querySelector(".greeting h2");
    greetingHeading.textContent = `Hello, ${userData.username}`;

    const greetingDate = document.querySelector(".greeting p");
    greetingDate.textContent = getTodaysDate();
  }

  initializeDateClicking();
  setupLogoutButton();

  initializeReminderNotifications();
  checkUpcomingReminders();
});

// ============================================
// REMINDER NOTIFICATION SYSTEM
// ============================================

function initializeReminderNotifications() {
  const bellIcon = document.querySelector(".bell_icon");

  if (bellIcon) {
    bellIcon.addEventListener("click", (e) => {
      e.preventDefault();
      // Navigate to reminder page
      window.location.href = "../REMINDER FOLDER/reminder.html";
    });
  }

  // Check reminders every minute
  setInterval(checkUpcomingReminders, 60000);
}

function checkUpcomingReminders() {
  const storedReminders =
    JSON.parse(localStorage.getItem("userReminders")) || [];
  const now = new Date();
  const currentTime =
    now.getHours().toString().padStart(2, "0") +
    ":" +
    now.getMinutes().toString().padStart(2, "0");

  storedReminders.forEach((reminder, index) => {
    if (reminder.time === currentTime) {
      // Show notification for this reminder
      showReminderNotification(reminder.type, reminder.time, index);
    }
  });
}

function showReminderNotification(type, time, index) {
  // Check if this reminder has already been notified today
  const notifiedReminders =
    JSON.parse(localStorage.getItem("notifiedReminders")) || [];
  const reminderKey = `${type}-${time}-${new Date().toDateString()}`;

  if (!notifiedReminders.includes(reminderKey)) {
    // Browser notification (if user has enabled it)
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("NutriTrack Reminder", {
        body: `Time for your ${type} at ${time}!`,
        icon: "../PROFILE FOLDER/logo image.jpg",
      });
    }

    // Alert notification
    alert(`🔔 NutriTrack Reminder!\n\nTime for your ${type} at ${time}!`);

    // Mark this reminder as notified
    notifiedReminders.push(reminderKey);
    localStorage.setItem(
      "notifiedReminders",
      JSON.stringify(notifiedReminders)
    );

    console.log(
      "[v0] Reminder notification shown for: " + type + " at " + time
    );
  }
}

// Request notification permission on page load
function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
}

// Call on page load
requestNotificationPermission();

// ============================================
// MAKE DATES CLICKABLE
// ============================================

function initializeDateClicking() {
  const dateSpans = document.querySelectorAll(".daily-checkin .days span");

  // Add click event listener to each date
  dateSpans.forEach((dateSpan) => {
    dateSpan.addEventListener("click", function () {
      // Remove active class from all dates
      dateSpans.forEach((span) => span.classList.remove("active"));

      // Add active class to clicked date
      this.classList.add("active");

      // Get the selected date info
      const selectedDate = this.textContent;
      console.log("[v0] Selected date: " + selectedDate);

      // Store selected date in localStorage
      localStorage.setItem("selectedCheckInDate", selectedDate);

      // Update the meals display (example)
      updateMealsForDate(selectedDate);
    });

    // Add hover effect for better UX
    dateSpan.style.transition = "all 0.3s ease";
    dateSpan.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.1)";
      this.style.cursor = "pointer";
    });
    dateSpan.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
    });
  });
}

// ============================================
// UPDATE MEALS FOR SELECTED DATE
// ============================================

function updateMealsForDate(selectedDate) {
  const meals = document.querySelectorAll(".daily-checkin .meal span");

  meals.forEach((meal) => {
    meal.textContent = "--";
  });

  console.log("[v0] Meals updated for date: " + selectedDate);
}

// ============================================
// LOGOUT FUNCTIONALITY
// ============================================

function setupLogoutButton() {
  const logoutBtn = document.getElementById("logoutBtn");

  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();

    localStorage.removeItem("currentUser");
    localStorage.removeItem("selectedCheckInDate");
    sessionStorage.clear();

    console.log("[v0] User logged out. All session data cleared.");

    // Redirect to login page
    window.location.href = "../SIGN IN FOLDER/sign_in.html";
  });
}

// ============================================
// LOG MEAL BUTTON FUNCTIONALITY
// ============================================

const logMealBtn = document.querySelector(".log-meal");

if (logMealBtn) {
  logMealBtn.addEventListener("click", () => {
    console.log("[v0] Log Meal button clicked");
    window.location.href = "../LOG MEAL FOLDER/logmeal.html";
    // You can add navigation to meal logging page here
  });
}

// ============================================
// TAKE SUGGESTIONS BUTTON FUNCTIONALITY
// ============================================

const takeSuggestionsBtn = document.querySelector(".take_suggestions-btn");

if (takeSuggestionsBtn) {
  takeSuggestionsBtn.addEventListener("click", () => {
    console.log("[v0] Take Suggestions button clicked");
    window.location.href = "../SUGGESTION FOLDER/suggestions.html";
    // You can add navigation to suggestions page here
  });
}
