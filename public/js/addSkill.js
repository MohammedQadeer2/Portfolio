
let skillBtn = document.getElementById("AddSkillbtn");
skillBtn.addEventListener("click", () => {
    let Skillform = document.getElementsByClassName("Skillform");
    for (skill of Skillform) {
        if (skill.style.display != "flex") {
            skill.style.display = "flex";
        } else {
            skill.style.display = "none";
        }
    }
});