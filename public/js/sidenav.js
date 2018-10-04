document.addEventListener("DOMContentLoaded", function() {
  const elems = document.querySelectorAll(".sidenav");
  const elem = document.querySelectorAll(".tabs");
  M.Sidenav.init(elems);
  M.Tabs.init(elem);
});

let carractereMax = 200;
const inputbody = document.querySelector("#body");
const nb_car_max = document.querySelector("#nb_car_max");
let compteur = 200;
inputbody.addEventListener("keyup", e => {
  compteur = carractereMax - inputbody.value.length;
  if (e.key === "Backspace") {
    compteur + 1;
  }
  nb_car_max.innerHTML = "vous avez encore " + compteur + " maximum";
});
