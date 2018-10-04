document.addEventListener("DOMContentLoaded", function() {
  const elems = document.querySelectorAll(".sidenav");
  const elem = document.querySelectorAll(".tabs");
  M.Sidenav.init(elems);
  M.Tabs.init(elem);
});
