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

// ============================================
// DOM ELEMENTS
// ============================================
const postForm = document.getElementById("postForm");
const postList = document.getElementById("postList");
const postContentInput = document.getElementById("postContent");
const postImageInput = document.getElementById("postImage");
const communityHeader = document.querySelector("h1");
const logoutBtn = document.getElementById("logoutBtn");

// --- Smooth Horizontal Swipe Scroll for Feed ---
const videoScroll = document.querySelector(".video-scroll");
let isDown = false;
let startX;
let scrollLeft;

if (videoScroll) {
  videoScroll.addEventListener("mousedown", (e) => {
    isDown = true;
    videoScroll.classList.add("active");
    startX = e.pageX - videoScroll.offsetLeft;
    scrollLeft = videoScroll.scrollLeft;
  });

  videoScroll.addEventListener("mouseleave", () => {
    isDown = false;
    videoScroll.classList.remove("active");
  });

  videoScroll.addEventListener("mouseup", () => {
    isDown = false;
    videoScroll.classList.remove("active");
  });

  videoScroll.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - videoScroll.offsetLeft;
    const walk = (x - startX) * 1.2; // scroll speed
    videoScroll.scrollLeft = scrollLeft - walk;
  });
}

// --- Auto-Highlight Active Icon in Pill Navigation ---
const currentPage = window.location.pathname.split("/").pop().toLowerCase();
document.querySelectorAll(".pill-nav a").forEach((link) => {
  if (link.getAttribute("href").toLowerCase() === currentPage) {
    link.classList.add("active");
  }
});

// --- Remove tap highlight flash on mobile (cleaner UI) ---
document.addEventListener("touchstart", () => {}, { passive: true });

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
