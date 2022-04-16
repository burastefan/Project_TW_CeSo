const applyFilters = document.querySelector("#close-button");
const closeButton = document.getElementsByClassName("close")[0];

applyFilters.addEventListener("click", () => {
  modal.close();
});
closeButton.addEventListener("click", () => {
  modal.close();
});

window.onclick = function (event) {
  console.log(event);
  if (
    event.target.id == "filters1" ||
    event.target.id == "filters2" ||
    event.target.id == "filters3"
  ) {
    const filterPopup = document.getElementById("modal");
    filterPopup.showModal();
  }
};
