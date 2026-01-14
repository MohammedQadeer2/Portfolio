const skillCards = document.querySelectorAll(".skill-card");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.2 }
);

skillCards.forEach(card => observer.observe(card));


//--------------PROJECT SECTION-----------------

const projectCards = document.querySelectorAll(".project-card");

projectCards.forEach(card => observer.observe(card));

//FOR DELETING PROJECT
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete-btn")) {
    const card = e.target.closest(".col-lg-4");
    card.style.opacity = "0";
    setTimeout(() => card.remove(), 300);
  }
});


//----------------------FOR showing Porjects---------------------------

// const form = document.getElementById("projectForm");
// const progress = document.getElementById("formProgress");
// const spinner = document.querySelector(".spinner-border");

// form.addEventListener("input", () => {
//   const filled = form.querySelectorAll("input:valid").length;
//   const total = form.querySelectorAll("input").length;
//   progress.style.width = `${(filled / total) * 100}%`;
// });

// form.addEventListener("submit", e => {
//   e.preventDefault();
//   spinner.classList.remove("d-none");

//   setTimeout(() => {
//     spinner.classList.add("d-none");
//     alert("🎉 Project added successfully!");
//     form.reset();
//     progress.style.width = "0%";
//   }, 2000);
// });

