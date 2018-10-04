document.addEventListener("DOMContentLoaded", function() {
  const elems = document.querySelectorAll(".sidenav");
  const elem = document.querySelectorAll(".tabs");
  M.Sidenav.init(elems);
  M.Tabs.init(elem);
});

let carractereMax = 200;
const inputbody = document.querySelector("#body");
const nb_car_max = document.querySelector("#nb_car_max");
const send_restrict = document.querySelector(".send_restrict");

let compteur = 200;
inputbody.addEventListener("keyup", e => {
  compteur = carractereMax - inputbody.value.length;
  if (e.key === "Backspace") {
    compteur + 1;
  }
  if (e.key === "Delete") {
    compteur + 1;
  }
  if (compteur > 200 || compteur < 1) {
    nb_car_max.innerHTML = "vous ne pouvez pas dépasser 200 carractères";
    nb_car_max.style.color = "red";
    send_restrict.setAttribute("disabled", "");
  } else {
    nb_car_max.innerHTML = "il vous reste encore " + compteur + " carractères";
    nb_car_max.style.color = "black";
    send_restrict.removeAttribute("disabled");
  }
});
