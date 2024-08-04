document.addEventListener("DOMContentLoaded", () => {
  const btnNav = document.querySelector(".btn-nav");
  const nav = document.querySelector("nav");

  btnNav.addEventListener("click", () => {
    if (!nav.classList.contains("fx")) {
      nav.classList.add("fx", "slideDown");
      nav.classList.remove("slideUp");
      
      setTimeout(() => {
        nav.classList.remove("slideDown");
      }, 490);
    } else {
      nav.classList.remove("slideDown");
      nav.classList.add("slideUp");

      setTimeout(() => {
        nav.classList.remove("fx");
        nav.classList.remove("slideUp");
      }, 490);
    }
  });
});
