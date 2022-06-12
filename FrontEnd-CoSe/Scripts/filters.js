function showFiltersPopup() {
  console.log("show");
  const filterPopup = document.getElementById("modal");
  filterPopup.showModal();
}

function closeFiltersPopup() {
  console.log("close");
  const filterPopup = document.getElementById("modal");
  filterPopup.close();
}
