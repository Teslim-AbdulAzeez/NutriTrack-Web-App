function checkUserSession() {
  // Check if user session is valid
  const userData = JSON.parse(localStorage.getItem("currentUser"));
  if (!userData || !userData.username) {
    window.location.href = "../SIGN IN FOLDER/sign_in.html ";
  }
}
checkUserSession();

document.addEventListener("DOMContentLoaded", () => {
  const reminderState = document.getElementById("reminder-state");
  const reminderSetup = document.getElementById("reminder-setup");
  const suggestionCard = document.getElementById("suggestion-card");

  const addReminderBtn = document.getElementById("add-reminder-btn");
  const cancelBtn = document.getElementById("cancel-btn");
  const logoutBtn = document.getElementById("logoutBtn");

  const reminderForm = document.getElementById("reminder-form");
  const reminderTypeInput = document.getElementById("reminder-type");
  const reminderTimeInput = document.getElementById("reminder-time");

  const reminderList = document.getElementById("reminder-list");

  const suggestBreakfast = document.getElementById("suggest-breakfast");
  const suggestLunch = document.getElementById("suggest-lunch");
  const suggestDinner = document.getElementById("suggest-dinner");
  const suggestWorkoutAm = document.getElementById("suggest-workout-am");
  const suggestWorkoutPm = document.getElementById("suggest-workout-pm");

  function loadRemindersFromStorage() {
    const storedReminders =
      JSON.parse(localStorage.getItem("userReminders")) || [];

    // Clear the reminder list
    const existingItems = reminderList.querySelectorAll(".reminder-item");
    existingItems.forEach((item) => item.remove());

    // Remove empty text if there are reminders
    const emptyText = reminderList.querySelector(".empty-text");

    if (storedReminders.length === 0) {
      if (!emptyText) {
        const emptyMsg = document.createElement("p");
        emptyMsg.className = "empty-text";
        emptyMsg.textContent = "No Reminders Set";
        reminderList.appendChild(emptyMsg);
      }
    } else {
      if (emptyText) emptyText.remove();

      // Add each stored reminder back to the DOM
      storedReminders.forEach((reminder, index) => {
        addReminderToDom(reminder.type, reminder.time, index);
      });
    }
  }

  function addReminderToDom(type, time, index) {
    const reminderItem = document.createElement("div");
    reminderItem.className = "reminder-item";
    reminderItem.id = `reminder-${index}`;
    reminderItem.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div><strong>${type}</strong> at <strong>${time}</strong></div>
        <button type="button" class="delete-reminder-btn" data-index="${index}" style="background-color: #ff4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;">Delete</button>
      </div>
      <hr>
    `;
    reminderList.appendChild(reminderItem);

    // Add delete button event listener
    const deleteBtn = reminderItem.querySelector(".delete-reminder-btn");
    deleteBtn.addEventListener("click", () => deleteReminder(index));
  }

  function deleteReminder(index) {
    const storedReminders =
      JSON.parse(localStorage.getItem("userReminders")) || [];
    storedReminders.splice(index, 1);
    localStorage.setItem("userReminders", JSON.stringify(storedReminders));

    console.log("[v0] Reminder deleted at index: " + index);

    // Reload reminders to refresh the display
    loadRemindersFromStorage();
  }

  function showForm() {
    reminderState.classList.add("hidden");
    suggestionCard.classList.add("hidden");
    reminderSetup.classList.remove("hidden");
  }

  function showMainState() {
    reminderState.classList.remove("hidden");
    suggestionCard.classList.remove("hidden");
    reminderSetup.classList.add("hidden");
  }

  function addReminder(type, time) {
    const emptyText = reminderList.querySelector(".empty-text");
    if (emptyText) {
      emptyText.remove();
    }

    // Get existing reminders or create empty array
    const storedReminders =
      JSON.parse(localStorage.getItem("userReminders")) || [];

    // Add new reminder to array
    const newReminder = { type, time };
    storedReminders.push(newReminder);

    // Save to localStorage
    localStorage.setItem("userReminders", JSON.stringify(storedReminders));

    console.log("[v0] Reminder saved to localStorage: " + type + " at " + time);

    // Add to DOM
    addReminderToDom(type, time, storedReminders.length - 1);
  }

  function prefillForm(type, time) {
    reminderTypeInput.value = type;
    reminderTimeInput.value = time;
    showForm();
  }

  addReminderBtn.addEventListener("click", showForm);

  cancelBtn.addEventListener("click", showMainState);

  reminderForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const type = reminderTypeInput.value;
    const time = reminderTimeInput.value;
    addReminder(type, time);
    showMainState();
  });

  suggestBreakfast.addEventListener("click", () =>
    prefillForm("Meal", "08:00")
  );
  suggestLunch.addEventListener("click", () => prefillForm("Meal", "12:30"));
  suggestDinner.addEventListener("click", () => prefillForm("Meal", "19:00"));
  suggestWorkoutAm.addEventListener("click", () =>
    prefillForm("Workout", "06:30")
  );
  suggestWorkoutPm.addEventListener("click", () =>
    prefillForm("Workout", "17:30")
  );

  loadRemindersFromStorage();
});

const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.onclick = () => {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("selectedCheckInDate");
  sessionStorage.clear();

  console.log("User logged out. All session data cleared.");

  // Redirect to login page
  window.location.href = "../SIGN IN FOLDER/sign_in.html";
};
