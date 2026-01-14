document.addEventListener("DOMContentLoaded", () => {
  console.log("header.js loaded");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (!menuToggle || !navLinks) {
    console.warn("Navbar elements not found");
  } else {
    menuToggle.addEventListener("click", () => {
      console.log("clicked");
      navLinks.classList.toggle("open");
    });
  }

  document.addEventListener("click", (e) => {
    if (
      !menuToggle.contains(e.target) &&
      !navLinks.contains(e.target)
    ) {
      navLinks.classList.remove("open");
    }
  });

});
