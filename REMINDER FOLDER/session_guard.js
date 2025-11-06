// ============================================
// SESSION GUARD - PROTECTS ALL PAGES
// ============================================

// This function checks if a user is logged in
// If not, it redirects them to the login page
function checkUserSession() {
  const currentUser = localStorage.getItem("currentUser");

  if (!currentUser) {
    console.log("[v0] No active session. Redirecting to login...");
    window.location.href = "../index.html";
    return false;
  }

  try {
    const userData = JSON.parse(currentUser);
    if (!userData.username || !userData.email) {
      console.log("[v0] Invalid session data. Redirecting to login...");
      localStorage.removeItem("currentUser");
      window.location.href = "../index.html";
      return false;
    }
    return true;
  } catch (error) {
    console.log("[v0] Session data corrupted. Redirecting to login...");
    localStorage.removeItem("currentUser");
    window.location.href = "../index.html";
    return false;
  }
}

// Add this line to profile.html and home.html in the first <script> tag:
// checkUserSession();
